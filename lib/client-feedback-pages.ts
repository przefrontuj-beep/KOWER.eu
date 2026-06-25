import type { MarketingPage } from "./content";
import { siteConfig } from "./site";

const consultationHref = "/umow-konsultacje";
const estimateHref = "/wycena";

const faqFor = (topic: string) => [
  {
    question: `Jak przygotować zapytanie o ${topic}?`,
    answer:
      "Najlepiej przesłać wstępny szkic z wymiarami, zdjęcia obecnego pomieszczenia oraz rzuty lub inspiracje. Pomoże nam to dobrać odpowiednią technologię i przygotować wstępną wycenę.",
  },
  {
    question: "Czy pomagacie w doborze materiałów?",
    answer:
      "Tak. Podczas konsultacji doradzamy w wyborze płyt, blatów oraz oklein. Prezentujemy próbki od wiodących producentów (Egger, Pfleiderer) i dopasowujemy je do oczekiwanego budżetu.",
  },
  {
    question: "Ile trwa realizacja zamówienia?",
    answer:
      "Czas realizacji zależy od skomplikowania projektu. Standardowo wynosi on od 6 do 8 tygodni dla kuchni i szaf na wymiar, natomiast usługi cięcia i oklejania płyt realizujemy w krótszych terminach.",
  },
];

const process = ["Konsultacja i pomiar", "Wizualizacja i dobór materiałów", "Produkcja stolarska", "Montaż i odbiór"];

const offerCatalogCards = [
  {
    title: "Meble na wymiar",
    description: "Kuchnie, garderoby, zabudowy łazienkowe i meble do salonu tworzone pod wymiar.",
    href: "/oferta/meble-na-wymiar",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Nowoczesne meble kuchenne na wymiar",
  },
  {
    title: "Lamele",
    description: "Lamele dekoracyjne na wymiar, produkcja seryjna i usługi opłaszczowywania.",
    href: "/lamele",
    image: "/client-assets/lamele-glowna.png",
    imageAlt: "Nowoczesne lamele ścienne w aranżacji wnętrza",
  },
  {
    title: "AGD w projektach",
    description: "Zabudowa sprzętu AGD z zachowaniem wymiarów technicznych i ergonomii stref.",
    href: "/agd",
    image: "/realizacje/realizacja-14.jpeg",
    imageAlt: "Czarny sprzęt AGD wbudowany w jasne szafki",
  },
  {
    title: "Usługi płytowe",
    description: "Precyzyjne cięcie płyt i oklejanie krawędzi obrzeżem pod zadany wymiar.",
    href: "/uslugi-plytowe",
    image: "/client-assets/uslugi-plytowe.png",
    imageAlt: "Praca stolarska z płytami",
  },
  {
    title: "Materiały i fronty",
    description: "Płyty MDF, blaty kompaktowe oraz fronty ryflowane i lakierowane.",
    href: "/materialy-i-fronty",
    image: "/client-assets/materialy-glowna.png",
    imageAlt: "Kolekcja materiałów i frontów meblowych Kower",
  },
  {
    title: "Producenci i partnerzy",
    description: "Materiały Egger, Pfleiderer, Blum i zaufane marki maszynowe.",
    href: "/producenci-i-partnerzy",
    image: "/client-assets/materialy-partnerzy.png",
    imageAlt: "Materiały i okucia Blum",
  },
];

const furnitureLinks = [
  { label: "Meble kuchenne", href: "/oferta/meble-kuchenne" },
  { label: "Meble łazienkowe", href: "/oferta/meble-lazienkowe" },
  { label: "Meble biurowe", href: "/oferta/meble-biurowe" },
  { label: "Meble do salonu", href: "/oferta/meble-do-salonu" },
  { label: "Garderoby", href: "/oferta/garderoby" },
  { label: "Zabudowy nietypowe", href: "/oferta/zabudowy-nietypowe" },
];

const lameleLinks = [
  { label: "Klient indywidualny", href: "/lamele/klient-indywidualny" },
  { label: "Sprzedaż hurtowa", href: "/lamele/sprzedaz-hurtowa" },
  { label: "Lamele na wymiar", href: "/lamele/na-wymiar" },
  { label: "Opłaszczowywanie elementów", href: "/lamele/oplaszczowywanie-elementow" },
];

const agdLinks = [
  { label: "AGD do zabudowy", href: "/agd/do-zabudowy" },
  { label: "AGD wolnostojące", href: "/agd/wolnostojace" },
  { label: "Małe AGD", href: "/agd/male-agd" },
  { label: "Producenci AGD", href: "/agd/producenci-agd" },
];

const plateLinks = [
  { label: "Cięcie płyt", href: "/uslugi-plytowe/ciecie-plyt" },
  { label: "Oklejanie płyt", href: "/uslugi-plytowe/oklejanie-plyt" },
  { label: "Producenci płyt", href: "/materialy-i-fronty/producenci-plyt-meblowych" },
];

type PageInput = {
  slug: string;
  title: string;
  eyebrow: string;
  h1: string;
  intro: string;
  image: string;
  imageAlt: string;
  leadTitle?: string;
  lead?: string[];
  benefits: string[];
  process?: string[];
  applications: string[];
  faq?: { question: string; answer: string }[];
  related: { label: string; href: string }[];
  ctaLabel?: string;
  ctaHref?: string;
  metaTitle?: string;
  metaDescription?: string;
  kind?: MarketingPage["kind"];
  catalogCards?: MarketingPage["catalogCards"];
  listNote?: string;
  formVariant?: MarketingPage["formVariant"];
};

function makePage(input: PageInput): MarketingPage {
  return {
    slug: input.slug,
    kind: input.kind ?? "service",
    title: input.title,
    metaTitle: input.metaTitle ?? `${input.title} na wymiar | Kower Pracownia Meblarska`,
    metaDescription:
      input.metaDescription ??
      `Zamów ${input.title.toLowerCase()} na wymiar w Kower. Zapewniamy dokładny pomiar, rzemieślnicze wykończenie i montaż w Kraśniku, Kosinie i woj. lubelskim.`,
    eyebrow: input.eyebrow,
    h1: input.h1,
    intro: input.intro,
    image: input.image,
    imageAlt: input.imageAlt,
    leadTitle: input.leadTitle ?? "Dopasowanie techniczne i estetyka rzemiosła.",
    lead:
      input.lead ??
      [
        "Każdy element meblowy projektujemy pod kątem wygody, optymalnych proporcji i spójności wizualnej.",
        "Wspieramy Cię na każdym etapie: od wstępnej wyceny rzutu, przez dobór płyt i blatów, po precyzyjną instalację w domu.",
      ],
    benefits: input.benefits,
    process: input.process ?? process,
    applications: input.applications,
    faq: input.faq ?? faqFor(input.title),
    related: input.related,
    ctaLabel: input.ctaLabel ?? "Umów bezpłatną konsultację",
    ctaHref: input.ctaHref ?? consultationHref,
    catalogCards: input.catalogCards,
    listNote: input.listNote,
    formVariant: input.formVariant,
  };
}

const furniturePages: MarketingPage[] = [
  makePage({
    slug: "oferta/meble-na-wymiar",
    title: "Meble na wymiar",
    metaTitle: "Meble na wymiar Kraśnik · Kuchnie i szafy | Kower",
    metaDescription: "Projektujemy i produkujemy meble na wymiar: kuchnie, garderoby, łazienki oraz nietypowe zabudowy. Obsługujemy Kraśnik, Janów Lubelski i lubelskie.",
    eyebrow: "Dla Domu i Mieszkania",
    h1: "Meble dopasowane do Twojego stylu życia i przestrzeni.",
    intro:
      "Projektujemy i wykonujemy kuchnie, garderoby oraz nietypowe zabudowy meblowe. Dbamy o rzemieślniczą precyzję, spójność materiałową i detale wykończenia.",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Meble kuchenne i zabudowa na wymiar",
    leadTitle: "Pełen proces stolarski od pomiaru po montaż.",
    lead: [
      "Oferujemy pełne wsparcie stolarskie. Pomagamy dopasować układ wewnętrzny szaf, dobrać zawiasy i szuflady o podwyższonej trwałości oraz optymalnie zaplanować zabudowę AGD, dbając o normy wentylacji i ergonomii stref roboczych.",
      "Nasze realizacje łączą trwałość płyt i blatów premium z ciepłem litego drewna lub forniru, tworząc funkcjonalną przestrzeń na lata. Pracujemy z pełnym poszanowaniem geometrii wnętrza – mierzymy kąty, sprawdzamy piony i dostosowujemy zabudowy do rzeczywistego stanu ścian.",
      "Dbamy o bezszelestne działanie szuflad i frontów przez lata. Stosujemy wyłącznie certyfikowane okucia i systemy ruchome renomowanej austriackiej marki Blum, które są objęte dożywotnią gwarancją producenta. Każda nasza realizacja jest efektem pracy jednego, dedykowanego stolarza prowadzącego projekt od cięcia w warsztacie po montaż u klienta."
    ],
    benefits: [
      "Projekty pod rzeczywisty wymiar i krzywizny ścian.",
      "Szeroki wybór płyt, blatów, fornirów oraz lakierów MDF.",
      "Niezawodne okucia Blum z dożywotnią gwarancją.",
      "Własna, doświadczona ekipa montażowa - bez podwykonawców."
    ],
    applications: ["Kuchnie", "Łazienki", "Garderoby", "Salony i biblioteki", "Zabudowy wnękowe i pod skosami"],
    related: furnitureLinks,
    faq: [
      {
        question: "Jak wygląda proces zamówienia mebli na wymiar?",
        answer: "Proces składa się z 5 kroków: wstępnej rozmowy i wyceny na bazie Twoich rysunków, dokładnego pomiaru laserowego u Ciebie, przygotowania ostatecznego projektu i doboru materiałów, produkcji stolarskiej oraz montażu końcowego."
      },
      {
        question: "Czy wykonujecie montaż mebli?",
        answer: "Tak. Wszystkie meble instalujemy osobiście. Ekipa, która produkuje meble w naszym warsztacie, odpowiada również za ich montaż w Twoim domu. Gwarantuje to idealne spasowanie krawędzi i frontów."
      },
      {
        question: "Z jakich materiałów korzystacie?",
        answer: "Pracujemy na płytach laminowanych i blatach roboczych Egger i Pfleiderer, płytach MDF lakierowanych oraz fornirowanych, a także elementach z litego drewna dębowego czy jesionowego."
      }
    ]
  }),
  
  makePage({
    slug: "oferta/meble-kuchenne",
    title: "Meble kuchenne",
    metaTitle: "Kuchnie na wymiar Kraśnik · Nowoczesne meble kuchenne | Kower",
    metaDescription: "Kuchnie na wymiar w Kraśniku i Kosinie. Trwałe okucia Blum z dożywotnią gwarancją, nowoczesny design, montaż i AGD pod zabudowę. Zamów darmową wycenę!",
    eyebrow: "Kuchnie na wymiar",
    h1: "Kuchnia zaprojektowana pod gotowanie, przechowywanie i styl życia.",
    intro:
      "Projektujemy i wykonujemy kuchnie na wymiar z optymalnym układem stref roboczych i perfekcyjną zabudową urządzeń AGD.",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Jasna kuchnia z drewnianą zabudową i lamelami",
    leadTitle: "Wentylacja, ergonomia i trwałe materiały.",
    lead: [
      "W kuchni liczy się każdy centymetr. Pomagamy rozplanować tzw. trójkąt roboczy (lodówka, zlew, płyta grzewcza) oraz optymalną wysokość blatów, aby codzienne przygotowywanie posiłków było w pełni wygodne, ergonomiczne i bezpieczne dla pleców.",
      "Do produkcji korpusów i frontów kuchennych stosujemy płyty o podwyższonej gęstości oraz wodoodporne kleje poliuretanowe (PUR), co chroni meble przed szkodliwym działaniem pary wodnej i wysokich temperatur w sąsiedztwie piekarnika czy zmywarki.",
      "Zarówno wysokie słupki spiżarniane cargo, jak i narożne półki typu Le Mans dobieramy od szwajcarskiej marki PEKA lub polskiego producenta Rejs. Gwarantuje to pełne wykorzystanie trudnodostępnych przestrzeni i płynne wysuwanie nawet przy pełnym obciążeniu."
    ],
    benefits: [
      "Ergonomiczny układ stref roboczych i szuflad.",
      "Zabudowa urządzeń AGD z zachowaniem norm wentylacyjnych.",
      "Trwałe blaty kompaktowe, laminowane lub fornirowane.",
      "Systemy cargo i zawiasy Blum z cichym domykaniem."
    ],
    applications: ["Kuchnie z wyspą", "Aneksy kuchenne w blokach", "Zabudowy wysokie pod sufit", "Zabudowy spiżarniane"],
    related: [
      { label: "Zabudowa AGD", href: "/agd" },
      { label: "Materiały i fronty", href: "/materialy-i-fronty" },
      { label: "Wycena kuchni", href: "/wycena" }
    ],
    faq: [
      {
        question: "Jak długo czeka się na kuchnię na wymiar?",
        answer: "Średni czas realizacji kuchni od momentu podpisania umowy i zatwierdzenia próbek materiałowych wynosi 6-8 tygodni. Dokładny termin zależy od dostępności wybranych dekorów oraz stopnia skomplikowania okuć."
      },
      {
        question: "Czy pomagacie w rozmieszczeniu gniazdek i przyłączy?",
        answer: "Tak. Po zaakceptowaniu wyceny i wykonaniu pomiaru przygotowujemy dla Twojego elektryka i hydraulika schemat techniczny z wytycznymi, gdzie powinny znaleźć się przyłącza wody, odpływy oraz gniazda zasilające pod AGD."
      }
    ]
  }),

  makePage({
    slug: "oferta/meble-lazienkowe",
    title: "Meble łazienkowe",
    metaTitle: "Meble łazienkowe na wymiar Kraśnik · Szafki pod umywalkę | Kower",
    metaDescription: "Projektujemy i produkujemy szafki podumywalkowe oraz zabudowy łazienkowe na wymiar w Kraśniku i okolicach. Trwałe materiały odporne na wilgoć (kleje PUR).",
    eyebrow: "Estetyka i Odporność",
    h1: "Zabudowy łazienkowe odporne na wilgoć, spasowane z instalacją.",
    intro:
      "Wykonujemy szafki podumywalkowe, słupki i zabudowy pralek, które idealnie współgrają z ceramiką i armaturą.",
    image: "/client-assets/project-bathroom.jpg",
    imageAlt: "Łazienka w naturalnych tonach z zabudową meblową",
    leadTitle: "Materiały stworzone do wymagających warunków.",
    lead: [
      "Meble łazienkowe są stale narażone na wilgoć, bezpośredni kontakt z wodą oraz wahania temperatury. Dlatego krawędzie wszystkich formatek oklejamy przy użyciu wodoodpornego kleju poliuretanowego (PUR), który tworzy szczelną barierę hydroizolacyjną i zapobiega pęcznieniu płyt.",
      "Wszystkie elementy wewnętrzne planujemy tak, aby ułatwić bezproblemowy dostęp do syfonów, zaworów odcinających oraz liczników wody. Szuflady podumywalkowe projektujemy ze specjalnym wycięciem dopasowanym pod syfon, co pozwala na pełne wykorzystanie wolnego miejsca.",
      "Jako blaty łazienkowe najchętniej rekomendujemy ultracienkie blaty kompaktowe HPL (grubość zaledwie 12 mm) lub zaimpregnowane twarde gatunki drewna liściastego (dąb, jesion), które są w pełni niewrażliwe na bezpośrednie działanie wody."
    ],
    benefits: [
      "Pełne zabezpieczenie przed wilgocią (technologia PUR).",
      "Szafki wiszące i stojące docięte pod instalacje hydrauliczne.",
      "Funkcjonalne szuflady z podcięciem pod syfon.",
      "Trwałe blaty z konglomeratu, drewna lub płyt kompaktowych."
    ],
    applications: ["Szafki pod umywalki nablatowe", "Zabudowy wnękowe nad stelażem WC", "Szafy gospodarcze na pralkę i suszarkę", "Półki otwarte i podświetlane"],
    related: [
      { label: "Meble na wymiar", href: "/oferta/meble-na-wymiar" },
      { label: "Materiały i fronty", href: "/materialy-i-fronty" }
    ],
    faq: [
      {
        question: "Czy drewniany blat sprawdzi się w łazience?",
        answer: "Tak, pod warunkiem odpowiedniego zabezpieczenia. Stosujemy twarde gatunki drewna (np. dąb) wykończone specjalnymi oleowoskami lub lakierami jachtowymi, które uniemożliwiają wnikanie wilgoci."
      },
      {
        question: "Jak zabezpieczacie szafki łazienkowe przed wilgocią?",
        answer: "Krawędzie wszystkich elementów oklejamy z użyciem wodoodpornego kleju poliuretanowego (PUR), który tworzy szczelną barierę hydroizolacyjną, zapobiegając pęcznieniu płyt meblowych."
      },
      {
        question: "Jakie okucia są najlepsze do mebli łazienkowych?",
        answer: "Stosujemy systemy szuflad i zawiasów Blum z technologią cichego domyku i powłoką antykorozyjną, co jest kluczowe w warunkach podwyższonej wilgotności powietrza."
      }
    ]
  }),

  makePage({
    slug: "oferta/garderoby",
    title: "Garderoby i szafy",
    metaTitle: "Garderoby i szafy wnękowe na wymiar Kraśnik | Kower",
    metaDescription: "Zamów garderobę lub szafę wnękową przesuwną na wymiar w Kraśniku. Ergonomiczny podział wnętrza, pantografy, oświetlenie LED i cichy domyk.",
    eyebrow: "Optymalne Przechowywanie",
    h1: "Garderoby i szafy wnękowe zaprojektowane pod wymiar Twoich ubrań.",
    intro:
      "Projektujemy i budujemy ergonomiczne systemy przechowywania, garderoby zamknięte oraz szafy z przemyślanym podziałem.",
    image: "/client-assets/hero-dining.jpg",
    imageAlt: "Wnętrze z nowoczesną zabudową garderobianą",
    leadTitle: "Maksymalnie wykorzystana przestrzeń.",
    lead: [
      "Tworzymy zabudowy wnękowe sięgające sufitu, eliminując zbierające kurz szczeliny. Oferujemy ciche systemy drzwi przesuwnych, składanych oraz klasycznych frontów uchylnych, dopasowane do szerokości i przeznaczenia pomieszczenia.",
      "Układ półek, drążków i szuflad dobieramy na podstawie rodzaju ubrań – wydzielamy dedykowane strefy na długie płaszcze, obuwie z systemem wysuwanych półek oraz specjalne szuflady z organizerami na biżuterię, krawaty czy paski.",
      "Dla najwyższych partii szaf montujemy pantografy (wysuwane drążki z rączką), co umożliwia wygodne opuszczenie ubrań bez konieczności używania drabiny. Całość uzupełniamy zintegrowanym oświetleniem LED Design Light wpuszczanym w boki szaf, sterowanym automatycznymi czujnikami."
    ],
    benefits: [
      "Szuflady z pełnym wysuwem na biżuterię i bieliznę.",
      "Drążki z pantografami ułatwiające dostęp to wysokich partii szaf.",
      "Zintegrowane, energooszczędne oświetlenie LED z czujnikami ruchu.",
      "Fronty z lustrami optycznie powiększające pomieszczenie."
    ],
    applications: ["Garderoby w osobnych pokojach", "Szafy wnękowe w przedpokoju", "Zabudowy sypialniane", "Pawłacze i szafy gospodarcze"],
    related: [
      { label: "Meble na wymiar", href: "/oferta/meble-na-wymiar" },
      { label: "Zabudowy nietypowe", href: "/oferta/zabudowy-nietypowe" }
    ],
    faq: [
      {
        question: "Jaka jest minimalna głębokość szafy na ubrania wiszące?",
        answer: "Aby wygodnie wieszać ubrania na klasycznych wieszakach, szafa powinna mieć głębokość min. 60 cm. Dla szaf przesuwnych zalecamy min. 65 cm ze względu na tor jezdny frontów."
      },
      {
        question: "Jakie oświetlenie stosujecie w garderobach?",
        answer: "Instalujemy energooszczędne profile LED wpuszczane w korpus szafy z automatycznymi czujnikami zbliżeniowymi lub ruchu, które włączają się po otwarciu drzwi."
      },
      {
        question: "Co to jest pantograf w szafie i kiedy warto go użyć?",
        answer: "Pantograf to wysuwany drążek ubraniowy z rączką, który pozwala na ergonomiczne opuszczenie ubrań z najwyższych partii szafy. Warto go stosować w szafach sięgających do sufitu."
      }
    ]
  }),

  makePage({
    slug: "oferta/zabudowy-nietypowe",
    title: "Zabudowy nietypowe",
    metaTitle: "Zabudowy nietypowe i meble pod skosami Kraśnik | Kower",
    metaDescription: "Wykonujemy autorskie szafy pod skosami, meble pod schody oraz nietypowe zabudowy wnękowe w Kraśniku. Precyzyjny pomiar laserowy 3D trudnych przestrzeni.",
    eyebrow: "Trudne Przestrzenie",
    h1: "Funkcjonalne szafy pod skosami, schodami i w trudnych wnękach.",
    intro:
      "Projektujemy i wytwarzamy autorskie meble dopasowane do nietypowych kształtów ścian, poddaszy i instalacji domowych.",
    image: "/client-assets/meble-zabudowy-nietypowe.png",
    imageAlt: "Drewniane schody i niestandardowy detal zabudowy",
    leadTitle: "Meble dopasowane do architektury budynku.",
    lead: [
      "Tam, gdzie standardowe meble z salonów sieciowych nie pasują, my tworzymy rozwiązania dedykowane. Dzięki dokładnym pomiarom laserowym 3D projektujemy fronty ścięte pod dowolnym kątem, idealnie dopasowane do skosów poddasza czy schodów.",
      "Maskujemy rury, liczniki, rozdzielacze ogrzewania czy piony wentylacyjne, zachowując estetyczną i jednolitą linię frontów meblowych. Jednocześnie dbamy o to, by elementy te posiadały ukryte klapy rewizyjne zapewniające natychmiastowy dostęp serwisowy.",
      "Wykorzystujemy nietypowe wnęki do stworzenia pojemnych schowków, szaf gospodarczych na pralkę i suszarkę (z wyciszeniem drgań) lub wysuwanych szuflad cargo pod schodami, co pozwala zagospodarować każdy wolny centymetr."
    ],
    benefits: [
      "Pełne zagospodarowanie wnęk i skosów poddasza.",
      "Schowki i szuflady wkomponowane pod konstrukcję schodów.",
      "Możliwość ukrycia urządzeń technicznych z zachowaniem dostępu serwisowego.",
      "Materiały spasowane kolorystycznie z panelami lub ościeżnicami."
    ],
    applications: ["Pokoje ze skosami na poddaszu", "Zabudowy wolnych wnęk pod schodami", "Zabudowy pralni i spiżarni", "Maskownice pionów i liczników"],
    related: [
      { label: "Meble na wymiar", href: "/oferta/meble-na-wymiar" },
      { label: "Usługi płytowe", href: "/uslugi-plytowe" }
    ],
    faq: [
      {
        question: "Czy wykonujecie meble na poddasza ze skosami?",
        answer: "Tak. Mierzymy kąt nachylenia dachu laserowo i projektujemy fronty oraz półki, które idealnie przylegają do skosu, maksymalizując przestrzeń do przechowywania."
      },
      {
        question: "Jak maskujecie rury i piony techniczne?",
        answer: "Projektujemy estetyczne maskownice z płyt meblowych lub MDF, które zakrywają elementy instalacji, ale jednocześnie posiadają ukryte klapy rewizyjne zapewniające dostęp serwisowy."
      },
      {
        question: "Czy można zamontować szafę pod schodami?",
        answer: "Tak. Projektujemy wysuwane carga na buty, szafki ubraniowe lub szuflady dopasowane pod stopnie schodów, co pozwala na pełne zagospodarowanie tej przestrzeni."
      }
    ]
  }),

  makePage({
    slug: "oferta/meble-biurowe",
    title: "Meble biurowe",
    metaTitle: "Meble biurowe na wymiar Kraśnik · Gabinety i biurka | Kower",
    metaDescription: "Stwórz funkcjonalne biuro lub domowy gabinet home office. Zamów biurko na wymiar, szafy na dokumenty i regały o wzmocnionej konstrukcji w Kraśniku.",
    eyebrow: "Ergonomia i Funkcja",
    h1: "Zabudowy gabinetów, biurka pod wymiar i regały na dokumenty.",
    intro: "Tworzymy funkcjonalne meble do domowych gabinetów oraz biur firmowych, dbając o trwałość blatów i organizację okablowania.",
    image: "/client-assets/project-office.jpg",
    imageAlt: "Biurko drewniane i regały biurowe na wymiar",
    leadTitle: "Półki i blaty odporne na duże obciążenia.",
    lead: [
      "Projektujemy i produkujemy ergonomiczne meble do domowych gabinetów oraz biur firmowych, dbając o trwałość blatów i organizację okablowania.",
      "W regałach na dokumenty stosujemy wzmocnione półki o grubości 25 lub 36 mm, zapobiegające ich uginaniu pod ciężarem segregatorów."
    ],
    benefits: [
      "Biurka dopasowane do wzrostu i przestrzeni.",
      "Regały o wzmocnionej konstrukcji pod ciężar dokumentów.",
      "Maskownice kabli, mediaportów i sprzętu komputerowego.",
      "Odporne na ścieranie blaty o grubości dopasowanej do potrzeb."
    ],
    applications: ["Gabinety domowe (home office)", "Recepcje i hole", "Szafy na dokumentację pracowniczą", "Sale konferencyjne"],
    related: [{ label: "Meble na wymiar", href: "/oferta/meble-na-wymiar" }],
    faq: [
      {
        question: "Jak rozwiązać problem kabli na biurku?",
        answer: "W blatach biurek montujemy mediaporty, przepusty kablowe oraz ukryte pod blatem rynny na przedłużacze i przewody, dzięki czemu stanowisko pracy pozostaje uporządkowane."
      },
      {
        question: "Z jakich materiałów wykonuje się blaty biurek?",
        answer: "Najczęściej stosujemy odporne na ścieranie płyty laminowane o grubości 28-36 mm lub naturalny blat dębowy zabezpieczony twardym oleowoskiem."
      }
    ]
  }),

  makePage({
    slug: "oferta/meble-do-salonu",
    title: "Meble do salonu",
    metaTitle: "Meble do salonu na wymiar Kraśnik · Zabudowy RTV | Kower",
    metaDescription: "Zaprojektuj salon swoich marzeń. Wykonujemy nowoczesne szafki RTV pod telewizor, wiszące regały, biblioteczki i szafy wnękowe w Kraśniku i Kosinie.",
    eyebrow: "Strefa Dzienna",
    h1: "Zabudowy RTV, regały na książki i komody dopasowane do stylu wnętrza.",
    intro: "Wykonujemy nowoczesne ściany telewizyjne, biblioteczki oraz szafki, które porządkują strefę dzienną.",
    image: "/client-assets/hero-dining.jpg",
    imageAlt: "Nowoczesny salon z zabudową z naturalnego drewna",
    leadTitle: "Estetyka ukrytych instalacji.",
    lead: [
      "Salon to serce domu. Tworzymy wiszące i stojące zabudowy RTV z ukrytym systemem odprowadzania przewodów oraz nowoczesne biblioteki.",
      "Dopasowujemy kolorystykę frontów i korpusów do koloru podłóg oraz ścian, łącząc płyty meblowe z akcentami z drewna lub forniru."
    ],
    benefits: [
      "Zabudowy RTV z ukrytym systemem odprowadzania przewodów.",
      "Witryny ze szkłem hartowanym i subtelnym podświetleniem LED.",
      "Materiały dobrane pod kolorystykę ścian i podłogi.",
      "Lekkie, podwieszane konstrukcje mebli."
    ],
    applications: ["Szafki RTV podwieszane i stojące", "Regały biblioteczne", "Komody na wymiar", "Ściany dekoracyjne z lamelami"],
    related: [{ label: "Lamele ścienne", href: "/lamele" }],
    faq: [
      {
        question: "Jak ukryć kable od telewizora w zabudowie RTV?",
        answer: "Projektujemy szafkę RTV z dedykowanymi kanałami kablowymi wewnątrz korpusu lub podwójną ścianką tylną, co pozwala całkowicie ukryć przewody od zasilania i konsoli."
      },
      {
        question: "Czy montujecie podświetlenie LED w witrynach?",
        answer: "Tak. Instalujemy energooszczędne oświetlenie LED wpuszczane w półki szklane lub w korpus szafki, sterowane wygodnie pilotem lub włącznikiem bezdotykowym."
      }
    ]
  }),

  makePage({
    slug: "oferta/meble-do-sypialni",
    title: "Meble do sypialni",
    metaTitle: "Meble do sypialni na wymiar Kraśnik · Toaletki | Kower",
    metaDescription: "Nowoczesne szafy ubraniowe, łóżka z szufladami i toaletki wiszące na wymiar w Kraśniku. Wybierz wyciszający klimat i naturalne dekory od Kower.",
    eyebrow: "Prywatna Przestrzeń",
    h1: "Szafy ubraniowe, toaletki i łóżka zintegrowane z zabudową sypialni.",
    intro: "Projektujemy i tworzymy meble tworzące przytulny, wyciszający klimat w Twojej sypialni.",
    image: "/client-assets/project-stairs.jpg",
    imageAlt: "Stolarka w sypialni i naturalne drewno dębowe",
    leadTitle: "Komfortowa i funkcjonalna przestrzeń nocna.",
    lead: [
      "Projektujemy meble tworzące przytulny, wyciszający klimat w Twojej sypialni. Wykonujemy szafy z drzwiami przesuwnymi i toaletki.",
      "Oferujemy łóżka zintegrowane z szafkami nocnymi oraz miękkimi panelami tapicerowanymi w wezgłowiu."
    ],
    benefits: [
      "Pojemne szafy ubraniowe dopasowane do wnęki.",
      "Toaletki z podświetlanym lustrem i szufladami na kosmetyki.",
      "Szafki nocne zintegrowane z wezgłowiem łóżka.",
      "Materiały o ciepłym rysunku usłojenia i matowych powierzchniach."
    ],
    applications: ["Szafy z drzwiami uchylnymi", "Łóżka z szufladami na pościel", "Toaletki wiszące", "Panele tapicerowane i ścienne"],
    related: [{ label: "Garderoby", href: "/oferta/garderoby" }],
    faq: [
      {
        question: "Jakie fronty wybrać do szafy w sypialni?",
        answer: "Najlepiej sprawdzają się fronty w wykończeniu matowym odpornym na odciski (np. akrylowe) lub naturalne dekory drewna, które dodają wnętrzu przytulności."
      },
      {
        question: "Czy wykonujecie łóżka z pojemnikami na pościel?",
        answer: "Tak, wykonujemy solidne konstrukcje łóżek ze skrzynią i podnośnikami gazowymi (stelaże metalowe), co zapewnia dużą przestrzeń do przechowywania pod materacem."
      }
    ]
  }),

  makePage({
    slug: "oferta/meble-do-pokoju-dzieciecego",
    title: "Meble dziecięce",
    metaTitle: "Meble dziecięce na wymiar Kraśnik · Pokój dziecka | Kower",
    metaDescription: "Zaprojektuj bezpieczną i modułową przestrzeń dla dziecka. Wykonujemy biurka ergonomiczne, łóżka i regały na zabawki na wymiar w Kraśniku.",
    eyebrow: "Pokój Dziecka",
    h1: "Bezpieczne meble do nauki, zabawy i przechowywania zabawek.",
    intro: "Wykonujemy łóżka, biurka i regały dostosowane do wzrostu dziecka i odporne na intensywne użytkowanie.",
    image: "/client-assets/meble-do-pokoju-dzieciecego.png",
    imageAlt: "Pokój dziecięcy z jasną zabudową biurkową",
    leadTitle: "Projektowanie przyjazne najmłodszym.",
    lead: [
      "Wykonujemy łóżka, biurka i regały dostosowane do wzrostu dziecka i odporne na intensywne użytkowanie w codziennych zabawach.",
      "Dbamy o zaokrąglone krawędzie elementów meblowych oraz stabilność konstrukcji regałów przykręcanych do ścian."
    ],
    benefits: [
      "Bezpieczne, zaokrąglone krawędzie elementów meblowych.",
      "Materiały łatwe w czyszczeniu i odporne na zarysowania.",
      "Szuflady z blokadą wypadania i systemami bezpiecznego domyku.",
      "Modułowe rozwiązania rosnące wraz z dzieckiem."
    ],
    applications: ["Biurka ergonomiczne", "Regały na książki i zabawki", "Szafy ubraniowe", "Zabudowy łóżek jedno- i piętrowych"],
    related: [{ label: "Meble na wymiar", href: "/oferta/meble-na-wymiar" }],
    faq: [
      {
        question: "Z jakich materiałów produkuje się meble dla dzieci?",
        answer: "Stosujemy płyty laminowane z certyfikatami higienicznymi o niskiej emisji formaldehydu, łatwe w czyszczeniu i odporne na uderzenia."
      },
      {
        question: "Jak zabezpieczyć szuflady w pokoju dziecka?",
        answer: "Stosujemy systemy Blum z amortyzacją (cichy domyk), co zapobiega gwałtownemu przytrzaśnięciu palców dziecka."
      }
    ]
  }),

  makePage({
    slug: "oferta/meble-z-litego-drewna-i-fornirowane",
    title: "Meble fornirowane i z litego drewna",
    metaTitle: "Meble z litego drewna i fornirowane Kraśnik · Stoły | Kower",
    metaDescription: "Wytwarzamy stoły dębowe, blaty łazienkowe z drewna i fronty fornirowane na wymiar w Kraśniku. Szlachetne rzemiosło wykończone oleowoskiem.",
    eyebrow: "Premium Rzemiosło",
    h1: "Stoły, blaty i fronty z naturalnego drewna oraz fornirów dębowych.",
    intro: "Wytwarzamy meble o wyjątkowym rysunku usłojenia, wykończone naturalnymi oleowoskami i lakierami.",
    image: "/client-assets/wood-detail.jpg",
    imageAlt: "Praca z naturalnym drewnem i precyzyjne łączenia",
    leadTitle: "Szlachetność i niepowtarzalność materiału.",
    lead: [
      "Wytwarzamy meble o wyjątkowym rysunku usłojenia, wykończone naturalnymi oleowoskami i lakierami o wysokiej odporności.",
      "Łączymy naturalny fornir dębowy i jesionowy z konstrukcjami stalowymi malowanymi proszkowo, tworząc meble w stylu loftowym."
    ],
    benefits: [
      "Naturalny rysunek usłojenia i unikalna struktura drewna.",
      "Forniry modyfikowane i naturalne o podwyższonej estetyce.",
      "Wykończenia odporne na plamy i temperaturę (oleje Rubio Monocoat).",
      "Solidna konstrukcja z litego drewna dębowego, jesionowego lub orzechowego."
    ],
    applications: ["Stoły jadalniane i kawowe", "Fronty szafek fornirowane", "Blaty kuchenne i łazienkowe z drewna", "Detale konstrukcyjne i wykończeniowe"],
    related: [
      { label: "Kuchnie na wymiar", href: "/oferta/meble-kuchenne" },
      { label: "Materiały i fronty", href: "/materialy-i-fronty" }
    ],
    faq: [
      {
        question: "Czym różni się lite drewno od forniru?",
        answer: "Lite drewno to jednorodny materiał z pnia drzewa. Fornir to cienkie płaty naturalnego drewna naklejane na płytę MDF. Fornir zapewnia stabilność wymiarową (nie pęka) i pozwala na zachowanie spójnego rysunku usłojenia."
      },
      {
        question: "Jak dbać o drewniany stół lub blat?",
        answer: "Należy unikać zalania stojącą wodą i gorących naczyń bezpośrednio na drewnie. Do pielęgnacji zalecamy miękkie ściereczki i odnawianie powłoki olejowosku raz w roku."
      }
    ]
  })
];

const lamelePages: MarketingPage[] = [
  makePage({
    slug: "lamele",
    title: "Lamele",
    metaTitle: "Lamele ścienne Kraśnik · Producent lameli na wymiar | Kower",
    metaDescription: "Jako producent oferujemy lamele ścienne i sufitowe na wymiar w Kraśniku. Wykończenie fornirem dębowym, lakierem lub folią premium. Szybki montaż i dostawa.",
    eyebrow: "Lamele Ścienne",
    h1: "Lamele dekoracyjne na wymiar – dla domów i zamówień hurtowych.",
    intro:
      "Produkujemy lamele ścienne i sufitowe w szerokiej palecie dekorów, idealne na ściany TV, do biur i lokali usługowych.",
    image: "/client-assets/lamele-glowna.png",
    imageAlt: "Detal nowoczesnej aranżacji ściennej z lamelami",
    leadTitle: "Estetyczny podział i izolacja akustyczna.",
    lead: [
      "Lamele to nowoczesny sposób na wykończenie ścian. Optycznie wydłużają pomieszczenie i znacząco poprawiają jego akustykę, redukując pogłos i echo w przestrzeniach z dużymi przeszkleniami lub podłogami z płytek.",
      "Dzięki własnej linii produkcyjnej wykonujemy lamele o dowolnym przekroju (np. 30x40 mm, 40x20 mm), z precyzyjnym rozstawem na gotowych płytach nośnych. Pozwala to na sprawny montaż bez konieczności pracochłonnego odmierzania i klejenia każdej listwy osobno.",
      "Do wykończenia lameli stosujemy najwyższej jakości naturalny fornir dębowy zabezpieczony matowym olejem lub folie polimerowe premium o strukturze synchronicznej, co gwarantuje pełną zgodność kolorystyczną z pozostałymi meblami w pokoju."
    ],
    benefits: [
      "Dowolny wymiar, rozstaw i grubość lameli.",
      "Trwałe dekory drewnopodobne oraz forniry dębowe.",
      "Możliwość montażu na suficie i ścianach.",
      "Szybkie przygotowanie formatek pod montaż."
    ],
    applications: ["Ściany telewizyjne", "Przedpokoje i wiatrołapy", "Wykończenie sufitów", "Wyciszenie biur i gabinetów"],
    related: lameleLinks,
    ctaLabel: "Poproś o wycenę lameli",
    ctaHref: estimateHref,
    faq: [
      {
        question: "Z czego produkowane są lamele Kower?",
        answer: "Nasze lamele produkujemy na bazie wilgocioodpornego MDF-u, który oklejamy foliami premium lub naturalnym fornirem dębowym, lakierowanym lub olejowanym. Zapewnia to stabilność wymiarową (lamele nie wyginają się z czasem)."
      },
      {
        question: "Jak wygląda montaż lameli?",
        answer: "Lamele możemy dostarczyć jako pojedyncze listwy do samodzielnego przyklejenia klejem montażowym lub w postaci gotowych paneli na płycie bazowej (czarnej, szarej lub w dekorze drewna), które wystarczy przykręcić do ściany."
      }
    ]
  }),
  
  makePage({
    slug: "lamele/klient-indywidualny",
    title: "Lamele dla domu",
    metaTitle: "Lamele ścienne do salonu i przedpokoju Kraśnik | Kower",
    metaDescription: "Stylowe lamele do mieszkań i domów jednorodzinnych w Kraśniku. Panele na czarnej płycie MDF, pojedyncze listwy i docięcia pod sufit. Darmowa wycena.",
    eyebrow: "Dla Klientów Indywidualnych",
    h1: "Ocieplenie wnętrza salonu, przedpokoju i sypialni lamelami ściennymi.",
    intro:
      "Dopasowujemy kolorystykę, rytm i układ lameli dekoracyjnych do Twojego mieszkania.",
    image: "/client-assets/lamele-dom.png",
    imageAlt: "Wnętrze jadalni ocieplone lamelami drewnianymi",
    leadTitle: "Przytulny akcent i redukcja pogłosu.",
    lead: [
      "Pomożemy Ci dobrać odcień lameli do paneli podłogowych, stolarki drzwiowej oraz frontów szafek kuchennych.",
      "Lamele to sprawdzony sposób na wyciszenie sypialni czy salonu oraz przełamanie chłodnych barw gładkich ścian."
    ],
    benefits: [
      "Kolorystyka dobrana do posiadanych mebli i podłogi.",
      "Długości lameli docięte pod wysokość pokoju (brak sztukowania).",
      "Pomoc w zaplanowaniu przejścia kabli pod telewizor.",
      "Indywidualny kosztorys na podstawie wymiarów ściany."
    ],
    applications: ["Ściana za telewizorem w salonie", "Ściana z wieszakami w przedpokoju", "Zagłówek za łóżkiem w sypialni", "Wydzielenie strefy jadalnianej"],
    related: lameleLinks,
    faq: [
      {
        question: "Jak dopasować kolor lameli do wnętrza?",
        answer: "Pomożemy Ci dobrać odcień lameli do paneli podłogowych, drzwi oraz frontów mebli kuchennych podczas wizyty u nas lub w trakcie pomiaru."
      },
      {
        question: "Czy montujecie lamele u klienta?",
        answer: "Tak. Świadczymy kompletną usługę wraz z transportem i precyzyjnym montażem lameli na ścianach lub sufitach w Kraśniku i okolicach."
      }
    ]
  }),

  makePage({
    slug: "lamele/sprzedaz-hurtowa",
    title: "Lamele hurtowe",
    metaTitle: "Lamele hurtowo B2B · Producent lameli meblowych | Kower",
    metaDescription: "Hurtowa produkcja seryjna lameli ściennych dla deweloperów, wykonawców i stolarzy. Gwarancja powtarzalności serii i atrakcyjne ceny B2B.",
    eyebrow: "B2B i Inwestycje",
    h1: "Hurtowe dostawy lameli ściennych dla deweloperów, stolarzy i firm.",
    intro:
      "Dostarczamy duże ilości i powtarzalne serie lameli ściennych o stałych parametrach technicznych.",
    image: "/client-assets/lamele-hurt.png",
    imageAlt: "Przestrzeń biurowa z dekoracyjną ścianą z lameli",
    leadTitle: "Partnerstwo w dostawach dla inwestycji.",
    lead: [
      "Obsługujemy zamówienia inwestycyjne na potrzeby hoteli, biur oraz inwestycji mieszkaniowych. Oferujemy powtarzalność odcienia oraz terminowe dostawy.",
      "Zapewniamy wsparcie techniczne przy doborze systemów mocowania na dużych powierzchniach ściennych i sufitowych."
    ],
    benefits: [
      "Atrakcyjne ceny hurtowe zależne od wolumenu zamówienia.",
      "Gwarancja powtarzalności koloru w kolejnych partiach.",
      "Pakowanie zabezpieczające elementy na czas transportu.",
      "Wykonanie na bazie projektów technicznych B2B."
    ],
    applications: ["Hotele i pensjonaty", "Biura i sale konferencyjne", "Salony kosmetyczne i gabinety", "Współpraca z zakładami stolarskimi"],
    related: lameleLinks,
    ctaLabel: "Zapytaj o warunki hurtowe",
    ctaHref: estimateHref,
    formVariant: "wholesale",
    faq: [
      {
        question: "Jakie są korzyści ze współpracy hurtowej?",
        answer: "Zapewniamy atrakcyjne rabaty ilościowe, stały dostęp do oferty dekorów, powtarzalność odcieni oraz szybką realizację zamówień seryjnych."
      },
      {
        question: "Czy produkujecie lamele według specyfikacji CAD?",
        answer: "Tak. Realizujemy zlecenia seryjne ściśle według rysunków technicznych i plików CAD dostarczonych przez biura projektowe lub deweloperów."
      }
    ]
  }),

  makePage({
    slug: "lamele/na-wymiar",
    title: "Lamele na wymiar",
    metaTitle: "Lamele na wymiar Kraśnik · Dowolna wysokość i przekrój | Kower",
    metaDescription: "Lamele dekoracyjne produkowane pod indywidualny wymiar (do 300 cm bez łączeń). Wybierz własny przekrój i kolor z palety RAL/NCS. Pomiar i montaż.",
    eyebrow: "Precyzyjne Wymiary",
    h1: "Lamele ścienne dopasowane do nietypowych wysokości i wnęk.",
    intro:
      "Wykonujemy lamele o niestandardowych grubościach, szerokościach i długościach pod konkretne projekty.",
    image: "/client-assets/lamele-wymiar.png",
    imageAlt: "Precyzyjne dopasowanie lameli do wysokości ściany",
    leadTitle: "Estetyka bez kompromisów.",
    lead: [
      "Eliminujemy konieczność poprzecznego sztukowania lameli przy wysokich sufitach. Produkujemy je w pełnej długości (nawet do 300 cm).",
      "Dobieramy dowolną grubość listwy i szerokość przerw, by zachować idealną symetrię kompozycji ściennej na skośnych i trudnych ścianach."
    ],
    benefits: [
      "Długość dopasowana do wnęki bez odpadów produkcyjnych.",
      "Dowolny przekrój i szerokość szczelin między lamelami.",
      "Wykończenie fornirem naturalnym lub lakierem z palety RAL/NCS.",
      "Pomiar laserowy i montaż stolarski w cenie realizacji."
    ],
    applications: ["Ściany o wysokości powyżej 280 cm", "Zabudowy sufitowe o skomplikowanym kształcie", "Maskowanie szafek w lamelach", "Zabudowy skośne i narożne"],
    related: lameleLinks,
    faq: [
      {
        question: "Czy robicie lamele o niestandardowym przekroju?",
        answer: "Tak, jako producent możemy dopasować grubość i szerokość pojedynczej listwy (np. 30x40 mm, 40x20 mm) do założeń projektu architektonicznego."
      },
      {
        question: "Czy lamele na wymiar można lakierować na dowolny kolor?",
        answer: "Tak, lakierujemy lamele MDF na dowolny odcień z palety RAL lub NCS, a także oferujemy forniry naturalne dębowe barwione na wybrany kolor."
      }
    ]
  }),

  makePage({
    slug: "lamele/oplaszczowywanie-elementow",
    title: "Opłaszczowywanie elementów",
    metaTitle: "Opłaszczowywanie profili i listew meblowych | Kower",
    metaDescription: "Precyzyjne oklejanie i opłaszczowywanie elementów meblowych oraz lameli foliami premium. Zapewniamy spójną powierzchnię bez widocznych spoin na rogach.",
    eyebrow: "Technologia Wykończenia",
    h1: "Opłaszczowywanie profili i listew dla uzyskania spójnej powierzchni.",
    intro:
      "Zapewniamy jednolitą teksturę i kolor na elementach meblowych i lamelach o skomplikowanym przekroju.",
    image: "/client-assets/lamele-oplaszczowywanie.png",
    imageAlt: "Drewniane elementy meblowe po obróbce i oklejeniu",
    leadTitle: "Doskonała spoina i ochrona krawędzi.",
    lead: [
      "Technologia opłaszczowywania pozwala na pokrycie całego elementu wybranym dekorem bez widocznych spoin na krawędziach.",
      "Sprawdza się to doskonale w produkcji seryjnej lameli, listew przypodłogowych oraz elementów dekoracyjnych mebli."
    ],
    benefits: [
      "Brak widocznych łączeń folii na krawędziach profili.",
      "Wysoka odporność mechaniczna na narożnikach.",
      "Spójność dekoru z płytami meblowymi wiodących marek.",
      "Wykończenie elementów prostych, litych oraz profilowanych."
    ],
    applications: ["Lamele ścienne", "Opaski drzwiowe i ościeżnice", "Listwy cokołowe i wykończeniowe", "Profile meblowe i dekoracyjne"],
    related: [
      { label: "Lamele hurtowe", href: "/lamele/sprzedaz-hurtowa" },
      { label: "Cięcie i oklejanie", href: "/uslugi-plytowe" }
    ],
    faq: [
      {
        question: "Na czym polega technologia opłaszczowywania?",
        answer: "Jest to proces nakładania folii dekoracyjnej lub forniru na profilowane elementy (listwy, profile) z użyciem kleju poliuretanowego, co gwarantuje pokrycie powierzchni bez widocznej spoiny."
      },
      {
        question: "Jakie materiały można opłaszczowywać?",
        answer: "Najczęściej opłaszczowujemy elementy na bazie MDF-u lub drewna iglastego, pokrywając je foliami PVC, PP, a także naturalnymi okleinami (fornirem)."
      }
    ]
  })
];

const agdPages: MarketingPage[] = [
  makePage({
    slug: "agd",
    title: "AGD w projektach",
    metaTitle: "Zabudowa sprzętu AGD Kraśnik · Montaż w meblach | Kower",
    metaDescription: "Planujemy i montujemy urządzenia AGD in zabudowie kuchennej. Dbamy o techniczne wymogi wentylacji, dylatacji i ergonomii. Sprawdź naszą ofertę!",
    eyebrow: "Zabudowa Kuchenna",
    h1: "Dobór i montaż urządzeń AGD zintegrowanych z meblami kuchennymi.",
    intro:
      "Projektujemy wnęki meblowe pod lodówki, piekarniki, zmywarki i okapy zgodnie z kartami technicznymi producentów.",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Kuchnia ze zintegrowanym okapem i płytą grzewczą",
    leadTitle: "Bezpieczny montaż i weryfikacja parametrów.",
    lead: [
      "Zabudowa AGD wymaga technicznej dyscypliny. Zły montaż lodówki lub piekarnika może prowadzić do przegrzania sprzętu, podwyższonego poboru energii, a w skrajnych przypadkach – do uszkodzenia mebli i utraty gwarancji producenta.",
      "Weryfikujemy oficjalne karty techniczne urządzeń i przygotowujemy wnęki meblowe z zachowaniem precyzyjnych szczelin dylatacyjnych oraz kratek wentylacyjnych w cokołach dolnych i wieńcach górnych szafek.",
      "Dopasowujemy fronty meblowe do zmywarek przy użyciu profesjonalnych zawiasów ślizgowych, co eliminuje problem haczenia frontu o cokół. Całość instalacji elektrycznej oraz przyłączy hydraulicznych planujemy w szafkach sąsiednich, co zapewnia bezpieczny dostęp."
    ],
    benefits: [
      "Analiza wentylacji szafek pod lodówki i piekarniki.",
      "Idealne dopasowanie frontów do zmywarek z zawiasami ślizgowymi.",
      "Ergonomiczne rozmieszczenie urządzeń w słupkach kuchennych.",
      "Montaż sprzętu z zachowaniem gwarancji producenta."
    ],
    applications: ["Słupki kuchenne pod piekarnik i mikrofalę", "Zabudowy lodówek jednodrzwiowych i Side-by-Side", "Instalacja okapów podszafkowych i wyspowych", "Szuflady grzewcze i ekspresy do kawy"],
    related: agdLinks,
    faq: [
      {
        question: "Czy montujecie sprzęt AGD zakupiony przez klienta?",
        answer: "Tak. Przy montażu mebli osadzamy i podłączamy sprzęt AGD. Warunkiem jest dostarczenie kart technicznych urządzeń na etapie projektowania mebli, co pozwala nam przygotować wnęki o odpowiednich wymiarach."
      },
      {
        question: "Czy podłączacie płyty indukcyjne?",
        answer: "Osadzamy płyty indukcyjne w blacie (w tym na równi z blatem). Podłączenie do instalacji elektrycznej 400V powinno być wykonane przez elektryka z uprawnieniami SEP w celu zachowania gwarancji."
      }
    ]
  }),
  
  makePage({
    slug: "agd/do-zabudowy",
    title: "AGD do zabudowy",
    metaTitle: "Zabudowa lodówki i piekarnika w kuchni Kraśnik | Kower",
    metaDescription: "Projektujemy i montujemy piekarniki, mikrofale, zmywarki i lodówki pod zabudowę. Dbamy o kratki wentylacyjne w cokołach i odpowiednie światło wnęki.",
    eyebrow: "Integracja",
    h1: "Projektowanie zabudów kuchennych pod piekarniki, mikrofale, zmywarki i lodówki z uwzględnieniem wentylacji.",
    intro: "Projektowanie zabudów kuchennych pod piekarniki, mikrofale, zmywarki i lodówki z uwzględnieniem szczelin wentylacyjnych.",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Zabudowa kuchenna dopasowana do AGD",
    leadTitle: "Prawidłowa cyrkulacja powietrza.",
    lead: [
      "Montaż zmywarki pod zabudowę wymaga precyzyjnego wyregulowania frontu meblowego. Używamy zawiasów o dużym udźwigu, by front działał lekko.",
      "W szafkach pod lodówki montujemy kratki wentylacyjne w cokole dolnym oraz wieńcu górnym, zapewniając prawidłowy obieg powietrza wokół lodówki i piekarnika."
    ],
    benefits: [
      "Słupki kuchenne dopasowane do wysokości oczu.",
      "Właściwy obieg powietrza wokół lodówki i piekarnika.",
      "Estetyczna spójność frontów bez widocznych szczelin.",
      "Wzmocnione konstrukcje półek pod ciężkie piekarniki."
    ],
    applications: ["Piekarniki i mikrofale w słupku", "Zmywarki ze zintegrowanym panelem", "Lodówki pod zabudowę", "Okapy wbudowane w szafki"],
    related: agdLinks,
    faq: [
      {
        question: "Dlaczego wentylacja lodówki pod zabudowę jest ważna?",
        answer: "Brak odpowiedniego przepływu powietrza powoduje przegrzewanie kompresora lodówki, co drastycznie zwiększa pobór prądu i może doprowadzić do awarii sprzętu."
      },
      {
        question: "Jakie zawiasy stosuje się do zmywarki pod zabudowę?",
        answer: "Stosujemy okucia dopasowane do typu zmywarki. Przy frontach o pełnej wysokości szafek kuchennych najchętniej wybieramy zawiasy ślizgowe, które zapobiegają haczeniu o cokół dolny."
      }
    ]
  }),

  makePage({
    slug: "agd/wolnostojace",
    title: "AGD wolnostojące",
    metaTitle: "Zabudowa lodówek wolnostojących Side-by-Side | Kower",
    metaDescription: "Planujemy wnęki kuchenne i zabudowy pod lodówki wolnostojące Side-by-Side oraz pralki. Dbamy o dylatacje wentylacyjne i wygodne otwieranie drzwi.",
    eyebrow: "Sprzęt Wolnostojący",
    h1: "Planowanie przestrzeni na lodówki Side-by-Side, pralki i suszarki z dylatacją.",
    intro: "Planowanie przestrzeni na lodówki Side-by-Side, pralki i suszarki z zachowaniem odpowiednich odstępów dylatacyjnych.",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Zabudowa kuchenna dopasowana do AGD",
    leadTitle: "Przestrzeń dylatacyjna we wnękach.",
    lead: [
      "Lodówki wolnostojące potrzebują przestrzeni dylatacyjnej po bokach i z tyłu do oddawania ciepła. Dbamy o to, by te szczeliny wyglądały estetycznie.",
      "W pralniach i spiżarniach planujemy zabudowy tak, aby pralki wolnostojące nie przenosiły drgań na konstrukcję mebli."
    ],
    benefits: [
      "Bezpieczne odległości dylatacyjne pod lodówki.",
      "Konstrukcje wygłuszające drgania pralek.",
      "Estetyczne dopasowanie linii frontów mebli.",
      "Łatwy dostęp do filtrów i przyłączy wody."
    ],
    applications: ["Lodówki wolnostojące", "Pralki i suszarki w pralniach", "Kuchenki gazowe i elektryczne", "Mini-chłodziarki"],
    related: agdLinks,
    faq: [
      {
        question: "Ile luzu należy zostawić wokół lodówki wolnostojącej?",
        answer: "W zależności od modelu producent zazwyczaj wymaga pozostawienia od 2 do 5 cm wolnej przestrzeni po bokach i z tyłu urządzenia, aby zapewnić oddawanie ciepła."
      },
      {
        question: "Czy pralka w zabudowie może powodować drgania mebli?",
        answer: "Tak, dlatego pralkę wolnostojącą umieszczamy w odpowiednio szerszej wnęce (z zachowaniem min. 1.5 cm luzu z każdej strony), a blat opieramy na niezależnych bokach podporowych."
      }
    ]
  }),

  makePage({
    slug: "agd/male-agd",
    title: "Małe AGD",
    metaTitle: "Szafki roletowe na małe AGD w kuchni | Kower",
    metaDescription: "Zorganizuj blat roboczy. Projektujemy szafki roletowe stojące na blacie i wysuwane cargo na ekspres do kawy, mikser i robot kuchenny.",
    eyebrow: "Organizacja Blatu",
    h1: "Przechowywanie ekspresów do kawy i robotów kuchennych w dedykowanych szafkach.",
    intro: "Przechowywanie ekspresów do kawy, robotów kuchennych i tosterów w dedykowanych szafkach roletowych lub cargo.",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Zabudowa kuchenna dopasowana do AGD",
    leadTitle: "Porządek na blacie kuchennym.",
    lead: [
      "Ekspres do kawy lub mikser kuchenny mogą mieć swoje stałe miejsce w szafce roletowej. Po zakończeniu pracy wystarczy opuścić roletę, by zachować ład we wnętrzu.",
      "Instalujemy wysuwane półki, które ułatwiają korzystanie z ciężkich robotów kuchennych bez konieczności ich dźwigania."
    ],
    benefits: [
      "Dedykowane wnęki z gniazdami elektrycznymi.",
      "Szafki roletowe i przesuwne ułatwiające maskowanie sprzętów.",
      "Wysuwane półki o dużym udźwigu pod miksery.",
      "Czysty blat roboczy przygotowany do gotowania."
    ],
    applications: ["Kąciki kawowe", "Szafki z roletami meblowymi", "Wysuwane półki pod miksery", "Gniazda wpuszczane w blat"],
    related: agdLinks,
    faq: [
      {
        question: "Gdzie najlepiej schować ekspres do kawy?",
        answer: "Doskonałym rozwiązaniem są szafki roletowe stojące na blacie. Ekspres jest stale podłączony do ukrytego gniazdka, a po zasunięciu rolety kuchnia wygląda estetycznie."
      },
      {
        question: "Jak przechowywać ciężki robot planetarny?",
        answer: "Projektujemy specjalne, wysuwane półki na prowadnicach o wysokim udźwigu (do 30-50 kg), co ułatwia korzystanie z miksera bez konieczności ich podnoszenia."
      }
    ]
  }),

  makePage({
    slug: "agd/producenci-agd",
    title: "Producenci AGD",
    metaTitle: "Zabudowa AGD Bosch, Siemens, Samsung, Electrolux | Kower",
    metaDescription: "Dostosowujemy szafki kuchenne do wymogów montażowych sprzętów AGD wiodących producentów. Pełna zgodność z kartami instalacyjnymi i wymiarami.",
    eyebrow: "Marki Techniczne",
    h1: "Dostosowanie mebli do wymogów sprzętu czołowych producentów AGD.",
    intro: "Dostosowanie mebli do wymogów montażowych sprzętu czołowych producentów AGD na rynku polskim.",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Zabudowa kuchenna dopasowana do AGD",
    leadTitle: "Pełna kompatybilność z instrukcjami montażu.",
    lead: [
      "Nie jesteśmy dystrybutorem sprzętu, co daje nam pełną niezależność. Projektujemy wnęki na podstawie kart technicznych dowolnego urządzenia wybranego przez Ciebie lub Twojego architekta.",
      "Współpracujemy technicznie z kartami instalacyjnymi najpopularniejszych marek: Bosch, Siemens, Electrolux, Samsung, Miele, Liebherr, Smeg oraz Falmec. Dzięki temu zabudowa pasuje idealnie."
    ],
    benefits: [
      "Pełna weryfikacja wymiarów wentylacji przed produkcją.",
      "Brak problemów ze spasowaniem frontów pod zmywarki (np. zawiasy ślizgowe).",
      "Ergonomiczne dopasowanie słupków i stref pracy.",
      "Praca z dowolnymi markami AGD dostępnymi na rynku."
    ],
    applications: ["Karty techniczne urządzeń", "Wymiary montażowe", "Wymogi wentylacji", "Serwis i gwarancje"],
    related: agdLinks,
    listNote: "Najczęściej montowane: Bosch · Siemens · Electrolux · Samsung · Miele · Smeg",
    faq: [
      {
        question: "Czy dopasowujecie meble pod konkretne marki urządzeń?",
        answer: "Tak. Każda wnęka i mocowanie projektowane są bezpośrednio na podstawie oficjalnej karty technicznej modelu urządzenia dostarczonej przez klienta lub architekta."
      },
      {
        question: "Z jakimi markami sprzętu AGD pracujecie najczęściej?",
        answer: "Mamy duże doświadczenie w projektowaniu pod sprzęty marek Bosch, Siemens, Electrolux, Samsung, Miele, Liebherr, Smeg, Falmec oraz Bora."
      }
    ]
  })
];

const plateServicePages: MarketingPage[] = [
  makePage({
    slug: "uslugi-plytowe",
    title: "Usługi płytowe",
    metaTitle: "Usługi płytowe Kraśnik · Cięcie i oklejanie płyt | Kower",
    metaDescription: "Profesjonalne cięcie i oklejanie płyt meblowych w Kraśniku. Nowoczesny park maszynowy, obrzeża ABS/PVC, szybka realizacja dla stolarzy i klientów indywidualnych.",
    eyebrow: "Formatowanie i Oklejanie",
    h1: "Precyzyjna obróbka płyt meblowych i blatów dla stolarzy i klientów indywidualnych.",
    intro:
      "Świadczymy usługi cięcia, formatowania oraz oklejania krawędzi płyt meblowych. Wykorzystujemy nowoczesne maszyny stolarskie, gwarantując dokładność wymiarową oraz trwałość spoin.",
    image: "/client-assets/uslugi-plytowe.png",
    imageAlt: "Precyzyjne cięcie płyt wiórowych w warsztacie stolarskim Kower",
    leadTitle: "Nowoczesna technologia obróbki płyt meblowych.",
    lead: [
      "Formatowanie płyt laminowanych i blatów roboczych wykonujemy na sterowanej numerycznie pile panelowej z podcinakiem, co całkowicie eliminuje ryzyko powstawania mikrowyszczerbienia laminatu na krawędziach.",
      "Krawędzie formatek zabezpieczamy na okleiniarce z frezowaniem wstępnym, która wyrównuje brzeg bezpośrednio przed nałożeniem kleju. Stosujemy wodoodporne kleje poliuretanowe (PUR), które trwale wiążą obrzeże z płytą.",
      "Obsługujemy zarówno duże zlecenia seryjne dla stolarzy i firm wykończeniowych, jak i pojedyncze formatki dla klientów indywidualnych. Dzięki cyfrowemu rozkrojowi optymalizujemy zużycie płyt, co minimalizuje odpady i obniża koszty."
    ],
    benefits: [
      "Dokładność wymiarowa do 0,1 mm na każdym elemencie.",
      "Brak wyszczerbień i wyrwań krawędzi dzięki frezowaniu wstępnemu.",
      "Oklejanie wodoodpornym klejem PUR na życzenie.",
      "Optymalizacja rozkroju płyt w celu minimalizacji odpadów stolarskich."
    ],
    applications: [
      "Przygotowanie formatek do samodzielnego montażu mebli",
      "Formatowanie blatów kuchennych i płyt MDF pod lakier",
      "Docinanie półek, szafek i regałów na wymiar",
      "Obróbka płyt wiórowych, pilśniowych, sklejki i HDF"
    ],
    related: plateLinks,
    ctaLabel: "Zapytaj o cięcie i oklejanie płyt",
    ctaHref: estimateHref,
    faq: [
      {
        question: "Jakie materiały można u Państwa dociąć?",
        answer: "Docinamy płyty wiórowe laminowane, surowe, płyty MDF, płyty pilśniowe (HDF), a także blaty robocze (zarówno laminowane, jak i kompaktowe czy drewniane). Pracujemy na materiałach własnych oraz powierzonych."
      },
      {
        question: "Co jest potrzebne do złożenia zamówienia na usługi płytowe?",
        answer: "Wystarczy dostarczyć nam specyfikację formatek w formie czytelnej tabeli (rozpisu) zawierającej wymiary w milimetrach, liczbę sztuk, grubość i dekor płyty oraz zaznaczenie, które krawędzie mają być oklejone obrzeżem."
      },
      {
        question: "Czy świadczą Państwo usługi oklejania krzywoliniowego?",
        answer: "Tak. Poza tradycyjnym oklejaniem prostoliniowym wykonujemy również obróbkę i oklejanie elementów krzywoliniowych (np. blatów owalnych lub półek o niestandardowym kształcie)."
      }
    ]
  }),
  
  makePage({
    slug: "uslugi-plytowe/ciecie-plyt",
    title: "Cięcie płyt",
    metaTitle: "Cięcie płyt meblowych Kraśnik · Rozkrój i formatowanie | Kower",
    metaDescription: "Precyzyjne docinanie płyt laminowanych, MDF i blatów kuchennych w Kraśniku. Sterowanie numeryczne CNC, brak odprysków, optymalizacja rozkroju. Zamów wycenę!",
    eyebrow: "Formatowanie Formatek",
    h1: "Precyzyjne cięcie płyt laminowanych, MDF i blatów na dowolny wymiar.",
    intro:
      "Oferujemy usługi profesjonalnego formatowania płyt wiórowych i blatów roboczych na pile panelowej z podcinakiem, co zapewnia idealnie gładką krawędź.",
    image: "/client-assets/ciecie-plyt.png",
    imageAlt: "Cięcie płyt meblowych na maszynie w zakładzie Kower",
    leadTitle: "Idealnie czyste cięcie bez wyrw i odprysków.",
    lead: [
      "Każde zlecenie optymalizujemy przy użyciu specjalistycznego oprogramowania do rozkroju. Dzięki temu maksymalnie wykorzystujemy powierzchnię płyt i ograniczamy odpady, co przekłada się na niższy koszt dla klienta.",
      "Nasza piła panelowa wyposażona jest w agregat podcinający, który nacina laminat od spodu przed przejściem piły głównej. Zapobiega to powstawaniu jakichkoľwiek wyszczerbień na krawędziach."
    ],
    benefits: [
      "Cięcie sterowane numerycznie z gwarancją powtarzalności wymiarów.",
      "Krawędzie przygotowane bezpośrednio pod oklejanie obrzeżem.",
      "Optymalne zużycie materiału dzięki cyfrowemu rozkrojowi.",
      "Możliwość docinania blatów pod kątem i otworów na zlewozmywak."
    ],
    applications: [
      "Przygotowanie elementów korpusów meblowych dla stolarzy",
      "Formatowanie płyt MDF przeznaczonych do lakierowania",
      "Docinanie i dopasowywanie blatów kuchennych",
      "Cięcie pleców szaf z płyt HDF na wymiar"
    ],
    related: plateLinks,
    ctaLabel: "Zleć cięcie płyt online",
    ctaHref: estimateHref,
    faq: [
      {
        question: "Jaka jest minimalna i maksymalna grubość płyt, które możecie dociąć?",
        answer: "Standardowo docinamy materiały o grubości od 3 mm (np. płyty pilśniowe HDF na plecy szafek) do 38-40 mm (grube blaty robocze). W przypadku niestandardowych grubości prosimy o wcześniejszy kontakt."
      },
      {
        question: "Co oznacza optymalizacja rozkroju płyt?",
        answer: "To proces komputerowego planowania ułożenia formatek na płycie bazowej (np. o wymiarach 2800x2070 mm). Program układa elementy tak, aby zminimalizować ilość odpadów (tzw. ścinków) i zaoszczędzić Twój budżet."
      },
      {
        question: "Czy tną Państwo blaty kompaktowe HPL?",
        answer: "Tak. Posiadamy odpowiednie tarcze i oprzyrządowanie do obróbki blatów kompaktowych HPL, które wymagają innej technologii cięcia niż tradycyjne płyty wiórowe ze względu na swoją twardość."
      }
    ]
  }),
 
  makePage({
    slug: "uslugi-plytowe/oklejanie-plyt",
    title: "Oklejanie płyt",
    metaTitle: "Oklejanie płyt meblowych Kraśnik · Obrzeża ABS/PVC | Kower",
    metaDescription: "Profesjonalne oklejanie krawędzi płyt obrzeżami ABS/PVC w Kraśniku. Wykończenie klejem PUR o podwyższonej odporności na wilgoć i parę wodną.",
    eyebrow: "Wykończenie Krawędzi",
    h1: "Estetyczne wykończenie krawędzi płyt obrzeżami ABS i PVC.",
    intro:
      "Zabezpieczamy krawędzie płyt meblowych przed uderzeniami, wilgocią oraz parą wodną przy użyciu okleiniarki z frezowaniem wstępnym.",
    image: "/client-assets/oklejanie-plyt.png",
    imageAlt: "Gładkie krawędzie płyt meblowych po nałożeniu obrzeża PVC",
    leadTitle: "Technologia wodoodpornego klejenia PUR.",
    lead: [
      "Kluczem do trwałości mebli w łazience i kuchni jest szczelność spoin. W Kower oferujemy oklejanie krawędzi przy użyciu kleju poliuretanowego (PUR), który charakteryzuje się pełną wodoodpornością i odpornością na wysoką temperaturę.",
      "Nasze maszyny wykonują automatyczne frezowanie wstępne krawędzi płyty bezpośrednio przed nałożeniem kleju. Likwiduje to ewentualne mikrowyszczerbienia powstałe podczas transportu i gwarantuje idealną linię styku."
    ],
    benefits: [
      "Doskonała estetyka dzięki automatycznemu cyklinowaniu i polerowaniu spoiny.",
      "Oklejanie wodoodpornym klejem poliuretanowym (PUR).",
      "Obrzeża ABS/PVC o różnej grubości (od 0,5 mm do 2 mm).",
      "Idealne dopasowanie koloru i struktury obrzeża do dekoru płyty."
    ],
    applications: [
      "Wykończenie frontów kuchennych i szafek łazienkowych",
      "Zabezpieczanie półek wewnętrznych i korpusów mebli",
      "Oklejanie krawędzi blatów biurek i stołów",
      "Wykańczanie płyt w meblach medycznych i biurowych"
    ],
    related: plateLinks,
    ctaLabel: "Wyślij specyfikację oklejania",
    ctaHref: estimateHref,
    faq: [
      {
        question: "Jaka jest różnica między klejem EVA a PUR?",
        answer: "Klej EVA to standardowy klej termotopliwy, podatny na działanie wilgoci i wysokiej temperatury (np. nad piekarnikiem lub czajnikiem). Klej PUR (poliuretanowy) po utwardzeniu tworzy nierozerwalną spoinę odporną na bezpośrednie działanie wody i temperatury, co zapobiega pęcznieniu płyt."
      },
      {
        question: "Jakie grubości obrzeża stosuje się najczęściej?",
        answer: "Najczęściej stosujemy obrzeża o grubości 0,8 mm lub 1 mm do widocznych frontów i boków mebli, co zapewnia ładny wygląd i ochronę przed uderzeniami, oraz 0,5 mm do niewidocznych elementów konstrukcyjnych."
      },
      {
        question: "Czy można okleić krawędzie płyty po samodzielnym cięciu?",
        answer: "Tak, pod warunkiem, że płyty zostały docięte z zachowaniem kątów i bez dużych wyrwań. Nasza okleiniarka z frezowaniem wstępnym wyrówna krawędź przed nałożeniem obrzeża, co poprawia końcowy efekt."
      }
    ]
  })
];


const materialCards = [
  ["Płyta wiórowa", "/materialy-i-fronty/plyta-wiorowa", "Trwała i ekonomiczna baza do korpusów mebli.", "/client-assets/materialy-wiorowa.png"],
  ["Płyta MDF", "/materialy-i-fronty/plyta-mdf", "Doskonała baza pod fronty lakierowane, ryflowane i frezowane.", "/client-assets/materialy-mdf.png"],
  ["Blaty laminowane", "/materialy-i-fronty/blaty-laminowane", "Odporne na ścieranie i łatwe w pielęgnacji blaty robocze.", "/client-assets/materialy-laminowane.png"],
  ["Blaty kompaktowe", "/materialy-i-fronty/blaty-kompaktowe", "Cienkie, w 100% wodoodporne blaty o nowoczesnej linii.", "/client-assets/materialy-kompaktowe.png"],
  ["Blaty z litego drewna", "/materialy-i-fronty/blaty-z-litego-drewna", "Szlachetny, naturalny dąb lub jesion wykończony oleowoskiem.", "/client-assets/materialy-lite-drewno.png"],
  ["Fronty lakierowane", "/materialy-i-fronty/fronty-lakierowane", "Fronty MDF lakierowane w mat lub połysk z palety RAL.", "/client-assets/materialy-lakierowane.png"],
  ["Fronty akrylowe", "/materialy-i-fronty/fronty-akrylowe", "Głęboki mat odporny na odciski palców (Anti-Fingerprint).", "/client-assets/materialy-akrylowe.png"],
  ["Fronty ryflowane", "/materialy-i-fronty/fronty-ryflowane", "Pionowe frezowania dodające frontom nowoczesnego rytmu.", "/client-assets/materialy-ryflowane.png"],
  ["Fronty tłoczone", "/materialy-i-fronty/fronty-tloczone", "Fronty z dekoracyjnym reliefem dopasowane do projektu.", "/client-assets/materialy-tloczone.png"],
  ["Producenci płyt", "/materialy-i-fronty/producenci-plyt-meblowych", "Dekory, struktury i płyty od Egger, Pfleiderer i Swiss Krono.", "/client-assets/materialy-producenci-plyt.png"],
].map(([title, href, description, image]) => ({
  title: String(title),
  href: String(href),
  description: String(description),
  image: String(image),
  imageAlt: String(title),
}));

const materialDetailsLookup: Record<string, {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  leadTitle: string;
  lead: string[];
  benefits: string[];
  applications: string[];
  faq: { question: string; answer: string }[];
  listNote?: string;
  related?: { label: string; href: string }[];
}> = {
  "plyta-wiorowa": {
    metaTitle: "Płyta wiórowa na wymiar Kraśnik · Płyty meblowe | Kower",
    metaDescription: "Wysokiej jakości płyty wiórowe laminowane Egger i Pfleiderer w Kraśniku. Trwała baza na korpusy mebli, wysoka odporność na zarysowania, setki dekorów.",
    eyebrow: "Trwała Konstrukcja",
    h1: "Płyty wiórowe laminowane – solidna baza pod korpusy meblowe.",
    intro: "Stosujemy wyłącznie płyty wiórowe o podwyższonej gęstości od wiodących producentów, gwarantując stabilność konstrukcji Twoich mebli.",
    leadTitle: "Odpowiednia gęstość i grubość płyt meblowych.",
    lead: [
      "Płyta wiórowa laminowana to podstawowy budulec nowoczesnych mebli. Używamy płyt o grubości 18 mm na korpusy szaf i szafek, co gwarantuje wysoką odporność na obciążenia i stabilność mocowania okuć.",
      "Powierzchnia laminowana jest odporna na ścieranie, wysokie temperatury oraz łatwa w codziennej pielęgnacji, dzięki czemu meble zachowują nienaganny wygląd przez lata."
    ],
    benefits: [
      "Wysoka gęstość rdzenia gwarantująca stabilność wkrętów i zawiasów.",
      "Odporność na zarysowania, mikrouderzenia i wysokie temperatury.",
      "Szeroka paleta dekorów imitujących drewno, kamień, beton oraz kolory uni.",
      "Certyfikaty higieniczne potwierdzające niską emisję formaldehydu."
    ],
    applications: [
      "Korpusy szafek kuchennych, łazienkowych i biurowych",
      "Półki wewnętrzne i regały o wzmocnionej konstrukcji",
      "Boki szuflad i elementy konstrukcyjne łóżek",
      "Panele ścienne i dekoracyjne zabudowy wnęk"
    ],
    faq: [
      {
        question: "Czym różni się płyta wiórowa od płyty MDF?",
        answer: "Płyta wiórowa powstaje z prasowanych wiórów drzewnych i jest stosowana głównie na proste elementy konstrukcyjne (korpusy). Płyta MDF powstaje z bardzo drobnych włókien drzewnych, jest twardsza i jednorodna, co pozwala na jej głębokie frezowanie i lakierowanie (stosowana głównie na fronty)."
      },
      {
        question: "Jakich producentów płyty wiórowe stosujecie?",
        answer: "Pracujemy na płytach renomowanych marek takich jak Egger, Pfleiderer, Swiss Krono oraz Kronospan, co zapewnia najlepszą jakość laminatu i powtarzalność dekorów."
      }
    ]
  },
  "plyta-mdf": {
    metaTitle: "Płyta MDF Kraśnik · Frezowanie i lakierowanie | Kower",
    metaDescription: "Płyty MDF na wymiar w Kraśniku. Idealny materiał na fronty lakierowane i ryflowane. Precyzyjna obróbka CNC, gładka struktura i wysoka gęstość.",
    eyebrow: "Plastyczność i Trwałość",
    h1: "Płyta MDF – jednorodna baza pod zaawansowane fronty meblowe.",
    intro: "Dzięki wysokiej gęstości i gładkiej strukturze, płyta MDF stanowi idealny materiał do frezowania, lakierowania i tworzenia frontów ozdobnych.",
    leadTitle: "Gładkie krawędzie i precyzyjne frezowanie.",
    lead: [
      "Płyta MDF (Medium Density Fibreboard) to materiał o jednolitej gęstości w całym przekroju. Pozwala to na wykonywanie w niej precyzyjnych uchwytów frezowanych, ryflowań oraz ozdobnych krawędzi bez ryzyka wykruszenia.",
      "Powierzchnia płyt MDF po obróbce jest gruntowana i pokrywana wielowarstwowo lakierami poliuretanowymi lub akrylowymi, co daje idealnie gładką powierzchnię w macie bądź wysokim połysku."
    ],
    benefits: [
      "Możliwość głębokiego frezowania wzorów i uchwytów zintegrowanych.",
      "Idealnie gładka powierzchnia pod lakierowanie lub oklejanie folią.",
      "Wyższa odporność na wilgoć w porównaniu do standardowej płyty wiórowej.",
      "Brak sęków i jednorodna struktura materiału w każdym punkcie."
    ],
    applications: [
      "Lakierowane i foliowane fronty mebli kuchennych",
      "Ozdobne panele ścienne i lamele ryflowane",
      "Elementy łukowe i gięte mebli na wymiar",
      "Listwy przypodłogowe oraz ramy luster"
    ],
    faq: [
      {
        question: "Czy płyta MDF nadaje się do łazienki?",
        answer: "Tak. Płyta MDF, zwłaszcza w wersji wilgocioodpornej i prawidłowo polakierowana z każdej strony, doskonale radzi sobie w warunkach podwyższonej wilgotności w łazience."
      },
      {
        question: "Jak dbać o fronty z płyty MDF lakierowanej?",
        answer: "Zaleca się czyszczenie miękką ściereczką z mikrofibry przy użyciu letniej wody z mydłem lub delikatnych środków bez dodatku alkoholu czy amoniaku. Należy unikać szorstkich gąbek i mleczek do czyszczenia."
      }
    ]
  },
  "blaty-laminowane": {
    metaTitle: "Blaty laminowane Kraśnik · Blaty kuchenne na wymiar | Kower",
    metaDescription: "Trwałe blaty laminowane Egger i Pfleiderer w Kraśniku. Odporność na ścieranie, uderzenia i plamy. Profesjonalny montaż i cięcie pod wymiar.",
    eyebrow: "Ergonomia i Trwałość",
    h1: "Blaty laminowane – odporne na ścieranie i codzienne użytkowanie.",
    intro: "Oferujemy bogaty wybór blatów roboczych w dekorach drewnopodobnych, kamiennych i betonowych, dopasowanych do stylu Twojej kuchni.",
    leadTitle: "Wytrzymały laminat HPL na wilgocioodpornym rdzeniu.",
    lead: [
      "Blaty laminowane są najczęściej wybieranym rozwiązaniem do kuchni ze względu na doskonały stosunek ceny do jakości. Powierzchnia pokryta jest twardym laminatem HPL, odpornym na zaplamienia, zarysowania oraz krótkotrwałe działanie temperatury.",
      "Krawędzie blatów zabezpieczamy obrzeżem ABS przy użyciu wodoodpornego kleju PUR, co chroni wiórowy rdzeń przed wnikaniem pary wodnej z zmywarki czy zlewozmywaka."
    ],
    benefits: [
      "Wysoka odporność na plamy z kawy, wina, kwasów spożywczych.",
      "Łatwość utrzymania w czystości (nie wymaga impregnacji).",
      "Laminat odporny na promieniowanie UV - kolory nie blakną.",
      "Szeroki wybór struktur wykończenia (mat, satyna, imitacje kamienia)."
    ],
    applications: [
      "Blaty robocze w kuchniach domowych i aneksach",
      "Blaty biurek gabinetowych i stołów jadalnianych",
      "Lady recepcyjne i lady w punktach usługowych",
      "Półki o podwyższonej grubości (np. 38 mm)"
    ],
    faq: [
      {
        question: "Czy blat laminowany można zarysować nożem?",
        answer: "Laminat HPL jest bardzo twardy i odporny na codzienne użytkowanie, jednak bezpośrednie krojenie nożem kuchennym może uszkodzić strukturę. Zawsze zalecamy stosowanie desek do krojenia."
      },
      {
        question: "Jak zabezpieczane jest wycięcie pod zlew w blacie?",
        answer: "Wycięty otwór pod zlewozmywak oraz płytę grzewczą dokładnie pokrywamy silikonem sanitarnym lub specjalnymi preparatami wodoodpornymi, aby uniemożliwić kontakt wilgoci z surowym rdzeniem płyty."
      }
    ]
  },
  "blaty-kompaktowe": {
    metaTitle: "Blaty kompaktowe Kraśnik · Cienkie blaty HPL | Kower",
    metaDescription: "Cienkie, 100% wodoodporne blaty kompaktowe HPL w Kraśniku. Nowoczesny design o grubości zaledwie 12 mm. Montaż zlewu podwieszanego i gładkie krawędzie.",
    eyebrow: "Nowoczesny Minimalizm",
    h1: "Blaty kompaktowe HPL – w 100% wodoodporne i wyjątkowo cienkie.",
    intro: "Nowoczesne blaty o grubości 12 mm, całkowicie odporne na wodę, pozwalające na montaż zlewów podwieszanych pod blat.",
    leadTitle: "Jednorodna struktura i monolityczna wytrzymałość.",
    lead: [
      "Blaty kompaktowe produkowane są z kilkudziesięciu warstw papieru rdzeniowego zaimpregnowanego żywicą fenolową, sprasowanych pod ogromnym ciśnieniem. Daje to materiał całkowicie nieporowaty i jednorodny w całej objętości.",
      "Dzięki pełnej wodoodporności, w blatach kompaktowych możemy frezować ociekacze oraz instalować zlewozmywaki podwieszane podblatowe, co tworzy wyjątkowo elegancki i higieniczny efekt."
    ],
    benefits: [
      "Całkowita wodoodporność rdzenia - blat nie pęcznieje od wilgoci.",
      "Ultracienki profil (12 mm) nadający meblom nowoczesny charakter.",
      "Możliwość frezowania rowków ociekowych bezpośrednio w blacie.",
      "Możliwość montażu zlewozmywaków podblatowych (podwieszanych)."
    ],
    applications: [
      "Blaty kuchenne z podwieszanymi zlewozmywakami",
      "Zabudowy łazienkowe narażone na częsty kontakt z wodą",
      "Monolityczne blaty na wyspy kuchenne z przejściem na bok",
      "Stoliki kawiarniane i biurka premium"
    ],
    faq: [
      {
        question: "Czy blaty kompaktowe wymagają impregnacji?",
        answer: "Nie. Blaty kompaktowe HPL mają całkowicie zamkniętą strukturę, co oznacza, że nie chłoną płynów i nie wymagają olejowania ani stosowania specjalnych impregnatów."
      },
      {
        question: "Jak czyścić blat kompaktowy?",
        answer: "Wystarczy przetrzeć go ściereczką z mikrofibry i ciepłą wodą z płynem do naczyń. Materiał jest odporny na środki dezynfekujące i większość domowej chemii."
      }
    ]
  },
  "blaty-z-litego-drewna": {
    metaTitle: "Blaty drewniane Kraśnik · Blat dębowy na wymiar | Kower",
    metaDescription: "Stoły i blaty z litego drewna (dąb, jesion) w Kraśniku. Wykończenie profesjonalnymi oleowoskami Rubio Monocoat. Rzemieślnicza stolarka na wymiar.",
    eyebrow: "Szlachetne Rzemiosło",
    h1: "Blaty z litego drewna – naturalne ciepło dębu i jesionu w Twoim domu.",
    intro: "Wytwarzamy blaty robocze i stołowe z wyselekcjonowanego drewna liściastego, dbając o tradycyjne techniki klejenia i impregnacji.",
    leadTitle: "Trwałość i rzemieślnicze wykończenie.",
    lead: [
      "Naturalne drewno to ponadczasowy materiał, który dodaje wnętrzom szlachetności. Wykorzystujemy dąb oraz jesion, klejone z szerokich lameli, co minimalizuje naturalne naprężenia drewna i zapobiega jego paczeniu.",
      "Powierzchnię blatów zabezpieczamy najwyższej jakości oleowoskami (np. Rubio Monocoat), które wnikają w strukturę drewna, chroniąc je przed plamami z wody czy wina, jednocześnie zachowując naturalną fakturę pod palcami."
    ],
    benefits: [
      "Niepowtarzalny rysunek usłojenia i naturalna kolorystyka.",
      "Możliwość wielokrotnej renowacji i naprawy drobnych uszkodzeń.",
      "Przyjemna w dotyku struktura drewna wykończona oleowoskiem.",
      "Stabilna konstrukcja klejona zgodnie z zasadami sztuki stolarskiej."
    ],
    applications: [
      "Blaty stołów jadalnianych i stolików kawowych",
      "Blaty kuchenne w stylu klasycznym, loftowym lub skandynawskim",
      "Blaty pod umywalki łazienkowe (odpowiednio zaimpregnowane)",
      "Parapety okienne i stopnie schodów"
    ],
    faq: [
      {
        question: "Jak często należy olejować blat z litego drewna?",
        answer: "W warunkach domowych renowacja powłoki olejowosku jest zalecana raz na 12-18 miesięcy. Proces jest prosty – polega na przetarciu czystego blatu ściereczką z cienką warstwą dedykowanego oleju regeneracyjnego."
      },
      {
        question: "Czy blat drewniany sprawdzi się przy zlewie?",
        answer: "Tak, pod warunkiem starannej dbałości o suchość krawędzi. Stosujemy impregnację krawędzi bocznych i otworów specjalnymi olejami wodoodpornymi, jednak zalecamy wycieranie stojącej wody wokół zlewozmywaka."
      }
    ]
  },
  "fronty-lakierowane": {
    metaTitle: "Fronty lakierowane Kraśnik · Meble lakier mat połysk | Kower",
    metaDescription: "Producent mebli lakierowanych w Kraśniku. Fronty MDF lakierowane na dowolny kolor RAL/NCS, wykończenie matowe i połysk. Trwałe lakiery poliuretanowe.",
    eyebrow: "Szeroka Paleta Barw",
    h1: "Fronty lakierowane – dowolna kolorystyka i frezowane uchwyty.",
    intro: "Lakierujemy płyty MDF na dowolny odcień z palet RAL oraz NCS, oferując wykończenie w głębokim macie, półmacie lub wysokim połysku.",
    leadTitle: "Wielowarstwowa ochrona i precyzyjne lakierowanie.",
    lead: [
      "Fronty lakierowane dają pełną swobodę aranżacyjną. Możemy na nich wykonać frezowane uchwyty krawędziowe (brak konieczności montażu klasycznych rączek), a krawędzie są całkowicie gładkie i bezspoinowe.",
      "Proces lakierowania obejmuje nałożenie izolantu, podkładu oraz dwóch warstw lakieru nawierzchniowego. Korzystamy z trwałych lakierów poliuretanowych odpornych na promieniowanie UV, co zapobiega żółknięciu kolorów."
    ],
    benefits: [
      "Brak widocznych spoin i obrzeży na krawędziach frontu.",
      "Tysiące kolorów do wyboru z profesjonalnych palet RAL i NCS.",
      "Możliwość frezowania uchwytów zintegrowanych bezpośrednio we froncie.",
      "Powłoki o podwyższonej odporności na żółknięcie pod wpływem słońca."
    ],
    applications: [
      "Nowoczesne fronty mebli kuchennych",
      "Bezuchwytowe szafki pod umywalki łazienkowe",
      "Komody salonowe i szafki RTV pod telewizor",
      "Zaudowy szaf wnękowych z frontami gładkimi"
    ],
    faq: [
      {
        question: "Jaka jest różnica między lakierem matowym a połyskiem?",
        answer: "Lakier w połysku optycznie powiększa przestrzeń, odbijając światło, ale wymaga częstszego przecierania ze względu na widoczność odcisków. Lakier matowy (zwłaszcza głęboki mat) pochłania światło, nadając meblom nowoczesny, stonowany charakter."
      },
      {
        question: "Jak czyścić fronty lakierowane?",
        answer: "Używaj wyłącznie miękkich ściereczek z mikrofibry i łagodnych środków myjących. Bezwzględnie unikaj szorstkich gąbek i preparatów zawierających alkohol, amoniak lub rozpuszczalniki."
      }
    ]
  },
  "fronty-akrylowe": {
    metaTitle: "Fronty akrylowe Kraśnik · Mat anty-fingerprint | Kower",
    metaDescription: "Wyjątkowo odporne fronty akrylowe w Kraśniku. Głęboki mat z powłoką anty-fingerprint (brak śladów palców). Idealne dla rodzin z dziećmi, łatwe czyszczenie.",
    eyebrow: "Wysoka Odporność",
    h1: "Fronty akrylowe – odporność na zarysowania i powłoka matowa.",
    intro: "Fronty o głębokiej strukturze matowej lub lustrzanym połysku, charakteryzujące się najwyższą odpornością na zarysowania i odciski palców.",
    leadTitle: "Trwałość i powłoka zapobiegająca śladom palców.",
    lead: [
      "Fronty akrylowe powstają poprzez naprasowanie grubego laminatu akrylowego na płytę MDF. Powierzchnia ta jest znacznie bardziej odporna na uszkodzenia mechaniczne i zarysowania niż tradycyjne lakiery.",
      "Dla miłośników matu oferujemy wersje z technologią Anti-Fingerprint. Zapobiega ona pozostawaniu śladów dłoni na szafkach, co jest kluczowe w codziennym użytkowaniu kuchni."
    ],
    benefits: [
      "Niezwykle wysoka odporność na zarysowania i uderzenia.",
      "Powłoka Anti-Fingerprint - brak widocznych odcisków palców.",
      "Idealnie gładka powierzchnia o stałym stopniu matu lub połysku.",
      "Oklejanie krawędzi technologią PUR dającą niewidoczną spoinę."
    ],
    applications: [
      "Kuchnie w domach z małymi dziećmi i zwierzętami",
      "Szafy przedpokojowe narażone na intensywne użytkowanie",
      "Meble w biurach, gabinetach i lokalach komercyjnych",
      "Zabudowy łazienkowe o podwyższonym standardzie trwałości"
    ],
    faq: [
      {
        question: "Czy front akrylowy jest lepszy od lakierowanego?",
        answer: "Akryl jest twardszy, bardziej odporny na zarysowania i ma powłokę ograniczającą ślady palców. Lakier z kolei pozwala na frezowanie uchwytów i ma bezspoinowe krawędzie. Wybór zależy od tego, czy priorytetem jest trwałość mechaniczna, czy plastyczność formy."
      },
      {
        question: "Czym czyścić fronty akrylowe?",
        answer: "Wystarczy woda z mydłem i ściereczka z mikrofibry. Nie należy stosować agresywnej chemii ani mleczek do szorowania, które mogłyby zmatowić powierzchnię."
      }
    ]
  },
  "fronty-ryflowane": {
    metaTitle: "Fronty ryflowane Kraśnik · Meble z pionowym frezem | Kower",
    metaDescription: "Stylowe fronty ryflowane w Kraśniku. Pionowe frezowania w płytach MDF, wykończenie lakierem lub fornirem dębowym. Dodaj elegancji swoim meblom.",
    eyebrow: "Nowoczesny Rytm",
    h1: "Fronty ryflowane – pionowe frezowania nadające wnętrzom dynamiki.",
    intro: "Efektowne fronty meblowe z gęstym lub szerokim ryflowaniem pionowym, lakierowane bądź wykończone naturalnym fornirem.",
    leadTitle: "Precyzyjna obróbka CNC i trójwymiarowy efekt.",
    lead: [
      "Fronty ryflowane to jeden z najsilniejszych trendów we współczesnym projektowaniu mebli. Rowki frezowane są na cyfrowych maszynach CNC w płytach MDF, co gwarantuje milimetrową precyzję i powtarzalność rytmu.",
      "Ryflowanie tworzy trójwymiarowy efekt światłocienia, który przełamuje monolit gładkich frontów i optycznie wydłuża zabudowę meblową."
    ],
    benefits: [
      "Unikalny, elegancki efekt wizualny wprowadzający dynamikę do wnętrza.",
      "Precyzyjne wykonanie frezowania na numerycznych maszynach CNC.",
      "Możliwość lakierowania na dowolny kolor lub wykończenia fornirem.",
      "Dostępność różnych szerokości i głębokości ryfli (np. zagęszczone, szerokie)."
    ],
    applications: [
      "Fronty wysp kuchennych i słupków dekoracyjnych",
      "Szafki pod umywalkę w eleganckich łazienkach",
      "Komody salonowe i szafki RTV pod telewizor",
      "Dekoracyjne panele ścienne maskujące drzwi"
    ],
    faq: [
      {
        question: "Czy fronty ryflowane są trudne w czyszczeniu?",
        answer: "Nie. Frezowania są zaokrąglone i gładkie, dzięki czemu kurz nie gromadzi się w szczelinach. Wystarczy regularne przecieranie miękką końcówką odkurzacza lub wilgotną ściereczką z mikrofibry."
      },
      {
        question: "W jakich wykończeniach oferujecie ryflowania?",
        answer: "Wykonujemy fronty ryflowane lakierowane (mat lub półmat z palety RAL/NCS) oraz fornirowane (naturalny dąb lub jesion z widocznym usłojeniem drewna)."
      }
    ]
  },
  "fronty-tloczone": {
    metaTitle: "Fronty tłoczone Kraśnik · Reliefy i frezowania mebli | Kower",
    metaDescription: "Autorskie fronty tłoczone i rzeźbione w Kraśniku. Dekoracyjne reliefy 3D na płytach MDF, frezy ramowe do kuchni klasycznych i angielskich.",
    eyebrow: "Unikalna Rzeźba",
    h1: "Fronty tłoczone – autorskie reliefy 3D i frezy ramowe w płytach MDF.",
    intro: "Wykonujemy dekoracyjne frezy ramowe oraz przestrzenne reliefy na płytach MDF, idealne do kuchni klasycznych, angielskich oraz modern classic.",
    leadTitle: "Klasyczne frezy ramowe i nowoczesne płaskorzeźby.",
    lead: [
      "Fronty tłoczone pozwalają na uzyskanie efektu klasycznej ramy (kuchnie prowansalskie, angielskie) lub nowoczesnych, geometrycznych wzorów 3D na powierzchni płyty MDF.",
      "Precyzyjną rzeźbę uzyskujemy dzięki obróbce na 5-osiowym centrum obróbczym CNC, po czym fronty są starannie szlifowane i lakierowane metodą natryskową."
    ],
    benefits: [
      "Bogata oferta wzorów - od klasycznych ramek po geometryczne reliefy 3D.",
      "Gładkie krawędzie i jednolite lakierowanie w każdym zagłębieniu wzoru.",
      "Świetnie pasują do stylów klasycznego, modern classic oraz boho.",
      "Trwała konstrukcja z grubego MDF-u odpornego na paczenie."
    ],
    applications: [
      "Fronty w kuchniach klasycznych, rustykalnych i angielskich",
      "Stylizowane szafki łazienkowe i toaletki",
      "Ozdobne drzwi szaf w sypialni i przedpokoju",
      "Elementy dekoracyjne obudowy kominków i wnęk"
    ],
    faq: [
      {
        question: "Czym różnią się fronty tłoczone od ryflowanych?",
        answer: "Fronty ryflowane spiralnie mają regularne, powtarzalne pionowe rowki na całej powierzchni. Fronty tłoczone (frezowane) posiadają bardziej złożone wzory, takie jak ramki, kasetony, frezy łukowe lub asymetryczne rzeźbienia 3D."
      },
      {
        question: "Z jakich materiałów wykonuje się tłoczenia?",
        answer: "Podstawą jest zawsze stabilna płyta MDF o odpowiedniej grubości (np. 19 mm lub 22 mm), która pozwala na głębokie frezowanie wzorów bez osłabienia struktury frontu."
      }
    ]
  },
  "producenci-plyt-meblowych": {
    metaTitle: "Producenci płyt meblowych · Egger, Pfleiderer Kraśnik | Kower",
    metaDescription: "Pracujemy na płytach i blatach czołowych producentów: Egger, Pfleiderer, Swiss Krono, Kronospan. Szeroki wybór dekorów i struktur w Kraśniku.",
    eyebrow: "Materiały Premium",
    h1: "Płyty i blaty wiodących marek meblarskich na rynku polskim.",
    intro: "Dbamy o jakość bazy. W naszych realizacjach wykorzystujemy wyłącznie sprawdzone płyty i blaty o podwyższonych parametrach wytrzymałościowych.",
    leadTitle: "Dostęp do setek dekorów i struktur najwyższej jakości.",
    lead: [
      "Współpracujemy z największymi dystrybutorami płyt meblowych w regionie, co daje nam stały dostęp do pełnej oferty dekorów marek Egger, Pfleiderer, Swiss Krono, Kronospan oraz Cleaf.",
      "Oferujemy płyty o strukturze synchronicznej (gdzie faktura laminatu idealnie pokrywa się z rysunkiem słojów drewna), maty o wysokiej odporności na zarysowania oraz blaty robocze odporne na ścieranie."
    ],
    benefits: [
      "Gwarancja powtarzalności odcienia i struktury płyt laminowanych.",
      "Szeroki wybór struktur dotykowych (od głębokiego matu po synchroniczne drewno).",
      "Atesty higieniczne i certyfikaty środowiskowe (FSC, PEFC).",
      "Najlepsze parametry gęstości płyt zapobiegające wyrywaniu zawiasów."
    ],
    applications: [
      "Płyty laminowane na korpusy i fronty meblowe",
      "Blaty robocze kuchenne i stołowe HPL",
      "Lekkie płyty komórkowe na grube półki i boki mebli",
      "Wilgocioodporne płyty MDF przeznaczone do łazienek"
    ],
    related: [
      { label: "Materiały i fronty", href: "/materialy-i-fronty" },
      { label: "Cięcie i oklejanie", href: "/uslugi-plytowe" }
    ],
    listNote: "Hurtownie i producenci: Egger · Pfleiderer · Kronospan · Swiss Krono · Cleaf",
    faq: [
      {
        question: "Czym jest struktura synchroniczna w płytach meblowych?",
        answer: "To nowoczesna technologia tłoczenia laminatu, w której rowki i słoje wyczuwalne pod palcem pokrywają się idealnie z nadrukowanym rysunkiem drewna. Dzięki temu płyta wygląda i w dotyku przypomina naturalne, lakierowane drewno."
      },
      {
        question: "Którego producenta płyty polecacie najczęściej?",
        answer: "Zarówno Egger, jak i Pfleiderer oferują najwyższą jakość płyt laminowanych z doskonałą gęstością i odpornością laminatu. Wybór konkretnej marki najczęściej zależy od tego, który dekor kolorystyczny najbardziej odpowiada Twojemu gustowi."
      }
    ]
  }
};

const materialPages: MarketingPage[] = [
  makePage({
    slug: "materialy-i-fronty",
    title: "Materiały i fronty",
    metaTitle: "Materiały i fronty na wymiar Kraśnik | Kower",
    metaDescription: "Doradzamy w wyborze płyt wiórowych, MDF, blatów kompaktowych, drewnianych oraz frontów lakierowanych, akrylowych i ryflowanych. Odwiedź nas w Kraśniku.",
    eyebrow: "Wybór Materiałów",
    h1: "Płyty, blaty i fronty meblowe dobrane do stylu i budżetu.",
    intro:
      "Doradzamy w wyborze płyt wiórowych, MDF, blatów roboczych oraz frontów lakierowanych i fornirowanych do Twojej zabudowy.",
    image: "/client-assets/materialy-glowna.png",
    imageAlt: "Kolekcja próbek materiałów i frontów meblowych Kower",
    leadTitle: "Estetyka, trwałość i parametry techniczne materiałów.",
    lead: [
      "Wybór materiałów meblowych decyduje nie tylko o wyglądzie, ale przede wszystkim o trwałości Twojej kuchni czy łazienki. Pomagamy dobrać odpowiednie parametry gęstości płyt oraz odporności blatów do planowanego użytkowania.",
      "Prezentujemy pełną gamę próbek blatów, frontów i płyt laminowanych od czołowych dostawców, takich jak Egger, Pfleiderer, Swiss Krono, Forner czy Niemann. Wspólnie dobieramy spójne połączenia dekorów drewnopodobnych z gładkimi matami w naszej pracowni.",
      "Doradzamy w wyborze odpowiedniej grubości płyt (18 mm, 28 mm, 38 mm) w zależności od przeznaczenia – od korpusów szafek, przez wzmocnione półki regałów, po solidne blaty robocze i ozdobne panele ścienne."
    ],
    benefits: [
      "Próbki i wzorniki wiodących marek dostępne na spotkaniu.",
      "Materiały dobrane pod kątem wilgotności i ścieralności.",
      "Fronty lakierowane, akrylowe, ryflowane i fornirowane.",
      "Współpraca z czołowymi hurtowniami płyt w regionie."
    ],
    applications: ["Fronty szafek kuchennych", "Blaty robocze i stołowe", "Korpusy mebli i regały", "Okładziny ścienne i lamele"],
    related: materialCards.map((item) => ({ label: item.title, href: item.href })),
    catalogCards: materialCards,
    faq: [
      {
        question: "Jak dobrać fronty do kuchni?",
        answer: "Wybór zależy od stylu i budżetu. Fronty lakierowane dają pełną swobodę kolorów (RAL) i frezowań, fronty akrylowe zapewniają wysoką odporność na zarysowania i odciski palców, natomiast forniry dodają luksusowego, naturalnego charakteru."
      },
      {
        question: "Czy pomagacie w zestawieniu kolorystycznym materiałów?",
        answer: "Tak. W naszej pracowni wspólnie zestawiamy próbki blatów, frontów i płyt laminowanych w świetle dziennym i sztucznym, co pozwala dobrać idealne połączenie kolorów i struktur."
      }
    ]
  }),
  
  ...materialCards.map((card) => {
    const slugKey = card.href.split("/").pop() || "";
    const details = materialDetailsLookup[slugKey];
    return makePage({
      slug: card.href.slice(1),
      title: card.title,
      metaTitle: details?.metaTitle,
      metaDescription: details?.metaDescription,
      eyebrow: details?.eyebrow ?? "Charakterystyka Materiału",
      h1: details?.h1 ?? `${card.title} – dobór właściwości i koloru do Twoich mebli.`,
      intro: details?.intro ?? card.description,
      image: card.image,
      imageAlt: card.imageAlt,
      leadTitle: details?.leadTitle ?? "Odpowiedni dobór materiału bazowego",
      lead: details?.lead ?? [card.description, "Odpowiedni dobór materiału bazowego decyduje o tym, jak mebel zniesie próbę czasu i codzienne, intensywne użytkowanie."],
      benefits: details?.benefits ?? [
        "Bogata gama kolorów, struktur i dekorów.",
        "Wysoka stabilność wymiarowa i odporność na ugięcia.",
        "Atesty higieniczne i bezpieczeństwo użytkowania.",
        "Dopasowanie grubości płyt (18 mm, 28 mm, 38 mm) pod projekt."
      ],
      applications: details?.applications ?? ["Fronty szafek", "Korpusy szaf i komód", "Blaty robocze i stoliki", "Ścianki działowe i cokoły"],
      faq: details?.faq ?? [
        {
          question: `Jak dbać o ${card.title.toLowerCase()}?`,
          answer: `Zalecamy regularne czyszczenie miękką, wilgotną ściereczką z dodatkiem delikatnych środków myjących bez cząstek ściernych. Unikaj stojącej wody na łączeniach.`
        }
      ],
      related: details?.related ?? [
        { label: "Materiały i fronty", href: "/materialy-i-fronty" },
        { label: "Meble na wymiar", href: "/oferta/meble-na-wymiar" }
      ],
      listNote: details?.listNote,
    });
  }),
];

export const clientFeedbackPages: MarketingPage[] = [
  makePage({
    slug: "oferta",
    kind: "page",
    title: "Oferta",
    metaTitle: "Oferta mebli na wymiar Kraśnik · Usługi stolarskie | Kower",
    metaDescription: "Sprawdź naszą ofertę: kuchnie, garderoby, łazienki na wymiar, lamele ścienne, zabudowę AGD oraz precyzyjne cięcie i oklejanie płyt w Kraśniku i Kosinie.",
    eyebrow: "Zakres Prac",
    h1: "Wykonanie mebli i elementów stolarskich – od projektu po montaż.",
    intro:
      "Wybierz interesującą Cię kategorię: meble na wymiar, lamele dekoracyjne, zabudowę AGD, usługi cięcia płyt lub dobór materiałów.",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Oferta mebli na wymiar i lamelów Kower",
    leadTitle: "Jedna pracownia, kompletna realizacja.",
    lead: [
      "Agregujemy pełen zakres prac stolarskich: od precyzyjnego pomiaru laserowego 3D, przez dobór materiałów premium i produkcję w naszym warsztacie, po profesjonalny montaż końcowy u klienta.",
      "Dzięki nowoczesnemu parkowi maszynowemu realizujemy również usługi formatowania płyt meblowych dla stolarzy i klientów indywidualnych."
    ],
    benefits: [
      "Wszystko w jednym miejscu: pomiar, produkcja i montaż.",
      "Dostęp do nowoczesnego parku maszyn stolarskich.",
      "Przejrzyste wyceny bez ukrytych kosztów dodatkowych.",
      "Szybka realizacja zleceń usługowych (cięcie, oklejanie)."
    ],
    applications: ["Dla domu i mieszkania", "Dla firm wykończeniowych", "Dla stolarzy i wykonawców", "Dla deweloperów"],
    related: [
      { label: "O nas", href: "/o-nas" },
      { label: "Realizacje", href: "/realizacje" },
      { label: "Wycena projektu", href: "/wycena" }
    ],
    catalogCards: offerCatalogCards,
    faq: [
      {
        question: "Jakie usługi wchodzą w skład oferty Kower?",
        answer: "Oferujemy kompleksowe wykonanie mebli na wymiar (kuchnie, szafy, łazienki, garderoby), produkcję i montaż lameli ściennych, dobór i zabudowę AGD, a także usługi płytowe (cięcie i oklejanie obrzeżami)."
      },
      {
        question: "Gdzie realizujecie swoje usługi?",
        answer: "Nasza pracownia stolarska zlokalizowana jest w Kosinie, a projekty montażowe realizujemy na terenie Kraśnika, Janowa Lubelskiego, Lublina oraz całego województwa lubelskiego."
      },
      {
        question: "Czy wycena i pomiar są bezpłatne?",
        answer: "Wstępną kalkulację kosztów wykonujemy całkowicie bezpłatnie na podstawie przesłanych rysunków lub rzutów. Pomiar na miejscu inwestycji jest darmowy po zaakceptowaniu wstępnego kosztorysu."
      }
    ]
  }),
  
  makePage({
    slug: "umow-konsultacje",
    kind: "contact",
    title: "Umów konsultację",
    metaTitle: "Umów konsultację stolarską · Kontakt | Kower",
    metaDescription: "Chcesz zamówić meble na wymiar lub usługi płytowe? Prześlij swoje wymiary, rzuty lub odręczny szkic za pomocą formularza i umów bezpłatną konsultację.",
    eyebrow: "Bezpłatna Konsultacja",
    h1: "Wyślij wymiary lub rzuty i umów się na omówienie projektu.",
    intro:
      "Skorzystaj z formularza, aby opisać swoje potrzeby stolarskie, przesłać rzuty od dewelopera lub odręczne szkice wnęki.",
    image: "/client-assets/project-kitchen.jpg",
    imageAlt: "Formularz umówienia konsultacji stolarskich Kower",
    leadTitle: "Przygotowanie do wyceny mebli na wymiar.",
    lead: [
      "Abyśmy mogli sprawnie przygotować dla Ciebie wstępny kosztorys, prześlij nam podstawowe informacje o planowanej realizacji. Formularz pozwala na wygodne załączenie rzutów mieszkania lub odręcznych szkiców wnęki.",
      "Skontaktujemy się z Tobą telefonicznie bądź mailowo, aby omówić szczegóły, doradzić w wyborze materiałów i ustalić termin spotkania."
    ],
    benefits: [
      "Szybki kontakt zwrotny z propozycją spotkania lub wyceną.",
      "Możliwość załączenia plików z rzutami i inspiracjami.",
      "Wygodny wybór preferowanego typu zapytania.",
      "Zgodność formularza z wytycznymi RODO."
    ],
    applications: ["Kuchnie i szafy", "Lamele ścienne", "Cięcie i oklejanie płyt", "Wycena z plików projektowych"],
    related: [
      { label: "Oferta", href: "/oferta" },
      { label: "Kontakt tradycyjny", href: "/kontakt" }
    ],
    ctaLabel: "Przejdź do formularza",
    ctaHref: "#formularz",
    formVariant: "consultation",
    faq: [
      {
        question: "Jak długo trzeba czekać na odpowiedź po wysłaniu formularza?",
        answer: "Na wszystkie zapytania przesłane przez formularz staramy się odpowiadać w ciągu 24-48 godzin roboczych. Otrzymasz od nas wstępną kalkulację lub propozycję terminu konsultacji."
      },
      {
        question: "Jakie pliki mogę załączyć do wiadomości?",
        answer: "Do formularza możesz dołączyć maksymalnie 5 plików w formatach JPG, PNG, WEBP lub PDF (rozmiar pojedynczego pliku do 10 MB). Mogą to być rysunki odręczne, rzuty od dewelopera czy zdjęcia inspiracyjne."
      },
      {
        question: "Czy konsultacja w Państwa pracowni jest zobowiązująca?",
        answer: "Nie. Konsultacja, dobór podstawowych dekorów i przygotowanie wstępnego projektu wraz z wyceną są całkowicie niezobowiązujące i darmowe."
      }
    ]
  }),

  ...furniturePages,
  ...lamelePages,
  ...agdPages,
  ...plateServicePages,
  ...materialPages,
  
  makePage({
    slug: "producenci-i-partnerzy",
    title: "Producenci i partnerzy",
    metaTitle: "Producenci i partnerzy meblowi · Blum, Egger, Hettich | Kower",
    metaDescription: "Współpracujemy z wiodącymi markami płyt i okuć meblowych (Blum, Hettich, Egger, Pfleiderer, Swiss Krono, PEKA). Zobacz naszych partnerów i producentów komponentów.",
    eyebrow: "Marki i Jakość",
    h1: "Materiały, okucia i akcesoria wiodących marek meblarskich.",
    intro:
      "W naszych realizacjach korzystamy wyłącznie ze sprawdzonych komponentów od uznanych producentów płyt, blatów, okuć, systemów cargo oraz zintegrowanego oświetlenia LED.",
    image: "/client-assets/materialy-partnerzy.png",
    imageAlt: "Nowoczesna zabudowa meblowa wykonana z materiałów partnerów premium",
    leadTitle: "Jakość ukryta w rzemieślniczych szczegółach.",
    lead: [
      "Trwałość mebli na wymiar zależy od precyzji spasowania oraz jakości użytych podzespołów. Stosujemy niezawodne systemy szuflad i zawiasów marek Blum (objęte dożywotnią gwarancją) oraz Hettich. Do organizacji szaf i narożników kuchennych wdrażamy kosze cargo i systemy wysuwne marek PEKA, Rejs, GTV oraz Nomet.",
      "Pracujemy na certyfikowanych płytach laminowanych i blatach roboczych czołowych dostawców: Egger, Pfleiderer, Swiss Krono, Kronospan, Forner (płyty akrylowe i głęboko matowe), Niemann (płyty o podwyższonej odporności na zarysowania), Wiech (fronty foliowane i frezowane) oraz Fundermax i Abet Laminati (blaty i laminaty kompaktowe HPL). Wykończenie detali stanowią uchwyty meblowe marek SIRO, Gamet i Nomet, a całość dopełnia zintegrowane oświetlenie LED firmy Design Light."
    ],
    benefits: [
      "Okucia Blum i Hettich z gwarancją płynnego ruchu i cichego domyku.",
      "Płyty i blaty wiodących marek o najwyższej gęstości i odporności na wilgoć.",
      "Nowoczesne kosze cargo PEKA i Rejs optymalizujące przestrzeń.",
      "Zintegrowane oświetlenie Design Light z niewidocznymi instalacjami."
    ],
    applications: [
      "Systemy szuflad z cichym domykiem Blum Legrabox i Hettich InnoTech",
      "Płyty laminowane synchroniczne Egger i Swiss Krono",
      "Wysuwane kosze cargo i półki narożne PEKA i Rejs",
      "Inteligentne oświetlenie meblowe LED Design Light"
    ],
    related: [
      { label: "Materiały i fronty", href: "/materialy-i-fronty" },
      { label: "Producenci płyt", href: "/materialy-i-fronty/producenci-plyt-meblowych" },
      { label: "Producenci AGD", href: "/agd/producenci-agd" }
    ],
    listNote: "Materiały i okucia: Blum · Hettich · Egger · Pfleiderer · Swiss Krono · Kronospan · Niemann · Wiech · Fundermax · Forner · Nomet · Gamet · GTV · Rejs · SIRO · Abet Laminati · Design Light · PEKA",
    faq: [
      {
        question: "Na jakich płytach i blatach meblowych pracujecie najczęściej?",
        answer: "Podstawę naszych realizacji stanowią płyty laminowane i blaty robocze marek Egger, Pfleiderer, Swiss Krono oraz Kronospan. W projektach wymagających unikalnych właściwości stosujemy płyty akrylowe Forner, odporne fronty Niemann, blaty kompaktowe Fundermax oraz płyty i laminaty Abet Laminati."
      },
      {
        question: "Jakie okucia i systemy szuflad stosujecie w standardzie?",
        answer: "Standardowo we wszystkich meblach na wymiar instalujemy zawiasy, prowadnice szuflad (np. Tandembox, Legrabox) oraz podnośniki frontów górnych Aventos marki Blum, które posiadają dożywotnią gwarancję producenta. Korzystamy również z systemów niemieckiej marki Hettich."
      },
      {
        question: "Jak rozwiązujecie kwestię przechowywania w narożnikach i szafkach cargo?",
        answer: "Wdrażamy zaawansowane systemy wysuwne i kosze cargo szwajcarskiej marki PEKA oraz polskiego producenta Rejs. Oferujemy również akcesoria marek Nomet oraz GTV, dzięki czemu dopasowujemy ergonomię mebli do budżetu klienta."
      },
      {
        question: "Skąd pochodzi oświetlenie LED stosowane w Waszych meblach?",
        answer: "Stosujemy zintegrowane systemy oświetlenia LED polskiej marki Design Light. Profile świetlne są precyzyjnie wpuszczane w korpusy szafek lub półek, a instalacja elektryczna, czujniki zbliżeniowe i zasilacze są ukryte w konstrukcji mebla."
      },
      {
        question: "Jakie uchwyty meblowe są dostępne w Waszej ofercie?",
        answer: "Oferujemy szeroki wybór uchwytów tradycyjnych, krawędziowych, wpuszczanych oraz gałek od wiodących marek takich jak SIRO, Gamet, Nomet oraz GTV. Pomagamy dobrać wykończenie (np. czarny mat, szczotkowane złoto) na etapie wyboru materiałów."
      }
    ]
  })
];
