'use client';

import { motion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { useHybridPaginatedSection } from '@/lib/usePaginatedSection';
import GridLayout from './GridLayout';
import ListLayout from './ListLayout';
import TimelineLayout from './TimelineLayout';
import Badge from '../ui/Badge';
import { premiumItemVariants, premiumWindowVariants, usePremiumInView } from '../motionConfig';
import { getDate, getImageSource, getLinks, getSummary, getSubtitle, getTags, getTitle } from './layoutUtils';

export default function LayoutRenderer({
  sectionData = { items: [], total: 0, hasMore: false },
  sectionId,
  layoutType,
  dataType,
  itemType = dataType,
}) {
  const {
    items,
    visibleItems,
    total,
    loading,
    allVisible,
    needsToggle,
    nextBatch,
    showMore,
    showLess,
  } = useHybridPaginatedSection({ sectionData, sectionId });

  const collectionHasImages = dataType !== 'minimal' && items.some((item) => item.image);
  const shared = {
    items: visibleItems,
    dataType,
    itemType,
    totalCount: total,
    collectionHasImages,
  };

  let layout = <ListLayout {...shared} />;
  if (layoutType === 'grid') layout = <GridLayout {...shared} />;
  else if (layoutType === 'timeline') layout = <TimelineLayout {...shared} />;
  else if (layoutType === 'compact') layout = <CompactLayout {...shared} />;

  return (
    <div className="premium-layout-stack">
      {layout}
      {needsToggle ? (
        <div className="premium-show-more-wrap">
          {allVisible ? (
            <button
              type="button"
              className="premium-button premium-show-more"
              onClick={showLess}
              aria-expanded="true"
            >
              Show less
            </button>
          ) : (
            <button
              type="button"
              className="premium-button premium-show-more"
              onClick={showMore}
              disabled={loading}
              aria-expanded="false"
            >
              {loading ? 'Loading…' : `Show more · ${nextBatch} more`}
            </button>
          )}
          <span className="premium-show-more-meta">
            Showing {visibleItems.length} of {total}
          </span>
        </div>
      ) : null}
    </div>
  );
}

function CompactLayout({ items, dataType, itemType, totalCount }) {
  const { ref, isInView } = usePremiumInView();
  const count = totalCount ?? items.length;
  return (
    <motion.section ref={ref} className="premium-layout-window" variants={premiumWindowVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      <div className="premium-layout-header"><h3>{dataType}</h3><span>{count} {count === 1 ? 'entry' : 'entries'}</span></div>
      <div className="premium-layout-content premium-compact-list">
        {items.length ? items.map((item, index) => <CompactRow key={`${getTitle(item, itemType)}-${index}`} item={item} dataType={dataType} itemType={itemType} index={index} />) : <div className="premium-layout-empty" role="status">No {dataType} entries yet.</div>}
      </div>
    </motion.section>
  );
}

function CompactRow({ item, dataType, itemType, index }) {
  const fields = getFields(item, dataType, itemType);
  const imageSource = dataType === 'minimal' ? '' : getImageSource(item.image);
  const showImage = Boolean(imageSource);
  return (
    <motion.article className={`premium-compact-row${showImage ? ' premium-compact-row-with-image' : ''}`} custom={index} variants={premiumItemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.2, ease: [0.165, 0.84, 0.44, 1] }}>
      <div className="premium-compact-title-cell">
        {showImage && <img className="premium-card-image" src={imageSource} alt="" loading="lazy" />}
        <div><strong>{fields.title}</strong><p>{fields.subtitle}</p></div>
      </div>
      <DescriptionDisclosure description={fields.summary} />
      <div className="premium-links"><span className="premium-card-kicker">{fields.date}</span>{fields.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}{fields.links.map((link) => <a className="premium-mini-link" href={link.href} key={link.label}>{link.label}</a>)}</div>
    </motion.article>
  );
}

function getFields(item, dataType, itemType) {
  if (dataType === 'project') return { title: item.title || 'Untitled project', subtitle: item.path || 'Project', summary: getSummary(item), tags: item.tags || [], links: getLinks(item), date: item.date || 'Active' };
  if (dataType === 'experience') return { title: item.role || 'Untitled role', subtitle: item.company || 'Independent', summary: getSummary(item), tags: item.technologies || [], links: getLinks(item), date: getDate(item, dataType) };
  if (dataType === 'education') return { title: item.degree || 'Untitled degree', subtitle: item.institution || 'Institution', summary: getSummary(item), tags: [item.fieldOfStudy, item.grade].filter(Boolean), links: getLinks(item), date: getDate(item, dataType) };
  if (dataType === 'full') return { title: getTitle(item, itemType), subtitle: getSubtitle(item, itemType), summary: getSummary(item), tags: getTags(item, itemType), links: getLinks(item), date: getDate(item, itemType) };
  if (dataType === 'minimal') return { title: getTitle(item, itemType), subtitle: '', summary: getSummary(item), tags: getTags(item, itemType), links: [], date: '' };
  if (dataType === 'listview') return { title: getTitle(item, itemType), subtitle: getSubtitle(item, itemType), summary: getSummary(item), tags: getTags(item, itemType), links: getLinks(item), date: getDate(item, itemType) };
  return { title: getTitle(item, itemType), subtitle: getSubtitle(item, itemType), summary: getSummary(item), tags: getTags(item, itemType), links: getLinks(item), date: getDate(item, itemType) };
}
