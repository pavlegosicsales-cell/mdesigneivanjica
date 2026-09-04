/* ==========================================================================
   FOOTER  -  prenet 1:1 sa referentnog sajta

   Slojevi (od pozadine ka vrhu):
     1. wordmark preko cele sirine footera
     2. kabina, apsolutno pozicionirana preko celog footera (left/right 100px)
     3. telemetrijske trake i linkovi, koji stoje preko slike
   Donja traka preseca kucu, kao na referentnom sajtu.
   ========================================================================== */

module.exports = function (K, esc, up, NAV, sticky) {

  return function foot(depth = 0, kategorije = []) {
    const b = up(depth);

    const kats = kategorije
      .map(k => `<a href="${b}modeli/${k.slug}.html">${esc(k.naziv)}</a>`)
      .join('\n        ');

    const nav = NAV
      .map(([h, t]) => `<a href="${b}${h}">${t}</a>`)
      .join('\n        ');

    const danas = new Date()
      .toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit', year: 'numeric' })
      .replace(/\s/g, '');

    return `</main>
${sticky(depth)}
<footer class="site-footer">

  <div class="telemetry">
    <p>HQ // IVANJICA, SRBIJA &mdash; 43.5781&deg; N, 20.2297&deg; E</p>
    <p>STATUS PROIZVODNJE: <span class="on">AKTIVNA</span></p>
    <p>POSLEDNJA IZMENA // ${danas}</p>
  </div>

  <div class="lgrid">
    <div class="lnews">
      <p>Javite nam se za slobodne termine montaže i nove modele u ponudi.</p>
      <form class="lnews__form" onsubmit="return false">
        <input type="email" placeholder="Email" aria-label="Vaša email adresa">
        <button type="submit">Pošalji
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </button>
      </form>
    </div>

    <div class="lcols">
        <div class="lcol">
          ${kats}
        </div>
        <div class="lcol">
          ${nav}
        </div>
        <div class="lcol">
          <a href="${b}cenovnik.html">Cenovnik 2026</a>
          <a href="${b}privatnost.html">Politika privatnosti</a>
          <a href="${K.instagram}" target="_blank" rel="noopener">Instagram</a>
          <a href="${K.tiktok}" target="_blank" rel="noopener">TikTok</a>
          <a href="${K.facebook}" target="_blank" rel="noopener">Facebook</a>
        </div>
    </div>
  </div>

  <div class="fmark">
    <span class="fmark__t">M DESIGNE</span>
  </div>

  <div class="fcabin fcabin--dim"><img src="${b}images/brend/footer-cabin.png" alt="" aria-hidden="true"></div>
  <div class="fcabin fcabin--bright"><img src="${b}images/brend/footer-cabin.png" alt="" aria-hidden="true"></div>

  <div class="telemetry telemetry--bottom">
    <p>&copy; ${new Date().getFullYear()} M DESIGNE IVANJICA. SVA PRAVA ZADRŽANA.</p>
    <p>IZRADA SAJTA // <a class="pato" href="https://www.patoadcreatives.com/sr" target="_blank" rel="noopener">PATO</a></p>
    <p><a href="#glavni">Nazad na vrh</a></p>
  </div>

</footer>
<script src="${b}js/main.js"></script>
</body>
</html>`;
  };
};
