#!/usr/bin/env node
/* ==========================================================================
   M DESIGNE  -  generator stranica
   node build.js
   ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DATA = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'modeli.json'), 'utf8'));
const BLOG = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'blog.json'), 'utf8'));
const K = DATA.kontakt;

const L = require('./layout.js')(K);
const { head, foot, esc, meta, SITE, ARROW } = L;

/* "14.900 €" -> 14900, radi racunanja raspona cena i kvadratura */
const broj = (v) => {
  const m = String(v || '').replace(/\./g, '').match(/\d+(?:,\d+)?/);
  return m ? parseFloat(m[0].replace(',', '.')) : 0;
};
const fmt = (n) => n ? Math.round(n).toLocaleString('de-DE') : '';

const FOOT = (d) => foot(d, DATA.kategorije);

/* Napomena uz svaku cenu */
const NOTE = `<p class="note"><strong>Sve cene su početne i informativne.</strong> Ne predstavljaju konačnu ponudu. Konačan iznos zavisi od lokacije, temelja, izabranih materijala, izmena projekta, transporta i uslova pristupa gradilištu. Temelj, dozvole, priključci i uređenje parcele nisu uključeni osim kada ponuda to izričito navodi.</p>`;

/* ---------- kartica modela u mrezi ---------- */
function gcard(m, prefix, kat) {
  const meta1 = (m.specs.find(s => /ukupno|bruto|površina|dimenzije/i.test(s.k)) || m.specs[0] || {}).v || '';
  const cena = m.cene && m.cene[0] ? m.cene[0].iznos : 'na upit';
  return `        <article class="gcard ap">
          <div class="gcard__img"><img src="${prefix}${m.slika}" alt="${esc(m.naziv)}, ${esc(m.podnaslov.toLowerCase())}" loading="lazy" width="900" height="850"></div>
          <div class="gcard__overlay"></div>
          <div class="gcard__meta">${esc(meta1)}</div>
          <div class="gcard__row">
            <span class="gcard__title">${esc(m.naziv)}</span>
            <span class="gcard__price">${esc(cena)}</span>
          </div>
          <a class="gcard__link" href="${prefix}model/${m.slug}.html" aria-label="Pogledaj model ${esc(m.naziv)}"></a>
        </article>`;
}

/* ==========================================================================
   STRANICA KATEGORIJE
   ========================================================================== */
function categoryPage(kat, idx) {
  const modeli = DATA.modeli.filter(m => m.kategorija === kat.slug);
  const br = String(idx + 1).padStart(2, '0');
  const paketi = modeli.length ? modeli[0].cene.map(c => c.paket) : [];
  const imaTemelj = modeli.some(m => m.temelj);

  /* Comparative Matrix: tamna sekcija, centriran naslov, tabela sa bordurama */
  const tabela = modeli.length ? `
  <div class="matrix">
    <div class="matrix__head">
      <p class="eyebrow">UPOREDNI PREGLED // ${esc(kat.naziv.toUpperCase())}</p>
      <h2 data-split>Sve cene | na jednom mestu.</h2>
      <p>Cene su početne, za tipski model u navedenim dimenzijama. Konačan iznos zavisi od lokacije, temelja, izabranih materijala i uslova pristupa gradilištu.</p>
    </div>
    <div class="matrix__wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Model</th>
            ${modeli[0].specs[0] ? `<th scope="col">${esc(modeli[0].specs[0].k)}</th>` : ''}
            ${paketi.map(p => `<th scope="col" class="num">${esc(p)}</th>`).join('')}
            ${imaTemelj ? '<th scope="col" class="num">Temelj</th>' : ''}
          </tr>
        </thead>
        <tbody>
          ${modeli.map(m => `<tr>
            <td><a href="../model/${m.slug}.html">${esc(m.naziv)}</a></td>
            ${m.specs[0] ? `<td>${esc(m.specs[0].v)}</td>` : ''}
            ${paketi.map(p => {
              const h = (m.cene || []).find(c => c.paket === p);
              return `<td class="num">${h ? esc(h.iznos) : '&ndash;'}</td>`;
            }).join('')}
            ${imaTemelj ? `<td class="num">${m.temelj ? esc(m.temelj) : '&ndash;'}</td>` : ''}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    ${NOTE}
    <div class="btn-row">
      <a class="btn btn--light" href="../cenovnik.html">Ceo cenovnik 2026 ${ARROW}</a>
    </div>
  </div>` : '';

  const dop = DATA.doplate[kat.slug];
  const doplate = dop ? `
  <div class="matrix">
    <div class="matrix__head">
      <p class="eyebrow">DOPLATE // IZMENE I OPREMA</p>
      <h2 data-split>Najčešće izmene | i dodatna oprema.</h2>
      <p>Cene doplata važe kada se opcija ugovori pre nabavke i početka proizvodnje. Naknadne izmene uključuju demontažu, otpad, novu nabavku i dodatni rad.</p>
    </div>
    <div class="matrix__wrap">
      <table>
        <thead><tr><th scope="col">Opcija</th><th scope="col" class="num">Doplata</th><th scope="col">Napomena</th></tr></thead>
        <tbody>
          ${dop.map(d => `<tr><td>${esc(d.opcija)}</td><td class="num">${esc(d.cena)}</td><td>${esc(d.napomena)}</td></tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>` : '';

  const invest = kat.tip === 'investicije' ? `
  <section class="sec--dark">
    <div class="wrap">
      <div class="two-col">
        <div class="two-col__left">
          <span class="tab">Investitori</span>
          <h2 data-split>Više jedinica, jedan sistem</h2>
        </div>
        <div class="two-col__right">
          ${[
            ['Master plan i miks modela', 'Izbor odnosa manjih, porodičnih i premium jedinica prema parceli i ciljnoj grupi.'],
            ['Fazna realizacija', 'Gradnja u etapama koje prate prodaju, finansiranje, sezonu i infrastrukturu.'],
            ['Standardizacija', 'Jedinstveni slojevi, boje, stolarija, kupatila i oprema radi lakše nabavke i servisa.'],
            ['Optimizacija serije', 'Zajednička priprema i ponavljajuća proizvodnja mogu smanjiti jedinične troškove.'],
            ['Turistička funkcija', 'Broj ležajeva, skladištenje, čišćenje, privatnost i trajnost za realan režim izdavanja.'],
            ['Servis i širenje', 'Plan rezervnih delova, održavanja i dodavanja novih jedinica u istoj liniji dizajna.']
          ].map(([h, p], i) => `<div class="step ap"><div class="step__n">${String(i + 1).padStart(2, '0')}</div><div class="step__body"><h4>${h}</h4><p>${p}</p></div></div>`).join('\n          ')}
          <div class="btn-row" style="margin-top:32px">
            <a class="btn btn--light" href="../kontakt.html?kategorija=resort">Zatraži investitorsku ponudu ${ARROW}</a>
          </div>
        </div>
      </div>
    </div>
  </section>` : '';

  /* --- naslov, opis i strukturirani podaci --- */
  const cene = modeli.map(m => broj(m.cene && m.cene[0] ? m.cene[0].iznos : '')).filter(Boolean);
  const najniza = cene.length ? Math.min.apply(null, cene) : 0;
  const kvadrature = modeli.map(m => broj((m.specs.find(x => /ukupno|bruto|površina/i.test(x.k)) || {}).v || '')).filter(Boolean);

  const title = modeli.length
    ? `${kat.naziv}, cene 2026 i ${modeli.length} modela | M Designe`
    : `${kat.naziv} 2026, ponuda i cene | M Designe Ivanjica`;

  const raspon = kvadrature.length ? `od ${Math.min.apply(null, kvadrature)} do ${Math.max.apply(null, kvadrature)} m², ` : '';
  const desc = meta(modeli.length
    ? `${kat.naziv}${raspon ? ' ' + raspon : ', '}${modeli.length} tipskih modela, cene od ${fmt(najniza)} €. Proizvodnja u Ivanjici, montaža na celoj teritoriji Srbije.`
    : `${kat.naziv}: ${kat.opis}`);

  const ld = [
    L.crumbsLd([['Početna', 'index.html'], ['Modeli', 'modeli.html'], [kat.naziv, `modeli/${kat.slug}.html`]]),
    {
      '@context': 'https://schema.org', '@type': 'Service',
      name: kat.naziv, serviceType: kat.naziv,
      description: kat.opis,
      provider: { '@id': SITE + '/#firma' },
      areaServed: { '@type': 'Country', name: 'Srbija' },
      url: `${SITE}/modeli/${kat.slug}.html`,
      ...(najniza ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'EUR', lowPrice: najniza, offerCount: modeli.length, availability: 'https://schema.org/PreOrder' } } : {})
    }
  ];
  if (modeli.length) ld.push({
    '@context': 'https://schema.org', '@type': 'ItemList',
    name: `${kat.naziv}, tipski modeli`,
    numberOfItems: modeli.length,
    itemListElement: modeli.map((m, i) => ({
      '@type': 'ListItem', position: i + 1, name: m.naziv,
      url: `${SITE}/model/${m.slug}.html`
    }))
  });

  return head({
    title, desc, canonical: `modeli/${kat.slug}.html`, depth: 1,
    ogImage: kat.slika, preload: kat.slika,
    extraHead: ld.map(L.jsonld).join('')
  }) + `
  <section class="mhero">
    <div class="mhero__text">
      <p class="crumbs"><a href="../index.html">Početna</a><i>/</i><a href="../modeli.html">Modeli</a><i>/</i>${esc(kat.naziv)}</p>
      <span class="tab">${br} // ${esc(kat.podnaslov)}</span>
      <h1 data-split>${esc(kat.naziv)}</h1>
      <p class="t-18">${esc(kat.opis)}</p>
      <div class="certstrip" style="margin-top:12px">
        <div><span class="v">${modeli.length || '–'}</span><span class="l">Modela u kolekciji</span></div>
        ${modeli.length ? `<div><span class="v">${esc(modeli[0].cene[0].iznos)}</span><span class="l">Početna cena</span></div>` : ''}
      </div>
      <div class="btn-row" style="margin-top:16px">
        <a class="btn btn--primary" href="../kontakt.html?kategorija=${kat.slug}">Zatraži ponudu ${ARROW}</a>
        <a class="btn btn--outline" href="../${kat.katalog}" target="_blank" rel="noopener">Preuzmi katalog</a>
      </div>
    </div>
    <div class="mhero__media">
      <img src="../${kat.slika}" alt="${esc(kat.naziv)}, M Designe Ivanjica" width="1200" height="900">
    </div>
  </section>
${modeli.length ? `
  <section class="sec--dark">
    <div class="wrap">
      <div class="two-col" style="margin-bottom:48px">
        <div class="two-col__left" style="position:static">
          <span class="tab">Modeli</span>
          <h2 data-split>Izaberite model</h2>
        </div>
        <div class="two-col__right">
          <p>Svaki model ima svoju stranicu sa dimenzijama, rasporedom, paketima i cenom. Kvadratura nije jedini kriterijum, važni su i broj korisnika, režim korišćenja i pristup parceli.</p>
        </div>
      </div>
      <div class="grid grid--3">
${modeli.map(m => gcard(m, '../', kat)).join('\n')}
      </div>
    </div>
  </section>` : ''}
${invest}
${tabela}
${doplate}
  <section class="cta-full">
    <p class="eyebrow">Sledeći korak</p>
    <h2 data-split>Niste sigurni koji model?</h2>
    <p>Pošaljite lokaciju, željenu kvadraturu, broj korisnika i okvirni budžet. Predložićemo model i strukturu ponude.</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="../kontakt.html?kategorija=${kat.slug}">Pošalji upit ${ARROW}</a>
      <a class="btn btn--light" href="tel:${K.telefonRaw}">${esc(K.telefon)}</a>
    </div>
  </section>
` + FOOT(1);
}

const modelPage = require('./modelpage.js')(DATA, L, FOOT, NOTE);

/* ---------- upis ----------
   Pri upisu se svaka slika u src, poster i preload zamenjuje WebP verzijom
   kad ona postoji na disku. Original ostaje za og:image, jer neke aplikacije
   za deljenje linkova jos ne prikazuju WebP. WebP se pravi sa tools/webp.js. */
const imaWebp = (rel) => {
  const w = rel.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  if (w === rel) return null;
  const cist = w.replace(/^(\.\.\/)+/, '');
  return fs.existsSync(path.join(ROOT, cist)) ? w : null;
};

function uWebp(html) {
  return html
    .replace(/(\s(?:src|poster)=")([^"]+\.(?:png|jpg|jpeg))(")/gi,
      (m, a, url, b) => a + (imaWebp(url) || url) + b)
    .replace(/(<link rel="preload" as="image" href=")([^"]+)(")/gi,
      (m, a, url, b) => a + (imaWebp(url) || url) + b)
    /* dekodiranje van glavne niti za sve slike koje se ucitavaju lenjo */
    .replace(/<img (?![^>]*decoding=)([^>]*loading="lazy")/gi, '<img decoding="async" $1');
}

function write(rel, html) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, uWebp(html), 'utf8');
  return rel;
}

/* ---------- pokretanje ---------- */
const written = [];
const urls = [
  { loc: '', p: '1.0' }, { loc: 'modeli.html', p: '0.9' }, { loc: 'galerija.html', p: '0.8' },
  { loc: 'blog.html', p: '0.7' }, { loc: 'o-nama.html', p: '0.6' },
  { loc: 'kontakt.html', p: '0.8' }, { loc: 'cenovnik.html', p: '0.9' },
  { loc: 'privatnost.html', p: '0.2' }
];

written.push(write('index.html', require('./home.js')(DATA, L, FOOT)));
written.push(write('o-nama.html', require('./aboutpage.js')(DATA, L, FOOT)));
written.push(write('kontakt.html', require('./contactpage.js')(DATA, L, FOOT)));

const PAGES = require('./pages.js')(DATA, L, FOOT);
Object.keys(PAGES).forEach(file => {
  const p = PAGES[file];
  /* stranica moze da prijavi svoje slike za sitemap (galerija) */
  if (p.slike && p.slike.length) {
    const u = urls.find(x => x.loc === file);
    if (u) u.slike = p.slike;
  }
  written.push(write(file, head({
    title: p.title, desc: p.desc, canonical: file, depth: 0, ogImage: p.ogImage,
    preload: p.preload || '', extraHead: p.extraHead || '',
    robots: p.robots || undefined
  }) + p.body + FOOT(0)));
});

DATA.kategorije.forEach((kat, i) => {
  written.push(write(path.join('modeli', kat.slug + '.html'), categoryPage(kat, i)));
  urls.push({ loc: `modeli/${kat.slug}.html`, p: '0.9', img: kat.slika, alt: kat.naziv });
});

DATA.modeli.forEach(m => {
  written.push(write(path.join('model', m.slug + '.html'), modelPage(m)));
  urls.push({ loc: `model/${m.slug}.html`, p: '0.8', img: m.slika, alt: `${m.naziv}, ${m.podnaslov}` });
});

const blog = require('./blogpages.js')(BLOG, { esc, meta, head, foot: FOOT, SITE, K, ARROW, crumbsLd: L.crumbsLd, jsonld: L.jsonld, faqLd: L.faqLd });
written.push(write('blog.html', blog.blogPage()));
BLOG.clanci.forEach(c => {
  written.push(write(path.join('savet', c.slug + '.html'), blog.articlePage(c)));
  urls.push({ loc: `savet/${c.slug}.html`, p: '0.6', img: c.slika, alt: c.naslov });
});

const today = new Date().toISOString().slice(0, 10);

/* Sitemap sa slikama: Google image ekstenzija pomaze da se renderi modela
   nadju u pretrazi slika, sto je za ovu delatnost realan izvor upita. */
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => `  <url>
    <loc>${SITE}/${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.p >= '0.9' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${u.p}</priority>${u.img ? `
    <image:image>
      <image:loc>${SITE}/${u.img}</image:loc>
      <image:title>${esc(u.alt || '')}</image:title>
    </image:image>` : ''}${u.slike ? u.slike.map(sl => `
    <image:image>
      <image:loc>${SITE}/${sl[0]}</image:loc>
      <image:title>${esc(sl[1])}</image:title>
    </image:image>`).join('') : ''}
  </url>`).join(String.fromCharCode(10))}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemapXml, 'utf8');

fs.writeFileSync(path.join(ROOT, 'robots.txt'),
`User-agent: *
Allow: /
Disallow: /apps-script/

# AI i pretrazivaci koji citaju sadrzaj
User-agent: Googlebot-Image
Allow: /images/

Sitemap: ${SITE}/sitemap.xml
`, 'utf8');

console.log(`Generisano ${written.length} stranica (${DATA.kategorije.length} kategorija, ${DATA.modeli.length} modela, ${BLOG.clanci.length} tekstova).`);
