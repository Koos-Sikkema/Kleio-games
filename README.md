# Kleio-games

Kleine spellen met de bronnen van [VGN Kleio](https://www.vgnkleio.nl/bronnen/) — Bronnen in de klas.

## Opbouw

```
index.html        startscherm: keuzemenu, versienummer, "nieuw in deze versie"
config.json       versie, nieuw-lijst en de lijst met spellen
collectie.json    één gedeelde bronnencollectie voor alle spellen
tijdlijnspel/     spel 1
tijdspeurder/     spel 2 (bevat ook het centrale beheerscherm)
vreemde-eend/     spel 3: welke bron hoort er niet bij? (contextualiseren)
gedeeld/melden.js meldknop voor alle spellen
```

## Collectie bijwerken

1. Open `tijdspeurder/#beheer`.
2. Haal nieuwe bronnen op uit Kleio, controleer jaar en plaats en klik op **Opslaan**.
   Opslaan bewaart de wijziging alleen in je eigen browser.
3. Klik op **Publiceren**. De collectie gaat dan rechtstreeks naar `collectie.json` in deze repository.
   Na ongeveer een minuut gebruiken alle spellen de nieuwe versie.

Eenmalig nodig voor Publiceren: een *fine-grained personal access token* van GitHub
(Settings → Developer settings → Personal access tokens → Fine-grained tokens), met toegang tot alleen
deze repository en het recht **Contents: Read and write**. Vul het in bij *Instellingen* onder de knop.
Het token blijft in je eigen browser; gebruik dit niet op een gedeelde computer.

Zonder token kan het ook handmatig: **Exporteren**, en het gedownloade `collectie.json` in de hoofdmap vervangen.

## Meldingen

Onder elke bron (na het antwoord) staat **⚑ Meld**. Daarmee opent een mail aan
bronnendatabase@vgnkleio.nl met de titel, de link, het id, het jaartal en de opmerking.
Het adres staat bovenaan `gedeeld/melden.js`.

Gebruik het beheer van Tijdspeurder en niet dat van het Tijdlijnspel: alleen Tijdspeurder bewaart plaats en coördinaten. Het beheerscherm van het Tijdlijnspel is daarom uitgeschakeld en stuurt door naar Tijdspeurder.

## Nieuwe versie uitbrengen

Pas in `config.json` de velden `versie`, `datum` en `nieuw` aan. Zet de vorige versie bovenaan in `eerder`:

```json
"eerder": [
  { "versie": "1.0.0", "datum": "2026-11-14", "nieuw": ["…"] }
]
```

## Nieuw spel toevoegen

1. Maak een map, bijvoorbeeld `pastnietbij/`, met een `index.html`.
2. Laad de bronnen met `fetch('../collectie.json')`.
3. Zet het spel in `config.json` onder `spellen`.
