'use client';

import { motion, useReducedMotion } from 'framer-motion';
import DescriptionDisclosure from '@/lib/DescriptionDisclosure';
import { useState } from 'react';
import Badge from '../ui/Badge';
import DateString from '../DateString';
import { image, links, subtitle, summary, tags, title } from './layoutUtils';
import { paperDrop, stickyItemReveal } from '../motionConfig';

const palettes = ['yellow', 'blue', 'pink', 'lime', 'purple'];

export default function NoteCard({ item, type, index = 0, variant = 'grid' }) {
  const reduceMotion = useReducedMotion();
  const [dropped, setDropped] = useState(false);
  const noteClass = `stickynote-note stickynote-note-${palettes[index % palettes.length]}`;
  const itemImage = image(item.image);
  const itemLinks = links(item);
  const itemTags = tags(item, type);
  const isTimeline = variant === 'timeline';
  const isList = variant === 'list';
  const imageClass = isList ? (itemImage ? ' has-image' : ' no-image') : '';

  function dropPaper() {
    if (reduceMotion || dropped) return;
    setDropped(true);
    window.setTimeout(() => setDropped(false), 2000);
  }

  return (
    <motion.article
      className={`${noteClass} stickynote-entry stickynote-entry-${variant}${imageClass}`}
      whileHover={isList ? undefined : { y: -5, rotate: index % 2 ? 0.35 : -0.35 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.2 }}
      variants={dropped ? paperDrop : stickyItemReveal}
      initial={reduceMotion ? false : 'hidden'}
      whileInView={reduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.16 }}
      custom={index}
      animate={dropped ? 'dropped' : undefined}
      onClick={(event) => {
        if (event.target.closest('a, button, input, textarea')) return;
        dropPaper();
      }}
    >
      {variant !== 'list' && (
        <span className={`stickynote-tape tape-${palettes[(index + 2) % palettes.length]}`} aria-hidden="true" />
      )}
      {isTimeline && <span className="stickynote-timeline-dot" aria-hidden="true" />}
      {itemImage ? (
        <img className="stickynote-entry-image" src={itemImage} alt="" loading="lazy" decoding="async" />
      ) : null}
      <div className="stickynote-entry-body">
        <div className="stickynote-entry-heading">
          <h3>{title(item, type)}</h3>
          {(item.start || item.end || item.date) && (
            <time>
              {item.start || item.end ? (
                <DateString start={item.start} end={item.end} />
              ) : (
                item.date
              )}
            </time>
          )}
        </div>
        {subtitle(item, type) && <p className="stickynote-entry-subtitle">{subtitle(item, type)}</p>}
        {summary(item) && <DescriptionDisclosure description={summary(item)} />}
        {itemTags.length > 0 && (
          <div className="stickynote-chip-list">
            {itemTags.map((tag, tagIndex) => <Badge key={`${tag}-${tagIndex}`}>{tag}</Badge>)}
          </div>
        )}
        {itemLinks.length > 0 && (
          <div className="stickynote-entry-links">
            {itemLinks.map((link) => (
              <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>
                {link.label} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}
