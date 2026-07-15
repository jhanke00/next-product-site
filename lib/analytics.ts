export type AnalyticsEvent = {
  category: string;
  action: string;
  label?: string;
  value?: number;
};

const STORAGE_KEY = 'app-analytics-events';

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === 'undefined') return;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  const events = raw ? JSON.parse(raw) : [];
  const payload = { ...event, timestamp: new Date().toISOString() };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...events, payload]));

  if ((window as any).dataLayer) {
    (window as any).dataLayer.push(payload);
  }

  console.log('[Analytics]', payload);
}

export function getCategoryCounts() {
  if (typeof window === 'undefined') return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  const events = raw ? JSON.parse(raw) : [];
  return events.reduce<Record<string, number>>((acc, event: AnalyticsEvent) => {
    if (event.action === 'category-click') {
      acc[event.label ?? event.category] = (acc[event.label ?? event.category] ?? 0) + 1;
    }
    return acc;
  }, {});
}
