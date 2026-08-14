export const PRODUCT_EXTRACTION_SCHEMA = `
{
  "name": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
  "category": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
  "description": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
  "image_keywords": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
  "coverage": {
    "roomRent": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
    "icuLimit": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
    "preHospitalization": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
    "postHospitalization": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
    "ambulance": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
    "noClaimBonus": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" }
  },
  "eligibility": {
    "minAgeAdult": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
    "maxAge": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" },
    "minAgeChild": { "value": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" }
  },
  "premium_data": {
    "startingPremium": { "value": "Number", "confidence": Number, "source_page": Number, "source_snippet": "String" }
  },
  "benefits": [
    { "name": "String", "description": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" }
  ],
  "waiting_periods": [
    { "name": "String", "duration": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" }
  ],
  "exclusions": [
    { "name": "String", "source_page": Number, "source_snippet": "String" }
  ],
  "highlights": [
    { "name": "String", "source_page": Number, "source_snippet": "String" }
  ],
  "faqs": [
    { "question": "String", "answer": "String", "confidence": Number, "source_page": Number, "source_snippet": "String" }
  ],
  "premium_tables": [
    { "columns": ["String"], "rows": [{}], "confidence": Number, "source_page": Number, "source_snippet": "String" }
  ]
}
`;

export const getExtractionPrompt = (sourceType: 'WEB' | 'DOCUMENT', contextInfo: string) => {
  const base = `You are a world-class insurance data extractor and underwriter.
Your goal is to extract structured product information from the provided ${sourceType === 'WEB' ? 'internet search data' : 'insurance document (PDF/Image)'}.

Context regarding this extraction task:
${contextInfo}

Extract the information perfectly and return it ONLY as a JSON object matching this schema.
CRITICAL RULES:
1. Include a "confidence" score (0-100). 100 means you are absolutely certain based on official text.
2. If this is a document, include the "source_page" number.
3. Include a "source_snippet" (a direct 10-15 word quote from the text that proves your extraction).
4. If a field is not found, leave its value null or empty, but DO NOT OMIT THE FIELD from the JSON.
5. NEVER fabricate premiums or limits. If you cannot find an exact number, return null.
6. For "premium_tables", if you detect a grid of ages, sum insureds, and premiums, extract it as an array of objects.

JSON SCHEMA:
${PRODUCT_EXTRACTION_SCHEMA}
`;

  return base;
};
