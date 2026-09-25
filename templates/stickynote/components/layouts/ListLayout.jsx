'use client';

import NoteCard from './NoteCard';
import { image } from './layoutUtils';

export default function ListLayout({ items, dataType }) {
  const hasImages = items.some((item) => image(item.image));
  return (
    <div className={`stickynote-layout stickynote-layout-list ${hasImages ? 'has-images' : 'no-images'}`} data-data-type={dataType}>
      {items.map((item, index) => (
        <NoteCard key={`${dataType}-${item.title || item.role || item.degree || item.name}-${index}`} item={item} type={dataType} index={index} variant="list" />
      ))}
    </div>
  );
}
