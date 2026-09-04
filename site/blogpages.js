/* ==========================================================================
   Blog  (po ugledu na Journals sa referentnog sajta)
   ========================================================================== */

const MESECI = ['januar','februar','mart','april','maj','jun',
                'jul','avgust','septembar','oktobar','novembar','decembar'];

function datumSr(iso) {
  const d = new Date(iso);
  return d.getDate() + '. ' + MESECI[d.getMonth()] + ' ' + d.getFullYear() + '.';
}

module.exports = function (BLOG, H) {
  const { esc, meta, head, foot, SITE, K, ARROW, crumbsLd, jsonld } = H;

  function post(c, featured, prefix, hrefPrefix) {
    return `        <article class="post ap${featured ? ' post--featured' : ''}" data-cat="${esc(c.kategorija)}">
          <div class="post__img"><img src="${prefix}${c.slika}" alt="${esc(c.naslov)}" loading="lazy" width="900" height="620"></div>
          <div>
            <span class="post__cat">${esc(c.kategorija)}</span>
            <h3 class="post__title" style="margin-top:8px">${esc(c.naslov)}</h3>
            <p style="margin-top:12px">${esc(c.sazetak)}</p>
            <p class="post__date" style="margin-top:16px">${datumSr(c.datum)}</p>
          </div>
          <a class="post__link" href="${hrefPrefix}${c.slug}.html" aria-label="Pročitaj tekst: ${esc(c.naslov)}"></a>
        </article>`;
  }

  function blogPage() {
    const sorted = BLOG.clanci.slice().sort((a, b) => b.datum.localeCompare(a.datum));
    const lead = sorted.find(c => c.istaknut) || sorted[0];
    const rest = sorted.filter(c => c !== lead);

    const filteri = ['sve'].concat(BLOG.kategorije).map((k, i) =>
      `        <button class="filter-btn${i === 0 ? ' is-active' : ''}" data-filter="${k === 'sve' ? 'sve' : esc(k)}">${k === 'sve' ? 'Sve teme' : esc(k)}</button>`
    ).join('\n');

    return head({
      title: 'Blog o gradnji montažnih i A-frame kuća | M Designe',
      desc: 'Praktični tekstovi o ceni, temelju, dozvolama, izolaciji i održavanju montažnih i A-frame kuća. Iskustvo sa terena, bez uopštenih saveta.',
      canonical: 'blog.html', depth: 0, ogImage: lead.slika, preload: lead.slika,
      extraHead: [
        crumbsLd([['Početna', 'index.html'], ['Blog', 'blog.html']]),
        {
          '@context': 'https://schema.org', '@type': 'Blog',
          '@id': SITE + '/blog.html', name: 'Blog M Designe Ivanjica',
          inLanguage: 'sr-Latn-RS', publisher: { '@id': SITE + '/#firma' },
          blogPost: sorted.map(c => ({
            '@type': 'BlogPosting', headline: c.naslov, url: SITE + '/savet/' + c.slug + '.html',
            datePublished: c.datum, image: SITE + '/' + c.slika
          }))
        }
      ].map(jsonld).join('')
    }) + `
  <div class="phead">
    <div class="phead__main">
      <span class="tab">Blog</span>
      <h1 data-split>Pre nego što počnete da gradite</h1>
    </div>
    <div class="phead__side">
      <p>Praktični tekstovi o ceni, temelju, dozvolama, izolaciji i održavanju. Ono što pitaju klijenti, odgovoreno bez uvijanja.</p>
    </div>
  </div>

  <section>
    <div class="wrap">
      <div class="filters" style="margin-bottom:48px" role="group" aria-label="Filter tema">
${filteri}
      </div>
      <div class="grid grid--3">
${post(lead, true, '', 'savet/')}
${rest.map(c => post(c, false, '', 'savet/')).join('\n')}
      </div>
    </div>
  </section>

  <section class="cta-full">
    <p class="eyebrow">Pitanja</p>
    <h2 data-split>Imate pitanje koje nije ovde?</h2>
    <p>Pošaljite ga direktno. Odgovaramo iz iskustva sa terena, ne iz brošure.</p>
    <div class="btn-row"><a class="btn btn--primary" href="kontakt.html">Postavi pitanje ${ARROW}</a></div>
  </section>` + foot(0);
  }

  /* Kurirane veze ka stranicama sajta, po tekstu.
     Bolje nego automatsko linkovanje pojmova, jer tekstovi retko pominju
     kategorije doslovno, a Google ipak treba da vidi vezu tema i ponude. */
  const VEZE = {
    'koliko-kosta-a-frame-kuca-u-srbiji': [['Cenovnik 2026', '../cenovnik.html'], ['A-frame kuće i cene', '../modeli/a-frame.html'], ['Izračunaj cenu', '../kontakt.html']],
    'a-frame-ili-montazna-kuca-sta-izabrati': [['A-frame kuće', '../modeli/a-frame.html'], ['Montažne kuće', '../modeli/montazne-kuce.html'], ['Uporedi cene', '../cenovnik.html']],
    'temelj-za-montaznu-kucu-kako-se-bira': [['Montažne kuće', '../modeli/montazne-kuce.html'], ['Cene i doplate', '../cenovnik.html']],
    'da-li-je-a-frame-kuca-za-celogodisnji-boravak': [['A-frame kuće', '../modeli/a-frame.html'], ['Modeli preko 80 m²', '../modeli/montazne-kuce.html']],
    'dozvole-za-montazne-objekte': [['Montažne kuće', '../modeli/montazne-kuce.html'], ['Bungalovi', '../modeli/bungalovi.html']],
    'odrzavanje-drvenih-objekata': [['Letnjikovci i pergole', '../modeli/letnjikovci.html'], ['Dečja igrališta', '../modeli/igralista.html']],
    'bungalov-za-izdavanje-racunica': [['Bungalovi i cene', '../modeli/bungalovi.html'], ['Resort i investicije', '../modeli/resort.html'], ['Cenovnik 2026', '../cenovnik.html']],
    'kako-se-bira-model-po-broju-korisnika': [['Svi modeli', '../modeli.html'], ['Cenovnik 2026', '../cenovnik.html'], ['A-frame kuće', '../modeli/a-frame.html']]
  };

  function articlePage(c) {
    const drugi = BLOG.clanci.filter(x => x.slug !== c.slug).slice(0, 3);
    const telo = c.sadrzaj.map(s => `        <h2 data-split>${esc(s.h)}</h2>\n        <p>${esc(s.p)}</p>`).join(String.fromCharCode(10));

    const ld = [
      crumbsLd([['Početna', 'index.html'], ['Blog', 'blog.html'], [c.naslov, 'savet/' + c.slug + '.html']]),
      {
        '@context': 'https://schema.org', '@type': 'Article',
        headline: c.naslov, description: c.sazetak,
        image: SITE + '/' + c.slika,
        datePublished: c.datum, dateModified: c.datum,
        inLanguage: 'sr-Latn-RS',
        mainEntityOfPage: { '@type': 'WebPage', '@id': SITE + '/savet/' + c.slug + '.html' },
        articleSection: c.kategorija,
        author: { '@id': SITE + '/#firma' },
        publisher: { '@id': SITE + '/#firma' }
      }
    ];

    let title = c.naslov + ' | M Designe';
    if (title.length > 60) title = c.naslov;

    return head({
      title, desc: meta(c.sazetak), canonical: 'savet/' + c.slug + '.html', depth: 1,
      ogImage: c.slika, preload: c.slika, ogType: 'article',
      extraHead: ld.map(jsonld).join('')
    }) + `
  <div class="phead">
    <div class="phead__main">
      <p class="crumbs"><a href="../index.html">Početna</a><i>/</i><a href="../blog.html">Blog</a><i>/</i>${esc(c.kategorija)}</p>
      <p class="eyebrow">${esc(c.kategorija)}</p>
      <h1 data-split>${esc(c.naslov)}</h1>
    </div>
    <div class="phead__side">
      <p>${esc(c.sazetak)}</p>
      <p class="crumbs" style="margin-top:20px;margin-bottom:0">${datumSr(c.datum)}</p>
    </div>
  </div>

  <section>
    <div class="wrap">
      <div class="two-col">
        <div class="two-col__left">
          <span class="tab">Tema</span>
          <h2 data-split>${esc(c.kategorija)}</h2>
          <div class="cta-box">
            <p>Treba vam konkretan odgovor?</p>
            <p>Pozovite i recite nam gde gradite i šta planirate.</p>
            <a class="btn btn--light" href="tel:${K.telefonRaw}">${esc(K.telefon)}</a>
          </div>
        </div>
        <div class="two-col__right">
          <div class="prose">
${telo}
          </div>
          <p class="note">Ovaj tekst je opšte uputstvo, ne zamena za projekat, statički proračun ni pregled terena.</p>
          <div class="btn-row" style="margin-top:24px">
            <a class="btn btn--primary" href="../kontakt.html">Zatraži ponudu ${ARROW}</a>
            <a class="btn btn--outline" href="../blog.html">Svi tekstovi</a>
          </div>
${(VEZE[c.slug] || []).length ? `          <p class="eyebrow" style="margin-top:40px">Povezano na sajtu //</p>
          <div class="btn-row">
${(VEZE[c.slug] || []).map(v => `            <a class="btn btn--outline" href="${v[1]}">${esc(v[0])}</a>`).join(String.fromCharCode(10))}
          </div>` : ''}
        </div>
      </div>
    </div>
  </section>

  <section class="sec--dark">
    <div class="wrap">
      <div class="two-col" style="margin-bottom:48px">
        <div class="two-col__left" style="position:static">
          <span class="tab">Još</span>
          <h2 data-split>Pročitajte i ovo</h2>
        </div>
      </div>
      <div class="grid grid--3">
${drugi.map(d => post(d, false, '../', '')).join('\n')}
      </div>
    </div>
  </section>` + foot(1);
  }

  return { blogPage, articlePage };
};
