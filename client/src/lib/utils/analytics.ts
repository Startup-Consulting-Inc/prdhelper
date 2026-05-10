const GA4_ID = import.meta.env.VITE_GA4_ID;

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: unknown[]) => void;
  }
}

const getGtag = () => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  window.dataLayer = window.dataLayer || [];

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }

  return window.gtag;
};

const hasAnalytics = (): boolean => typeof GA4_ID === 'string' && GA4_ID.length > 0;

export const initializeAnalytics = (): void => {
  if (typeof window === 'undefined' || !hasAnalytics()) {
    return;
  }

  const gtag = getGtag();
  if (!gtag) {
    return;
  }

  gtag('js', new Date());
  gtag('config', GA4_ID, {
    send_page_view: false,
  });
};

export const trackPageView = (page_path: string, page_title?: string): void => {
  if (typeof window === 'undefined' || !hasAnalytics()) {
    return;
  }

  const gtag = getGtag();
  if (!gtag) {
    return;
  }

  gtag('event', 'page_view', {
    page_path,
    page_title,
  });
};

export const trackEvent = (
  eventName: string,
  eventParams: Record<string, unknown> = {}
): void => {
  if (typeof window === 'undefined' || !hasAnalytics()) {
    return;
  }

  const gtag = getGtag();
  if (!gtag) {
    return;
  }

  gtag('event', eventName, eventParams);
};

export const setUserProperties = (properties: Record<string, string>): void => {
  if (typeof window === 'undefined' || !hasAnalytics()) {
    return;
  }

  const gtag = getGtag();
  if (!gtag) {
    return;
  }

  gtag('set', properties);
};
