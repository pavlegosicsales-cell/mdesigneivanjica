/* ==========================================================================
   KONTAKT
   Konfigurator po ugledu na Configurator_Workspace sa referentnog sajta:
   Header_Section (bez slike) + kartica sa dve kolone.
   Levo koraci sa Option karticama, desno pregled izbora i tamna kutija.
   ========================================================================== */

module.exports = function (DATA, L, FOOT) {
  const K = DATA.kontakt;
  const { head, esc, ARROW } = L;

  /* Korak 1: kategorije, sa najnizom cenom kao oznakom desno */
  const kats = DATA.kategorije.map(kat => {
    const najniza = DATA.modeli.filter(m => m.kategorija === kat.slug)
      .map(m => m.cene && m.cene[0] ? m.cene[0].iznos : null).filter(Boolean)[0];
    return `            <button type="button" class="wopt" data-value="${esc(kat.naziv)}" data-cena="${najniza ? esc(najniza) : 'na upit'}" aria-pressed="false">
              <span class="wopt__top">
                <span class="wopt__t">${esc(kat.naziv)}</span>
                <span class="wopt__tag">${najniza ? 'od ' + esc(najniza) : 'na upit'}</span>
              </span>
              <span class="wopt__s">${esc(kat.podnaslov)}</span>
            </button>`;
  }).join('\n');

  /* Podaci za procenu cene u koraku 2/3: za svaki model, kategorija (naziv
     kao u wizardu), povrsina u m2 (ako je poznata) i svi paketi sa cenom.
     Cita ih js/main.js da cena u tamnoj kutiji prati velicinu i paket, ne
     samo prvi izabrani korak. */
  const wizPricing = DATA.modeli.map(m => {
    const kat = DATA.kategorije.find(k => k.slug === m.kategorija);
    const sizeSpec = m.specs.find(s => /ukupno|bruto|površina/i.test(s.k));
    const sizeNum = sizeSpec ? parseFloat(String(sizeSpec.v).replace(',', '.')) : null;
    return {
      k: kat ? kat.naziv : m.kategorija,
      v: (sizeNum && !isNaN(sizeNum)) ? sizeNum : null,
      t: m.tip || '',
      c: m.cene.map(c => [c.paket, c.iznos])
    };
  });

  const opt = (v, t, tag, s, on) =>
    `            <button type="button" class="wopt" data-value="${esc(v)}" aria-pressed="false">
              <span class="wopt__top">
                <span class="wopt__t">${esc(t)}</span>
                <span class="wopt__tag${on ? ' wopt__tag--on' : ''}">${esc(tag)}</span>
              </span>
              <span class="wopt__s">${esc(s)}</span>
            </button>`;

  /* Koraci 2 i 3 zavise od kategorije. Kvadrature i nazivi paketa su iz
     kataloga: A-frame ide 30 do 200 m2, montazne 24 do 150, bungalovi 18 do
     42, letnjikovci 9 do 40. Igralista se ne mere kvadraturom, imaju tip
     privatno/komercijalno, pa se u koraku 2 pita namena. Resort nema tipske
     modele, pa se pita obim projekta. */
  const NEZNAM = ['još ne znam', 'Još ne znam', 'Savet', 'Predložićemo prema broju korisnika, nameni i parceli.'];

  const VELICINE = {
    'A-frame kuće': [
      ['do 30 m²', 'Do 30 m²', 'Kompaktno', 'Studio ili mala vikendica za dve osobe.'],
      ['30 do 60 m²', '30 do 60 m²', 'Najtraženije', 'Par ili mala porodica, vikendica i kratkoročno izdavanje.', true],
      ['60 do 100 m²', '60 do 100 m²', 'Porodično', 'Porodična kuća sa dve ili tri spavaće zone.'],
      ['100 do 150 m²', '100 do 150 m²', 'Prostrano', 'Veća porodica ili premium rentiranje.'],
      ['preko 150 m²', 'Preko 150 m²', 'Vila', 'Vila ili resort objekat za veće grupe.'],
      NEZNAM
    ],
    'Montažne kuće': [
      ['do 30 m²', 'Do 30 m²', 'Kompaktno', 'Manja jedinica za dve osobe ili kancelarija.'],
      ['30 do 60 m²', '30 do 60 m²', 'Najtraženije', 'Par ili mala porodica, stalni boravak ili izdavanje.', true],
      ['60 do 100 m²', '60 do 100 m²', 'Porodično', 'Porodična kuća sa dve ili tri spavaće sobe.'],
      ['100 do 150 m²', '100 do 150 m²', 'Prostrano', 'Veća porodica, najveći tipski modeli.'],
      NEZNAM
    ],
    'Bungalovi': [
      ['do 20 m²', 'Do 20 m²', 'Studio', 'Jedna jedinica za dve osobe, glamping i turizam.'],
      ['20 do 30 m²', '20 do 30 m²', 'Najtraženije', 'Manja porodica ili turistička jedinica sa kupatilom.', true],
      ['30 do 42 m²', '30 do 42 m²', 'Prostrano', 'Dve zone za spavanje ili wellness jedinica.'],
      NEZNAM
    ],
    'Letnjikovci i pergole': [
      ['do 16 m²', 'Do 16 m²', 'Dvorišno', 'Manji letnjikovac ili pergola za sedenje.'],
      ['16 do 24 m²', '16 do 24 m²', 'Najtraženije', 'Prostor za ručavanje, roštilj ili natkrivenu terasu.', true],
      ['preko 24 m²', 'Preko 24 m²', 'Paviljon', 'Veći paviljon za proslave i grupe.'],
      NEZNAM
    ],
    'Dečja igrališta': [
      ['privatno dvorište', 'Privatno dvorište', 'Privatno', 'Kuća, vikendica ili dvorište za svoju decu.', true],
      ['komercijalni prostor', 'Komercijalni prostor', 'Komercijalno', 'Vrtić, restoran, resort ili javna površina.'],
      NEZNAM
    ],
    'Resort i investicije': [
      ['do 5 jedinica', 'Do 5 jedinica', 'Manji projekat', 'Nekoliko jedinica na jednoj parceli.'],
      ['5 do 15 jedinica', '5 do 15 jedinica', 'Srednji projekat', 'Manji resort ili glamping kamp u fazama.', true],
      ['preko 15 jedinica', 'Preko 15 jedinica', 'Veliki projekat', 'Veći resort sa pratećim sadržajima.'],
      NEZNAM
    ]
  };

  const SAVET = ['treba mi savet', 'Nisam siguran', 'Savet', 'Objasnićemo razliku i predložiti nivo prema nameni.'];

  const PAKETI = {
    'A-frame kuće': [
      ['Siva faza', 'Siva faza', 'Osnovno', 'Konstrukcija, krov, spoljno zatvaranje i ugovorena spoljna stolarija.'],
      ['Standard', 'Standard', 'Ključ u ruke', 'Instalacije, podovi, keramika, kupatilo i unutrašnja stolarija.', true],
      ['Premium', 'Premium', 'Viši nivo', 'Jača izolacija, premium obloge, stolarija i oprema.'],
      SAVET
    ],
    'Montažne kuće': [
      ['Siva faza', 'Siva faza', 'Osnovno', 'Konstrukcija, krov, spoljno zatvaranje i spoljna stolarija.'],
      ['Ključ u ruke Standard', 'Ključ u ruke Standard', 'Standard', 'Kompletno useljivo u standardnom nivou opreme.', true],
      ['Ključ u ruke Comfort', 'Ključ u ruke Comfort', 'Comfort', 'Viši nivo obloga, stolarije i opreme.'],
      ['Ključ u ruke Premium', 'Ključ u ruke Premium', 'Premium', 'Najviši nivo izolacije, obloga i opreme.'],
      SAVET
    ],
    'Bungalovi': [
      ['Siva faza', 'Siva faza', 'Osnovno', 'Konstrukcija, krov i spoljno zatvaranje sa stolarijom.'],
      ['Ključ u ruke', 'Ključ u ruke', 'Standard', 'Instalacije, kupatilo, podovi i završna obrada.', true],
      SAVET
    ],
    'Letnjikovci i pergole': [
      ['Osnovni paket', 'Osnovni paket', 'Standard', 'Konstrukcija, krovni sklop i obrada drveta. Jedini nivo iz kataloga.', true],
      SAVET
    ],
    'Dečja igrališta': [
      ['Osnovni paket', 'Osnovni paket', 'Tipski model', 'Tipsko igralište iz kataloga, sa montažom.', true],
      ['Po projektu', 'Po projektu', 'Prema prostoru', 'Igralište krojeno prema prostoru i broju dece.'],
      SAVET
    ],
    'Resort i investicije': [
      ['Siva faza', 'Siva faza', 'Osnovno', 'Objekti zatvoreni spolja, unutrašnje radove vodi investitor.'],
      ['Ključ u ruke', 'Ključ u ruke', 'Standard', 'Kompletno useljive jedinice, spremne za goste.', true],
      SAVET
    ]
  };

  /* korak 2 ne pita svuda istu stvar, pa i naziv u pregledu upita mora da
     se razlikuje: kuce imaju kvadraturu, igralista namenu, resort obim */
  const VEL_META = {
    'Dečja igrališta':      { key: 'Namena', q: 'Gde ide igralište?', hint: 'Privatno dvorište i komercijalni prostor imaju različite modele i standarde.' },
    'Resort i investicije': { key: 'Obim projekta', q: 'Koliki je obim projekta?', hint: 'Resort se radi po projektu, pa je broj jedinica polazna informacija.' }
  };
  const VEL_DEF = { key: 'Veličina', q: 'Koja veličina vam treba?', hint: 'Okvirno je dovoljno. Tačne mere se usaglašavaju u idejnoj fazi.' };

  /* jedna .wopts grupa po kategoriji, JS prikazuje samo odgovarajucu */
  const grupe = (mapa, key) => Object.keys(mapa).map(katNaziv => {
    const meta = key === 'Veličina' ? (VEL_META[katNaziv] || VEL_DEF) : null;
    const dk = meta ? meta.key : key;
    const attrs = meta ? ` data-q="${esc(meta.q)}" data-hint="${esc(meta.hint)}"` : '';
    return `          <div class="wopts" data-key="${esc(dk)}" data-for="${esc(katNaziv)}"${attrs} hidden>
${mapa[katNaziv].map(o => opt(o[0], o[1], o[2], o[3], o[4])).join('\n')}
          </div>`;
  }).join('\n');

  const body = `
  <div class="phead">
    <div class="phead__main">
      <p class="eyebrow">// KONFIGURATOR UPITA</p>
      <h1 data-split>Sastavite svoj | objekat.</h1>
    </div>
    <div class="phead__side">
      <p class="t-18">Odgovorite na nekoliko pitanja i dobićete predlog modela sa strukturom ponude. Ako vam je lakše, samo nas pozovite na <a href="tel:${K.telefonRaw}" style="color:var(--accent)">${esc(K.telefon)}</a>.</p>
    </div>
  </div>

  <div class="wsec">
    <div class="wprog">
      <span class="wprog__c" data-prog-label>Korak 01 // 05</span>
      <span class="wprog__t"><span data-prog-bar></span></span>
    </div>

    <div class="wcard wizard">
      <script type="application/json" id="wiz-pricing">${JSON.stringify(wizPricing)}</script>
      <div class="wchrome" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>

      <form class="wleft" novalidate>

        <div class="wstep is-active" data-key="Kategorija">
          <p class="wstep__k">Korak 01 // Tip objekta</p>
          <h2 class="wstep__q">Šta gradimo?</h2>
          <p class="wstep__hint">Izaberite tip objekta. Ako niste sigurni, izaberite najbliže, precizira se kasnije.</p>
          <div class="wopts">
${kats}
          </div>
        </div>

        <div class="wstep" data-key="Veličina">
          <p class="wstep__k">Korak 02 // Obim</p>
          <h2 class="wstep__q" data-q-velicina>Koja veličina vam treba?</h2>
          <p class="wstep__hint" data-hint-velicina>Okvirno je dovoljno. Tačne mere se usaglašavaju u idejnoj fazi.</p>
${grupe(VELICINE, 'Veličina')}
        </div>

        <div class="wstep" data-key="Paket">
          <p class="wstep__k">Korak 03 // Nivo izvođenja</p>
          <h2 class="wstep__q">Koji paket?</h2>
          <p class="wstep__hint">Ovo najviše utiče na cenu. Nivoi su onako kako stoje u katalogu za izabranu kategoriju.</p>
${grupe(PAKETI, 'Paket')}
        </div>

        <div class="wstep" data-key="Lokacija i rok">
          <p class="wstep__k">Korak 04 // Lokacija</p>
          <h2 class="wstep__q">Gde i kada?</h2>
          <p class="wstep__hint">Lokacija određuje temelj, transport i uslove montaže.</p>
          <div class="field">
            <label for="lokacija">Mesto ili opština <span class="req">*</span></label>
            <input type="text" id="lokacija" name="lokacija" data-required="true" data-key="Lokacija" placeholder="na primer Zlatibor, Ivanjica, Kopaonik" autocomplete="address-level2">
            <span class="field__err">Upišite mesto ili opštinu.</span>
          </div>
          <div class="wopts" data-key="Rok">
${opt('što pre', 'Što pre', 'Spreman', 'Parcela je rešena, može da se kreće u dogovor.')}
${opt('za 3 do 6 meseci', 'Za 3 do 6 meseci', 'Sezona', 'Planiram gradnju za narednu sezonu.')}
${opt('raspitujem se', 'Raspitujem se', 'Info', 'Prikupljam informacije i cene.')}
          </div>
        </div>

        <div class="wstep">
          <p class="wstep__k">Korak 05 // Kontakt</p>
          <h2 class="wstep__q">Vaši podaci</h2>
          <p class="wstep__hint">Javljamo se sa predlogom modela i strukturom ponude.</p>
          <div class="field">
            <label for="ime">Ime i prezime <span class="req">*</span></label>
            <input type="text" id="ime" name="ime" required autocomplete="name" placeholder="Marko Marković">
            <span class="field__err">Unesite ime i prezime.</span>
          </div>
          <div class="field">
            <label for="telefon">Telefon <span class="req">*</span></label>
            <input type="tel" id="telefon" name="telefon" required autocomplete="tel" placeholder="06x xxx xxxx">
            <span class="field__err">Unesite ispravan broj telefona.</span>
          </div>
          <div class="field">
            <label for="email">Email <span class="req">*</span></label>
            <input type="email" id="email" name="email" required autocomplete="email" placeholder="vas@email.com">
            <span class="field__err">Unesite ispravnu email adresu.</span>
          </div>
          <div class="field">
            <label for="poruka">Poruka</label>
            <textarea id="poruka" name="poruka" placeholder="Dimenzije parcele, nagib terena, broj korisnika, budžet..."></textarea>
          </div>
        </div>

        <div class="wnav">
          <button type="button" class="btn btn--outline" data-act="back" hidden>&larr; Nazad</button>
          <button type="button" class="btn btn--dark btn--go" data-act="next">Sledeći korak</button>
          <button type="submit" class="btn btn--dark btn--go" data-act="send" hidden>Pošalji upit</button>
        </div>
      </form>

      <aside class="wright">
        <span class="wlabel">Pregled upita</span>
        <hr>
        <div class="wsum" data-sum></div>

        <div class="wbox">
          <a class="wbox__field" href="tel:${K.telefonRaw}">Pozovite odmah // ${esc(K.telefon)}</a>
          <span class="wbox__k">Okvirna cena za vaš izbor</span>
          <div class="wbox__row">
            <span class="wbox__v">&mdash;</span>
            <span class="wbox__note">// orijentaciono</span>
          </div>
        </div>
      </aside>

      <div class="wdone wizard__done">
        <div class="tick" aria-hidden="true">&#10003;</div>
        <h3>Upit je poslat</h3>
        <p style="margin-top:12px;max-width:46ch;margin-inline:auto">Hvala. Javljamo se u najkraćem roku sa predlogom modela. Ako vam treba odmah, pozovite <a href="tel:${K.telefonRaw}" style="color:var(--accent)">${esc(K.telefon)}</a>.</p>
      </div>
    </div>

    <p class="note" style="max-width:1100px">Cena u pregledu je okvirna, prema izabranoj kategoriji, veličini i paketu. Ne predstavlja ponudu. Konačan iznos zavisi od lokacije, temelja, izabranih materijala i uslova pristupa gradilištu.</p>
  </div>

  <div class="asec">
    <div class="cgrid">
      <div class="cell ap">
        <span class="cell__n">Telefon</span>
        <p class="eyebrow">Poziv i poruke //</p>
        <p><a href="tel:${K.telefonRaw}" style="color:var(--accent)">${esc(K.telefon)}</a><br>Isti broj radi na WhatsApp i Viber.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">Email</span>
        <p class="eyebrow">Pošta //</p>
        <p><a href="mailto:${K.email}" style="color:var(--accent)">${esc(K.email)}</a><br>Odgovaramo u roku od 24 sata.</p>
      </div>
      <div class="cell ap">
        <span class="cell__n">Lokacija</span>
        <p class="eyebrow">Područje rada //</p>
        <p>${esc(K.mesto)}<br>Radimo na celoj teritoriji Srbije. Za region i inostranstvo, ponuda po proveri uslova.</p>
      </div>
    </div>
  </div>

  <div class="closing">
    <div class="hblock">
      <p class="eyebrow">ZA PRECIZNIJU PONUDU</p>
      <h2 data-split>Pošaljite podatke | o parceli.</h2>
      <p>Mesto i link lokacije, fotografije parcele i prilaza, dimenzije i nagib terena, željeni model i broj korisnika, paket i planirani budžet.</p>
      <div class="btn-row" style="justify-content:center">
        <a class="btn btn--primary" href="tel:${K.telefonRaw}">${esc(K.telefon)} ${ARROW}</a>
        <a class="btn btn--light" href="mailto:${K.email}">${esc(K.email)}</a>
      </div>
    </div>
  </div>
`;

  return head({
    title: 'Kontakt i zahtev za ponudu | M Designe Ivanjica',
    desc: 'Zatražite ponudu za A-frame ili montažnu kuću. Odgovorite na nekoliko pitanja o modelu, dimenzijama, paketu i lokaciji. Telefon 060 366 5275.',
    canonical: 'kontakt.html', depth: 0, ogImage: 'images/objekti/aframe-minimal.png'
  }) + body + FOOT(0);
};
