/* ==========================================================================
   GALERIJA
   Dve vrste sadrzaja, jasno razdvojene znackom na kartici:
   fotografije izvedenih objekata i sa gradilista, i prikazi modela (renderi).
   Marko je trazio da se to ne mesa.

   Svaka stavka moze da pripada vise filtera, zato je cat lista reci.
   ========================================================================== */

module.exports = function (DATA, L) {
  const K = DATA.kontakt;
  const { esc, ARROW, SITE, crumbsLd, jsonld } = L;

  const G = 'images/galerija/';

  /* [putanja, filteri, opis, tip]  tip: foto | snimak | render */
  const stavke = [
    /* --- izvedeni objekti --- */
    [G + 'a-frame-kuca-na-livadi.webp', ['izvedeno', 'a-frame'], 'Izvedena A-frame kuća sa drvenom terasom', 'foto'],
    [G + 'a-frame-sa-bazenom-nocu.webp', ['izvedeno', 'a-frame'], 'A-frame kuća sa bazenom, večernje osvetljenje', 'foto'],
    [G + 'a-frame-sa-hot-tubom.webp', ['izvedeno', 'a-frame'], 'A-frame kuća sa drvenom kadom u dvorištu', 'foto'],
    [G + 'a-frame-staklena-fasada.webp', ['izvedeno', 'a-frame'], 'Staklena fasada A-frame kuće, detalj stolarije', 'foto'],
    [G + 'a-frame-enterijer-ulaz.webp', ['izvedeno', 'a-frame'], 'Enterijer A-frame kuće, ulazna zona u drvetu', 'foto'],
    [G + 'a-frame-enterijer-stepenice.webp', ['izvedeno', 'a-frame'], 'Enterijer sa stepenicama za galeriju', 'foto'],
    [G + 'a-frame-galerija-prozor.webp', ['izvedeno', 'a-frame'], 'Galerija za spavanje sa trougaonim prozorom', 'foto'],
    [G + 'a-frame-izlaz-na-terasu.webp', ['izvedeno', 'a-frame'], 'Izlaz na terasu iz dnevne zone', 'foto'],
    [G + 'a-frame-stakleni-zabat.webp', ['izvedeno', 'a-frame'], 'Stakleni zabat A-frame kuće iznutra', 'foto'],
    [G + 'a-frame-enterijer-drvo.webp', ['izvedeno', 'a-frame'], 'Drvena obloga krovne ravni u enterijeru', 'foto'],
    [G + 'letnjikovac-drveni-sa-tremom.webp', ['izvedeno', 'letnjikovci'], 'Izveden drveni letnjikovac sa tremom', 'foto'],
    [G + 'letnjikovac-terasa-namestaj.webp', ['izvedeno', 'letnjikovci'], 'Natkrivena terasa letnjikovca sa nameštajem', 'foto'],
    [G + 'letnjikovac-sa-ljuljaskom.webp', ['izvedeno', 'letnjikovci'], 'Letnjikovac uređen za sedenje i odmor', 'foto'],
    [G + 'letnjikovac-spolja.webp', ['izvedeno', 'letnjikovci'], 'Letnjikovac sa drvenim stubovima, spoljni pogled', 'foto'],

    /* --- montaza, temelji i gradiliste --- */
    ['video/galerija/montaza-timelapse.mp4', ['izvedeno', 'montaza', 'a-frame'], 'Montaža A-frame kuće, od iskopa do konstrukcije', 'snimak', G + 'poster-montaza-timelapse.webp'],
    [G + 'temelj-ab-ploca-gradiliste.webp', ['izvedeno', 'montaza'], 'Armiranobetonska ploča izlivena na parceli', 'foto'],
    [G + 'temelj-oplata.webp', ['izvedeno', 'montaza'], 'Oplata temelja pre betoniranja', 'foto'],
    [G + 'temelj-blokovi.webp', ['izvedeno', 'montaza'], 'Zidani sokl sa pripremom za instalacije', 'foto'],
    [G + 'temelj-zidani-sokl.webp', ['izvedeno', 'montaza'], 'Temeljni zid na kosom terenu', 'foto'],
    [G + 'montaza-podizanje-rama.webp', ['izvedeno', 'montaza', 'a-frame'], 'Podizanje prvog A rama na ploču', 'foto'],
    [G + 'montaza-prvi-ramovi.webp', ['izvedeno', 'montaza', 'a-frame'], 'Sklapanje ramova na gradilištu', 'foto'],
    [G + 'montaza-rogovi-niz.webp', ['izvedeno', 'montaza', 'a-frame'], 'Niz rogova postavljen na razmaku iz proračuna', 'foto'],
    [G + 'montaza-rogovi-sa-strane.webp', ['izvedeno', 'montaza', 'a-frame'], 'Konstrukcija A-frame kuće u punoj dužini', 'foto'],
    [G + 'montaza-krovna-konstrukcija.webp', ['izvedeno', 'montaza', 'a-frame'], 'Krovna konstrukcija pred zatvaranje', 'foto'],
    [G + 'montaza-detalj-konstrukcije.webp', ['izvedeno', 'montaza'], 'Detalj spoja krovne i podne konstrukcije', 'foto'],
    [G + 'montaza-konstrukcija-iznutra.webp', ['izvedeno', 'montaza'], 'Pogled na konstrukciju iznutra tokom radova', 'foto'],
    [G + 'montaza-enterijer-konstrukcija.webp', ['izvedeno', 'montaza'], 'Unutrašnja obloga krovnih ravni u toku', 'foto'],
    [G + 'montaza-unutrasnji-radovi.webp', ['izvedeno', 'montaza'], 'Unutrašnji radovi pre završne obrade', 'foto'],
    [G + 'montaza-stakleni-zabat.webp', ['izvedeno', 'montaza', 'a-frame'], 'Priprema otvora za stakleni zabat', 'foto'],
    [G + 'montaza-zidni-paneli.webp', ['izvedeno', 'montaza'], 'Postavljanje zidnih panela montažnog objekta', 'foto'],
    [G + 'montaza-fasadna-folija.webp', ['izvedeno', 'montaza'], 'Paropropusna folija i letve pre fasade', 'foto'],
    [G + 'montaza-fasadna-obloga.webp', ['izvedeno', 'montaza', 'a-frame'], 'Fasadna obloga krovne ravni', 'foto'],
    [G + 'montaza-zavrsna-faza.webp', ['izvedeno', 'montaza', 'a-frame'], 'Objekat u završnoj fazi na parceli', 'foto'],

    /* --- prikazi modela --- */
    ['video/galerija/montazna-kuca-prikaz.mp4', ['renderi', 'montazne'], 'Prikaz montažne kuće sa tremom', 'render', G + 'poster-montazna-kuca.webp'],
    ['images/objekti/aframe-dizajn.png', ['renderi', 'a-frame'], 'A-frame sa staklenom fasadom', 'render'],
    ['images/objekti/aframe-terasa.png', ['renderi', 'a-frame'], 'A-frame sa drvenom terasom', 'render'],
    ['images/objekti/aframe-minimal.png', ['renderi', 'a-frame'], 'Minimalistički A-frame', 'render'],
    ['images/objekti/aframe-bazen.png', ['renderi', 'a-frame'], 'A-frame sa bazenom', 'render'],
    ['images/objekti/montazna-moderna.png', ['renderi', 'montazne'], 'Moderna montažna kuća', 'render'],
    ['images/objekti/montazna-trem.png', ['renderi', 'montazne'], 'Montažna kuća sa tremom', 'render'],
    ['images/objekti/vikendica.png', ['renderi', 'bungalovi'], 'Bungalov za odmor', 'render'],
    ['images/objekti/letnjikovac.png', ['renderi', 'letnjikovci'], 'Drveni letnjikovac', 'render'],
    ['images/objekti/igraliste.png', ['renderi', 'igralista'], 'Dečje igralište od drveta', 'render'],
    ['images/objekti/dome.png', ['renderi'], 'Objekat po želji kupca', 'render']
  ];

  const ZNACKA = { foto: 'Izvedeno', snimak: 'Snimak sa gradilišta', render: 'Prikaz modela' };

  const FILTERI = [
    ['sve', 'Sve'],
    ['izvedeno', 'Izvedeni objekti'],
    ['montaza', 'Montaža i temelji'],
    ['a-frame', 'A-frame'],
    ['letnjikovci', 'Letnjikovci'],
    ['montazne', 'Montažne'],
    ['renderi', 'Prikazi modela']
  ];

  const kartica = ([src, cats, opis, tip, poster]) => {
    const jeVideo = src.slice(-4) === '.mp4';
    const medij = jeVideo
      ? `<video src="${src}" poster="${poster}" controls preload="none" playsinline aria-label="${esc(opis)}"></video>`
      : `<img src="${src}" alt="${esc(opis)}" loading="lazy" width="900" height="850">`;
    return `        <article class="gcard ap${jeVideo ? ' gcard--video' : ''}" data-cat="${cats.join(' ')}">
          <div class="gcard__img">${medij}</div>
          <div class="gcard__overlay"></div>
          <div class="gcard__meta">${ZNACKA[tip]}</div>
          <div class="gcard__row"><span class="gcard__title">${esc(opis)}</span></div>
        </article>`;
  };

  const brFoto = stavke.filter(s => s[3] === 'foto' || s[3] === 'snimak').length;

  /* za sitemap: sve fotografije sa opisom */
  const slike = stavke.filter(x => x[0].slice(-4) !== '.mp4').map(x => [x[0], x[2]]);

  return {
    slike,
    title: 'Galerija izvedenih objekata i montaže | M Designe',
    desc: `${brFoto} fotografija izvedenih A-frame kuća, letnjikovaca i gradilišta iz proizvodnje M Designe Ivanjica, od temelja do useljive kuće, plus prikazi tipskih modela.`,
    ogImage: 'images/galerija/a-frame-kuca-na-livadi.webp',
    preload: 'images/galerija/a-frame-kuca-na-livadi.webp',
    extraHead: [
      crumbsLd([['Početna', 'index.html'], ['Galerija', 'galerija.html']]),
      {
        '@context': 'https://schema.org', '@type': 'ImageGallery',
        name: 'Galerija M Designe Ivanjica',
        url: SITE + '/galerija.html',
        about: { '@id': SITE + '/#firma' },
        associatedMedia: stavke.filter(s => s[3] !== 'snimak' && !s[0].endsWith('.mp4')).map(s => ({
          '@type': 'ImageObject',
          contentUrl: SITE + '/' + s[0],
          caption: s[2],
          representativeOfPage: s[0].indexOf('a-frame-kuca-na-livadi') > -1 || undefined
        }))
      }
    ].map(jsonld).join(''),

    body: `
  <div class="phead">
    <div class="phead__main">
      <span class="tab">Galerija</span>
      <h1 data-split>Izvedeni objekti i montaža</h1>
    </div>
    <div class="phead__side">
      <p>Fotografije sa naših gradilišta i gotovih objekata, od temelja i konstrukcije do useljive kuće. Prikazi tipskih modela su posebno označeni, da se ne mešaju sa izvedenim radovima. Merodavni su ugovor, projekat, specifikacija i odobreni uzorci.</p>
      <div class="btn-row" style="margin-top:24px">
        <a class="btn btn--primary" href="kontakt.html">Zatraži ponudu ${ARROW}</a>
        <a class="btn btn--outline" href="cenovnik.html">Cenovnik 2026</a>
      </div>
    </div>
  </div>

  <section class="sec--dark" style="padding-top:80px">
    <div class="wrap">
      <div class="filters" style="margin-bottom:40px" role="group" aria-label="Filter galerije">
${FILTERI.map(([f, t], i) => `        <button class="filter-btn${i === 0 ? ' is-active' : ''}" data-filter="${f}" aria-pressed="${i === 0}">${t}</button>`).join('\n')}
      </div>
      <div class="grid grid--3">
${stavke.map(kartica).join('\n')}
      </div>
      <p class="note" style="margin-top:48px">Fotografije prikazuju objekte u različitim fazama izvođenja i nivoima opreme. Izgled konkretnog objekta zavisi od izabranog modela, paketa i doplata iz ponude.</p>
    </div>
  </section>

  <section class="cta-full">
    <p class="eyebrow">Sviđa vam se?</p>
    <h2 data-split>Dopada vam se neki objekat?</h2>
    <p>Pošaljite nam skicu, inspiraciju ili fotografiju željenog objekta, pa ćemo predložiti rešenje i dalje korake.</p>
    <div class="btn-row">
      <a class="btn btn--primary" href="kontakt.html">Pošalji upit ${ARROW}</a>
      <a class="btn btn--light" href="modeli.html">Svi modeli i cene</a>
    </div>
  </section>`
  };
};
