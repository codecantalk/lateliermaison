import re
import urllib.request
import os

with open('/Users/arko/.gemini/antigravity-ide/brain/0d42ab41-0afc-407c-815a-8df07531cc6a/.system_generated/steps/2297/content.md', 'r') as f:
    html = f.read()

# Find all squarespace image urls
urls = re.findall(r'https?://images\.squarespace-cdn\.com/content/v1/[a-zA-Z0-9/_-]+\.(?:jpg|png|jpeg|webp)', html)

# Download unique images
unique_urls = list(set(urls))
print(f"Found {len(unique_urls)} images.")
os.makedirs('public/latelier-images', exist_ok=True)

for i, url in enumerate(unique_urls):
    try:
        urllib.request.urlretrieve(url, f"public/latelier-images/img_{i}.jpg")
        print(f"Downloaded {url}")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
