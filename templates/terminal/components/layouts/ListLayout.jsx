'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { terminalWindowVariants, useTerminalWindowMotion } from '../motionConfig';
import {
  getListHeaders,
  getRecordFields,
  isMinimalDataType,
} from './layoutUtils';

export default function ListLayout({ items, dataType, itemType = dataType }) {
  const { ref: windowRef, isInView } = useTerminalWindowMotion();
  const reduced = useReducedMotion();
  const isProject = itemType === 'project' || dataType === 'project';
  const isMinimal = isMinimalDataType(dataType);
  const fieldsList = items.map((item) => getRecordFields(item, dataType, itemType));
  const hasImages = !isMinimal && fieldsList.some((fields) => fields.image);
  const headers = getHeaders({ dataType, itemType, isProject, isMinimal });
  const tableClassName = [
    'terminal-list-table',
    isProject ? 'project-list' : '',
    hasImages ? 'has-images' : '',
    `data-${itemType || dataType}`,
  ].filter(Boolean).join(' ');

  return (
    <motion.section
      className="terminal-window"
      variants={terminalWindowVariants}
      ref={windowRef}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="terminal-title-bar">
        <div className="terminal-dots">
          <span />
          <span />
          <span />
        </div>
        <div className="terminal-title">{dataType}.list</div>
        <div className="terminal-actions">_ [] x</div>
      </div>

      <div className="terminal-content">
        <div className={tableClassName}>
          <div className="terminal-list-head">
            {hasImages && <span aria-hidden="true" />}
            {headers.map((header) => <span key={header}>{header}</span>)}
          </div>

          {items.map((item, index) => (
            <ListRow
              key={`${fieldsList[index].title}-${index}`}
              fields={fieldsList[index]}
              isProject={isProject}
              isMinimal={isMinimal}
              hasImages={hasImages}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function ListRow({ fields, isProject, isMinimal, hasImages, reduced }) {
  return (
    <motion.div
      className="terminal-list-row"
      layout="position"
      whileHover={reduced ? undefined : { x: 4 }}
      whileTap={reduced ? undefined : { scale: 0.99 }}
      title={Array.isArray(fields.summary) ? fields.summary[0] : fields.summary}
    >
      {hasImages && (
        fields.image ? (
          <span className="terminal-list-image-frame">
            <img className="terminal-avatar-image terminal-list-image" src={fields.image} alt="" />
            <div className="terminal-avatar-scan" />
          </span>
        ) : <span />
      )}

      <span className="terminal-list-cell terminal-list-title">{fields.title}</span>

      {isMinimal ? (
        <DescriptionDisclosure className="terminal-list-cell terminal-list-summary" description={fields.summary} />
      ) : isProject ? (
        <>
          <DescriptionDisclosure className="terminal-list-cell terminal-list-summary" description={fields.summary} />
          <span className="terminal-list-cell terminal-list-tags">
            {fields.tags.join(' / ') || 'Project'}
          </span>
          <span className="terminal-list-cell terminal-list-links">
            {fields.links.length > 0
              ? fields.links.map((link) => <a key={link.label} href={link.href}>{link.label}</a>)
              : '—'}
          </span>
        </>
      ) : (
        <>
          <DescriptionDisclosure className="terminal-list-cell terminal-list-summary" description={fields.summary} />
          <span className="terminal-list-cell terminal-list-secondary">{fields.subtitle || '—'}</span>
          <span className="terminal-list-cell terminal-list-date">{fields.date || '—'}</span>
        </>
      )}
    </motion.div>
  );
}

function getHeaders({ dataType, itemType, isProject, isMinimal }) {
  if (isMinimal) return ['Title', 'Summary'];
  if (isProject) return ['Project', 'Summary', 'Tech Stack', 'Links'];
  return getListHeaders(itemType || dataType);
}
