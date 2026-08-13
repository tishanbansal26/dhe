const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('C:/Users/tisha/Downloads/Niva_Bupa_(formerly_known_as_Max_Bupa)_15_07_2026.pdf');

pdf(dataBuffer).then(function(data) {
    console.log("Num pages:", data.numpages);
    console.log("Text length:", data.text.length);
    console.log("Text snippet:", data.text.substring(0, 500));
}).catch(console.error);
