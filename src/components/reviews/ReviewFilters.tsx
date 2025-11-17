'use client';

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful';

type Props = {
  sort: SortOption;
  minRating: number;
  onSortChange: (value: SortOption) => void;
  onMinRatingChange: (value: number) => void;
};

export default function ReviewFilters({ sort, minRating, onSortChange, onMinRatingChange }: Props) {
  return (
    <div className='flex flex-wrap gap-4 items-center my-4'>
      <div className='flex flex-col'>
        <label className='text-xs opacity-70'>Sort by</label>
        <select
          className='border rounded px-2 py-1 text-sm'
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value='newest'>Newest</option>
          <option value='oldest'>Oldest</option>
          <option value='highest'>Highest rated</option>
          <option value='lowest'>Lowest rated</option>
          <option value='helpful'>Most helpful</option>
        </select>
      </div>

      <div className='flex flex-col'>
        <label className='text-xs opacity-70'>Min rating</label>
        <select
          className='border rounded px-2 py-1 text-sm'
          value={minRating}
          onChange={(e) => onMinRatingChange(Number(e.target.value))}
        >
          <option value={0}>All</option>
          <option value={1}>1★+</option>
          <option value={2}>2★+</option>
          <option value={3}>3★+</option>
          <option value={4}>4★+</option>
          <option value={5}>5★ only</option>
        </select>
      </div>
    </div>
  );
}
