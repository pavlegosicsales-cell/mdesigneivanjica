# M Designe Ivanjica — sajt

Statički sajt. Nema baze, nema WordPressa. Stranice modela i kategorija se
generišu iz jednog JSON fajla, pa su brze i vidljive na Google-u, a sadržaj se
menja bez diranja HTML-a.

## Pregled uživo

```
cd site
npx http-server -p 8790 -c-1
```
Otvori `http://localhost:8790`

## Kako se menja sadržaj

Sve što se menja u svakodnevnom radu je u **`data/modeli.json`**:

- cene modela
- dimenzije i specifikacije
- opisi i namena
- doplate
- pitanja i odgovori (FAQ)
- telefon, email, linkovi na mreže

Posle svake izmene pokreni:

```
node build.js
```

Regenerišu se sve stranice kategorija, sve stranice modela, `sitemap.xml` i
`robots.txt`. Ništa se ne radi ručno.

### Dodavanje novog modela

U `data/modeli.json`, u niz `modeli`, dodaj objekat po ugledu na postojeći.
Obavezna polja: `slug`, `naziv`, `kategorija`, `podnaslov`, `slika`, `specs`,
`raspored`, `cene`. `slug` postaje adresa stranice (`model/<slug>.html`).

### Izmena teksta koji nije u JSON-u

Sadržaj početne strane je u `index.html`. Ostale statične strane
(Modeli, O nama, Galerija, Kontakt, Privatnost) su u **`pages.js`**, pa se
i one regenerišu komandom `node build.js`.

Zaglavlje, podnožje i lebdeća dugmad su definisani na jednom mestu, u
`build.js`. Menjaš ih tamo i to se odrazi na svih 52 strane.

## Struktura

```
site/
├── index.html            početna (ručno pisana)
├── modeli.html           raskrsnica ka 6 kategorija   } generisano
├── galerija.html                                      } iz
├── o-nama.html                                        } pages.js
├── kontakt.html          wizard forma                 }
├── privatnost.html                                    }
├── modeli/<kategorija>.html    6 strana   } generisano iz
├── model/<slug>.html          40 strana   } modeli.json
├── css/styles.css        ceo dizajn sistem
├── js/main.js            navigacija, FAQ, animacije, wizard forma
├── data/modeli.json      IZVOR ISTINE za sadržaj
├── build.js              generator + zaglavlje/podnožje
├── pages.js              sadržaj statičnih strana
├── images/               brend, objekti, ikone
├── katalozi/             3 PDF kataloga za preuzimanje
├── sitemap.xml           generisano
└── robots.txt            generisano
```

## Šta još treba uraditi

1. **Kontakt forma ne šalje nigde.** U `js/main.js`, konstanta `ENDPOINT` je
   prazna. Popuniti je URL-om Google Apps Script web aplikacije
   (Skill 03, Form Backend Setup). Dok je prazna, forma prikazuje potvrdu i
   ispisuje podatke u konzolu brauzera, ali mejl ne stiže.
2. **Google Analytics, Search Console i Meta Pixel** nisu ubačeni. Čeka se
   pristup nalozima.
3. **Fotografije izvedenih projekata.** Sekcija na `galerija.html` je pripremljena,
   ali fotografije nisu stigle. Trenutno stoji objašnjenje i link na Instagram.
4. **Nacrti osnova po modelima.** Stranice modela imaju mesto za njih, ali za sada
   stoji tekstualni opis rasporeda.
5. **Neproverene odluke.** Vidi `../project/context.md`, sekcija konflikata:
   koje cene važe, da li ostaju tipovi A/B/C i šta sa garancijom.

## Provere koje su prošle

- 1809 internih linkova, nijedan mrtav
- 52 strane, svaka ima tačno jedan `<h1>`
- svi naslovi ispod 60 znakova, svi opisi ispod 160
- sve slike imaju `alt`
- `lang="sr"` svuda
- nema em-dasheva

## SEO sistem (dodato 4. septembra 2026)

Šta je ugrađeno u generator:

- **`layout.js` glava strane.** Svaka strana dobija `robots` sa
  `max-image-preview:large`, kanonikal, pun Open Graph i Twitter set,
  `geo.region`/`geo.placename` i jedan `LocalBusiness` JSON-LD čvor sa
  `@id` `#firma` (adresa, telefon, radno vreme, područja rada, mreže).
  Ostale šeme na strani pokazuju na taj `@id` umesto da ponavljaju podatke.
- **Šeme po tipu strane.** Početna: `WebSite`, `FAQPage`, `ItemList`.
  Kategorija: `BreadcrumbList`, `Service` sa `AggregateOffer`, `ItemList` modela.
  Model: `BreadcrumbList`, `Product` sa `AggregateOffer` i svim specifikacijama.
  Cenovnik: `BreadcrumbList`, `FAQPage`, `ItemList` sa cenom po modelu.
  Tekst: `BreadcrumbList`, `Article`. Kontakt i O nama: `ContactPage`, `AboutPage`.
- **`cenovnikpage.js`.** Nova strana `cenovnik.html`, sve cene i doplate iz
  `data/modeli.json` na jednom mestu. Cilja upit "cena" i "cenovnik", koji je
  najčešći komercijalni upit u ovoj delatnosti.
- **WebP.** `build.js` pri upisu zamenjuje svaku sliku u `src`, `poster` i
  `preload` WebP verzijom kada ona postoji na disku. `og:image` ostaje PNG ili
  JPG, jer neke aplikacije za deljenje linkova ne prikazuju WebP.
  Nove WebP fajlove praviti iz PNG-a preko Pythona i PIL-a, kvalitet 82,
  za logo i kuću u podnožju 92.
- **Preload LCP slike.** Svaka strana šalje `preload: 'putanja/slike'` u `head()`,
  generator dopisuje prefiks za dubinu i prebacuje na WebP.
- **Sitemap sa slikama.** `sitemap.xml` ima `image:image` za kategorije,
  modele i tekstove, plus `changefreq`.
- **Merenje.** Na vrhu `layout.js` stoje `GA4_ID`, `GSC_VERIFY` i
  `META_PIXEL_ID`. Dok su prazni, u stranu se ne ubacuje ništa. Kada stignu
  pristupi, popuniti i pokrenuti `node build.js`.

Šta stoji van generatora:

- **`../vercel.json`** ima 301 preusmerenja sa svih adresa starog Squarespace
  sajta (`/usluge`, `/usluge/a-frame-kuca-tip-a`, `/galerija/montazne-kuce`,
  `/o-nama`, `/kontakt`, `/pocetna`, `/cart`) na nove adrese. Aktiviraju se
  onog trenutka kada se domen prebaci na Vercel.
- **`X-Robots-Tag: noindex`** važi samo za host `mdesigneivanjica.vercel.app`,
  da probna adresa ne bi konkurisala pravom domenu. Kada domen bude prebačen,
  taj blok u `vercel.json` može da ostane, on ne dira pravi domen.
- **Keširanje.** Slike i video 30 dana, CSS i JS jedan dan uz
  `stale-while-revalidate`.

## Slike modela i sadržaj iz kataloga (4. septembar 2026)

- **`images/modeli/`** sadrži po jednu sliku za svaki od 40 modela, izvučenu iz
  PDF kataloga 2026, plus 8 kataloških osnova prizemlja za montažne kuće
  (`<slug>-osnova`). Svaka slika postoji kao `.webp` (prikaz) i `.jpg`
  (og:image i deljenje linkova). Putanja se upisuje u `data/modeli.json`, polja
  `slika` i `osnova`.
- **`images/galerija/`** su fotografije sa terena, **`images/sekcije/`** su
  ilustracije za sekcije na početnoj i strani O nama. Sekcijske slike imaju
  providnu pozadinu, zato se čuvaju kao PNG plus WebP sa alfa kanalom. Kada se
  konvertuju, mora `im.convert('RGBA')`, jer `RGB` gazi providnost bojom palete.
- **`data/modeli.json`, po kategoriji**: `paketiObuhvat` (šta koji paket
  obuhvata), `paketiNapomena`, `paketiTabela` (samo A-frame, uporedna tabela),
  `limiti` (limiti završnih materijala), `rok` i `podloga` (letnjikovci,
  bungalovi, igrališta). U korenu: `transport` i `temeljPodaci`.
  Sve preuzeto doslovno iz kataloga 2026.
- **`cenovnikpage.js`** i **`galerijapage.js`** su zasebni moduli, kao
  `modelpage.js`. `pages.js` ih samo poziva.

## Mobilna verzija

Prelomna tačka je 810px. Na telefonu:

- hero ne skraba video, video se uopšte ne preuzima, ostaje poster slika,
  tekst je centriran (`js/main.js`, promenljiva `telefon`)
- kartice kategorija se prevlače prstom (`overflow-x:auto` uz `scroll-snap`),
  bez pina od 290vh. Traka mora da ima `width:100%`, inače nema šta da se
  skroluje i vidi se samo prva kartica.
- traka sa logotipom ostaje svetla i nad tamnim sekcijama, dugme menija je
  tekst `[ MENI ]`, zatvoren meni je sklonjen preko `visibility` jer je
  njegova ivica ostavljala liniju ispod trake
- filteri u galeriji su jedna traka koja se prevlači
- konfigurator ima manje unutrašnje margine, opcije su 317px umesto 245px

## Keširanje

CSS i JS se učitavaju sa otiskom sadržaja u adresi (`?v=hash`, funkcija `v()` u
`layout.js`). Bez toga posetilac koji je već bio na sajtu vuče staru verziju iz
keša do jednog dana, pošto `vercel.json` postavlja `max-age=86400`.
