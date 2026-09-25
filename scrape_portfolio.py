import urllib.request
import re
import json

url = "https://www.lateliermaison.com/portfolioo"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        
    # Extract images.squarespace-cdn.com URLs
    # Squarespace often stores high-res images in data-image or data-src attributes, or in JSON chunks
    urls = set(re.findall(r'https://images\.squarespace-cdn\.com/content/v1/[a-zA-Z0-9_-]+/[a-zA-Z0-9_-]+/[^"\'\s?]+', html))
    
    print(f"Found {len(urls)} image URLs.")
    for i, img_url in enumerate(list(urls)[:20]):
        print(img_url)
        
    # Let's save them to a file for the agent to read
    with open('portfolio_urls.txt', 'w') as f:
        for u in urls:
            f.write(u + '?format=2500w\n')
            
except Exception as e:
    print("Error:", e)
