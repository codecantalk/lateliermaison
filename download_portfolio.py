import urllib.request
import os
import ssl

os.makedirs('public/latelier-images/portfolio', exist_ok=True)
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

with open('portfolio_urls.txt', 'r') as f:
    urls = [line.strip() for line in f if line.strip()]

for i, url in enumerate(urls):
    # Extract filename from URL (e.g. IMG_8186.JPG)
    filename = url.split('/')[-1].split('?')[0]
    filepath = os.path.join('public/latelier-images/portfolio', filename)
    
    print(f"Downloading {filename}...")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
    try:
        with urllib.request.urlopen(req, context=ctx) as response, open(filepath, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Saved {filepath} ({len(data)} bytes)")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
