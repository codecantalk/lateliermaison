const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.goto('https://maidbright.com', { waitUntil: 'networkidle2' });

  const fonts = await page.evaluate(() => {
    const h1 = document.querySelector('h1') ? window.getComputedStyle(document.querySelector('h1')) : null;
    const h2 = document.querySelector('h2') ? window.getComputedStyle(document.querySelector('h2')) : null;
    const p = document.querySelector('p') ? window.getComputedStyle(document.querySelector('p')) : null;
    
    return {
      h1: h1 ? { fontFamily: h1.fontFamily, fontSize: h1.fontSize, color: h1.color, fontWeight: h1.fontWeight } : null,
      h2: h2 ? { fontFamily: h2.fontFamily, fontSize: h2.fontSize, color: h2.color, fontWeight: h2.fontWeight } : null,
      p: p ? { fontFamily: p.fontFamily, fontSize: p.fontSize, color: p.color, fontWeight: p.fontWeight } : null,
    };
  });

  console.log(JSON.stringify(fonts, null, 2));
  await browser.close();
})();
