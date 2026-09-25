'use client';

import NoteCard from './NoteCard';

export default function TimelineLayout({ items, dataType }) {
  return (
    <div className="stickynote-layout stickynote-layout-timeline" data-data-type={dataType}>
      {items.map((item, index) => (
        <NoteCard key={`${dataType}-${item.title || item.role || item.degree || item.name}-${index}`} item={item} type={dataType} index={index} variant="timeline" />
      ))}
    </div>
  );
}
