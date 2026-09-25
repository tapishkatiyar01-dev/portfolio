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

export default function GridLayout({ items, dataType, itemType = dataType }) {
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
        <div className="terminal-title">{dataType}.grid</div>
        <div className="terminal-actions">_ [] x</div>
      </div>
      <div className="terminal-content">
        <div className="terminal-layout-grid">
          {items.map((item, index) => (
            <ArticleCard
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

function ArticleCard({ item, dataType, itemType, reduced }) {
  const fields = getRecordFields(item, dataType, itemType);
  const isMinimal = isMinimalDataType(dataType);
  const showImage = Boolean(fields.image);

  return (
    <motion.article
      className="terminal-grid-card"
      layout="position"
      whileHover={reduced ? undefined : { y: -4 }}
      whileTap={reduced ? undefined : { scale: 0.985 }}
    >
      <div className="terminal-card-icon">&gt;_</div>
      <div className="min-w-0 max-w-full space-y-4">
        {showImage && (
          <div className="terminal-card-image">
            <img className="terminal-avatar-image" src={fields.image} alt={fields.title} />
            <div className="terminal-avatar-scan" />
          </div>
        )}
        <div>
          <p className="terminal-card-kicker">{getItemKind(itemType)}</p>
          <h3 className="mt-2 truncate text-lg font-semibold text-zinc-100">{fields.title}</h3>
          {!isMinimal && fields.subtitle && (
            <p className="mt-1 truncate text-xs text-zinc-500">{fields.subtitle}</p>
          )}
        </div>
        <DescriptionDisclosure className="text-sm leading-6 text-zinc-400" description={fields.summary} />
        {fields.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {fields.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          {!isMinimal && fields.date && <span className="terminal-date-chip">{fields.date}</span>}
          {fields.links.map((link) => (
            <a key={link.label} href={link.href} className="terminal-mini-link">
              &gt; {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
