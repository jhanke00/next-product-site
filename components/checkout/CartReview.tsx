import React from 'react';

type Props = {
  onNext?: () => void;
};

export default function CartReview({ onNext }: Props) {
  return (
    <div>
      <h2>Cart Review</h2>
      <p>Your cart items will appear here.</p>
      {onNext && (
        <button onClick={onNext} style={{ marginTop: 12 }}>
          Continue
        </button>
      )}
    </div>
  );
}
