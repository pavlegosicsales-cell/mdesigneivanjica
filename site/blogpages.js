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
  const { esc, meta, head, foot, SITE, K, ARROW } = H;

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
      canonical: 'blog.html', depth: 0, ogImage: lead.slika
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

  function articlePage(c) {
    const drugi = BLOG.clanci.filter(x => x.slug !== c.slug).slice(0, 3);
    const telo = c.sadrzaj.map(s => `        <h2 data-split>${esc(s.h)}</h2>\n        <p>${esc(s.p)}</p>`).join('\n');

    const ld = {
      '@context': 'https://schema.org', '@type': 'Article',
      headline: c.naslov, description: c.sazetak,
      image: SITE + '/' + c.slika, datePublished: c.datum, inLanguage: 'sr-RS',
      author: { '@type': 'Organization', name: 'M Designe Ivanjica' },
      publisher: { '@type': 'Organization', name: 'M Designe Ivanjica', logo: { '@type': 'ImageObject', url: SITE + '/images/brend/logo.png' } }
    };

    let title = c.naslov + ' | M Designe';
    if (title.length > 60) title = c.naslov;

    return head({
      title, desc: meta(c.sazetak), canonical: 'savet/' + c.slug + '.html', depth: 1, ogImage: c.slika,
      extraHead: `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n`
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
