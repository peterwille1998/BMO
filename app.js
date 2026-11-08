
/* ==========================================
   BMO - DATASÆT
   ==========================================

   Hvert objekt repræsenterer ét bageri.

   price: Prisen i kroner
   area: Området, som bruges i pivottabellen
   source: Hvor prisoplysningen kommer fra
   sourceUrl: Link til en kilde, hvis vi har et

   Hvis vi senere finder flere priser, kan vi
   tilføje flere objekter til dette array.
*/

const bagerier = [
    {
        name: "Bagt",
        area: "Grænseområde",
        address: "Lygten 2C, 2400 København NV",
        price: 34,
        source: "Wolt",
        sourceUrl: "https://wolt.com/da/dnk/copenhagen/venue/bagt-nrrebro-bycenter/bmo-itemid-828333a4b60a754033059aec"
    },

    {
        name: "Flere Fugle",
        area: "Nordvest",
        address: "Rentemestervej 57, 2400 København NV",
        price: 37,
        source: "Officielt menukort, oplyst af bruger",
        sourceUrl: "https://www.flerefugle.dk/"
    },

    {
        name: "Copenhagen Bakery",
        area: "Nørrebro",
        address: "Nørrebrogade 224, 2200 København N",
        price: 40,
        source: "Wolt",
        sourceUrl: "https://wolt.com/da/dnk/copenhagen/venue/copenhagen-bakery/items/smurt-17"
    },

    {
        name: "Bageriet Benji",
        area: "Grænseområde",
        address: "Mjølnerparken 52, 2200 København N",
        price: 42,
        source: "Google-søgning, direkte kilde mangler",
        sourceUrl: ""
    },

    {
        name: "Rondo",
        area: "Nørrebro",
        address: "Sjællandsgade 7, 2200 København N",
        price: 45,
        source: "Google-søgning, direkte kilde mangler",
        sourceUrl: ""
    }
];


/* ==========================================
   HJÆLPEFUNKTIONER
   ========================================== */

// Gør et tal til dansk valuta.
// Eksempel: 39.6 bliver til "39,60 kr."
function formatPris(pris) {
    return pris.toLocaleString("da-DK", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " kr.";
}


// Beregner gennemsnittet af priserne
// i et array af bagerier.
function beregnGennemsnit(liste) {
    if (liste.length === 0) {
        return 0;
    }

    let samletPris = 0;

    liste.forEach(bageri => {
        samletPris += bageri.price;
    });

    return samletPris / liste.length;
}


/* ==========================================
   NØGLETAL
   ========================================== */

function visNoegletal() {

    // Henter alle priserne fra vores datasæt.
    const priser = bagerier.map(bageri => bageri.price);

    // Math.min finder den laveste pris.
    const lavestePris = Math.min(...priser);

    // Math.max finder den højeste pris.
    const hoejestePris = Math.max(...priser);

    // Forskellen mellem højeste og laveste pris.
    const prisforskel = hoejestePris - lavestePris;

    // Beregner gennemsnitsprisen.
    const gennemsnit = beregnGennemsnit(bagerier);

    // Finder bagerierne med laveste og højeste pris.
    const billigste = bagerier.find(bageri =>
        bageri.price === lavestePris
    );

    const dyreste = bagerier.find(bageri =>
        bageri.price === hoejestePris
    );

    // Opdaterer HTML-elementernes indhold.
    document.querySelector("#venue-count").textContent =
        bagerier.length;

    document.querySelector("#average-price").textContent =
        formatPris(gennemsnit);

    document.querySelector("#price-difference").textContent =
        prisforskel + " kr.";

    document.querySelector("#cheapest-price").textContent =
        lavestePris + " kr.";

    document.querySelector("#cheapest-name").textContent =
        billigste.name;

    document.querySelector("#expensive-price").textContent =
        hoejestePris + " kr.";

    document.querySelector("#expensive-name").textContent =
        dyreste.name;
}


/* ==========================================
   SØJLEDIAGRAM
   ========================================== */

function visPrisdiagram() {

    const diagram = document.querySelector("#price-chart");

    // Rydder diagrammet, inden vi opbygger det.
    diagram.innerHTML = "";

    // Finder den højeste pris.
    // Den bruges til at beregne søjlernes bredde.
    const maxPris = Math.max(
        ...bagerier.map(bageri => bageri.price)
    );

    // Sorterer bagerierne fra billigst til dyrest.
    const sorteretListe = [...bagerier].sort(
        (a, b) => a.price - b.price
    );

    // forEach gennemgår hvert bageri.
    sorteretListe.forEach(bageri => {

        // Beregner bredden som en procentdel.
        const bredde = (bageri.price / maxPris) * 100;

        // Opretter rækken med bageriets navn.
        const raekke = document.createElement("div");
        raekke.className = "price-row";

        // Opretter bageriets navn.
        const navn = document.createElement("span");
        navn.className = "price-name";
        navn.textContent = bageri.name;

        // Opretter baggrunden bag søjlen.
        const track = document.createElement("div");
        track.className = "price-track";

        // Opretter selve den gule søjle.
        const soejle = document.createElement("div");
        soejle.className = "price-bar";

        // CSS-variablen styrer søjlens bredde.
        soejle.style.setProperty(
            "--bar-width",
            bredde + "%"
        );

        // Viser prisen inde i søjlen.
        soejle.textContent = bageri.price + " kr.";

        // Samler elementerne.
        track.appendChild(soejle);
        raekke.appendChild(navn);
        raekke.appendChild(track);

        // Tilføjer rækken til diagrammet.
        diagram.appendChild(raekke);
    });

    // Tilføjer en beskrivelse til skærmlæsere.
    diagram.setAttribute(
        "aria-label",
        sorteretListe.map(bageri =>
            bageri.name + ": " + bageri.price + " kroner"
        ).join(". ")
    );
}


/* ==========================================
   PIVOTTABEL
   ==========================================

   En pivottabel samler data efter en kategori.

   Her grupperer vi bagerierne efter område
   og beregner antal, laveste pris, højeste
   pris og gennemsnitspris.
*/

function visPivottabel() {

    const tabel = document.querySelector("#pivot-body");

    tabel.innerHTML = "";

    const omraader = [
        "Nørrebro",
        "Nordvest",
        "Grænseområde"
    ];

    // Gennemgår hvert område.
    omraader.forEach(omraade => {

        // filter finder bagerierne i dette område.
        const lokaleBagerier = bagerier.filter(
            bageri => bageri.area === omraade
        );

        // Spring over områder uden bagerier.
        if (lokaleBagerier.length === 0) {
            return;
        }

        const priser = lokaleBagerier.map(
            bageri => bageri.price
        );

        const laveste = Math.min(...priser);
        const hoejeste = Math.max(...priser);
        const gennemsnit = beregnGennemsnit(lokaleBagerier);

        // Opretter en række i tabellen.
        const raekke = document.createElement("tr");

        // Indsætter de beregnede værdier.
        raekke.innerHTML = `
      <th scope="row">${omraade}</th>
      <td>${lokaleBagerier.length}</td>
      <td>${laveste} kr.</td>
      <td>${hoejeste} kr.</td>
      <td>${formatPris(gennemsnit)}</td>
    `;

        tabel.appendChild(raekke);
    });

    // Tilføjer en samlet række for alle bagerier.
    const allePriser = bagerier.map(
        bageri => bageri.price
    );

    const samletRaekke = document.createElement("tr");

    samletRaekke.innerHTML = `
    <th scope="row">Alle områder</th>
    <td>${bagerier.length}</td>
    <td>${Math.min(...allePriser)} kr.</td>
    <td>${Math.max(...allePriser)} kr.</td>
    <td>${formatPris(beregnGennemsnit(bagerier))}</td>
  `;

    tabel.appendChild(samletRaekke);
}


/* ==========================================
   BAGERIKORT OG FILTRERING
   ========================================== */

function visBagerier(valgtOmraade = "Alle") {

    const container = document.querySelector("#venue-list");

    container.innerHTML = "";

    // Viser enten alle bagerier eller kun
    // bagerier fra det valgte område.
    const filtreredeBagerier = bagerier.filter(
        bageri =>
            valgtOmraade === "Alle" ||
            bageri.area === valgtOmraade
    );

    // Sorterer kortene efter pris.
    filtreredeBagerier.sort(
        (a, b) => a.price - b.price
    );

    // Opretter ét kort for hvert bageri.
    filtreredeBagerier.forEach(bageri => {

        const kort = document.createElement("article");
        kort.className = "venue-card";

        // Opretter område.
        const omraade = document.createElement("p");
        omraade.className = "venue-area";
        omraade.textContent = bageri.area;

        // Opretter navn.
        const navn = document.createElement("h4");
        navn.textContent = bageri.name;

        // Opretter pris.
        const pris = document.createElement("p");
        pris.className = "venue-price";
        pris.textContent = bageri.price + " kr.";

        // Opretter adresse.
        const adresse = document.createElement("p");
        adresse.className = "venue-address";
        adresse.textContent = bageri.address;

        // Opretter kildeoplysning.
        const kilde = document.createElement("p");
        kilde.className = "venue-source";
        kilde.textContent = "Kilde: " + bageri.source;

        // Samler kortets indhold.
        kort.appendChild(omraade);
        kort.appendChild(navn);
        kort.appendChild(pris);
        kort.appendChild(adresse);
        kort.appendChild(kilde);

        // Tilføjer kun et link, hvis vi har en URL.
        if (bageri.sourceUrl !== "") {

            const link = document.createElement("a");

            link.href = bageri.sourceUrl;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "Se kilde ↗";

            kort.appendChild(link);
        }

        // Indsætter kortet på hjemmesiden.
        container.appendChild(kort);
    });

    // Besked hvis der ikke findes bagerier.
    if (filtreredeBagerier.length === 0) {
        container.textContent =
            "Der er endnu ingen bagerier i dette område.";
    }
}


/* ==========================================
   START HJEMMESIDEN
   ========================================== */

// Kører funktionerne, når HTML'en er indlæst.
visNoegletal();
visPrisdiagram();
visPivottabel();
visBagerier();

// Gør område-filteret interaktivt.
const omraadeFilter = document.querySelector("#area-filter");

omraadeFilter.addEventListener("change", () => {

    // value er den valgte værdi i dropdown-menuen.
    const valgtOmraade = omraadeFilter.value;

    // Opdaterer bagerikortene.
    visBagerier(valgtOmraade);
});
