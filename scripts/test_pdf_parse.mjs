import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfModule = require('pdf-parse');
import fs from 'fs';

console.log('PDFParse is:', typeof pdfModule.PDFParse);
try {
  const dataBuffer = fs.readFileSync('C:/Users/tisha/Downloads/Niva_Bupa_(formerly_known_as_Max_Bupa)_15_07_2026.pdf');
  const parser = new pdfModule.PDFParse(dataBuffer);
  console.log('Parser instance:', parser);
} catch (e) {
  console.error('Error:', e);
}
