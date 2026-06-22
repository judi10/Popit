import React, { useEffect } from 'react';
import './FeedbackText.css';

export default function FeedbackText({ feedback, onDone }) {
  const { id, text, type, x, y } = feedback;

  useEffect(() => {
    const t = setTimeout(() => onDone(id), 850);
    return () => clearTimeout(t);
  }, [id, onDone]);

  return (
    <span
      className={`feedback-text feedback-text--${type}`}
      style={{ left: x - 20, top: y - 20 }}
      aria-live="polite"
      aria-atomic="true"
    >
      {text}
    </span>
  );
}
