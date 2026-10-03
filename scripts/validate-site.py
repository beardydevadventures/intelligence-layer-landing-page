"""Check generated sales pages, links and SEO without contacting external services."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1] / 'dist'
DOMAIN = 'https://intelligencelayer.com.au'

class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.h1 = 0
        self.ids = []
        self.links = []
        self.assets = []
        self.metas = {}
        self.canonical = ''
        self.title = ''
        self.capture = ''
        self.json_buffer = ''
        self.schemas = []
        self.errors = []
        self.main_count = 0
        self.lang = ''
        self.label_depth = 0
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.lang = a.get('lang', '')
        if tag == 'main': self.main_count += 1
        if tag == 'label': self.label_depth += 1
        if tag in ['input', 'select', 'textarea'] and a.get('type') not in ['hidden','submit','button']:
            if not self.label_depth and not a.get('aria-label') and not a.get('aria-labelledby'): self.errors.append('Form control missing accessible label')
        if a.get('tabindex', '').isdigit() and int(a['tabindex']) > 0: self.errors.append('Positive tabindex disrupts focus order')
        if tag == 'iframe' and not a.get('title'): self.errors.append('Frame missing accessible title')
        if tag == 'h1': self.h1 += 1
        if 'id' in a: self.ids.append(a['id'])
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag in ['img', 'script'] and a.get('src'): self.assets.append(a['src'])
        if tag == 'img' and 'alt' not in a: self.errors.append('Image missing alt')
        if tag == 'meta': self.metas[a.get('name', a.get('property'))] = a.get('content', '')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical = a.get('href', '')
        if tag == 'title': self.capture = 'title'
        if tag == 'script' and a.get('type') == 'application/ld+json': self.capture = 'json'; self.json_buffer = ''

    def handle_data(self, data):
        if self.capture == 'title': self.title += data
        if self.capture == 'json': self.json_buffer += data

    def handle_endtag(self, tag):
        if tag == 'label': self.label_depth -= 1
        if tag == 'script' and self.capture == 'json': self.schemas.append(json.loads(self.json_buffer)); self.capture = ''
        if tag == 'title': self.capture = ''

pages = {}
for file in ROOT.rglob('*.html'):
    rel = file.relative_to(ROOT).as_posix()
    # Standalone WebGL demonstrators have separate interaction/browser verification.
    if rel.startswith('demos/'): continue
    route = '/' + rel.removesuffix('index.html') if rel.endswith('index.html') else '/' + rel
    pages[route] = Page(file.read_text(encoding='utf-8'))
assert pages, 'No generated pages; run npm run build first.'
errors = []
titles = set()
for route, page in pages.items():
    def check(condition, message):
        if not condition: errors.append(f'{route}: {message}')
    check(page.h1 == 1, f'Expected one H1, found {page.h1}')
    check(page.main_count == 1, 'Expected one main landmark')
    check(bool(page.lang), 'Missing document language')
    check(page.title and page.title not in titles, 'Missing or duplicated title')
    titles.add(page.title)
    check(bool(page.metas.get('description')), 'Missing description')
    check(page.canonical.startswith(DOMAIN) or page.canonical.startswith('https://'), 'Invalid canonical')
    check(len(page.ids) == len(set(page.ids)), 'Duplicate IDs')
    check('main' in page.ids, 'Missing skip-link destination')
    for meta in ['og:title','og:description','og:url','og:image','og:image:alt','twitter:card']:
        check(bool(page.metas.get(meta)), f'Missing {meta}')
    check(any(item.get('@type') == 'Organization' for schema in page.schemas for item in schema.get('@graph', [])), 'Missing Organization schema')
    for error in page.errors: check(False, error)
    for link in page.links + page.assets:
        url = urlsplit(link)
        if url.scheme and not link.startswith(DOMAIN): continue
        target = unquote(url.path) or route
        if target in pages:
            if url.fragment: check(unquote(url.fragment) in pages[target].ids, f'Broken anchor: {link}')
        else:
            check((ROOT / target.lstrip('/')).is_file() or (target.startswith('/demos/') and (ROOT / target.lstrip('/') / 'index.html').is_file()), f'Broken local link/asset: {link}')
    if route.startswith(('/ai/', '/xr/')):
        check(any(item.get('@type') == 'Service' for schema in page.schemas for item in schema.get('@graph', [])), 'Missing Service schema')

required = ['/', '/services/', '/industries/', '/about/', '/start-a-project/', '/ai/ai-automation/', '/ai/enterprise-ai-agents/', '/xr/immersive-experiences/', '/xr/digital-twins/', '/xr/vr-development/']
for route in required:
    if route not in pages: errors.append(f'Missing commercial route: {route}')
sitemap = ET.parse(ROOT / 'sitemap.xml')
urls = [e.text for e in sitemap.iter('{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
for route, page in pages.items():
    expected = page.metas.get('robots') != 'noindex' and page.canonical == DOMAIN + route
    if expected != (DOMAIN + route in urls): errors.append(f'{route}: Sitemap/indexing mismatch')
assert 'Sitemap: ' + DOMAIN + '/sitemap.xml' in (ROOT / 'robots.txt').read_text()
if errors:
    raise SystemExit('\n'.join(errors))
print(f'Validated {len(pages)} HTML pages: headings/landmarks, form labels, metadata, JSON-LD, local links/assets, anchors and sitemap indexing.')
