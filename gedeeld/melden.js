/* =====================================================================
   KLEIO-GAMES — MELDKNOP
   Leerlingen en docenten melden een bron die beter kan (verkeerd jaartal,
   kapotte afbeelding, onduidelijke toelichting …). De melding gaat per mail
   naar het beheeradres, met de link naar de bron en de opmerking.

   Gebruik in een spel:
     <script src="../gedeeld/melden.js"></script>
     element.innerHTML += KleioMelden.knop(bron, 'Naam van het spel');
   ===================================================================== */
(function () {
  const ADRES = 'bronnendatabase@vgnkleio.nl';
  const REDENEN = [
    'Het jaartal klopt niet',
    'De afbeelding doet het niet of is onduidelijk',
    'De toelichting is onduidelijk of onjuist',
    'De bron past niet bij dit tijdvak',
    'Iets anders',
  ];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const css = `
  .meld-knop { font: inherit; font-size: 13px; background: transparent; color: var(--zacht, #5a6a65); border: 1px solid var(--lijn, #d3dfdb); border-radius: 8px; padding: 3px 9px; cursor: pointer; }
  .meld-knop:hover { color: var(--rood, #C20E1A); border-color: var(--rood, #C20E1A); }
  .meld-scherm { position: fixed; inset: 0; background: rgba(20, 30, 27, .45); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 16px; }
  .meld-venster { background: #fff; color: var(--inkt, #1d2a26); border-radius: 12px; max-width: 520px; width: 100%; padding: 20px; box-shadow: 0 10px 40px rgba(0,0,0,.25); border-top: 4px solid var(--rood, #C20E1A); max-height: 90vh; overflow: auto; }
  .meld-venster h2 { font-family: var(--kop, Georgia, serif); color: var(--groen, #2E7160); font-weight: normal; margin: 0 0 4px; font-size: 22px; }
  .meld-venster .meld-bron { color: var(--zacht, #5a6a65); font-size: 14px; margin: 0 0 12px; }
  .meld-venster label.meld-reden { display: flex; gap: 8px; align-items: flex-start; margin: 6px 0; font-size: 15px; color: inherit; cursor: pointer; }
  .meld-venster label.meld-reden input { width: auto; margin-top: 3px; }
  .meld-venster textarea { width: 100%; min-height: 90px; font: inherit; padding: 8px; border: 1px solid var(--lijn, #d3dfdb); border-radius: 8px; margin-top: 8px; resize: vertical; }
  .meld-venster .meld-rij { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 14px; }
  .meld-venster button { font: inherit; padding: 8px 14px; border-radius: 8px; border: 1px solid var(--lijn, #d3dfdb); background: #fff; cursor: pointer; }
  .meld-venster button.meld-verstuur { background: var(--groen, #2E7160); border-color: var(--groen, #2E7160); color: #fff; font-weight: 600; }
  .meld-venster .meld-uitleg { font-size: 13px; color: var(--zacht, #5a6a65); margin-top: 10px; }
  .meld-venster .meld-melding { font-size: 14px; color: var(--groen, #2E7160); margin-top: 8px; min-height: 1em; }`;
  const stijl = document.createElement('style'); stijl.textContent = css; document.head.appendChild(stijl);

  const bekend = new Map();   // id → bron
  let spelNaam = '';

  function knop(b, spel) {
    if (!b) return '';
    const id = b.id || b.bronUrl || b.titel;
    bekend.set(String(id), b); if (spel) spelNaam = spel;
    return `<button type="button" class="meld-knop" data-meld="${esc(id)}" title="Meld een probleem met deze bron">⚑ Meld</button>`;
  }

  function tekstVan(b, redenen, opmerking) {
    return [
      'Melding over een bron in Kleio-games',
      '',
      'Bron: ' + (b.titel || '(zonder titel)'),
      'Link: ' + (b.bronUrl || '(geen link)'),
      'Id: ' + (b.id || '-'),
      'Jaartal in de spellen: ' + (b.jaar ?? '-'),
      'Spel: ' + (spelNaam || document.title),
      '',
      'Wat klopt er niet?',
      ...(redenen.length ? redenen.map(r => '- ' + r) : ['- (niets aangevinkt)']),
      '',
      'Opmerking:',
      opmerking || '(geen)',
    ].join('\n');
  }

  function open(b) {
    const scherm = document.createElement('div');
    scherm.className = 'meld-scherm';
    scherm.innerHTML = `
      <div class="meld-venster" role="dialog" aria-modal="true" aria-labelledby="meld-kop">
        <h2 id="meld-kop">Bron melden</h2>
        <p class="meld-bron">${esc(b.titel || 'Deze bron')}</p>
        ${REDENEN.map((r, i) => `<label class="meld-reden"><input type="checkbox" value="${esc(r)}"> ${esc(r)}</label>`).join('')}
        <textarea placeholder="Wat moet er beter? Bijvoorbeeld: het jaartal moet 1566 zijn, want…"></textarea>
        <div class="meld-rij">
          <button type="button" class="meld-verstuur">Verstuur melding</button>
          <button type="button" class="meld-kopieer">Kopieer melding</button>
          <button type="button" class="meld-sluit">Annuleren</button>
        </div>
        <div class="meld-melding" aria-live="polite"></div>
        <p class="meld-uitleg">Je mailprogramma opent met een kant-en-klare mail aan ${ADRES}. Werkt dat niet? Kopieer de melding en plak hem in een mail.</p>
      </div>`;
    document.body.appendChild(scherm);
    const $ = s => scherm.querySelector(s);
    const sluit = () => { scherm.remove(); document.removeEventListener('keydown', toets); };
    const toets = e => { if (e.key === 'Escape') sluit(); };
    document.addEventListener('keydown', toets);
    scherm.addEventListener('click', e => { if (e.target === scherm) sluit(); });
    $('.meld-sluit').onclick = sluit;
    const verzamel = () => tekstVan(b, [...scherm.querySelectorAll('input:checked')].map(x => x.value), $('textarea').value.trim());
    $('.meld-verstuur').onclick = () => {
      const onderwerp = 'Melding bron: ' + (b.titel || b.id || 'onbekend');
      location.href = `mailto:${ADRES}?subject=${encodeURIComponent(onderwerp)}&body=${encodeURIComponent(verzamel())}`;
      $('.meld-melding').textContent = 'Je mailprogramma wordt geopend. Klik daar op Verzenden. Bedankt!';
    };
    $('.meld-kopieer').onclick = async () => {
      try { await navigator.clipboard.writeText('Aan: ' + ADRES + '\n\n' + verzamel()); $('.meld-melding').textContent = 'Gekopieerd. Plak de melding in een mail aan ' + ADRES + '.'; }
      catch (e) { $('textarea').value = verzamel(); $('textarea').select(); $('.meld-melding').textContent = 'Kopiëren lukt niet automatisch: de tekst staat nu geselecteerd in het vak.'; }
    };
    $('input').focus();
  }

  document.addEventListener('click', e => {
    const k = e.target.closest('[data-meld]'); if (!k) return;
    e.preventDefault(); e.stopPropagation();
    const b = bekend.get(k.dataset.meld); if (b) open(b);
  });

  window.KleioMelden = { knop, open, ADRES };
})();
