/* ==========================================================================
   O NAMA
   Struktura je 1:1 sa About stranom referentnog sajta:
   Header_Section  ->  eyebrow + h1 levo, dva pasusa desno
   ECO-MATRIX      ->  3 celije sa brojem, oznakom i opisom
   LAND PREP GUIDE ->  Header_Block + 3 celije sa slikom  (kod nas: temelji)
   MARKET DASHBOARD->  traka oznaka + Header_Block + Metrics  (kod nas: paketi)
   BUILD PATHS     ->  Header_Block + 4 celije sa slikom i sparkline trakama
   TRUST COMPLIANCE->  Header_Block + levo checklist, desno milestones + kartica
   CLOSING CTA     ->  tamna, centrirana
   ========================================================================== */

module.exports = function (DATA, L, FOOT) {
  const K = DATA.kontakt;
  const { head, esc, ARROW } = L;

  const spark = (l, p) => `          <div class="spark"><span class="spark__l">${l}</span><span class="spark__t"><span style="width:${p}%"></span></span></div>`;

  const oznake = ['A-FRAME KUĆE', 'MONTAŽNE KUĆE', 'BUNGALOVI', 'LETNJIKOVCI', 'PERGOLE', 'DEČJA IGRALIŠTA', 'RESORT OBJEKTI'];
  const traka = oznake.map(o => `<p>${o}</p>`).join('');

  return head({
    title: 'O nama: proizvodnja montažnih kuća u Ivanjici | M Designe',
    desc: 'M Designe iz Ivanjice projektuje, proizvodi i montira A-frame kuće, montažne kuće, bungalove i letnjikovce. Preko dvadeset izvedenih objekata i četiri godine rada.',
    canonical: 'o-nama.html', depth: 0, ogImage: 'images/objekti/aframe-terasa.png',
    preload: 'images/objekti/aframe-terasa.png',
    extraHead: [
      L.crumbsLd([['Početna', 'index.html'], ['O nama', 'o-nama.html']]),
      { '@context': 'https://schema.org', '@type': 'AboutPage',
        url: L.SITE + '/o-nama.html', name: 'O nama, M Designe Ivanjica',
        mainEntity: { '@id': L.SITE + '/#firma' } }
    ].map(L.jsonld).join('')
  }) + `

  <!-- ===== Header_Section ===== -->
  <div class="phead">
    <div class="phead__main">
      <p class="eyebrow">// PROIZVODNJA I MONTAŽA</p>
      <h1 data-split>Pravimo u pogonu. Isporučujemo završeno.</h1>
    </div>
    <div class="phead__side">
      <p class="t-18">M Designe Ivanjica projektuje, proizvodi i montira A-frame kuće, montažne objekte, letnjikovce, pergole, bungalove i drvene sadržaje za dvorišta i turističke komplekse.</p>
      <p class="t-18" style="margin-top:16px">Svaki posao prolazi kroz jasnu specifikaciju, potvrdu mera i dogovoreni paket opreme. Verujemo da kvalitetna gradnja počinje dobrim dogovorom.</p>
    </div>
  </div>

  <!-- ===== ECO-MATRIX STATS ===== -->
  <div class="asec">
    <div class="cgrid">
      <div class="cell ap">
        <span class="cell__n">20+</span>
        <p class="eyebrow">IZVEDENIH OBJEKATA //</p>
        <p>Objekti izvedeni na različitim terenima i u različitim uslovima, od dvorišnih letnjikovaca do porodičnih kuća.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">40</span>
        <p class="eyebrow">TIPSKIH MODELA //</p>
        <p>Šest kategorija sa definisanim dimenzijama, rasporedom i cenom, koje se dalje prilagođavaju parceli i potrebama.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">4+</span>
        <p class="eyebrow">GODINE RADA //</p>
        <p>Od prvog razgovora do primopredaje, proces je isti za svaki objekat: specifikacija, potvrda, izvođenje, zapisnik.</p>
      </div>
    </div>
  </div>

  <!-- ===== TEMELJI  (LAND PREPARATION GUIDE) ===== -->
  <div class="asec">
    <div class="hblock">
      <p class="eyebrow">Temeljenje_Sistemi</p>
      <h2 data-split>Kako vaša kuća naleže.</h2>
    </div>
    <div class="cgrid" style="margin-top:40px">
      <div class="cell ap">
        <div class="cell__img"><img src="images/sekcije/temelj-ab-ploca.jpg" alt="Armiranobetonska ploča sa ankerima za montažni objekat" loading="lazy" width="1600" height="900"></div>
        <h4>01 // Armiranobetonska ploča</h4>
        <p>Za ravan ili pripremljen teren sa ravnomernim oslanjanjem. Daje brzu i čistu podnu zonu. Traži iskop, tampon, drenažu i debljinu prema projektu. Orijentaciono 90 do 120 € po m² osnove.</p>
      </div>
      <div class="cell ap">
        <div class="cell__img"><img src="images/sekcije/temelj-trakasti.jpg" alt="Trakasti temelji sa ankerima, pripremljeni za montažu" loading="lazy" width="1536" height="1024"></div>
        <h4>02 // Trakasti temelji</h4>
        <p>Klasično temeljenje na nosivom tlu. Fleksibilno za različite osnove i rasporede, ali zahteva precizno izvođenje zidova i serklaža prema statičkom proračunu.</p>
      </div>
      <div class="cell ap">
        <div class="cell__img"><img src="images/sekcije/temelj-grede-stubovi.jpg" alt="Konstrukcija na gredama i stubovima, bez pune ploče" loading="lazy" width="1200" height="1600"></div>
        <h4>03 // Grede i stubovi</h4>
        <p>Za nagib ili kada treba smanjiti obim iskopa. Manje zemljanih radova, koristi konfiguraciju parcele. Obavezna statika, ukrućenje i kontrola oslonaca.</p>
      </div>
    </div>
  </div>

  <!-- ===== PAKETI  (MARKET DASHBOARD) ===== -->
  <div class="asec asec--dark">
    <div class="logorow">
      <h4 style="color:var(--peach)">Šta proizvodimo</h4>
      <div class="logorow__t">${traka}${traka}</div>
    </div>

    <div class="hblock" style="margin-top:48px">
      <p class="eyebrow">NIVOI IZVOĐENJA</p>
      <h2 data-split>Paketi i šta svaki obuhvata</h2>
      <p>Nivo izvođenja najviše utiče na cenu. Ista kuća u sivoj fazi i u paketu ključ u ruke razlikuje se za oko polovinu ukupnog iznosa, jer se u drugom slučaju ugrađuju instalacije, podovi, keramika, kupatilo i unutrašnja stolarija.</p>
    </div>

    <div class="cgrid" style="margin-top:40px">
      <div class="cell ap">
        <h4>Siva faza</h4>
        <p>Konstrukcija, krovni sklop, spoljno zatvaranje objekta, termoizolacioni slojevi prema paketu, fasadni sistem i ugovorena spoljna stolarija.</p>
        <p class="eyebrow">SPOLJA ZAVRŠENO //</p>
      </div>
      <div class="cell ap">
        <h4>Ključ u ruke, Standard</h4>
        <p>Pored sive faze obuhvata unutrašnje obloge, osnovne elektro i vodovodne instalacije, podove, keramiku, unutrašnja vrata, osnovne sanitarije i završno krečenje.</p>
        <p class="eyebrow">USELJIVO //</p>
      </div>
      <div class="cell ap">
        <h4>Comfort i Premium</h4>
        <p>Viši nivo izolacije, završnih obloga, stolarije i opreme. Konačna specifikacija se formira prema željenom energetskom nivou, dizajnu i budžetu kupca.</p>
        <p class="eyebrow">VIŠI NIVO //</p>
      </div>
    </div>
  </div>

  <!-- ===== MATERIJALI  (BUILD PATHS GRID) ===== -->
  <div class="asec">
    <div class="hblock">
      <p class="eyebrow">TEHNIČKI SISTEM</p>
      <h2 data-split>Specifikacija materijala</h2>
      <p>Svaki objekat se gradi po istom sistemu slojeva. Konstrukcija se dimenzioniše prema statičkom proračunu konkretnog objekta, a ne po šablonu. Konačna specifikacija u ugovoru ima prednost nad katalogom.</p>
    </div>

    <div class="cgrid cgrid--4" style="margin-top:40px">
      <div class="cell ap">
        <div class="cell__img"><img src="images/sekcije/mat-konstrukcija.jpg" alt="Noseća drvena konstrukcija A-frame kuće u fazi montaže" loading="lazy" width="1200" height="1600"></div>
        <h4>01 // Noseća konstrukcija</h4>
        <p>Suva, sortirana građa. Konačni preseci potvrđuju se statičkim proračunom. A-frame rogovi 10 × 12 cm na oko 60 cm, galerijske grede 10 × 20 cm.</p>
        <p>Spojevi: zavrtnji, navojne šipke, pocinkovane ploče i ugaonici. Drvo zaštićeno odgovarajućim premazom.</p>
${spark('Proračun po objektu: 100%', 100)}
${spark('Pocinkovani spojevi: 100%', 100)}
      </div>

      <div class="cell ap">
        <div class="cell__img"><img src="images/sekcije/mat-termoizolacija.jpg" alt="Rolna mineralne vune za termoizolaciju krova i zidova" loading="lazy" width="1000" height="1000"></div>
        <h4>02 // Termoizolacija</h4>
        <p>Standard: 20 cm staklene vune u krovu, 10 cm u zidovima. Parna brana sa zalepljenim preklopima i obrađenim prodorima.</p>
        <p>Premium: 25 i 15 cm ili kamena vuna prema projektu, za celogodišnji boravak i planinske lokacije.</p>
${spark('Standard krov: 20 cm', 80)}
${spark('Premium nadogradnja: 25 cm', 100)}
      </div>

      <div class="cell ap">
        <div class="cell__img"><img src="images/sekcije/mat-krovni-sklop.jpg" alt="Crep kao osnovna pokrivka krovnog sklopa" loading="lazy" width="1000" height="1000"></div>
        <h4>03 // Krovni sklop</h4>
        <p>Paropropusna vodonepropusna folija, kontraletve za ventilacioni kanal, letve i završni trapezni ili falcovani lim 0,5 mm.</p>
        <p>Kod montažnih kuća crep je osnovna pokrivka. Sleme, vetar-lajsne, opšivke, okapnice i oluci u boji krova.</p>
${spark('Ventilisani sloj: 100%', 100)}
${spark('Lim 0,5 mm ili crep', 90)}
      </div>

      <div class="cell ap">
        <div class="cell__img"><img src="images/sekcije/mat-stolarija.jpg" alt="Zastakljena fasada A-frame kuće sa crnom stolarijom" loading="lazy" width="1024" height="1024"></div>
        <h4>04 // Stolarija i staklo</h4>
        <p>Crna ili bela PVC stolarija u osnovnom paketu, sa termoizolacionim staklom prema dimenziji otvora.</p>
        <p>Veće visine, kaljena i laminirana sigurnosna stakla, ALU sistemi, troslojno staklo i klizni portali biraju se kroz doplate.</p>
${spark('PVC u osnovnom paketu', 75)}
${spark('ALU i troslojno: doplata', 60)}
      </div>
    </div>
  </div>

  <!-- ===== GARANCIJA  (TRUST COMPLIANCE) ===== -->
  <div class="asec asec--dark">
    <div class="hblock">
      <p class="eyebrow">PRIMOPREDAJA I GARANCIJA</p>
      <h2 data-split>Jasna završnica posla</h2>
      <p>Garancija se odnosi na izvedene radove i ugovoreni obim. Za stolariju, krovni pokrivač, uređaje, sanitarije i drugu fabričku opremu važe uslovi njihovih proizvođača.</p>
    </div>

    <div class="split2" style="margin-top:48px">
      <div class="checks">
        <p>Zajednički pregled izvedenih ugovorenih radova pre predaje objekta.</p>
        <p>Zapisnik sa eventualnim vidljivim nedostacima i rokovima za otklanjanje.</p>
        <p>Predaja raspoloživih uputstava, garantnih listova i specifikacija.</p>
        <p>Evidentiranje stanja brojila, opreme i ključeva kada je primenljivo.</p>
        <p>Potpisivanje završne dokumentacije u skladu sa ugovorom.</p>
      </div>

      <div style="display:flex;flex-direction:column;gap:32px">
        <div class="miles3">
          <div><div class="n">6</div><div class="l">Faza do predaje</div></div>
          <div><div class="n">24 h</div><div class="l">Rok za odgovor</div></div>
          <div><div class="n">100%</div><div class="l">Pisani obračun izmena</div></div>
        </div>
        <div class="tcardq">
          <p>Pravilo je jednostavno: uključeno je samo ono što je imenovano, količinski određeno i opisano u konačnoj ponudi. Ako stavka nije navedena, ne smatra se automatski uključenom.</p>
          <p class="src">— Iz uslova poslovanja M Designe</p>
        </div>
      </div>
    </div>

    <p class="note" style="margin-top:40px">Tačno trajanje garancije, postupak prijave i rokovi odgovora navode se u ugovoru i garantnom dokumentu. Garancija ne pokriva redovno habanje, neodržavanje drveta i spojeva, mehanička oštećenja niti intervencije trećih lica.</p>
  </div>

  <!-- ===== CLOSING CTA ===== -->
  <div class="closing">
    <div class="hblock">
      <p class="eyebrow">SLEDEĆI KORAK</p>
      <h2 data-split>Pošaljite podatke o parceli.</h2>
      <p>Mesto i link lokacije, fotografije parcele i prilaznog puta, željena kvadratura i broj korisnika, paket i planirani budžet. Nakon početne analize dobijate predlog modela i strukturu ponude.</p>
      <div class="btn-row" style="justify-content:center">
        <a class="btn btn--primary" href="kontakt.html">Zatraži ponudu ${ARROW}</a>
        <a class="btn btn--light" href="tel:${K.telefonRaw}">${esc(K.telefon)}</a>
      </div>
    </div>
  </div>
` + FOOT(0);
};
