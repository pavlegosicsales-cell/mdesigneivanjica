/* ==========================================================================
   Staticke stranice. Svaka koristi raspored svoje sekcije sa referentnog sajta.
   ========================================================================== */

module.exports = function (DATA, L, FOOT) {
  const K = DATA.kontakt;
  const { esc, ARROW } = L;
  const P = {};

  /* =================================================================
     MODELI   (Header_Section + kartice + Spec_Grid paketa + katalozi)
     ================================================================= */
  const katKartice = DATA.kategorije.map(kat => {
    const broj = DATA.modeli.filter(m => m.kategorija === kat.slug).length;
    const najniza = DATA.modeli.filter(m => m.kategorija === kat.slug)
      .map(m => m.cene && m.cene[0] ? m.cene[0].iznos : null).filter(Boolean)[0];
    return `        <article class="gcard ap">
          <div class="gcard__img"><img src="${kat.slika}" alt="${esc(kat.naziv)}, ${esc(kat.podnaslov.toLowerCase())}" loading="lazy" width="900" height="850"></div>
          <div class="gcard__overlay"></div>
          <div class="gcard__meta">${broj ? broj + ' modela' : 'Po projektu'}</div>
          <div class="gcard__row">
            <span class="gcard__title">${esc(kat.naziv)}</span>
            <span class="gcard__price">${najniza ? esc(najniza) : 'Na upit'}</span>
          </div>
          <a class="gcard__link" href="modeli/${kat.slug}.html" aria-label="Pogledaj ${esc(kat.naziv)}"></a>
        </article>`;
  }).join('\n');

  P['modeli.html'] = {
    title: 'Modeli i cene 2026, A-frame i montažne kuće | M Designe',
    desc: 'Četrdeset tipskih modela sa cenama: A-frame kuće, montažne kuće, bungalovi, letnjikovci, pergole i dečja igrališta. Od sive faze do ključa u ruke.',
    ogImage: 'images/objekti/aframe-dizajn.png',
    body: `
  <div class="phead">
    <div class="phead__main">
      <span class="tab">Kolekcija 2026</span>
      <h1 data-split>Modeli i cene</h1>
    </div>
    <div class="phead__side">
      <p>Četrdeset tipskih modela u šest kategorija. Svaki model ima svoju stranicu sa dimenzijama, rasporedom, paketima, cenom i doplatama.</p>
      <div class="btn-row" style="margin-top:24px">
        <a class="btn btn--primary" href="kontakt.html">Zatraži ponudu ${ARROW}</a>
      </div>
    </div>
  </div>

  <section class="sec--dark" style="padding:0">
    <div class="fullgrid">
${katKartice}
    </div>
  </section>

  <div class="asec">
    <div class="hblock">
      <p class="eyebrow">Nivoi_Izvodjenja</p>
      <h2 data-split>Kako se objekat | predaje.</h2>
    </div>
    <div class="cgrid" style="margin-top:40px">
      <div class="cell ap">
        <div class="cell__img"><img src="images/objekti/aframe-terasa.png" alt="Objekat u sivoj fazi, zatvoren spolja" loading="lazy" width="900" height="675"></div>
        <h4>01 // Siva faza</h4>
        <p>Noseća konstrukcija, krovni sklop, spoljno zatvaranje objekta, termoizolacioni slojevi prema paketu, fasadni sistem i ugovorena spoljna stolarija. Objekat je spolja završen i spreman za nastavak instalacija i završnih radova.</p>
      </div>
      <div class="cell ap">
        <div class="cell__img"><img src="images/objekti/montazna-moderna.png" alt="Useljiva montažna kuća, ključ u ruke" loading="lazy" width="900" height="675"></div>
        <h4>02 // Ključ u ruke</h4>
        <p>Pored sive faze obuhvata unutrašnje obloge, osnovne elektro i vodovodne instalacije, podove, keramiku, unutrašnja vrata, osnovne sanitarije i završno krečenje. Najčešći izbor kod porodičnih objekata.</p>
      </div>
      <div class="cell ap">
        <div class="cell__img"><img src="images/objekti/aframe-minimal.png" alt="Premium nivo opreme i završne obrade" loading="lazy" width="900" height="675"></div>
        <h4>03 // Comfort i Premium</h4>
        <p>Viši nivo izolacije, završnih obloga, stolarije i opreme. Konačna specifikacija se formira prema željenom energetskom nivou, dizajnu i budžetu kupca, uz limite završnih materijala ugovorene unapred.</p>
      </div>
    </div>
    <p class="note" style="margin-top:40px">Konačna specifikacija u ugovoru ima prednost nad katalogom. Sve cene na sajtu su početne i informativne, i ne predstavljaju konačnu ponudu.</p>
  </div>

  <section class="sec--faq">
    <div class="wrap">
      <div class="two-col">
        <div class="two-col__left">
          <span class="tab">Katalozi</span>
          <h2 data-split>Preuzmite PDF</h2>
          <p>Isti sadržaj koji je na sajtu, u formatu koji možete poslati dalje ili odštampati.</p>
        </div>
        <div class="two-col__right">
          <div class="miles">
            <div class="mile"><div class="mile__y">A-FRAME</div><div class="mile__b"><h4>A-frame kuće 2026</h4><p>Deset modela, tehnički sistem, paketi, doplate i opremanje.</p><div class="btn-row" style="margin-top:8px"><a class="btn btn--outline" href="katalozi/m-designe-a-frame-katalog-2026.pdf" target="_blank" rel="noopener">Preuzmi PDF</a></div></div></div>
            <div class="mile"><div class="mile__y">MONTAŽNE</div><div class="mile__b"><h4>Montažne kuće 2026</h4><p>Osam prizemnih modela od 24 do 150 m², sa osnovama i cenama.</p><div class="btn-row" style="margin-top:8px"><a class="btn btn--outline" href="katalozi/m-designe-montazne-kuce-katalog-2026.pdf" target="_blank" rel="noopener">Preuzmi PDF</a></div></div></div>
            <div class="mile"><div class="mile__y">OUTDOOR</div><div class="mile__b"><h4>Outdoor Collection 2026</h4><p>Letnjikovci, pergole, bungalovi i dečja igrališta.</p><div class="btn-row" style="margin-top:8px"><a class="btn btn--outline" href="katalozi/m-designe-outdoor-collection-2026.pdf" target="_blank" rel="noopener">Preuzmi PDF</a></div></div></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta-full">
    <p class="eyebrow">Pomoć pri izboru</p>
    <h2 data-split>Ne znate koji model?</h2>
    <p>Odgovorite na nekoliko pitanja i predložićemo model koji odgovara vašoj parceli, broju korisnika i budžetu.</p>
    <div class="btn-row"><a class="btn btn--primary" href="kontakt.html">Pokreni upit ${ARROW}</a></div>
  </section>`
  };

  /* =================================================================
     O NAMA   (Header_Section + Metrics + Panels + Milestones + CTA)
     ================================================================= */
  /* =================================================================
     GALERIJA   (Lookbook raspored)
     ================================================================= */
  const gal = [
    ['images/objekti/aframe-dizajn.png', 'a-frame', 'A-frame sa staklenom fasadom'],
    ['images/objekti/aframe-terasa.png', 'a-frame', 'A-frame sa drvenom terasom'],
    ['images/objekti/aframe-minimal.png', 'a-frame', 'Minimalistički A-frame'],
    ['images/objekti/aframe-bazen.png', 'a-frame', 'A-frame sa bazenom'],
    ['images/objekti/montazna-moderna.png', 'montazne', 'Moderna montažna kuća'],
    ['images/objekti/montazna-trem.png', 'montazne', 'Montažna kuća sa tremom'],
    ['images/objekti/vikendica.png', 'bungalovi', 'Bungalov za odmor'],
    ['images/objekti/letnjikovac.png', 'letnjikovci', 'Drveni letnjikovac'],
    ['images/objekti/dome.png', 'ostalo', 'Objekat po želji kupca']
  ];

  P['galerija.html'] = {
    title: 'Galerija objekata | M Designe Ivanjica',
    desc: 'Pogledajte A-frame kuće, montažne kuće, bungalove i letnjikovce koje izrađuje M Designe Ivanjica. Prikazi modela i izvedeni projekti.',
    ogImage: 'images/objekti/aframe-bazen.png',
    body: `
  <div class="phead">
    <div class="phead__main">
      <span class="tab">Galerija</span>
      <h1 data-split>Naši objekti</h1>
    </div>
    <div class="phead__side">
      <p>Prikazi pokazuju stil, proporcije i mogućnosti završne obrade. Merodavni su ugovor, projekat, specifikacija i odobreni uzorci.</p>
    </div>
  </div>

  <section class="sec--dark" style="padding-top:80px">
    <div class="wrap">
      <div class="filters" style="margin-bottom:40px" role="group" aria-label="Filter galerije">
        <button class="filter-btn is-active" data-filter="sve">Sve</button>
        <button class="filter-btn" data-filter="a-frame">A-frame</button>
        <button class="filter-btn" data-filter="montazne">Montažne</button>
        <button class="filter-btn" data-filter="bungalovi">Bungalovi</button>
        <button class="filter-btn" data-filter="letnjikovci">Letnjikovci</button>
        <button class="filter-btn" data-filter="ostalo">Po želji</button>
      </div>
      <div class="grid grid--3">
${gal.map(([src, cat, cap]) => `        <article class="gcard ap" data-cat="${cat}">
          <div class="gcard__img"><img src="${src}" alt="${cap}" loading="lazy" width="900" height="850"></div>
          <div class="gcard__overlay"></div>
          <div class="gcard__row"><span class="gcard__title">${cap}</span></div>
        </article>`).join('\n')}
      </div>
    </div>
  </section>

  <section class="cta-full">
    <p class="eyebrow">Sviđa vam se?</p>
    <h2 data-split>Dopada vam se neki model?</h2>
    <p>Pošaljite nam skicu, inspiraciju ili fotografiju željenog objekta, pa ćemo predložiti rešenje i dalje korake.</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="kontakt.html">Pošalji upit ${ARROW}</a>
      <a class="btn btn--light" href="modeli.html">Svi modeli i cene</a>
    </div>
  </section>`
  };

  /* =================================================================
     KONTAKT   (Header centriran + Form_Section red)
     ================================================================= */
  const katIzbor = DATA.kategorije.map(k =>
    `                  <button type="button" class="choice" data-value="${k.slug}" aria-pressed="false">
                    <span class="choice__t">${esc(k.naziv)}</span>
                    <span class="choice__s">${esc(k.podnaslov)}</span>
                  </button>`).join('\n');

  /* =================================================================
     PRIVATNOST
     ================================================================= */
  const danas = new Date().toLocaleDateString('sr-RS', { day: 'numeric', month: 'long', year: 'numeric' });

  P['privatnost.html'] = {
    title: 'Politika privatnosti | M Designe Ivanjica',
    desc: 'Kako M Designe Ivanjica prikuplja i koristi podatke koje ostavite putem kontakt forme. Podaci se koriste isključivo za odgovor na vaš upit.',
    ogImage: 'images/brend/logo.png',
    body: `
  <div class="phead">
    <div class="phead__main">
      <span class="tab">Pravno</span>
      <h1 data-split>Politika privatnosti</h1>
    </div>
    <div class="phead__side"><p>Poslednja izmena: ${danas}.</p></div>
  </div>

  <section style="padding-top:40px">
    <div class="wrap">
      <div class="prose">
        <h2>Koje podatke prikupljamo</h2>
        <p>Kada popunite obrazac za upit na ovom sajtu, prikupljamo podatke koje sami unesete: ime i prezime, broj telefona, email adresu, opcionu poruku, kao i odgovore koje ste izabrali o tipu objekta, veličini, paketu, lokaciji i planiranom roku.</p>
        <h2>Zašto ih koristimo</h2>
        <p>Isključivo da bismo odgovorili na vaš upit, pripremili predlog modela i ponudu, i sa vama komunicirali o tom poslu. Ne koristimo vaše podatke za slanje reklamnih poruka bez vaše saglasnosti.</p>
        <h2>Čuvanje i prosleđivanje</h2>
        <p>Podatke ne prodajemo i ne ustupamo trećim licima u marketinške svrhe. Podaci iz obrasca stižu na našu poslovnu email adresu i čuvaju se u našoj evidenciji upita.</p>
        <h2>Koliko dugo ih čuvamo</h2>
        <p>Podatke iz upita čuvamo onoliko koliko je potrebno da odgovorimo i, ako dođe do saradnje, koliko nalažu poslovni i zakonski propisi. Ako do saradnje ne dođe, upit brišemo na vaš zahtev.</p>
        <h2>Vaša prava</h2>
        <p>Imate pravo da zatražite uvid u podatke koje o vama imamo, njihovu ispravku ili brisanje. Zahtev pošaljite na <a href="mailto:${K.email}" style="color:var(--accent)">${esc(K.email)}</a> ili nas pozovite na <a href="tel:${K.telefonRaw}" style="color:var(--accent)">${esc(K.telefon)}</a>.</p>
        <h2>Kolačići</h2>
        <p>Sajt ne koristi kolačiće za praćenje u reklamne svrhe. Ako u budućnosti uvedemo alate za analitiku posećenosti, ova stranica će biti dopunjena pre nego što oni budu aktivirani.</p>
        <h2>Kontakt</h2>
        <p>${esc(K.firma)}, ${esc(K.mesto)}<br>Telefon: <a href="tel:${K.telefonRaw}" style="color:var(--accent)">${esc(K.telefon)}</a><br>Email: <a href="mailto:${K.email}" style="color:var(--accent)">${esc(K.email)}</a></p>
      </div>
    </div>
  </section>`
  };

  return P;
};
