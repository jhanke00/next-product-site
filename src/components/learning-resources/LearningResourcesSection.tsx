'use client';

import { useState } from 'react';
import LearningResourcesList from './LearningResourcesList';
import AddLearningResourceForm from './AddLearningResourceForm';

interface LearningResourcesSectionProps {
  productId: string;
}

export default function LearningResourcesSection({ productId }: LearningResourcesSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleResourceAdded = () => {
    // Force refresh of the list by changing the key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <LearningResourcesList key={refreshKey} productId={productId} />
      <AddLearningResourceForm productId={productId} onSuccess={handleResourceAdded} />
    </div>
  );
}
