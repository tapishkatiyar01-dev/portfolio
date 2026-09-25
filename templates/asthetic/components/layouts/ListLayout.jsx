'use client';

import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import Badge from '@/templates/asthetic/components/ui/Badge';
import { aestheticStagger, aestheticStaggerItem, aestheticTimelineMotion } from '../motionConfig';
import LayoutFrame from './LayoutFrame';
import {
  getItemTitle,
  getListHeaders,
  getRecordFields,
  isMinimalDataType,
} from './layoutUtils';

export default function ListLayout({ items, dataType, itemType = dataType, sectionName = '' }) {
  const reduced = useReducedMotion();
  const listRef = useRef(null);
  const inView = useInView(listRef, { once: true, amount: 0.02, margin: '0px 0px -8% 0px' });
  const isProject = itemType === 'project' || dataType === 'project';
  const isMinimal = isMinimalDataType(dataType);
  const isListView = dataType === 'listview' || itemType === 'listview';
  const hasImages = !isMinimal && items.some((item) => item.image);
  const headers = getHeaders({ dataType, itemType, isProject, isMinimal });
  const tableClassName = [
    'aesthetic-list-table',
    isProject ? 'project-list' : '',
    hasImages ? 'has-images' : '',
    isListView ? 'is-listview' : '',
    isMinimal ? 'data-minimal' : '',
    `data-${itemType || dataType}`,
  ].filter(Boolean).join(' ');

  return (
    <LayoutFrame title={sectionName || 'Index'}>
      <div className={tableClassName}>
        <div className="aesthetic-list-head">
          {hasImages && <span aria-hidden="true" />}
          {headers.map((header) => <span key={header}>{header}</span>)}
        </div>

        <motion.div
          ref={listRef}
          className="aesthetic-list-body"
          variants={aestheticStagger}
          initial={false}
          animate={reduced || inView ? 'visible' : 'hidden'}
        >
          {items.map((item, index) => (
            isListView ? (
              <ListViewRow
                key={`${getItemTitle(item, itemType)}-${index}`}
                item={item}
                dataType={dataType}
                itemType={itemType}
                hasImages={hasImages}
                reduced={reduced}
              />
            ) : (
              <ListRow
                key={`${getItemTitle(item, itemType)}-${index}`}
                item={item}
                dataType={dataType}
                itemType={itemType}
                isProject={isProject}
                isMinimal={isMinimal}
                hasImages={hasImages}
                reduced={reduced}
              />
            )
          ))}
        </motion.div>
      </div>
    </LayoutFrame>
  );
}

function ListViewRow({ item, dataType, itemType, hasImages, reduced }) {
  const fields = getRecordFields(item, dataType, itemType);

  return (
    <motion.article
      className={`aesthetic-list-row aesthetic-listview-row${hasImages ? ' has-images' : ''}`}
      variants={aestheticStaggerItem}
      {...aestheticTimelineMotion(reduced)}
    >
      {hasImages && (
        fields.image ? (
          <span className="aesthetic-list-image-frame">
            <img className="aesthetic-list-image" src={fields.image} alt={fields.title} loading="lazy" />
          </span>
        ) : <span className="aesthetic-list-image-placeholder" aria-hidden="true" />
      )}
      <div className="aesthetic-listview-primary">
        <strong>{fields.title}</strong>
        {fields.subtitle && <span>{fields.subtitle}</span>}
      </div>
      {fields.date && <time className="aesthetic-listview-date">{fields.date}</time>}
    </motion.article>
  );
}

function ListRow({ item, dataType, itemType, isProject, isMinimal, hasImages, reduced }) {
  const fields = getRecordFields(item, dataType, itemType);

  return (
    <motion.article
      className="aesthetic-list-row"
      variants={aestheticStaggerItem}
      {...aestheticTimelineMotion(reduced)}
    >
      {hasImages && (
        fields.image ? (
          <span className="aesthetic-list-image-frame">
            <img className="aesthetic-list-image" src={fields.image} alt={fields.title} loading="lazy" />
            <div className="aesthetic-avatar-scan" aria-hidden="true" />
          </span>
        ) : <span className="aesthetic-list-image-placeholder" aria-hidden="true" />
      )}

      <span className="aesthetic-list-cell aesthetic-list-title">{fields.title}</span>

      {isMinimal ? (
        <>
          <DescriptionDisclosure className="aesthetic-list-cell aesthetic-list-summary" description={fields.summary} />
          <span className="aesthetic-list-cell aesthetic-list-tags">
            {fields.tags.length > 0 ? fields.tags.join(' / ') : '—'}
          </span>
        </>
      ) : isProject ? (
        <>
          <DescriptionDisclosure className="aesthetic-list-cell aesthetic-list-summary" description={fields.summary} />
          <span className="aesthetic-list-cell aesthetic-list-tags">{fields.tags.join(' / ') || '—'}</span>
          <span className="aesthetic-list-cell aesthetic-list-links">
            {fields.links.length > 0
              ? fields.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)
              : '—'}
          </span>
        </>
      ) : (
        <>
          <DescriptionDisclosure className="aesthetic-list-cell aesthetic-list-summary" description={fields.summary} />
          <span className="aesthetic-list-cell aesthetic-list-secondary">{fields.subtitle || '—'}</span>
          <span className="aesthetic-list-cell aesthetic-list-date">{fields.date || '—'}</span>
        </>
      )}
    </motion.article>
  );
}

function getHeaders({ dataType, itemType, isProject, isMinimal }) {
  if (isMinimal) return ['Title', 'Summary', 'Tags'];
  if (isProject) return ['Project', 'Summary', 'Stack', 'Links'];
  return getListHeaders(itemType || dataType);
}