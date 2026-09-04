/* ==========================================================================
   STRANICA MODELA
   Model_Hero_Section  ->  red, krem, puna visina, tekst levo slika desno
   Spec_Grid           ->  4 kolone
   Spatial_Layout      ->  kolona, gap 80, raspored prostora
   Lookbook            ->  tekst levo (sticky), galerija desno
   CTA_section         ->  tamna, puna visina
   ========================================================================== */

module.exports = function (DATA, L, FOOT, NOTE) {
  const K = DATA.kontakt;
  const { head, esc, meta, ARROW, SITE } = L;

  function gcard(m, prefix) {
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

  return function modelPage(m) {
    const kat = DATA.kategorije.find(k => k.slug === m.kategorija);
    const braca = DATA.modeli.filter(x => x.kategorija === m.kategorija && x.slug !== m.slug).slice(0, 3);
    const mid = m.cene.length > 2 ? 1 : 0;

    const povrsina = (m.specs.find(s => /ukupno|bruto|površina/i.test(s.k)) || m.specs[0] || {}).v || '';

    /* Jednina kategorije: "A-frame kuće" -> "A-frame kuća", da naslov cita kao upit. */
    const jednina = {
      'A-frame kuće': 'A-frame kuća',
      'Montažne kuće': 'Montažna kuća',
      'Bungalovi': 'Bungalov',
      'Letnjikovci i pergole': 'Letnjikovac',
      'Dečja igrališta': 'Dečje igralište',
      'Resort i investicije': 'Resort objekat'
    }[kat.naziv] || kat.naziv;

    const cena1 = m.cene && m.cene[0] ? m.cene[0].iznos : '';
    const cenaBroj = parseFloat(String(cena1).replace(/\./g, '').replace(/[^\d.]/g, '')) || 0;
    const cenaVisoka = m.cene && m.cene.length > 1
      ? parseFloat(String(m.cene[m.cene.length - 1].iznos).replace(/\./g, '').replace(/[^\d.]/g, '')) || 0
      : 0;

    /* Naslov nosi model, tip objekta i rec "cena", jer se tako i pretrazuje. */
    let title = `${jednina} ${m.naziv}${povrsina ? ' (' + povrsina + ')' : ''}, cena | M Designe`;
    if (title.length > 62) title = `${jednina} ${m.naziv}, cena | M Designe`;
    if (title.length > 62) title = `${m.naziv} | ${kat.naziv} | M Designe`;

    const ld = [
      L.crumbsLd([
        ['Početna', 'index.html'], ['Modeli', 'modeli.html'],
        [kat.naziv, `modeli/${kat.slug}.html`], [m.naziv, `model/${m.slug}.html`]
      ]),
      {
        '@context': 'https://schema.org', '@type': 'Product',
        name: `${m.naziv}, ${jednina}`,
        description: `${m.podnaslov}. ${m.raspored}`,
        image: `${SITE}/${m.slika}`,
        sku: m.slug,
        category: kat.naziv,
        url: `${SITE}/model/${m.slug}.html`,
        brand: { '@type': 'Brand', name: 'M Designe Ivanjica' },
        manufacturer: { '@id': SITE + '/#firma' },
        additionalProperty: m.specs.map(sp => ({
          '@type': 'PropertyValue', name: sp.k, value: sp.v
        })),
        offers: {
          '@type': 'AggregateOffer', priceCurrency: 'EUR',
          lowPrice: cenaBroj || undefined,
          highPrice: cenaVisoka || undefined,
          offerCount: m.cene.length,
          availability: 'https://schema.org/PreOrder',
          areaServed: { '@type': 'Country', name: 'Srbija' },
          seller: { '@id': SITE + '/#firma' }
        }
      }
    ];

    const upit = `../kontakt.html?model=${m.slug}&amp;kategorija=${kat.slug}`;

    return head({
      title,
      desc: meta(`${jednina} ${m.naziv}${povrsina ? ', ' + povrsina : ''}, cena od ${cena1}. ${m.podnaslov}. Proizvodnja u Ivanjici, isporuka i montaža u celoj Srbiji.`),
      canonical: `model/${m.slug}.html`, depth: 1, ogImage: m.slika,
      preload: m.slika, ogType: 'product',
      extraHead: ld.map(L.jsonld).join('')
    }) + `

  <!-- ===== Model_Hero: tekst levo, slika desno ===== -->
  <section class="mhero">
    <div class="mhero__text">
      <p class="crumbs"><a href="../index.html">Početna</a><i>/</i><a href="../modeli.html">Modeli</a><i>/</i><a href="../modeli/${kat.slug}.html">${esc(kat.naziv)}</a></p>
      <span class="tab">${esc(kat.naziv)}</span>
      <h1 data-split>${esc(m.naziv)}</h1>
      <p class="t-18">${esc(m.podnaslov)}</p>
      <div class="certstrip" style="margin-top:12px">
${m.specs.slice(0, 3).map(s => `        <div><span class="v">${esc(s.v)}</span><span class="l">${esc(s.k)}</span></div>`).join('\n')}
      </div>
      <div class="btn-row" style="margin-top:16px">
        <a class="btn btn--primary" href="${upit}">Zatraži ponudu ${ARROW}</a>
        <a class="btn btn--outline" href="tel:${K.telefonRaw}">${esc(K.telefon)}</a>
      </div>
    </div>
    <div class="mhero__media">
      <img src="../${m.slika}" alt="${esc(m.naziv)}, ${esc(m.podnaslov.toLowerCase())}" width="1200" height="900">
    </div>
  </section>

  <!-- ===== Specifikacija ===== -->
  <section class="sec--dark">
    <div class="wrap">
      <span class="tab">Specifikacija</span>
      <h2 data-split style="margin-top:24px;max-width:20ch">Tehnički podaci</h2>
      <div class="specgrid">
${m.specs.map((s, i) => `        <div class="ap"><div class="k">${String(i + 1).padStart(2, '0')}</div><h4>${esc(s.k)}</h4><p>${esc(s.v)}</p></div>`).join('\n')}
      </div>
    </div>
  </section>

  <!-- ===== Spatial_Layout: raspored prostora ===== -->
  <section>
    <div class="wrap">
      <div class="two-col">
        <div class="two-col__left">
          <span class="tab">Raspored</span>
          <h2 data-split>Kako je organizovan prostor</h2>
        </div>
        <div class="two-col__right">
          <p class="t-18">${esc(m.raspored)}</p>
          ${m.namena ? `<div class="mile" style="border-top:0;padding-top:0"><div class="mile__y">NAMENA</div><div class="mile__b"><p>${esc(m.namena)}</p></div></div>` : ''}
          ${m.prednost ? `<div class="mile"><div class="mile__y">PREDNOST</div><div class="mile__b"><p>${esc(m.prednost)}</p></div></div>` : ''}
          <p class="note">Nacrt osnove sa kotama, karakterističan presek i fasade izrađuju se u projektnoj fazi. Katalog ne predstavlja projekat za građenje.</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== Cene ===== -->
  <section class="sec--faq">
    <div class="wrap">
      <span class="tab">Cene</span>
      <h2 data-split style="margin-top:24px;max-width:22ch">Šta košta ${esc(m.naziv)}</h2>

      <div class="price-grid" style="margin-top:48px">
${m.cene.map((c, i) => `        <div class="price-card${i === mid && m.cene.length > 2 ? ' price-card--on' : ''} ap">
          <div class="price-card__k">${esc(c.paket)}</div>
          <div class="price-card__v">${esc(c.iznos)}</div>
        </div>`).join('\n')}
      </div>

      <div style="margin-top:32px;max-width:72ch">
        ${m.temelj ? `<p><strong>Temelj:</strong> ${esc(m.temelj)}. Obračunava se posebno, prema geomehanici i nagibu terena.</p>` : ''}
        ${m.opremanje ? `<p><strong>Paket opremanja nameštajem:</strong> ${esc(m.opremanje)}. Nije deo osnovne cene kuće.</p>` : ''}
        ${NOTE}
      </div>

      <div class="btn-row" style="margin-top:32px">
        <a class="btn btn--primary" href="${upit}">Zatraži ponudu za ${esc(m.naziv)} ${ARROW}</a>
        <a class="btn btn--outline" href="../${kat.katalog}" target="_blank" rel="noopener">Preuzmi katalog</a>
      </div>
    </div>
  </section>

  <!-- ===== Lookbook: rokovi levo, slike desno ===== -->
  <section>
    <div class="lookbook">
      <div class="lookbook__head">
        <span class="tab">Rokovi</span>
        <h2 data-split>Realizacija po fazama</h2>
        <p>Planski okvir za organizaciju posla. Rok se potvrđuje ugovorom nakon zaključavanja modela, lokacije, projekta i specifikacije.</p>
        <div class="miles" style="margin-top:12px">
${DATA.faze.map(f => `          <div class="mile"><div class="mile__y">${esc(f.okvir)}</div><div class="mile__b"><h4>${esc(f.faza)}</h4><p>${esc(f.utice)}</p></div></div>`).join('\n')}
        </div>
      </div>
      <div class="lookbook__gal">
        <img src="../${m.slika}" alt="Prikaz modela ${esc(m.naziv)}" loading="lazy" width="1200" height="900">
        <img src="../${kat.slika}" alt="${esc(kat.naziv)}, kontekst modela" loading="lazy" width="1200" height="900">
      </div>
    </div>
  </section>
${braca.length ? `
  <!-- ===== Slicni modeli ===== -->
  <section class="sec--dark">
    <div class="wrap">
      <span class="tab">Slično</span>
      <h2 data-split style="margin-top:24px;max-width:20ch">Uporedite sa ostalima</h2>
      <div class="grid grid--3" style="margin-top:48px">
${braca.map(b => gcard(b, '../')).join('\n')}
      </div>
    </div>
  </section>` : ''}

  <section class="cta-full">
    <p class="eyebrow">Sledeći korak</p>
    <h2 data-split>Pošaljite podatke o parceli</h2>
    <p>Mesto i link lokacije, fotografije parcele i prilaza, željeni paket i planirani budžet. Nakon početne analize dobijate predlog i strukturu ponude.</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="${upit}">Pošalji upit ${ARROW}</a>
      <a class="btn btn--light" href="tel:${K.telefonRaw}">${esc(K.telefon)}</a>
    </div>
  </section>
` + FOOT(1);
  };
};
