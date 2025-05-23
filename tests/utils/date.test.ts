import { formatDate } from '@/src/utils/date';

describe('formatDate', () => {
  test('formats valid date string correctly', () => {
    const input = '2023-03-15T10:30:00Z';
    const localDate = new Date(input);
    const expected = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(localDate);

    expect(formatDate(input)).toBe(expected);
  });

  test('handles invalid date string gracefully', () => {
    const input = 'invalid-date';
    expect(() => formatDate(input)).toThrow();
  });
});
