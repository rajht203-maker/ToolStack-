import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface InFeedAdProps {
  className?: string;
  adSlot?: string;
  adClient?: string;
  layoutKey?: string;
  showLabel?: boolean;
  asCard?: boolean;
}

export const InFeedAd: React.FC<InFeedAdProps> = ({
  className = '',
  adSlot = '8822630856',
  adClient = 'ca-pub-9951412841260181',
  layoutKey = '-fb+5w+4e-db+86',
  showLabel = true,
  asCard = true
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Only attempt to push when mounted in client browser and not yet initialized for this instance
    if (typeof window === 'undefined' || pushedRef.current) return;

    const timer = setTimeout(() => {
      try {
        if (adRef.current && !adRef.current.getAttribute('data-adsbygoogle-status')) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushedRef.current = true;
          setAdLoaded(true);
        }
      } catch (err) {
        // Benign handling for AdBlockers, dev environment, or duplicate calls
        console.debug('AdSense in-feed ad push notice:', err);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  if (asCard) {
    return (
      <div 
        className={`group relative flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 min-h-[220px] ${className}`}
      >
        {showLabel && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sponsored
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
              Ad
            </span>
          </div>
        )}
        <div className="w-full flex-1 flex items-center justify-center overflow-hidden">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', minHeight: '120px' }}
            data-ad-format="fluid"
            data-ad-layout-key={layoutKey}
            data-ad-client={adClient}
            data-ad-slot={adSlot}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full my-6 clear-both ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            Sponsored Story
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
            Ad
          </span>
        </div>
      )}
      <div className="w-full overflow-hidden rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/80 p-3 sm:p-4 text-center min-h-[140px] flex items-center justify-center transition-all duration-300">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-format="fluid"
          data-ad-layout-key={layoutKey}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
        />
      </div>
    </div>
  );
};

export default InFeedAd;
