import fs from 'fs';

const text = fs.readFileSync('all_hospitals_raw.txt', 'utf8');

// The file has a header at the beginning:
// List of hospitals
// Last updated on ...
// Disclaimer: ...

// Let's clean the header
const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);

const hospitals = [];
let currentHospitalName = null;
let currentAddressLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  if (line.includes('List of hospitals') || 
      line.includes('Last updated on') || 
      line.includes('Supplier Name') || 
      line.includes('Niva Bupa Health Insurance') || 
      line.includes('Health Insurance)') ||
      line.includes('Disclaimer: Network lists are subject')) {
    continue;
  }

  // Check if line ends with a 6 digit pincode like ", 160022" or "160022"
  const pinMatch = line.match(/\b\d{6}\b$/);

  if (!currentHospitalName) {
    currentHospitalName = line;
  } else {
    currentAddressLines.push(line);
    if (pinMatch || line.match(/,\s*\d{6}$/)) {
      // Completed an address block
      const fullAddress = currentAddressLines.join(' ');
      
      // Extract City
      let city = 'Unknown';
      const cityMatch = fullAddress.match(/\(City\s*-\s*([^)]+)\)/i);
      if (cityMatch && cityMatch[1]) {
        city = cityMatch[1].trim();
      }

      // Infer Type
      let type = 'Multi-Speciality';
      const lowerName = currentHospitalName.toLowerCase();
      if (lowerName.includes('eye') || lowerName.includes('netra') || lowerName.includes('retina') || lowerName.includes('vision') || lowerName.includes('drishti')) {
        type = 'Eye Care';
      } else if (lowerName.includes('heart') || lowerName.includes('cardiac') || lowerName.includes('cardio')) {
        type = 'Cardiology';
      } else if (lowerName.includes('maternity') || lowerName.includes('child') || lowerName.includes('women') || lowerName.includes('pediatric') || lowerName.includes('baby') || lowerName.includes('fertility') || lowerName.includes('ivf')) {
        type = 'Maternity & Childcare';
      } else if (lowerName.includes('ortho') || lowerName.includes('bone') || lowerName.includes('joint')) {
        type = 'Orthopaedics';
      } else if (lowerName.includes('cancer') || lowerName.includes('onco')) {
        type = 'Oncology';
      } else if (lowerName.includes('dental')) {
        type = 'Dental';
      } else if (lowerName.includes('neuro')) {
        type = 'Neurology';
      } else if (lowerName.includes('kidney') || lowerName.includes('dialysis') || lowerName.includes('nephro') || lowerName.includes('uro')) {
        type = 'Nephrology & Urology';
      }

      hospitals.push({
        name: currentHospitalName,
        address: fullAddress,
        location: city,
        type: type,
        rating: (4.0 + Math.random() * 0.9).toFixed(1),
        phone: '+91 1800 200 4545'
      });

      currentHospitalName = null;
      currentAddressLines = [];
    }
  }
}

console.log('Total parsed hospitals:', hospitals.length);
console.log('Sample parsed:', hospitals.slice(0, 5));

// Check Chandigarh hospitals
const chd = hospitals.filter(h => h.location.toLowerCase().includes('chandigarh') || h.address.toLowerCase().includes('chandigarh'));
console.log('Chandigarh hospitals found:', chd.length);
console.log('Chandigarh sample:', chd.slice(0, 3));

fs.writeFileSync('parsed_all_hospitals.json', JSON.stringify(hospitals, null, 2));
