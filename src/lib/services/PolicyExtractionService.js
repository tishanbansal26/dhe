import { GoogleGenerativeAI } from "@google/generative-ai";

export class PolicyExtractionService {
  static async extractFromDocument(file) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("VITE_GEMINI_API_KEY is missing in your .env file.");
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // We use gemini-1.5-pro for its massive context window and accuracy
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    // Convert file to base64
    const base64Data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(file);
    });

    const filePart = {
      inlineData: {
        data: base64Data,
        mimeType: file.type || 'application/pdf'
      }
    };

    const prompt = `You are an expert insurance data extractor.
Read the provided insurance policy document/brochure.
Extract the following information perfectly and return it ONLY as a JSON object matching this schema.
Include a "confidence" score (0-100) for every nested extracted field based on how clearly it was stated in the document.
If a field is not found, leave its value null or empty, but still include the field.

{
  "name": "String (Name of the insurance product)",
  "category": "String (Health, Life, Term, Motor, Investment)",
  "description": "String (A 2-3 sentence summary)",
  "coverage": {
    "roomRent": { "value": "String", "confidence": Number },
    "icuLimit": { "value": "String", "confidence": Number },
    "preHospitalization": { "value": "String", "confidence": Number },
    "postHospitalization": { "value": "String", "confidence": Number },
    "ambulance": { "value": "String", "confidence": Number },
    "noClaimBonus": { "value": "String", "confidence": Number }
  },
  "eligibility": {
    "minAgeAdult": { "value": "String", "confidence": Number },
    "maxAge": { "value": "String", "confidence": Number },
    "minAgeChild": { "value": "String", "confidence": Number }
  },
  "premium_data": {
    "startingPremium": { "value": "Number", "confidence": Number }
  },
  "benefits": [
    { "name": "String", "description": "String", "confidence": Number }
  ],
  "waiting_periods": [
    { "name": "String", "duration": "String", "confidence": Number }
  ],
  "exclusions": [
    { "name": "String" }
  ]
}`;

    const result = await model.generateContent([prompt, filePart]);
    const response = await result.response;
    const text = response.text();
    
    return JSON.parse(text);
  }

  static async processJob(file, onProgressCallback) {
    if (onProgressCallback) onProgressCallback(10);
    
    let progress = 10;
    const progressInterval = setInterval(() => {
      progress += (90 - progress) * 0.2; 
      if (onProgressCallback) onProgressCallback(Math.floor(progress));
    }, 1000);

    try {
      const result = await this.extractFromDocument(file);
      clearInterval(progressInterval);
      if (onProgressCallback) onProgressCallback(100);
      return result;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  }
}
