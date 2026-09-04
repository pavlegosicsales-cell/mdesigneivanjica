/* ==========================================================================
   CENOVNIK
   Jedna strana sa svim cenama iz kataloga 2026, ciljana na upit "cena".
   Koristi iste komponente kao stranica kategorije:
   phead, matrix (tamna tabela), asec + cgrid, cta-full.
   ========================================================================== */

module.exports = function (DATA, L) {
  const K = DATA.kontakt;
  const { esc, ARROW, SITE, crumbsLd, faqLd, jsonld } = L;

  const cenaBroj = (v) => {
    const m = String(v || '').replace(/\./g, '').match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
  };
  const eur = (n) => n.toLocaleString('de-DE') + ' €';

  /* --- tabela modela jedne kategorije --- */
  function tabelaKat(kat) {
    const modeli = DATA.modeli.filter(m => m.kategorija === kat.slug);
    if (!modeli.length) return '';
    const paketi = modeli[0].cene.map(c => c.paket);
    const imaTemelj = modeli.some(m => m.temelj);

    return `
  <div class="matrix" id="cene-${kat.slug}">
    <div class="matrix__head">
      <p class="eyebrow">CENOVNIK 2026 // ${esc(kat.naziv.toUpperCase())}</p>
      <h2 data-split>${esc(kat.naziv)} | cene po modelu.</h2>
      <p>${esc(kat.opis)}</p>
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
            <td><a href="model/${m.slug}.html">${esc(m.naziv)}</a></td>
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
    <p class="matrix__hint">Prevucite tabelu levo i desno &rarr;</p>
    <div class="btn-row">
      <a class="btn btn--light" href="modeli/${kat.slug}.html">Sve o kategoriji ${esc(kat.naziv)} ${ARROW}</a>
    </div>
  </div>`;
  }

  /* --- tabela doplata jedne kategorije --- */
  function doplateKat(kat) {
    const dop = DATA.doplate[kat.slug];
    if (!dop) return '';
    return `
  <div class="matrix">
    <div class="matrix__head">
      <p class="eyebrow">DOPLATE // ${esc(kat.naziv.toUpperCase())}</p>
      <h2 data-split>Izmene i oprema | ${esc(kat.naziv)}.</h2>
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
    <p class="matrix__hint">Prevucite tabelu levo i desno &rarr;</p>
  </div>`;
  }

  const svePocetne = DATA.modeli
    .map(m => cenaBroj(m.cene && m.cene[0] ? m.cene[0].iznos : ''))
    .filter(Boolean);
  const najniza = svePocetne.length ? Math.min.apply(null, svePocetne) : 0;
  const najvisa = DATA.modeli
    .map(m => cenaBroj(m.cene && m.cene.length ? m.cene[m.cene.length - 1].iznos : ''))
    .filter(Boolean);
  const gornja = najvisa.length ? Math.max.apply(null, najvisa) : 0;

  const pregled = DATA.kategorije.map(kat => {
    const modeli = DATA.modeli.filter(m => m.kategorija === kat.slug);
    const cene = modeli.map(m => cenaBroj(m.cene && m.cene[0] ? m.cene[0].iznos : '')).filter(Boolean);
    const od = cene.length ? eur(Math.min.apply(null, cene)) : 'Na upit';
    return `          <tr>
            <td><a href="modeli/${kat.slug}.html">${esc(kat.naziv)}</a></td>
            <td>${modeli.length ? modeli.length + ' modela' : 'Po projektu'}</td>
            <td class="num">${od}</td>
            <td>${modeli.length ? `<a href="#cene-${kat.slug}">Ceo cenovnik</a>` : '&ndash;'}</td>
          </tr>`;
  }).join('\n');

  const faq = [
    {
      p: 'Šta ulazi u početnu cenu?',
      o: 'Početna cena je cena tipskog modela u navedenom paketu, sa konstrukcijom, oblogama i radovima koji su za taj paket opisani u katalogu. Temelj, dozvole, priključci i uređenje parcele nisu uključeni osim kada ponuda to izričito navodi.'
    },
    {
      p: 'Da li je cena iz cenovnika konačna?',
      o: 'Nije. Sve cene su početne i informativne. Konačan iznos zavisi od lokacije, temelja, izabranih materijala, izmena projekta, transporta i uslova pristupa gradilištu.'
    },
    {
      p: 'Koliko košta najjeftiniji objekat u ponudi?',
      o: `Najniža početna cena u katalogu 2026 je ${eur(najniza)}. Reč je o najmanjem modelu u svojoj kategoriji, u osnovnom paketu.`
    },
    {
      p: 'Da li se cena menja sa lokacijom?',
      o: 'Da. Transport, uslovi pristupa parceli i priprema terena utiču na konačan iznos, pa uz svaki upit tražimo mesto ili opštinu.'
    },
    {
      p: 'Kako da dobijem cenu za svoj slučaj?',
      o: 'Kroz upit izaberete kategoriju, kvadraturu, paket i lokaciju i odmah vidite okvirnu cenu. Predlog modela i strukturu ponude šaljemo posle toga.'
    }
  ];

  return {
    title: 'Cenovnik 2026: montažne i A-frame kuće | M Designe',
    desc: `Cene svih ${DATA.modeli.length} modela na jednom mestu: montažne kuće, A-frame kuće, bungalovi, letnjikovci i dečja igrališta. Početne cene od ${eur(najniza)}, sa doplatama i opisom paketa.`,
    ogImage: 'images/objekti/montazna-moderna.png',
    preload: 'images/objekti/montazna-moderna.png',
    extraHead: [
      crumbsLd([['Početna', 'index.html'], ['Cenovnik', 'cenovnik.html']]),
      faqLd(faq),
      {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: 'Cenovnik 2026, M Designe Ivanjica',
        numberOfItems: DATA.modeli.length,
        itemListElement: DATA.modeli.map((m, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'Product',
            name: m.naziv,
            url: SITE + '/model/' + m.slug + '.html',
            image: SITE + '/' + m.slika,
            offers: {
              '@type': 'Offer',
              priceCurrency: 'EUR',
              price: cenaBroj(m.cene && m.cene[0] ? m.cene[0].iznos : ''),
              availability: 'https://schema.org/PreOrder',
              seller: { '@id': SITE + '/#firma' }
            }
          }
        }))
      }
    ].map(jsonld).join(''),

    body: `
  <div class="phead">
    <div class="phead__main">
      <span class="tab">Cenovnik 2026</span>
      <h1 data-split>Cene montažnih i A-frame kuća</h1>
    </div>
    <div class="phead__side">
      <p>Sve cene iz kataloga 2026 na jednom mestu, po kategoriji, modelu i paketu. Početne cene idu od ${eur(najniza)} za najmanje objekte do ${eur(gornja)} za najveće modele u punom paketu. Cene su početne i informativne i ne predstavljaju konačnu ponudu.</p>
      <div class="btn-row" style="margin-top:24px">
        <a class="btn btn--primary" href="kontakt.html">Izračunaj cenu za svoj slučaj ${ARROW}</a>
        <a class="btn btn--outline" href="modeli.html">Svi modeli</a>
      </div>
    </div>
  </div>

  <div class="matrix">
    <div class="matrix__head">
      <p class="eyebrow">PREGLED // ŠEST KATEGORIJA</p>
      <h2 data-split>Od čega se polazi | u svakoj kategoriji.</h2>
      <p>Početna cena je najniža cena tipskog modela u toj kategoriji, u osnovnom paketu. Detaljne tabele po modelu i doplate su ispod.</p>
    </div>
    <div class="matrix__wrap">
      <table>
        <thead>
          <tr><th scope="col">Kategorija</th><th scope="col">Obim ponude</th><th scope="col" class="num">Početna cena</th><th scope="col">Tabela</th></tr>
        </thead>
        <tbody>
${pregled}
        </tbody>
      </table>
    </div>
    <p class="matrix__hint">Prevucite tabelu levo i desno &rarr;</p>
    <p class="note"><strong>Sve cene su početne i informativne.</strong> Ne predstavljaju konačnu ponudu. Konačan iznos zavisi od lokacije, temelja, izabranih materijala, izmena projekta, transporta i uslova pristupa gradilištu. Temelj, dozvole, priključci i uređenje parcele nisu uključeni osim kada ponuda to izričito navodi.</p>
  </div>
${DATA.kategorije.map(kat => tabelaKat(kat) + doplateKat(kat)).join('\n')}

  <div class="asec">
    <div class="hblock">
      <p class="eyebrow">Pitanja_O_Ceni</p>
      <h2 data-split>Šta cena obuhvata | a šta ne.</h2>
    </div>
    <div class="cgrid" style="margin-top:40px">
${faq.slice(0, 3).map((f, i) => `      <div class="cell ap">
        <span class="cell__n">${String(i + 1).padStart(2, '0')}</span>
        <p class="eyebrow">${esc(f.p)}</p>
        <p>${esc(f.o)}</p>
      </div>`).join('\n')}
    </div>
  </div>

  <div class="asec asec--dark">
    <div class="hblock">
      <p class="eyebrow">OBIM PONUDE</p>
      <h2 data-split>Šta nije uključeno | u katalošku cenu.</h2>
      <p>Pravilo je jednostavno: uključeno je samo ono što je imenovano, količinski određeno i opisano u konačnoj ponudi. Ako stavka nije navedena, ne smatra se automatski uključenom.</p>
    </div>
    <div class="cgrid" style="margin-top:40px">
      <div class="cell ap">
        <span class="cell__n">01</span>
        <p class="eyebrow">Parcela i dokumentacija //</p>
        <p>Kupovina i pravno uređenje parcele. Geodetski radovi, geomehanika, projekti, dozvole, takse i saglasnosti, osim kada su izričito ugovoreni.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">02</span>
        <p class="eyebrow">Zemljani radovi i priključci //</p>
        <p>Čišćenje parcele, rušenje, iskop, nasipanje, drenaža, potporni zidovi i kosine. Priključci struje, vode, kanalizacije, gasa, interneta, septička jama ili prečistač.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">03</span>
        <p class="eyebrow">Logistika gradilišta //</p>
        <p>Transport van ugovorenog radijusa, putarine i posebne dozvole. Smeštaj radnika, kran, pumpa za beton, dizalica, agregat i specijalna mehanizacija kada ih zahteva lokacija.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">04</span>
        <p class="eyebrow">Spoljno uređenje //</p>
        <p>Parking, staze, ograde, kapije, hortikultura, rasveta parcele i odvođenje atmosferskih voda. Bazen, spa, letnjikovac, pergola i objekti izvan ugovorene kuće.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">05</span>
        <p class="eyebrow">Enterijer i oprema //</p>
        <p>Kuhinja, nameštaj, bela tehnika, zavese, dekoracija i turistički inventar, osim izabranog paketa opremanja. Materijali i oprema iznad ugovorenih limita.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">06</span>
        <p class="eyebrow">Naknadne promene //</p>
        <p>Demontaža, otpad, ponovna nabavka i dodatni rad nastali posle potvrde projekta ili specifikacije. Sanacija temelja i radova drugih izvođača.</p>
      </div>
    </div>
  </div>

  <section class="cta-full">
    <p class="eyebrow">Sledeći korak</p>
    <h2 data-split>Cena za vašu parcelu</h2>
    <p>Pošaljite kategoriju, kvadraturu, paket i lokaciju. Okvirnu cenu vidite odmah, a predlog modela i strukturu ponude šaljemo u najkraćem roku.</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="kontakt.html">Zatraži ponudu ${ARROW}</a>
      <a class="btn btn--light" href="tel:${K.telefonRaw}">${esc(K.telefon)}</a>
    </div>
  </section>`
  };
};
