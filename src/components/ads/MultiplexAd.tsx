import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

interface MultiplexAdProps {
  className?: string;
  adSlot?: string;
  adClient?: string;
  showLabel?: boolean;
}

export const MultiplexAd: React.FC<MultiplexAdProps> = ({
  className = '',
  adSlot = '2800147981',
  adClient = 'ca-pub-9951412841260181',
  showLabel = true
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef<boolean>(false);
  const [adLoaded, setAdLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Only attempt to push when mounted and not yet initialized for this instance
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
        console.debug('AdSense multiplex ad push notice:', err);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`w-full my-6 clear-both ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
            Sponsored Recommendations
          </span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            Ad
          </span>
        </div>
      )}
      <div className="w-full overflow-hidden rounded-2xl bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/80 p-2 sm:p-4 text-center min-h-[140px] flex items-center justify-center transition-all duration-300">
        <ins
          ref={adRef}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-format="autorelaxed"
          data-ad-client={adClient}
          data-ad-slot={adSlot}
        />
      </div>
    </div>
  );
};

export default MultiplexAd;
