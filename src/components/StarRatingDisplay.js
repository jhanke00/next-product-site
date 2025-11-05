export default function StarRatingDisplay({ rating }) {
  return (
    <div style={{ display: 'flex', gap: '5px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= rating ? '#ffc107' : '#e4e5e9',
            fontSize: '20px',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}
