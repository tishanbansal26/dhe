import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nzdqkfxjotdicmkfvfom.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56ZHFrZnhqb3RkaWNta2Z2Zm9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNDQzMjYsImV4cCI6MjEwMTgyMDMyNn0.kZ61mSMtyDJQ3MiexTkwFyKYbdIEUi_Eza5xgpJdS-g';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const rawData = `
21St Century Hospital
Doctor Lane Nanded No -2 Beside Sbi Bank (City - Nanded), Nanded,
Maharashtra, 431601

2S Wellness And Research Centre Pvt Ltd
100 Megh Nagar Near Ashok Udhyan Pal Road (City - Jodhpur),
Jodhpur, Rajasthan, 342008

3D Vision Eye Hospital-Jaipur
50 Jda Market Mansarovar Link Road Near Riddhi Siddhi Bridge
Gopalpura Bypass (City - Jaipur), Jaipur, Rajasthan, 302020

7 Orange Healthcare Organization Llp
74 Pawana Nagar Chinchwadpune (City - Pune), Pune, Maharashtra,
411033

7X Multi Speciality Hospital
4Th Floor 7X Corridor Opp Motilal Vin Baug Soneri Mahal Road
Panchbatti (City - Bharuch), Bharuch, Gujarat, 392001

A And G Hospital
Suchak Building Near Axis Bank Munje Chikangharopp Star Ct Scan
Center .Syndicate Kalyankalyan -Murbad Road Opp Karnik Road
(City - Thane), Thane, Maharashtra, 421301

A B Laser Eye Centre
A B Laser Eye Centre Shop No 1 8 Third Floor Plot No Cs 03 Gh 1
Sector 4 Greater Noida West City: Noida Dist: Gautam Buddha Nagar
State: Uttar Pradesh 201009 ( City - Gautam Buddha Nagar ),
Gautam Buddha Nagar, Uttar Pradesh, 201009

A Four Hospital
No. 87 Arcot Road Virugambakkam -- (City - Chennai), Chennai,
Tamil Nadu, 600092

A K Hospital (Prop.Anil Kumar Khiwani)
Block-7 Sanjya Complex Near Mata Mandir (City - Bhopal), Bhopal,
Madhya Pradesh, 462003

A M Medical Centre Private Limited-Kolkata
97A Southern Avenue (City - Kolkata), Kolkata, West Bengal, 700029

A R Hospital - Belgaum
22 New Kantha Raj Urs Road Sharadadevi Nagara (City - Belgaum),
Belgaum, Karnataka, 570022

A R Hospital Orthopaedic And Icu Llp
1/2 Flr New Era Talkies Compound Opp Alka Vihar Hotel Malad West
(City - Navi Mumbai), Navi Mumbai, Maharashtra, 400064

A R Medical Centre - Thrissur
Craft Campus Chandapura Kesavathuparambil Kodungallur Edapally
(City - Thrissur), Thrissur, Kerala, 680664

A S Imaging Centre Private Limited
27-E Pattunoolkara Street 28H Indhiragandhi Street (City - Ariyalur),
Ariyalur, Tamil Nadu, 621704

A To Z Mutlispeciality Hospital Llp
Nr Sachin Post Officestation Road Sachin (City - Surat), Surat,
Gujarat, 394230

A V Eye Hospital & Diagnostics Pvt Ltd
711 Modi Hospital Road Woc Road 2Nd Stage Mahalakshmipuram
(City - Bengaluru), Bengaluru, Karnataka, 560086

A-Care Orthopaedic And General Hospital
G-1 G-2 Giriraj Tower Sai Baba Nagar Mira Bhayander Road Mira
Road (East) (City - Thane), Thane, Maharashtra, 401107

A. B. Eye Institute
Rajendra Nagar Road 12 Near Bahadurpur Gumti (City - Patna),
Patna, Bihar, 800016

A. K. Eye Hospital Pvt. Ltd.
1136 Sanjay Nagar Stadium Road (City - Bareilly), Bareilly, Uttar
Pradesh, 243001

A.B. Memorial Eye Foundation - Burdwan
Amlapukur Road Baidyapur More Kalna Purba Burdwan (City -
Bardhaman), Bardhaman, West Bengal, 713409

A.B.R Neuro And Multispeciality Hospital
No: 2-3-212/73/Nr Uppal Land Mark: Pillar No: 28 Dist-Medchal Uppal
(City - Hyderabad), Hyderabad, Telangana, 500092

A.C.S. Medical College And Hospital
Poonamallee High Road Velappanchavadi (City - Chennai), Chennai,
Tamil Nadu, 600077

A.G.Nursing Home
A T Roadtarajan (City - Jorhat), Jorhat, Assam, 785001

A.J. Hospital & Research Centre
Nh 17 Kuntikana (City - Dakshina Kannada), Dakshina Kannada,
Karnataka, 575004

A.N Neuro Critical Care Centre And Cmc Hospital
53 Indra Park Near Cheema Chowk Opp Thakur Cold Store Wadala
Road (City - Jalandhar), Jalandhar, Punjab, 144001

A.N.S. Hospital
12F And 13F Shramik Colony A B Road Rau (City - Indore), Indore,
Madhya Pradesh, 453331

A.P. Varkey Mission Hospital - Ernakulam
Thottappady Arakkunnam Kochi (City - Ernakulam), Ernakulam,
Kerala, 682313

A.R Hospital (P) Ltd
No: 33 P&T Nagarvalluvar Colonynear Balamandram School (City -
Madurai), Madurai, Tamil Nadu, 625014

A.V. Multispeciality Hospital
No 781 782 100 Feet Ring Road Hosakerehalliopp. Little Flower
Public School B.S.K. 3Rd Stage (City - Bengaluru), Bengaluru,
Karnataka, 560085

A.V.Hospitals
97 & 172 Soliappan Street Old Washermanpet (City - Chennai),
Chennai, Tamil Nadu, 600021

A.V.M. Hospital ( A Unit Of Avmm Assocites (P) Ltd)
135 Palayamkottai Roadthoothukudi-- (City - Tuticorin), Tuticorin,
Tamil Nadu, 628003

A1 Superspeciality Healthcare - Mumbai
Keshava Building Jaya Nagar Near Anand Nagar Metro Station
Dahisar East (City - Navi Mumbai), Navi Mumbai, Maharashtra,
400068

Aaddhyas Wellness Pvt Ltd - Bihar
P No-199 Sudha Booth Rps Manglam Baily Road (City - Patna),
Patna, Bihar, 801503

Aadhaar Hospital Multispeciality Unit
Plot No 32 Radha Krishna Colony Near Karond Chouraha Karond
Bypass Road (City - Bhopal), Bhopal, Madhya Pradesh, 462038

Aadhar Health Institute (A Unit Of Vlcom Healthcare P.
Ltd.)
Tosham Roadnear South Bye Pass Crossinghisar (City - Hisar), Hisar,
Haryana, 125005

Aadhar Hospital - Mumbai
Swarmala Chs Rsc-02 Plot 40 Mahada Malwani 8 Malad West (City -
Navi Mumbai), Navi Mumbai, Maharashtra, 400095

Aadhar Hospital Pvt Ltd
Wadiya Componudshivji Nagar Nanded-- (City - Nanded), Nanded,
Maharashtra, 431602

Aadhar Multispeciality Hospital & Icu Raigarh Mh
7A 1St Floor Gurusharanam Complex Vishrali Naka Market Yard
Road Old Panvel (City - Raigarh(Mh)), Raigarh(Mh), Maharashtra,
410206

Aadhithya Adhikari Hospital
Counter Road Gokulam (City - Mysore), Mysore, Karnataka, 570002

Aadhya Childrens Hospital
H No: 6-6-326 First Floor Apex Hospital Building Beside Raja
Theatresainagarkarimnagartelangana (City - Karim Nagar), Karim
Nagar, Telangana, 505001

Aadhya Childrens Hosptial - Nizamabad
H No 1-18-65/5/B Vidyanagar Colony Armoor Nizamabad District (City
- Nizamabad), Nizamabad, Telangana, 503224

Aadhya Childrens Hosptial - Nizamabad
H No 1-18-65/5/B Vidyanagar Colony Armoor Nizamabad District (City
- Nizamabad), Nizamabad, Andhra Pradesh, 503224

Aadhya Health Care (Greenlands Multispeciality Hospital)
H No 8-2-27/1 Ansari Colony (City - Nalgonda), Nalgonda, Telangana,
508001

Aadhya Hospital Tumkur
Siddashree Bhavana 2Nd Floor B H Road (City - Tumkur), Tumkur,
Karnataka, 572102

Aadhya Multispeciality Hospital Gondia
Rajabhoj Colony Opp Dwarika Lawn Ring Road Gondia (City -
Gondia), Gondia, Maharashtra, 441614

Aadira Kidney Care - Namakkal
D No 90/134 A1 Trichengodu Road Near To Namakkal Municipality
Office Tiruchengode Road (City - Namakkal), Namakkal, Tamil Nadu,
637001

Aadit Hospital Prop. Tejash Jayantkumar Shah
Custom Road Chalavapi-- (City - Valsad), Valsad, Gujarat, 396191

Aaditya Eye & Children Hospital (A Unit Of Aaditya
Healthcare)
4Th Foor Akshar Plaza Near Govardhan Nathaji Haveli Opp Ghelani
Petrol Pump Nizampura (City - Vadodara), Vadodara, Gujarat, 390024

Aadya Hospital Speciality Surgical Centre-Bangalore
Scout Camp Road Near Railway Station Doddaballapura (City -
Bangalore Rural), Bangalore Rural, Karnataka, 561203

Aai Hospital - Beed
Behind Mantri Road Jalna Road (City - Beed), Beed, Maharashtra,
431122

Aakar Hospital - Rajkot
Ramkrishna Nagar Main Road Near Pnb Bank Virani Chowk Rama
Krishan Nagar360002 (City - Rajkot), Rajkot, Gujarat, 360002

Aakash Eye Clinic And Laser Center - Pune
1St Floor City Space Near Four Point Hotel Building Viman Nagar---
(City - Pune), Pune, Maharashtra, 411014

Aakash Healthcare Multi Speciality Hospital - Agra
672 Mathura Bypass Road Nh-2 Sikandra (City - Agra), Agra, Uttar
Pradesh, 282007

Aakash Hospital
90/43 Malviya Nagarnew Delhi (City - South Delhi), South Delhi,
Delhi, 110017

Aakash Hospital - Chennai
No: 3 P.S. Sivasamy Salai Mylapore (City - Chennai), Chennai, Tamil
Nadu, 600004
`;

async function seed() {
    const blocks = rawData.trim().split('\n\n');
    const hospitals = [];
    
    for (const block of blocks) {
        if (!block.trim()) continue;
        const lines = block.split('\n');
        if (lines.length >= 2) {
            const name = lines[0].trim();
            const address = lines.slice(1).join(' ').trim();
            
            let location = 'Unknown';
            const cityMatch = address.match(/\\(City - ([^)]+)\\)/i);
            if (cityMatch && cityMatch[1]) {
                location = cityMatch[1].trim();
            }
            
            let type = 'Multi-Speciality';
            const lowerName = name.toLowerCase();
            if (lowerName.includes('eye')) type = 'Eye Care';
            if (lowerName.includes('dental')) type = 'Dental';
            if (lowerName.includes('maternity')) type = 'Maternity';
            if (lowerName.includes('heart') || lowerName.includes('cardiac')) type = 'Cardiology';
            
            hospitals.push({
                name,
                address,
                location,
                type,
                rating: (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1),
                phone: '+91 ' + Math.floor(1000000000 + Math.random() * 9000000000).toString()
            });
        }
    }
    
    console.log("Parsed hospitals:", hospitals.length);
    
    const chunkSize = 20;
    let inserted = 0;
    for (let i = 0; i < hospitals.length; i += chunkSize) {
        const chunk = hospitals.slice(i, i + chunkSize);
        const { error } = await supabase.from('hospitals').insert(chunk);
        if (error) {
            console.error("Error:", error);
        } else {
            inserted += chunk.length;
            console.log("Inserted " + inserted + "/" + hospitals.length + " hospitals.");
        }
    }
}

seed().catch(console.error);
