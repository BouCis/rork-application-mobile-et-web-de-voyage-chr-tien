export type City = { name: string; lat: number; lng: number };
export type Country = { name: string; iso2: string; iso3?: string; cities: City[] };

// Use JSON source of truth (195+ countries, 500+ cities expected)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const raw: Record<string, { name: string; cities: { name: string; lat: number; lng: number }[] }> = require('./countries-cities.json');

const countriesFromJson: Country[] = Object.entries(raw).map(([iso2, v]) => ({
  name: v.name,
  iso2,
  iso3: undefined,
  cities: v.cities.map(c => ({ name: c.name, lat: c.lat, lng: c.lng })),
}));

export function getCountries(): { label: string; value: string }[] {
  return countriesFromJson
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(c => ({ label: `${c.name} (${c.iso2})`, value: c.iso2 }));
}

export function getCitiesByCountry(iso2: string): { label: string; value: string; lat: number; lng: number }[] {
  const c = countriesFromJson.find(cn => cn.iso2 === iso2);
  if (!c) return [];
  return c.cities
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(city => ({ label: city.name, value: city.name, lat: city.lat, lng: city.lng }));
}
