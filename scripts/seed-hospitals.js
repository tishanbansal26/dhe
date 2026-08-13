import { GoogleGenAI } from '@google/genai';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function extractHospitals() {
  console.log("Uploading PDF to Gemini...");
  
  const fileResult = await ai.files.upload({
    file: 'C:/Users/tisha/Downloads/Niva_Bupa_(formerly_known_as_Max_Bupa)_15_07_2026.pdf',
    mimeType: 'application/pdf',
    displayName: 'Hospital List PDF',
  });
  
  console.log("Uploaded file: ", fileResult.name);
  console.log("Waiting 10 seconds for file processing...");
  await new Promise(r => setTimeout(r, 10000));
  
  const prompt = `
  You are an expert data extractor. Extract the list of hospitals from this document.
  Ignore the first few lines of disclaimer.
  Each entry has a hospital name followed by an address on the next lines.
  Extract them into a JSON array of objects.
  Each object MUST have the following keys:
  - name: String (The hospital name)
  - address: String (The full address)
  - location: String (Extract just the city name from the address, usually found in "City - X" or similar)
  - type: String (Infer from name: e.g., if it has 'Eye' then 'Eye Care', if 'Maternity' then 'Maternity', else 'Multi-Speciality')
  
  Extract the first 100 hospitals to ensure it completes successfully within token limits. Focus on accuracy.
  Return ONLY the raw JSON array, without any markdown formatting like \`\`\`json.
  `;

  console.log("Waiting for Gemini to process...");
  const response = await ai.models.generateContent({
    model: 'gemini-1.5-pro',
    contents: [
      {
        fileData: {
          fileUri: fileResult.uri,
          mimeType: fileResult.mimeType
        }
      },
      { text: prompt }
    ],
    config: {
        responseMimeType: "application/json"
    }
  });

  const rawJson = response.text;
  console.log("Received response length:", rawJson.length);
  
  let hospitals = [];
  try {
      hospitals = JSON.parse(rawJson);
  } catch (e) {
      console.log("Error parsing JSON:", e);
      fs.writeFileSync('raw_hospitals.txt', rawJson);
      return;
  }
  
  console.log(`Parsed ${hospitals.length} hospitals. Ready to insert...`);
  fs.writeFileSync('hospitals.json', JSON.stringify(hospitals, null, 2));

  // Insert into Supabase
  console.log("Inserting into Supabase...");
  
  const chunkSize = 100;
  let inserted = 0;
  
  for (let i = 0; i < hospitals.length; i += chunkSize) {
      const chunk = hospitals.slice(i, i + chunkSize).map(h => ({
          ...h,
          rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
          phone: "N/A"
      }));
      
      const { error } = await supabase.from('hospitals').insert(chunk);
      if (error) {
          console.error("Error inserting chunk:", error);
      } else {
          inserted += chunk.length;
          console.log(`Inserted ${inserted}/${hospitals.length}...`);
      }
  }
  
  console.log("Finished seeding hospitals.");
}

extractHospitals().catch(console.error);
