#!/bin/bash
set -e
cd "$(dirname "$0")"

rm -rf .parcel-cache dist bundle.html bundle.raw.html artifact.html dist/index.stripped.html
pnpm exec parcel build index.html --dist-dir dist --no-source-maps

python3 - <<'EOF'
import re

with open('dist/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

pattern = re.compile(r'<link[^>]*href=["\']?https://fonts\.(?:googleapis|gstatic)\.com[^>]*>')
externals = pattern.findall(html)
stripped = pattern.sub('', html)

with open('dist/index.stripped.html', 'w', encoding='utf-8') as f:
    f.write(stripped)
with open('/tmp/font_links.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(externals))
EOF

pnpm exec html-inline -i dist/index.stripped.html -b dist > bundle.raw.html

python3 - <<'EOF'
import re

with open('bundle.raw.html', 'r', encoding='utf-8') as f:
    html = f.read()
with open('/tmp/font_links.txt', 'r', encoding='utf-8') as f:
    fonts = f.read()

html = html.replace('<meta charset=UTF-8>', fonts + '\n<meta charset=UTF-8>', 1)

assert html.startswith('<!DOCTYPE html><html lang=en>')
html = html[len('<!DOCTYPE html><html lang=en>'):]
idx = html.find('<body>')
html = html[:idx] + html[idx + len('<body>'):]

title_m = re.search(r'<title>.*?</title>', html, re.DOTALL)
meta_charset_m = re.search(r'<meta charset=[^>]*>', html)
meta_viewport_m = re.search(r'<meta name=viewport[^>]*>', html)
font_links = re.findall(r'<link[^>]*fonts\.(?:googleapis|gstatic)\.com[^>]*>', html)

pieces = [m.group(0) for m in [title_m, meta_charset_m, meta_viewport_m] if m] + font_links
for p in pieces:
    html = html.replace(p, '', 1)
html = ''.join(pieces) + html

with open('artifact.html', 'w', encoding='utf-8') as f:
    f.write(html)

print(f"artifact.html written: {len(html)} chars")
EOF

du -h artifact.html
