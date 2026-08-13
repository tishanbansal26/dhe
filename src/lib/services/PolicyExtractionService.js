/**
 * Service for parsing insurance PDFs and extracting structured JSON data.
 */
export class PolicyExtractionService {
  /**
   * Extracts policy information from a document (Mocked).
   * @param {File} file - The uploaded document.
   * @returns {Promise<Object>} Mocked structured JSON response.
   */
  static async extractFromDocument(file) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      productName: 'Mock Tata AIA Health Plan',
      insurer: 'Tata AIA',
      category: 'Health',
      summary: 'Mock summary',
      description: 'Mock detailed description...',
      coverage: {
        roomRent: { value: 'Single Private Room', confidence: 95 },
        noClaimBonus: { value: '50% up to 100%', confidence: 80 }
      },
      eligibility: {
        minAge: { value: 18, confidence: 98 },
        maxAge: { value: 65, confidence: 90 }
      },
      premium_data: {
        startingPremium: { value: 750, confidence: 70 }
      },
      benefits: [
        { name: 'Ambulance', description: 'Up to ₹2000 per hospitalization', confidence: 95 }
      ],
      riders: [],
      waiting_periods: [
        { name: 'Pre-existing Diseases', duration: '36 Months', confidence: 85 }
      ],
      faqs: [],
      seo_metadata: {
        title: 'Tata AIA Health',
        description: 'Buy Tata AIA health online.'
      }
    };
  }

  /**
   * Simulates processing chunks of a document with progress updates.
   * @param {File} file - The document to process.
   * @param {Function} onProgressCallback - Callback function for progress updates (0-100).
   * @returns {Promise<Object>} Mocked structured JSON response.
   */
  static async processJob(file, onProgressCallback) {
    const totalSteps = 5;
    for (let i = 1; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (onProgressCallback) {
        onProgressCallback((i / totalSteps) * 100);
      }
    }
    
    return this.extractFromDocument(file);
  }
}
