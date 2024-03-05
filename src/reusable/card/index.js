import './card.css';

export default function Card({ children = null, className = '' }) {
  return <div className={`reusable-card ${className}`}>{children}</div>;
}
