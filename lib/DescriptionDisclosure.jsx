'use client';

import { useId, useState } from 'react';

export default function DescriptionDisclosure({ description, className = '' }) {
  const parts = (Array.isArray(description) ? description : [description]).filter(
    (part) => typeof part === 'string' && part.trim(),
  );
  const [expanded, setExpanded] = useState(false);
  const regionId = useId();

  if (!parts.length) return null;
  if (parts.length === 1) return <p className={className}>{parts[0]}</p>;

  return (
    <div className={`description-disclosure ${className}`.trim()}>
      <p className="description-disclosure-preview">{parts[0]}</p>
      {expanded && (
        <div className="description-disclosure-content" id={regionId} role="region">
          {parts.slice(1).map((part, index) => (
            <p key={`${part}-${index}`}>{part}</p>
          ))}
        </div>
      )}
      <button
        className="description-disclosure-trigger"
        type="button"
        aria-expanded={expanded}
        aria-controls={regionId}
        onClick={() => setExpanded((value) => !value)}
      >
        {expanded ? 'Show less' : 'Show more'}{' '}
        <span aria-hidden="true">{expanded ? '−' : '+'}</span>
      </button>
      <style jsx global>{`
        .description-disclosure {
          margin: 0;
          color: inherit;
          min-width: 0;
        }
        .description-disclosure-preview {
          margin: 0;
        }
        .description-disclosure-content {
          margin-top: 0.55rem;
          animation: description-disclosure-in 180ms ease-out both;
        }
        .description-disclosure-content p {
          margin: 0.5rem 0;
          color: inherit;
        }
        .description-disclosure-trigger {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          min-height: 44px;
          margin-top: 0.55rem;
          padding: 0.3rem 0.55rem;
          border: 1px solid currentColor;
          border-radius: 999px;
          background: transparent;
          color: var(--disclosure-accent, currentColor);
          font: 600 0.68rem / 1.2 var(--disclosure-font, inherit);
          text-transform: uppercase;
          cursor: pointer;
          transition:
            transform 180ms ease,
            background-color 180ms ease,
            color 180ms ease,
            border-color 180ms ease;
        }
        .description-disclosure-trigger:hover {
          background: currentColor;
          color: var(--disclosure-on-accent, #0f172a);
          transform: translateY(-1px);
        }
        .description-disclosure-trigger:focus-visible {
          outline: 2px solid var(--disclosure-accent, currentColor);
          outline-offset: 3px;
        }
        .description-disclosure-trigger span {
          font-size: 1rem;
          line-height: 1;
        }
        @keyframes description-disclosure-in {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .description-disclosure-content,
          .description-disclosure-trigger {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
