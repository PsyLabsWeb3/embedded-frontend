import { useEffect, useState } from 'react';
import { getBlockedCountries } from '../utils/blockedCountries';

type GeoStatus = 
  | { loading: true; allowed: null; countryCode: string | null }
  | { loading: false; allowed: boolean; countryCode: string | null };

export function useGeoblock(): GeoStatus {
  const [state, setState] = useState<GeoStatus>({
    loading: true,
    allowed: null,
    countryCode: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function checkGeo() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Geo API error');
        const data = await res.json();

        const countryCode = (data.country || data.country_code || '').toUpperCase();
        const BLOCKED_COUNTRIES = getBlockedCountries();
        const isBlocked = BLOCKED_COUNTRIES.includes(countryCode);

        if (!cancelled) {
          setState({
            loading: false,
            allowed: !isBlocked,
            countryCode,
          });
        }
      } catch (err) {
        console.error('Geolocation check failed', err);
        if (!cancelled) {
          setState({
            loading: false,
            allowed: false,
            countryCode: null,
          });
        }
      }
    }

    checkGeo();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}