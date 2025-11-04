export type City = { name: string; lat: number; lng: number };
export type Country = { name: string; iso2: string; iso3: string; cities: City[] };

export const countries: Country[] = [
  {
    name: 'France',
    iso2: 'FR',
    iso3: 'FRA',
    cities: [
      { name: 'Paris', lat: 48.8566, lng: 2.3522 },
      { name: 'Lyon', lat: 45.7640, lng: 4.8357 },
      { name: 'Marseille', lat: 43.2965, lng: 5.3698 },
      { name: 'Nice', lat: 43.7102, lng: 7.2620 },
      { name: 'Bordeaux', lat: 44.8378, lng: -0.5792 },
    ],
  },
  {
    name: 'Italie',
    iso2: 'IT',
    iso3: 'ITA',
    cities: [
      { name: 'Rome', lat: 41.9028, lng: 12.4964 },
      { name: 'Milan', lat: 45.4642, lng: 9.1900 },
      { name: 'Naples', lat: 40.8518, lng: 14.2681 },
      { name: 'Florence', lat: 43.7696, lng: 11.2558 },
      { name: 'Venise', lat: 45.4408, lng: 12.3155 },
    ],
  },
  {
    name: 'Espagne',
    iso2: 'ES',
    iso3: 'ESP',
    cities: [
      { name: 'Madrid', lat: 40.4168, lng: -3.7038 },
      { name: 'Barcelone', lat: 41.3851, lng: 2.1734 },
      { name: 'Valence', lat: 39.4699, lng: -0.3763 },
      { name: 'Séville', lat: 37.3891, lng: -5.9845 },
      { name: 'Malaga', lat: 36.7213, lng: -4.4217 },
    ],
  },
  {
    name: 'États-Unis',
    iso2: 'US',
    iso3: 'USA',
    cities: [
      { name: 'New York', lat: 40.7128, lng: -74.006 },
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
      { name: 'Miami', lat: 25.7617, lng: -80.1918 },
      { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
      { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
    ],
  },
  {
    name: 'Japon',
    iso2: 'JP',
    iso3: 'JPN',
    cities: [
      { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
      { name: 'Kyoto', lat: 35.0116, lng: 135.7681 },
      { name: 'Osaka', lat: 34.6937, lng: 135.5023 },
      { name: 'Hiroshima', lat: 34.3853, lng: 132.4553 },
      { name: 'Sapporo', lat: 43.0618, lng: 141.3545 },
    ],
  },
  {
    name: 'Brésil',
    iso2: 'BR',
    iso3: 'BRA',
    cities: [
      { name: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729 },
      { name: 'São Paulo', lat: -23.5558, lng: -46.6396 },
      { name: 'Salvador', lat: -12.9777, lng: -38.5016 },
      { name: 'Brasilia', lat: -15.7939, lng: -47.8828 },
      { name: 'Fortaleza', lat: -3.7319, lng: -38.5267 },
    ],
  },
  {
    name: 'Sénégal',
    iso2: 'SN',
    iso3: 'SEN',
    cities: [
      { name: 'Dakar', lat: 14.7167, lng: -17.4677 },
      { name: 'Saint-Louis', lat: 16.0333, lng: -16.5 },
      { name: 'Thiès', lat: 14.7833, lng: -16.9667 },
      { name: 'Ziguinchor', lat: 12.5833, lng: -16.2667 },
      { name: 'Kaolack', lat: 14.1833, lng: -16.25 },
    ],
  },
  {
    name: 'Royaume-Uni',
    iso2: 'GB',
    iso3: 'GBR',
    cities: [
      { name: 'Londres', lat: 51.5074, lng: -0.1278 },
      { name: 'Manchester', lat: 53.4808, lng: -2.2426 },
      { name: 'Édimbourg', lat: 55.9533, lng: -3.1883 },
      { name: 'Bristol', lat: 51.4545, lng: -2.5879 },
      { name: 'Liverpool', lat: 53.4084, lng: -2.9916 },
    ],
  },
];

export function getCountries(): { label: string; value: string }[] {
  return countries.map(c => ({ label: `${c.name} (${c.iso2})`, value: c.iso2 }));
}

export function getCitiesByCountry(iso2: string): { label: string; value: string; lat: number; lng: number }[] {
  const c = countries.find(cn => cn.iso2 === iso2);
  if (!c) return [];
  return c.cities.map(city => ({ label: city.name, value: city.name, lat: city.lat, lng: city.lng }));
}
