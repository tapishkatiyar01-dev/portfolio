'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import Badge from '@/templates/terminal/components/ui/Badge';
import { terminalWindowVariants, useTerminalWindowMotion } from '../motionConfig';
import {
  getItemKind,
  getRecordFields,
  isMinimalDataType,
} from './layoutUtils';

export default function TimelineLayout({ items, dataType, itemType = dataType }) {
  const { ref: windowRef, isInView } = useTerminalWindowMotion();
  const reduced = useReducedMotion();

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
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="terminal-title">{dataType}.log</div>
        <div className="terminal-actions">_ [] x</div>
      </div>
      <div className="terminal-content">
        <div className="terminal-timeline">
          {items.map((item, index) => (
            <TimelineItem
              key={`${getRecordFields(item, dataType, itemType).title}-${index}`}
              item={item}
              dataType={dataType}
              itemType={itemType}
              reduced={reduced}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function TimelineItem({ item, dataType, itemType, reduced }) {
  const fields = getRecordFields(item, dataType, itemType);
  const isMinimal = isMinimalDataType(dataType);
  const showImage = Boolean(fields.image);

  return (
    <motion.article
      className={`terminal-timeline-item${isMinimal || !fields.date ? ' is-minimal' : ''}`}
    >
      <span className="terminal-timeline-dot" aria-hidden="true" />
      {!isMinimal && fields.date && (
        <div className="terminal-timeline-date">
          <span>{fields.date}</span>
          <span className="terminal-data-kind">{getItemKind(itemType)}</span>
        </div>
      )}
      <motion.div
        className={`terminal-timeline-card${showImage ? ' has-image' : ''}`}
        whileHover={reduced ? undefined : { x: 3 }}
        whileTap={reduced ? undefined : { scale: 0.99 }}
      >
        {showImage && (
          <>
            <img className="terminal-avatar-image terminal-layout-image" src={fields.image} alt={fields.title} />
            <div className="terminal-avatar-scan" />
          </>
        )}
        <h3 className="text-sm font-semibold text-zinc-100">{fields.title}</h3>
        {!isMinimal && fields.subtitle && (
          <p className="text-xs text-zinc-300">{fields.subtitle}</p>
        )}
        <DescriptionDisclosure className="max-w-2xl text-sm leading-6 text-zinc-400" description={fields.summary} />
        {fields.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {fields.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
        {fields.links.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {fields.links.map((link) => (
              <a key={link.label} href={link.href} className="terminal-mini-link">
                &gt; {link.label}
              </a>
            ))}
          </div>
        )}
      </motion.div>
    </motion.article>
  );
}
