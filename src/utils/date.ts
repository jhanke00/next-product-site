export const formatDate = (date: string) => {
  const newDate = new Date(date);
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(newDate);

  return formattedDate;
};
