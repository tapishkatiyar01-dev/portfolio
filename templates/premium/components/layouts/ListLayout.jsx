'use client';

import { motion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { premiumItemVariants, premiumWindowVariants, usePremiumInView } from '../motionConfig';
import { getDate, getImageSource, getLinks, getSummary, getSubtitle, getTags, getTitle } from './layoutUtils';

export default function ListLayout({ items = [], dataType, itemType = dataType, totalCount, collectionHasImages }) {
  const { ref, isInView } = usePremiumInView();
  const isProject = dataType === 'project' || itemType === 'project';
  const isMinimal = dataType === 'minimal';
  const count = totalCount ?? items.length;
  const hasImages = collectionHasImages ?? (!isMinimal && items.some((item) => getImageSource(item.image)));
  return (
    <motion.section ref={ref} className="premium-layout-window" variants={premiumWindowVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      <div className="premium-layout-header"><h3>{dataType}</h3><span>{count} {count === 1 ? 'entry' : 'entries'}</span></div>
      <div className={`premium-layout-content premium-list${hasImages ? ' has-images' : ' no-images'}`} data-data-type={dataType}>
        {!isMinimal && <div className="premium-list-head">{hasImages && <span aria-hidden="true" /> }<span>Title</span><span>Summary</span><span>{isProject ? 'Tech Stack' : 'Details'}</span><span>Links</span></div>}
        {items.length ? items.map((item, index) => <ListRow key={`${getTitle(item, itemType)}-${index}`} item={item} dataType={dataType} itemType={itemType} isProject={isProject} isMinimal={isMinimal} hasImages={hasImages} index={index} />) : <div className="premium-layout-empty" role="status">No {dataType} entries yet.</div>}
      </div>
    </motion.section>
  );
}

function ListRow({ item, dataType, itemType, isProject, isMinimal, hasImages, index }) {
  const fields = getFields(item, dataType, itemType);
  const imageSource = isMinimal ? '' : getImageSource(item.image);
  const showImage = Boolean(imageSource);
  return (
    <motion.div className={`premium-list-row${showImage ? ' premium-list-row-with-image has-image' : ' no-image'}`} custom={index} variants={premiumItemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} whileHover={{ x: 6, scale: 1.005 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}>
      {showImage ? <img className="premium-list-image" src={imageSource} alt={`${fields.title} preview`} loading="lazy" /> : hasImages ? <span className="premium-list-image-placeholder" aria-hidden="true" /> : null}
      <div className="premium-list-title-cell">
        <strong>{fields.title}</strong>
      </div>
      <DescriptionDisclosure description={fields.summary} />
      <span>{isMinimal ? fields.tags.join(' / ') : isProject ? fields.tags.join(' / ') : `${fields.subtitle} - ${fields.date}`}</span>
      <span className="premium-links">{fields.links.length ? fields.links.map((link) => <a className="premium-mini-link" href={link.href} key={link.label}>{link.label}</a>) : '-'}</span>
    </motion.div>
  );
}

function getFields(item, dataType, itemType) {
  if (dataType === 'project') return { title: item.title || 'Untitled project', summary: getSummary(item), subtitle: item.path || 'Project', date: item.date || 'Active', tags: item.tags || [], links: getLinks(item) };
  if (dataType === 'experience') return { title: item.role || 'Untitled role', summary: getSummary(item), subtitle: item.company || 'Independent', date: getDate(item, dataType), tags: item.technologies || [], links: getLinks(item) };
  if (dataType === 'education') return { title: item.degree || 'Untitled degree', summary: getSummary(item), subtitle: item.institution || 'Institution', date: getDate(item, dataType), tags: [item.fieldOfStudy, item.grade].filter(Boolean), links: getLinks(item) };
  if (dataType === 'full') return { title: getTitle(item, itemType), summary: getSummary(item), subtitle: getSubtitle(item, itemType), date: getDate(item, itemType), tags: getTags(item, itemType), links: getLinks(item) };
  if (dataType === 'minimal') return { title: getTitle(item, itemType), summary: getSummary(item), subtitle: '', date: '', tags: getTags(item, itemType), links: [] };
  return { title: getTitle(item, itemType), summary: getSummary(item), subtitle: getSubtitle(item, itemType), date: getDate(item, itemType), tags: getTags(item, itemType), links: getLinks(item) };
}
