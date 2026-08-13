export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Radhe Investments",
    "url": "https://www.radheinv.site",
    "logo": "https://www.radheinv.site/logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9603610000",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": ["en", "hi", "pa"]
    }
  };
};

export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "Radhe Investments",
    "image": "https://www.radheinv.site/storefront.jpg",
    "@id": "https://www.radheinv.site",
    "url": "https://www.radheinv.site",
    "telephone": "+91-9603610000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Bazaar",
      "addressLocality": "Mansa",
      "addressRegion": "Punjab",
      "postalCode": "151505",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 29.9880,
      "longitude": 75.3940
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "$$"
  };
};

export const generateBreadcrumbSchema = (crumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};
