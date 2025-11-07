export default function ShareIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {/* share-2 스타일 (세 점 + 선) */}
      <circle cx="18" cy="5" r="3"></circle>
      <circle cx="6" cy="12" r="3"></circle>
      <circle cx="18" cy="19" r="3"></circle>
      <path d="M8.59 13.51l6.82 3.98"></path>
      <path d="M15.41 6.51L8.59 10.49"></path>
    </svg>
  );
}
