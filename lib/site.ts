export const siteConfig = {
  name: "Kower Pracownia Meblarska",
  shortName: "Kower",
  baseUrl: "https://kower.eu",
  phone: "+48 690 877 720",
  email: "a.ciosmak@kower.eu",
  address: "Kosin 20, 23-235 Kosin",
  city: "Kosin",
  nip: "7151938015",
};

export const mainNavigation = [
  { label: "O nas", href: "/o-nas" },
  { label: "Oferta", href: "/oferta" },
  { label: "Lamele", href: "/lamele" },
  { label: "Materiały", href: "/materialy-i-fronty" },
  { label: "Realizacje", href: "/realizacje" },
  { label: "Kontakt", href: "/kontakt" },
];

export const offerGroups = [
  {
    title: "Meble",
    description: "Kuchnie, łazienki, biura, salony, garderoby i zabudowy nietypowe.",
    links: [
      { label: "Meble na wymiar", href: "/oferta/meble-na-wymiar" },
      { label: "Meble kuchenne", href: "/oferta/meble-kuchenne" },
      { label: "Meble łazienkowe", href: "/oferta/meble-lazienkowe" },
      { label: "Meble biurowe", href: "/oferta/meble-biurowe" },
      { label: "Meble do salonu", href: "/oferta/meble-do-salonu" },
      { label: "Garderoby", href: "/oferta/garderoby" },
      { label: "Zabudowy nietypowe", href: "/oferta/zabudowy-nietypowe" },
    ],
  },
  {
    title: "Lamele",
    description: "Produkcja detaliczna, hurtowa, pod wymiar i opłaszczowywanie.",
    links: [
      { label: "Lamele", href: "/lamele" },
      { label: "Klient indywidualny", href: "/lamele/klient-indywidualny" },
      { label: "Sprzedaż hurtowa", href: "/lamele/sprzedaz-hurtowa" },
      { label: "Lamele na wymiar", href: "/lamele/na-wymiar" },
      { label: "Opłaszczowywanie", href: "/lamele/oplaszczowywanie-elementow" },
    ],
  },
  {
    title: "AGD",
    description: "Sprzęt uwzględniony w wymiarach, wentylacji i ergonomii zabudowy.",
    links: [
      { label: "AGD w projektach", href: "/agd" },
      { label: "AGD do zabudowy", href: "/agd/do-zabudowy" },
      { label: "AGD wolnostojące", href: "/agd/wolnostojace" },
      { label: "Małe AGD", href: "/agd/male-agd" },
      { label: "Producenci AGD", href: "/agd/producenci-agd" },
    ],
  },
  {
    title: "Płyty",
    description: "Formatki, krawędzie, usługi płytowe i przygotowanie elementów.",
    links: [
      { label: "Usługi płytowe", href: "/uslugi-plytowe" },
      { label: "Cięcie płyt", href: "/uslugi-plytowe/ciecie-plyt" },
      { label: "Oklejanie płyt", href: "/uslugi-plytowe/oklejanie-plyt" },
      { label: "Producenci płyt", href: "/materialy-i-fronty/producenci-plyt-meblowych" },
    ],
  },
  {
    title: "Materiały",
    description: "Płyty, MDF, blaty, fronty i producenci do uzupełnienia markami.",
    links: [
      { label: "Materiały i fronty", href: "/materialy-i-fronty" },
      { label: "Płyta wiórowa", href: "/materialy-i-fronty/plyta-wiorowa" },
      { label: "Płyta MDF", href: "/materialy-i-fronty/plyta-mdf" },
      { label: "Blaty laminowane", href: "/materialy-i-fronty/blaty-laminowane" },
      { label: "Blaty kompaktowe", href: "/materialy-i-fronty/blaty-kompaktowe" },
      { label: "Fronty lakierowane", href: "/materialy-i-fronty/fronty-lakierowane" },
      { label: "Fronty ryflowane", href: "/materialy-i-fronty/fronty-ryflowane" },
      { label: "Partnerzy", href: "/producenci-i-partnerzy" },
    ],
  },
];

export const offerNavigation = offerGroups.flatMap((group) => group.links);

export const offerQuickNavigation = [
  { label: "Lamele", href: "/lamele", description: "Produkcja detaliczna i hurtowa" },
  { label: "Lamele detaliczne", href: "/lamele/klient-indywidualny", description: "Do mieszkań, domów i ścian dekoracyjnych" },
  { label: "Lamele hurtowe", href: "/lamele/sprzedaz-hurtowa", description: "Serie dla firm i wykonawców" },
  { label: "Lamele na wymiar", href: "/lamele/na-wymiar", description: "Wymiary pod konkretne inwestycje" },
  { label: "Opłaszczowywanie", href: "/lamele/oplaszczowywanie-elementow", description: "Spójna faktura i kolor elementów" },
  { label: "AGD w projektach", href: "/agd", description: "Dobór sprzętu do zabudowy" },
  { label: "AGD do zabudowy", href: "/agd/do-zabudowy", description: "Wymiary, ergonomia, montaż" },
  { label: "AGD wolnostojące", href: "/agd/wolnostojace", description: "Miejsce, odstępy i wygoda" },
  { label: "Małe AGD", href: "/agd/male-agd", description: "Organizacja blatów i stref roboczych" },
  { label: "Cięcie płyt", href: "/uslugi-plytowe/ciecie-plyt", description: "Formatki przygotowane pod projekt" },
  { label: "Oklejanie płyt", href: "/uslugi-plytowe/oklejanie-plyt", description: "Krawędzie dopasowane do dekoru" },
  { label: "Producenci płyt", href: "/materialy-i-fronty/producenci-plyt-meblowych", description: "Dekory, struktury i dobór materiału" },
];

export const baseNavigation = [
  { label: "O nas", href: "/o-nas" },
  { label: "Oferta", href: "/oferta" },
  { label: "Realizacje", href: "/realizacje" },
  { label: "Blog", href: "/blog" },
  { label: "Kontakt", href: "/kontakt" },
  { label: "Umów konsultację", href: "/umow-konsultacje" },
  { label: "Wycena", href: "/wycena" },
  { label: "Polityka prywatności", href: "/polityka-prywatnosci" },
];

export const footerGroups = [
  { title: "Strony", items: baseNavigation },
  { title: "Meble na wymiar", items: offerGroups[0].links },
  { title: "Lamele", items: offerGroups[1].links },
  { title: "AGD", items: offerGroups[2].links },
  { title: "Płyty i materiały", items: [...offerGroups[3].links, ...offerGroups[4].links] },
];

export const requiredPageSlugs = [
  "o-nas",
  "oferta",
  "realizacje",
  "kontakt",
  "umow-konsultacje",
  "wycena",
  "polityka-prywatnosci",
  "oferta/meble-na-wymiar",
  "oferta/meble-kuchenne",
  "oferta/meble-lazienkowe",
  "oferta/meble-biurowe",
  "oferta/meble-do-salonu",
  "oferta/meble-do-sypialni",
  "oferta/meble-do-pokoju-dzieciecego",
  "oferta/garderoby",
  "oferta/zabudowy-nietypowe",
  "oferta/meble-z-litego-drewna-i-fornirowane",
  "lamele",
  "lamele/klient-indywidualny",
  "lamele/sprzedaz-hurtowa",
  "lamele/na-wymiar",
  "lamele/oplaszczowywanie-elementow",
  "agd",
  "agd/do-zabudowy",
  "agd/wolnostojace",
  "agd/male-agd",
  "agd/producenci-agd",
  "uslugi-plytowe",
  "uslugi-plytowe/ciecie-plyt",
  "uslugi-plytowe/oklejanie-plyt",
  "materialy-i-fronty",
  "materialy-i-fronty/plyta-wiorowa",
  "materialy-i-fronty/plyta-mdf",
  "materialy-i-fronty/blaty-laminowane",
  "materialy-i-fronty/blaty-kompaktowe",
  "materialy-i-fronty/blaty-z-litego-drewna",
  "materialy-i-fronty/fronty-lakierowane",
  "materialy-i-fronty/fronty-akrylowe",
  "materialy-i-fronty/fronty-ryflowane",
  "materialy-i-fronty/fronty-tloczone",
  "materialy-i-fronty/producenci-plyt-meblowych",
  "producenci-i-partnerzy",
];
