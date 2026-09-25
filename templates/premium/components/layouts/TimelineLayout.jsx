'use client';

import { motion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import Badge from '../ui/Badge';
import { premiumItemVariants, premiumWindowVariants, usePremiumInView } from '../motionConfig';
import { getDate, getLinks, getSummary, getSubtitle, getTags, getTitle } from './layoutUtils';

export default function TimelineLayout({ items = [], dataType, itemType = dataType, totalCount }) {
  const { ref, isInView } = usePremiumInView();
  const count = totalCount ?? items.length;
  return (
    <motion.section ref={ref} className="premium-layout-window" variants={premiumWindowVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
      <div className="premium-layout-header"><h3>{dataType}</h3><span>{count} {count === 1 ? 'entry' : 'entries'}</span></div>
      <div className="premium-layout-content premium-timeline">
        {items.length ? items.map((item, index) => <TimelineItem key={`${getTitle(item, itemType)}-${index}`} item={item} dataType={dataType} itemType={itemType} index={index} />) : <div className="premium-layout-empty" role="status">No {dataType} entries yet.</div>}
      </div>
    </motion.section>
  );
}

function TimelineItem({ item, dataType, itemType, index }) {
  const fields = getFields(item, dataType, itemType);
  const showImage = dataType !== 'minimal' && Boolean(item.image);
  return (
    <motion.article className="premium-timeline-item" custom={index} variants={premiumItemVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.16 }} whileTap={{ scale: 0.99 }} transition={{ duration: 0.2, ease: [0.165, 0.84, 0.44, 1] }}>
      {fields.date ? <div className="premium-timeline-date">{fields.date}</div> : <div className="premium-timeline-date" aria-hidden="true" />}
      <motion.div className="premium-timeline-card" whileHover={{ x: 6 }} whileTap={{ scale: 0.985 }} transition={{ duration: 0.18, ease: [0.165, 0.84, 0.44, 1] }}>
        {showImage && <img className="premium-card-image" src={item.image} alt={fields.title} />}
        <span className="premium-card-kicker">{itemType}</span>
        <h3>{fields.title}</h3>
        {fields.subtitle ? <p>{fields.subtitle}</p> : null}
        <DescriptionDisclosure description={fields.summary} />
        {fields.tags.length > 0 && <div className="premium-tags">{fields.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>}
        {fields.links.length > 0 && <div className="premium-links">{fields.links.map((link) => <a className="premium-mini-link" href={link.href} key={link.label}>{link.label}</a>)}</div>}
      </motion.div>
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
