'use client';

import NoteCard from './NoteCard';

export default function ListLayout({ items, dataType }) {
  return (
    <div className="stickynote-layout stickynote-layout-list" data-data-type={dataType}>
      {items.map((item, index) => (
        <NoteCard key={`${dataType}-${item.title || item.role || item.degree || item.name}-${index}`} item={item} type={dataType} index={index} variant="list" />
      ))}
    </div>
  );
}
