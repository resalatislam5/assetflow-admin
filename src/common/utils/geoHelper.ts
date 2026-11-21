/**
 * Fetches a human-readable location/area name using OpenStreetMap Nominatim reverse geocoding
 */
export const getFriendlyLocationName = async (
  latitude: number,
  longitude: number,
): Promise<string> => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en',
        },
      },
    );
    if (!res.ok) {
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
    const data = await res.json();
    const addr = data?.address;
    if (!addr) {
      return data?.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }

    // Build short clean name: e.g. "Dhanmondi, Dhaka" or "Banani, Dhaka"
    const parts = [
      addr.suburb || addr.neighbourhood || addr.road || addr.village || addr.commercial,
      addr.city || addr.town || addr.county || addr.state_district,
    ].filter(Boolean);

    if (parts.length > 0) {
      return parts.join(', ');
    }

    return (
      addr.city ||
      addr.state ||
      data?.display_name?.split(',').slice(0, 2).join(',') ||
      `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
    );
  } catch {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
};

/**
 * Generates a Google Maps URL from coordinates or address string
 */
export const getGoogleMapUrl = (
  latitude?: number,
  longitude?: number,
  locationText?: string,
): string => {
  if (latitude && longitude) {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }
  if (locationText) {
    // Check if locationText looks like "lat, lng"
    const match = locationText.match(/^([-+]?\d+\.\d+)\s*,\s*([-+]?\d+\.\d+)$/);
    if (match) {
      return `https://www.google.com/maps?q=${match[1]},${match[2]}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationText)}`;
  }
  return 'https://www.google.com/maps';
};
