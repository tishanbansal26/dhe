/**
 * Structured Data (JSON-LD) Schema Generators
 * Google Rich Results compliant schemas for insurance domain
 */

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Radhe Investments",
    "alternateName": "Radhe Investments Insurance & Financial Services",
    "url": "https://www.radheinv.site",
    "logo": "https://www.radheinv.site/logo.png",
    "sameAs": [],
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "telephone": "+91-9603610000",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["en", "hi", "pa"]
      },
      {
        "@type": "ContactPoint",
        "telephone": "+91-9603610000",
        "contactType": "sales",
        "areaServed": ["IN-PB", "IN-HR", "IN-CH"],
        "availableLanguage": ["en", "hi", "pa"]
      }
    ],
    "description": "Radhe Investments is a trusted IRDAI-registered insurance advisory firm in Mansa, Punjab offering health, life, term, motor, pension and investment plans from top Indian insurers.",
    "foundingDate": "2015",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opp More Super Market, Main Bazaar",
      "addressLocality": "Mansa",
      "addressRegion": "Punjab",
      "postalCode": "151505",
      "addressCountry": "IN"
    }
  };
};

export const generateLocalBusinessSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "InsuranceAgency",
    "name": "Radhe Investments",
    "image": "https://www.radheinv.site/og-image.jpg",
    "@id": "https://www.radheinv.site",
    "url": "https://www.radheinv.site",
    "telephone": "+91-9603610000",
    "description": "Expert insurance advisory and financial planning services in Mansa, Punjab. Compare health, life, term, motor & pension plans from 50+ insurers.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Opp More Super Market, Main Bazaar",
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
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ],
    "priceRange": "$$",
    "areaServed": [
      { "@type": "City", "name": "Mansa" },
      { "@type": "State", "name": "Punjab" },
      { "@type": "City", "name": "Bathinda" },
      { "@type": "City", "name": "Sangrur" }
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Insurance Products",
      "itemListElement": [
        { "@type": "OfferCatalog", "name": "Health Insurance Plans" },
        { "@type": "OfferCatalog", "name": "Term Life Insurance Plans" },
        { "@type": "OfferCatalog", "name": "Pension & Annuity Plans" },
        { "@type": "OfferCatalog", "name": "Motor Insurance Plans" },
        { "@type": "OfferCatalog", "name": "ULIP & Investment Plans" }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "120",
      "bestRating": "5"
    }
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

export const generateFAQSchema = (faqs) => {
  if (!faqs || !faqs.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question || faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer || faq.a
      }
    }))
  };
};

/**
 * Product schema for individual insurance plans
 */
export const generateProductSchema = (plan) => {
  if (!plan) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": plan.name,
    "description": plan.description || plan.metadata?.summary || '',
    "brand": {
      "@type": "Brand",
      "name": plan.insurance_companies?.name || 'IRDAI Registered Insurer'
    },
    "category": plan.category,
    "url": `https://www.radheinv.site/plan/${plan.id}`,
    "offers": {
      "@type": "Offer",
      "availability": plan.active ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceCurrency": "INR",
      "seller": {
        "@type": "Organization",
        "name": "Radhe Investments"
      }
    }
  };
};

/**
 * WebPage schema for generic pages
 */
export const generateWebPageSchema = (pageInfo) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageInfo.title,
    "description": pageInfo.description,
    "url": pageInfo.url,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Radhe Investments",
      "url": "https://www.radheinv.site"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Radhe Investments"
    },
    ...(pageInfo.breadcrumbs ? { "breadcrumb": generateBreadcrumbSchema(pageInfo.breadcrumbs) } : {})
  };
};

/**
 * SiteNavigationElement for internal linking signals
 */
export const generateSiteNavigationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "name": "Main Navigation",
    "hasPart": [
      { "@type": "SiteNavigationElement", "name": "Health Insurance", "url": "https://www.radheinv.site/category/health" },
      { "@type": "SiteNavigationElement", "name": "Term Life Insurance", "url": "https://www.radheinv.site/category/life" },
      { "@type": "SiteNavigationElement", "name": "Motor Insurance", "url": "https://www.radheinv.site/category/motor" },
      { "@type": "SiteNavigationElement", "name": "Investment & Pension", "url": "https://www.radheinv.site/category/investment" },
      { "@type": "SiteNavigationElement", "name": "Insurance Calculators", "url": "https://www.radheinv.site/calculators" },
      { "@type": "SiteNavigationElement", "name": "Compare Plans", "url": "https://www.radheinv.site/compare" },
      { "@type": "SiteNavigationElement", "name": "Instant Quote", "url": "https://www.radheinv.site/quote-generator" }
    ]
  };
};
