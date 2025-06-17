export const httpFetch = async (url: string) => {
  try {
    const domain = 'http://localhost:3000/api';
    const response = await fetch(domain + url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetcher error:', error);
    throw error;
  }
};
