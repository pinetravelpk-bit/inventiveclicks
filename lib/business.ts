// Single source of truth for the business profile used in structured data,
// llms.txt and contact details. Only fill in verified details: empty values are
// left out of the published markup rather than guessed.
// Keep name, address and phone identical to your Google Business Profile.
export const business = {
  name: 'Inventive Clicks',
  url: 'https://inventiveclicks.com',
  tagline: 'Ideas. Strategy. Real Results.',
  description:
    'Inventive Clicks is a creative and performance digital agency providing digital marketing, SEO, PPC, social media marketing, e-commerce marketing, web development, branding, content creation and remote staffing.',
  email: '',
  // International format, e.g. +92 300 0000000
  telephone: '',
  address: {
    streetAddress: '',
    addressLocality: '', // city
    addressRegion: '', // province / state
    postalCode: '',
    addressCountry: '', // ISO code, e.g. PK
  },
  // Optional map pin for the office, decimal degrees.
  geo: { latitude: '', longitude: '' },
  // Cities, regions or countries you serve, e.g. ['Karachi', 'Pakistan', 'United States']
  areaServed: [] as string[],
  // e.g. [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' }]
  openingHours: [] as { days: string[]; opens: string; closes: string }[],
  // Official profiles: Google Business Profile, LinkedIn, Facebook, Instagram, Clutch, etc.
  sameAs: [] as string[],
  foundingDate: '',
  priceRange: '',
};

const hasAddress = Boolean(business.address.streetAddress && business.address.addressLocality && business.address.addressCountry);

function clean<T extends Record<string, unknown>>(o: T) {
  return Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '' && v != null && !(Array.isArray(v) && v.length === 0)));
}

export const organizationId = business.url + '/#organization';

// Organization schema; becomes ProfessionalService (a LocalBusiness type) once a real address is set.
export function organizationSchema(serviceNames: string[]) {
  return clean({
    '@type': hasAddress ? ['Organization', 'ProfessionalService'] : 'Organization',
    '@id': organizationId,
    name: business.name,
    url: business.url,
    slogan: business.tagline,
    description: business.description,
    logo: { '@type': 'ImageObject', url: business.url + '/logo.png', width: 512, height: 512 },
    image: business.url + '/opengraph-image.jpg',
    email: business.email,
    telephone: business.telephone,
    foundingDate: business.foundingDate,
    priceRange: hasAddress ? business.priceRange : '',
    address: hasAddress ? { '@type': 'PostalAddress', ...clean(business.address) } : '',
    geo: business.geo.latitude && business.geo.longitude ? { '@type': 'GeoCoordinates', latitude: Number(business.geo.latitude), longitude: Number(business.geo.longitude) } : '',
    areaServed: business.areaServed.map(name => ({ '@type': 'Place', name })),
    openingHoursSpecification: business.openingHours.map(h => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    sameAs: business.sameAs,
    contactPoint: business.email || business.telephone ? clean({ '@type': 'ContactPoint', contactType: 'sales', email: business.email, telephone: business.telephone, availableLanguage: ['English'] }) : '',
    knowsAbout: serviceNames,
    hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Digital marketing and web services', itemListElement: serviceNames.map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })) },
  });
}
