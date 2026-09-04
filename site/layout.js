/* ==========================================================================
   Zaglavlje, navigacija, sticky dugmad i podnozje.
   Jedno mesto za sve stranice.
   ========================================================================== */

const SITE = 'https://www.mdesigneivanjica.com';

/* ==========================================================================
   MERENJE I POTVRDA VLASNISTVA
   Popuni kad stignu pristupi, pa pokreni node build.js. Prazno znaci da se
   nista ne ubacuje u stranu, bez ijednog dodatnog zahteva ka mrezi.
   GA4_ID          - "G-XXXXXXXXXX" iz Google Analytics 4
   GSC_VERIFY      - sadrzaj meta oznake iz Search Console, HTML tag metoda
   META_PIXEL_ID   - broj piksela iz Meta Business Manager-a
   ========================================================================== */
const GA4_ID = '';
const GSC_VERIFY = '';
const META_PIXEL_ID = '';

const merenje = () => {
  let out = '';
  if (GSC_VERIFY) out += `<meta name="google-site-verification" content="${GSC_VERIFY}">
`;
  if (GA4_ID) out += `<link rel="preconnect" href="https://www.googletagmanager.com">
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA4_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA4_ID}');</script>
`;
  if (META_PIXEL_ID) out += `<script>!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');</script>
`;
  return out;
};

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const up = (d) => d === 0 ? '' : '../'.repeat(d);

function meta(text, max = 155) {
  const t = String(text).replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,.;:]$/, '') + '.';
}

const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

/* Ikona sa referentnog sajta: mreza od 6 tackica, 3 x 2.
   Original: krugovi 2x2 na translate(4|11|18, 8|14), stroke-width 2. */
const DOTS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
  + '<circle cx="5" cy="9" r="1"/><circle cx="12" cy="9" r="1"/><circle cx="19" cy="9" r="1"/>'
  + '<circle cx="5" cy="15" r="1"/><circle cx="12" cy="15" r="1"/><circle cx="19" cy="15" r="1"/>'
  + '</svg>';

const NAV = [
  ['index.html',    'Početna'],
  ['modeli.html',   'Modeli'],
  ['galerija.html', 'Galerija'],
  ['blog.html',     'Blog'],
  ['o-nama.html',   'O nama'],
  ['kontakt.html',  'Kontakt']
];

module.exports = function (K) {

  /* Sitewide JSON-LD: jedan LocalBusiness cvor na koji sve ostale seme mogu da
     pokazuju preko @id. Google trazi NAP (naziv, adresa, telefon) na svakoj strani. */
  const ORG_ID = SITE + '/#firma';
  const orgLd = () => ({
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'GeneralContractor', 'HomeAndConstructionBusiness'],
    '@id': ORG_ID,
    name: 'M Designe Ivanjica',
    alternateName: ['M Designe', 'MDesigne Ivanjica'],
    description: 'Projektovanje, proizvodnja i montaža A-frame kuća, montažnih kuća, bungalova, letnjikovaca, pergola i dečjih igrališta. Ivanjica, isporuka na celoj teritoriji Srbije.',
    url: SITE + '/',
    telephone: K.telefonRaw,
    email: K.email,
    image: SITE + '/images/brend/hero.jpg',
    logo: SITE + '/images/brend/logo.png',
    priceRange: '€€',
    currenciesAccepted: 'EUR, RSD',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ivanjica',
      addressRegion: 'Moravički okrug',
      postalCode: '32250',
      addressCountry: 'RS'
    },
    geo: { '@type': 'GeoCoordinates', latitude: 43.5781, longitude: 20.2297 },
    areaServed: [
      { '@type': 'Country', name: 'Srbija' },
      { '@type': 'City', name: 'Ivanjica' },
      { '@type': 'City', name: 'Beograd' },
      { '@type': 'City', name: 'Novi Sad' },
      { '@type': 'Place', name: 'Zlatibor' },
      { '@type': 'Place', name: 'Kopaonik' },
      { '@type': 'Place', name: 'Tara' },
      { '@type': 'Place', name: 'Divčibare' },
      { '@type': 'Place', name: 'Golija' }
    ],
    knowsLanguage: ['sr', 'en'],
    openingHoursSpecification: [{
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '08:00', closes: '18:00'
    }],
    sameAs: [K.instagram, K.tiktok, K.facebook].filter(Boolean),
    makesOffer: [
      'A-frame kuće', 'Montažne kuće', 'Bungalovi',
      'Letnjikovci i pergole', 'Dečja igrališta', 'Resort i investicioni objekti'
    ].map(n => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: n, serviceType: n, areaServed: 'Srbija' } }))
  });

  /* BreadcrumbList: Google ga koristi za putanju u rezultatu umesto gole adrese. */
  function crumbsLd(items) {
    return {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: items.map((it, i) => ({
        '@type': 'ListItem', position: i + 1, name: it[0],
        item: SITE + '/' + String(it[1] || '').replace(/^\//, '')
      }))
    };
  }

  function faqLd(pitanja) {
    return {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: pitanja.map(f => ({
        '@type': 'Question', name: f.p,
        acceptedAnswer: { '@type': 'Answer', text: f.o }
      }))
    };
  }

  const jsonld = (obj) => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>
`;

  function head({ title, desc, canonical, depth = 0, ogImage = 'images/brend/logo.png', extraHead = '', preload = '', ogType = 'website', noOrg = false, robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }) {
    const b = up(depth);
    return `<!doctype html>
<html lang="sr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="robots" content="${robots}">
<link rel="canonical" href="${SITE}/${canonical}">
<meta property="og:type" content="${ogType}">
<meta property="og:locale" content="sr_RS">
<meta property="og:site_name" content="M Designe Ivanjica">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}/${canonical}">
<meta property="og:image" content="${SITE}/${ogImage}">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${SITE}/${ogImage}">
<meta name="geo.region" content="RS">
<meta name="geo.placename" content="Ivanjica">
<meta name="theme-color" content="#faf6ed">
<link rel="icon" href="${b}images/brend/logo.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders:opsz,wght@10..72,400;10..72,500;10..72,600;10..72,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Fragment+Mono&family=Space+Grotesk:wght@700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${b}css/styles.css">
<link rel="stylesheet" href="${b}css/sections.css">
<link rel="stylesheet" href="${b}css/about.css">
<link rel="stylesheet" href="${b}css/faq.css">
<link rel="stylesheet" href="${b}css/matrix.css">
<link rel="stylesheet" href="${b}css/wizard.css">
<link rel="stylesheet" href="${b}css/footer.css">
<link rel="stylesheet" href="${b}css/loader.css">
${preload ? `<link rel="preload" as="image" href="${b}${preload}" fetchpriority="high">
` : ''}${noOrg ? '' : jsonld(orgLd())}${merenje()}${extraHead}</head>
<body>
<a class="skip-link" href="#glavni">Preskoči na sadržaj</a>
<div class="pcover" aria-hidden="true">
  <div class="pcover__load">
    <div class="boxes">
      <div class="box box-1"><div class="face face-front"></div><div class="face face-right"></div><div class="face face-top"></div><div class="face face-back"></div></div>
      <div class="box box-2"><div class="face face-front"></div><div class="face face-right"></div><div class="face face-top"></div><div class="face face-back"></div></div>
      <div class="box box-3"><div class="face face-front"></div><div class="face face-right"></div><div class="face face-top"></div><div class="face face-back"></div></div>
      <div class="box box-4"><div class="face face-front"></div><div class="face face-right"></div><div class="face face-top"></div><div class="face face-back"></div></div>
    </div>
  </div>
</div>
<div class="grain" aria-hidden="true"></div>
${header(depth)}
<main id="glavni">`;
  }

  function header(depth) {
    const b = up(depth);
    return `<header class="site-header">
  <div class="header-bar">
    <a class="logo" href="${b}index.html" aria-label="M Designe Ivanjica, početna strana">
      <span class="logo__mark">M DESIGNE //</span>
      <span class="logo__meta">43.6° N</span>
    </a>
    <nav class="nav" id="glavna-navigacija" aria-label="Glavna navigacija">
${NAV.map(([h, t]) => `      <a href="${b}${h}">${t}</a>`).join('\n')}
    </nav>
    <div class="header-cta">
      <a class="btn btn--dark" href="${b}kontakt.html">Zatraži ponudu</a>
    </div>
    <button class="nav-toggle" aria-expanded="false" aria-controls="glavna-navigacija" aria-label="Otvori meni">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>`;
  }

  function sticky(depth) {
    const b = up(depth);
    return `<div class="sticky-actions" aria-label="Brzi kontakt">
  <a href="tel:${K.telefonRaw}" aria-label="Pozovi ${K.telefon}">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .7-.2 1l-2.3 2.2z"/></svg>
    <span>Pozovi</span>
  </a>
  <a href="viber://chat?number=%2B${K.viber.replace('+', '')}" aria-label="Pišite nam na Viber">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.9 2 3 5.5 3 10c0 2.4 1.1 4.5 3 6v4.2c0 .4.5.6.8.4l3.3-2.3c.6.1 1.2.1 1.9.1 5.1 0 9-3.5 9-8s-3.9-8.4-9-8.4z"/></svg>
    <span>Viber</span>
  </a>
  <a href="https://wa.me/${K.whatsapp}" target="_blank" rel="noopener" aria-label="Pišite nam na WhatsApp">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.2 14.8l-.4-.2-2.4.6.6-2.3-.2-.4A8 8 0 0 1 12 4zm4.3 10.2c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.6.8c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.4a3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8a9.6 9.6 0 0 0 4 3.4c1.4.5 1.7.4 2 .4.4 0 1.4-.5 1.6-1.1.2-.6.2-1 .1-1.1l-.4-.2z"/></svg>
    <span>WhatsApp</span>
  </a>
  <a href="${b}kontakt.html" aria-label="Pošalji upit">
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18v14H3V5zm2 2v.5l7 4.2 7-4.2V7H5zm14 3.1-6.5 3.9a1 1 0 0 1-1 0L5 10.1V17h14v-6.9z"/></svg>
    <span>Upit</span>
  </a>
</div>`;
  }

  const foot = require('./footer.js')(K, esc, up, NAV, sticky);

  return { head, header, sticky, foot, esc, up, meta, SITE, ARROW, DOTS, NAV, orgLd, crumbsLd, faqLd, jsonld, ORG_ID };
};
