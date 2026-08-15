import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ 
  title, 
  description, 
  canonicalUrl, 
  type = 'website',
  imageUrl = 'https://www.radheinv.site/og-image.jpg',
  imageWidth = '1200',
  imageHeight = '630',
  keywords,
  noindex = false,
  article = null,
  jsonLd = null,
  children
}) {
  const siteName = 'Radhe Investments';
  const defaultKeywords = 'Insurance Mansa, Health Insurance Punjab, Term Life Insurance Mansa, Radhe Investments, Financial Planner Mansa, IRDAI Insurance Advisor, Best Insurance Agent Punjab, Life Insurance Mansa, Motor Insurance Punjab, Pension Plans India';
  const fullTitle = title?.includes(siteName) ? title : `${title} | ${siteName}`;
  const effectiveKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* Basic HTML Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={effectiveKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Geo targeting for Punjab, India */}
      <meta name="geo.region" content="IN-PB" />
      <meta name="geo.placename" content="Mansa, Punjab" />
      <meta name="geo.position" content="29.9880;75.3940" />
      <meta name="ICBM" content="29.9880, 75.3940" />

      {/* Language / Content */}
      <meta httpEquiv="content-language" content="en-IN" />
      <meta name="author" content="Radhe Investments" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Article-specific OG tags */}
      {article && <meta property="article:published_time" content={article.publishedTime} />}
      {article && <meta property="article:modified_time" content={article.modifiedTime || article.publishedTime} />}
      {article?.section && <meta property="article:section" content={article.section} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@radheinvest" />

      {/* Standalone JSON-LD passed as prop */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}

      {children}
    </Helmet>
  );
}
