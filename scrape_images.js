const fs = require('fs');
const https = require('https');
const path = require('path');

const urls = [
  'https://images.squarespace-cdn.com/content/v1/58289c699f7456b3bc2f13a2/ab5a4df0-3168-450f-90e6-b9a30147983c/21.JPG?format=2500w',
  'https://images.squarespace-cdn.com/content/v1/58289c699f7456b3bc2f13a2/a5dcde39-81fc-444f-801e-ce90d29d8916/8.JPG?format=2500w',
  'https://images.squarespace-cdn.com/content/v1/58289c699f7456b3bc2f13a2/7996f7e4-232a-4318-8be0-5a39cdad5e6e/15.jpg?format=2500w',
  'https://images.squarespace-cdn.com/content/v1/58289c699f7456b3bc2f13a2/d0e515da-dd0e-4361-9f93-68f7004f128c/20.JPG?format=2500w',
  'https://images.squarespace-cdn.com/content/v1/58289c699f7456b3bc2f13a2/21262d16-c7fb-419b-abfc-fec5db0bf65b/23.JPG?format=2500w'
];

const outDir = path.join(__dirname, 'public/latelier-images/home');

urls.forEach((url) => {
  const fileName = new URL(url).pathname.split('/').pop();
  const filePath = path.join(outDir, fileName);
  
  https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    if (res.statusCode === 200) {
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${fileName}`);
      });
    } else {
      console.log(`Failed ${fileName}: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error ${fileName}: ${err.message}`);
  });
});
