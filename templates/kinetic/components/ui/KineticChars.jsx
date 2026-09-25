'use client';

/**
 * Split a string into per-character spans for GSAP stagger.
 * Spaces become non-breaking so line breaks stay intentional.
 */
export default function KineticChars({ text = '', className = '', as: Tag = 'span' }) {
  const value = String(text || '');
  return (
    <Tag className={className} aria-label={value} data-k="title" data-k-chars>
      {value.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="kinetic-char"
          data-k-char
          aria-hidden="true"
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </Tag>
  );
}
