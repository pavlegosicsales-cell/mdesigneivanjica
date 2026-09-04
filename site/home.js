/* ==========================================================================
   POCETNA
   Svaka sekcija koristi svoj raspored sa referentnog sajta:
   Hero_Section  ->  pin 400vh sa videom
   Lineup        ->  pin 340vh, horizontalne kartice
   Spec_Grid     ->  4 kolone bez razmaka
   Bento_Grid    ->  3 kartice sa slikom
   Process       ->  levo sticky, desno koraci
   Metrics_Grid  ->  4 velika broja
   FAQ           ->  dve kolone, pitanje i odgovor kao tekst
   CTA_section   ->  tamna, puna visina
   ========================================================================== */

module.exports = function (DATA, L, FOOT) {
  const K = DATA.kontakt;
  const { head, esc, ARROW, DOTS, SITE } = L;

  const lineup = DATA.kategorije.map(kat => {
    const broj = DATA.modeli.filter(m => m.kategorija === kat.slug).length;
    const najniza = DATA.modeli.filter(m => m.kategorija === kat.slug)
      .map(m => m.cene && m.cene[0] ? m.cene[0].iznos : null).filter(Boolean)[0];
    return `          <a class="mcard" href="modeli/${kat.slug}.html">
            <div class="mcard__img"><img src="${kat.slika}" alt="${esc(kat.naziv)}, ${esc(kat.podnaslov.toLowerCase())}" loading="lazy" width="900" height="850"></div>
            <div class="mcard__overlay"></div>
            <div class="mcard__size">${broj ? broj + ' modela' : 'Po projektu'}</div>
            <div class="mcard__info">
              <span class="mcard__title">${esc(kat.naziv)}</span>
              <span class="mcard__price">${najniza ? esc(najniza) : 'Na upit'}</span>
            </div>
          </a>`;
  }).join('\n');

  const CHEV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';

  const faq = DATA.faq.map((f, i) =>
    `          <div class="acc__item">
            <button class="acc__q" aria-expanded="false" id="fq-${i}" aria-controls="fa-${i}">
              <span class="acc__n">${String(i + 1).padStart(2, '0')}</span>
              <span class="acc__t">${esc(f.p)}</span>
              <span class="acc__i">${CHEV}</span>
            </button>
            <div class="acc__a" id="fa-${i}" role="region" aria-labelledby="fq-${i}"><p>${esc(f.o)}</p></div>
          </div>`).join('\n');

  /* Sitewide LocalBusiness dolazi iz layout.js. Ovde idu samo cvorovi
     specificni za pocetnu: WebSite, FAQPage i lista kategorija. */
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'WebSite',
      '@id': SITE + '/#sajt', url: SITE + '/', name: 'M Designe Ivanjica',
      inLanguage: 'sr-Latn-RS', publisher: { '@id': SITE + '/#firma' }
    },
    L.faqLd(DATA.faq),
    {
      '@context': 'https://schema.org', '@type': 'ItemList',
      name: 'Kategorije montažnih objekata',
      itemListElement: DATA.kategorije.map((kat, i) => ({
        '@type': 'ListItem', position: i + 1, name: kat.naziv,
        url: SITE + '/modeli/' + kat.slug + '.html'
      }))
    }
  ];

  return head({
    title: 'Montažne i A-frame kuće, cene 2026 | M Designe Ivanjica',
    desc: 'Montažne i A-frame kuće, bungalovi, letnjikovci i dečja igrališta iz Ivanjice. 40 modela sa cenama od 1.390 €, od sive faze do ključa u ruke, u celoj Srbiji.',
    canonical: '', depth: 0, ogImage: 'images/brend/hero.jpg',
    preload: 'images/brend/hero.jpg',
    extraHead: ld.map(L.jsonld).join('')
  }) + `

  <!-- ===== HERO: video se odvija skrolom ===== -->
  <div class="hero-pin">
    <div class="hero-sticky">
      <section class="hero">
        <div class="hero__media">
          <video src="video/hero-scrub.mp4" poster="images/brend/hero.jpg" muted playsinline preload="auto" aria-label="Snimak A-frame kuće M Designe"></video>
        </div>
        <div class="wrap hero__top">
          <p class="eyebrow">M Designe Ivanjica // Kolekcija 2026</p>
        </div>
        <div class="wrap hero__bottom">
          <h1 data-split>Kuće koje se pamte</h1>
          <p>A-frame kuće, montažne kuće, bungalovi i letnjikovci. Četrdeset tipskih modela sa jasnom cenom, od sive faze do ključa u ruke.</p>
          <div class="btn-row">
            <a class="btn btn--primary" href="modeli.html">Pogledaj modele ${DOTS}</a>
            <a class="btn btn--light" href="tel:${K.telefonRaw}">${esc(K.telefon)}</a>
          </div>
        </div>
        <div class="hero__cue" aria-hidden="true"><span>Skrolujte</span><span class="track"></span></div>
      </section>
    </div>
  </div>

  <!-- ===== 01 // MODELI : horizontalni red ===== -->
  <div class="lineup" id="modeli">
    <div class="lineup__sticky">
      <div class="lineup__head">
        <div>
          <p class="eyebrow">01 // Modeli</p>
          <h2 data-split>Šest kategorija, jedan pogon</h2>
        </div>
        <a class="btn btn--light" href="modeli.html">Svi modeli i cene ${ARROW}</a>
      </div>
      <div class="lineup__row">
${lineup}
      </div>
    </div>
  </div>

  <!-- ===== 02 // OBIM : Spec_Grid_Section ===== -->
  <div class="asec">
    <div class="hblock">
      <p class="eyebrow">02 // OBIM PONUDE</p>
      <h2 data-split>Šta cena obuhvata, | a šta ne.</h2>
    </div>
    <div class="cgrid cgrid--4 cgrid--spec" style="margin-top:40px">
      <div class="cell ap">
        <span class="cell__n">20 cm</span>
        <p class="eyebrow">Izolacija krova //</p>
        <p>Standard je 20 cm staklene vune u krovu i 10 cm u zidovima, sa parnom branom i ventilisanim slojem. Premium ide na 25 i 15 cm.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">Ključ</span>
        <p class="eyebrow">U ruke //</p>
        <p>Instalacije, podovi, keramika, kupatilo i unutrašnja stolarija ulaze u paket. U sivoj fazi objekat je zatvoren spolja.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">90–120 €</span>
        <p class="eyebrow">Temelj po m² //</p>
        <p>Temelj se ne uračunava u cenu kuće jer zavisi od tla, nagiba i pristupa. Obračunava se posebno, prema geomehanici.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">Posebno</span>
        <p class="eyebrow">Dozvole i priključci //</p>
        <p>Projekat, dozvole, geodetski radovi, priključci struje i vode, kuhinja i nameštaj nisu deo cene objekta.</p>
      </div>
    </div>
    <p class="note" style="margin-top:40px">Pravilo je jednostavno: uključeno je samo ono što je imenovano, količinski određeno i opisano u konačnoj ponudi. Ako stavka nije navedena, ne smatra se automatski uključenom.</p>
  </div>

  <!-- ===== 03 // KVALITET : Bento_Grid ===== -->
  <section class="sec--dark">
    <div class="wrap">
      <span class="tab">03 // Kvalitet</span>
      <h2 data-split style="margin-top:24px;max-width:20ch">Bez improvizacije | bez površnog rada.</h2>
      <p style="margin-top:16px;max-width:62ch">Od prvog razgovora do realizacije, cilj nam je da klijent zna šta dobija i da bude siguran u proces izrade.</p>

      <div class="bento" style="margin-top:56px">
        <article class="bcard ap">
          <div class="bcard__img"><img src="images/sekcije/kvalitet-konstrukcija.png" alt="Drvena noseća konstrukcija sa pocinkovanim spojevima" loading="lazy" width="1535" height="1024"></div>
          <span class="bcard__badge">Konstrukcija</span>
          <div class="bcard__body">
            <h3 class="t-h4">Suva sortirana građa</h3>
            <ul>
              <li>Preseci potvrđeni statičkim proračunom</li>
              <li>Rogovi 10 × 12 cm na oko 60 cm</li>
              <li>Pocinkovane ploče, ugaonici i navojne šipke</li>
            </ul>
          </div>
        </article>

        <article class="bcard ap">
          <div class="bcard__img"><img src="images/sekcije/kvalitet-izolacija.png" alt="Presek krova sa termoizolacijom, parnom branom i pokrivkom" loading="lazy" width="1535" height="1024"></div>
          <span class="bcard__badge">Izolacija</span>
          <div class="bcard__body">
            <h3 class="t-h4">Krov 20, zid 10 cm</h3>
            <ul>
              <li>Parna brana sa zalepljenim preklopima</li>
              <li>Paropropusna krovna folija i ventilisani sloj</li>
              <li>Premium nadogradnja na 25 i 15 cm</li>
            </ul>
          </div>
        </article>

        <article class="bcard ap">
          <div class="bcard__img"><img src="images/sekcije/kvalitet-stolarija.png" alt="Profili PVC i ALU stolarije sa termoizolacionim staklom" loading="lazy" width="1535" height="1024"></div>
          <span class="bcard__badge">Stolarija</span>
          <div class="bcard__body">
            <h3 class="t-h4">PVC standard, ALU po ponudi</h3>
            <ul>
              <li>Termoizolaciono staklo prema otvoru</li>
              <li>Kaljena i laminirana stakla po projektu</li>
              <li>Klizni sistemi i troslojno staklo kao doplata</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- ===== 04 // PROCES : Process_Section ===== -->
  <div class="proc">
    <div class="proc__left">
      <p class="eyebrow">04 // PROCES</p>
      <h2 data-split>Od upita | do useljenja.</h2>
      <p>Svaki korak se zaključava pre prelaska na sledeći, tako da nema nejasnoća oko cene i obima. Rok se potvrđuje ugovorom nakon usaglašavanja modela, lokacije i specifikacije.</p>
    </div>
    <div class="proc__right">
        <div class="pstep ap">
          <p class="pstep__n">Korak 01 //</p>
          <div class="pstep__img"><img src="images/sekcije/proces-01.png" alt="Osnove i preseci objekta u fazi analize potreba" loading="lazy" width="1600" height="1218"></div>
          <h4>Lokacija i potrebe</h4>
          <p>Analiziramo parcelu, pristup, namenu, željeni kapacitet i budžet. Ovaj razgovor određuje sve što sledi, od tipa temelja do izbora modela i nivoa opreme.</p>
        </div>
        <div class="pstep ap">
          <p class="pstep__n">Korak 02 //</p>
          <div class="pstep__img"><img src="images/sekcije/proces-02.png" alt="Trodimenzionalni model A-frame kuće sa rasporedom prostorija" loading="lazy" width="1600" height="1280"></div>
          <h4>Model i specifikacija</h4>
          <p>Biramo tipski model i precizno evidentiramo sve izmene i nivo opreme, stavku po stavku. Izmene pre zaključavanja projekta su najjednostavnije i najjeftinije.</p>
        </div>
        <div class="pstep ap">
          <p class="pstep__n">Korak 03 //</p>
          <div class="pstep__img"><img src="images/sekcije/proces-03.png" alt="Materijal pripremljen za proizvodnju objekta" loading="lazy" width="1536" height="1024"></div>
          <h4>Priprema i proizvodnja</h4>
          <p>Nabavka materijala, priprema elemenata u pogonu i koordinacija temelja sa instalacijama. Elementi se izrađuju prema usaglašenom projektu.</p>
        </div>
        <div class="pstep ap">
          <p class="pstep__n">Korak 04 //</p>
          <div class="pstep__img"><img src="images/sekcije/proces-04.png" alt="Završena A-frame kuća sa osvetljenim enterijerom" loading="lazy" width="1024" height="1536"></div>
          <h4>Montaža i primopredaja</h4>
          <p>Konstrukcija, zatvaranje, instalacije i završna obrada po izabranom paketu. Zatim zajednički pregled, zapisnik i predaja dokumentacije.</p>
        </div>
    </div>
  </div>

  <!-- ===== 05 // BROJEVI : Metrics_Grid ===== -->
  <section class="sec--dark">
    <div class="wrap">
      <span class="tab">05 // Brojevi</span>
      <h2 data-split style="margin-top:24px;max-width:18ch">Iza posla stoje konkretne cifre</h2>

      <div class="metrics" style="margin-top:56px">
        <div class="metric ap"><div class="metric__n">20+</div><div class="metric__l">Završenih projekata</div></div>
        <div class="metric ap"><div class="metric__n">4+</div><div class="metric__l">Godine iskustva</div></div>
        <div class="metric ap"><div class="metric__n">40</div><div class="metric__l">Tipskih modela</div></div>
        <div class="metric ap"><div class="metric__n">2.500+</div><div class="metric__l">Pratilaca na Instagramu</div></div>
      </div>

      <div class="certstrip" style="margin-top:64px">
        <div><span class="v">Cela Srbija</span><span class="l">Područje rada</span></div>
        <div><span class="v">24 sata</span><span class="l">Rok za odgovor</span></div>
        <div><span class="v">3 kataloga</span><span class="l">Dostupno za preuzimanje</span></div>
      </div>
    </div>
  </section>

  <!-- ===== FAQ ===== -->
  <section class="sec--faq">
    <div class="wrap">
      <div class="two-col">
        <div class="two-col__left">
          <span class="tab">FAQ</span>
          <h2 data-split>Pitanja koja obično dobijamo</h2>
          <div class="cta-box">
            <p>Imate još pitanja?</p>
            <p>Tu smo da olakšamo posao. Javite se slobodno.</p>
            <a class="btn btn--light" href="kontakt.html">Kontaktirajte nas</a>
          </div>
        </div>
        <div class="two-col__right">
          <div class="acc">
${faq}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ===== CTA : puna visina ===== -->
  <section class="cta-full">
    <p class="eyebrow">Sledeći korak</p>
    <h2 data-split>Započnite izgradnju</h2>
    <p>Pošaljite lokaciju, željenu kvadraturu, broj korisnika i okvirni budžet. Predložićemo model i strukturu ponude.</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="kontakt.html">Pošalji upit ${ARROW}</a>
      <a class="btn btn--light" href="tel:${K.telefonRaw}">${esc(K.telefon)}</a>
    </div>
  </section>
` + FOOT(0);
};
