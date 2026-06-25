import { clientFeedbackPages } from "./client-feedback-pages";
import { offerNavigation, siteConfig } from "./site";

export type LinkItem = {
  label: string;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type MarketingPage = {
  slug: string;
  kind: "page" | "service" | "contact" | "estimate" | "privacy" | "gallery";
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
  image?: string;
  imageAlt?: string;
  leadTitle: string;
  lead: string[];
  benefits: string[];
  process: string[];
  applications: string[];
  faq: FaqItem[];
  related: LinkItem[];
  ctaLabel: string;
  ctaHref: string;
  formVariant?: "contact" | "estimate" | "wholesale" | "consultation";
  listNote?: string;
  catalogCards?: {
    title: string;
    description: string;
    href: string;
    image: string;
    imageAlt: string;
  }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  lead: string;
  date: string;
  category: string;
  sections: {
    title: string;
    body: string[];
  }[];
  faq: FaqItem[];
  related: LinkItem[];
};

const defaultFaq = (topic: string): FaqItem[] => [
  {
    question: `Jak przygotować zapytanie o ${topic}?`,
    answer:
      "Najlepiej przesłać krótki opis planowanego zakresu prac, orientacyjne wymiary wnęki lub rzuty od dewelopera, wybrane dekory (np. Egger) oraz oczekiwany termin realizacji.",
  },
  {
    question: "Czy wycena jest bezpłatna?",
    answer:
      "Tak. Wstępną wycenę projektu przygotowujemy całkowicie bezpłatnie na podstawie przesłanych wymiarów lub projektu wykonawczego. Pomiar laserowy wykonujemy po akceptacji kosztorysu.",
  },
  {
    question: "Czy pomagacie w transporcie i montażu?",
    answer:
      "Tak. Zapewniamy pełną realizację – od cięcia i oklejania płyt w naszym warsztacie, po transport i czysty montaż mebli w miejscu inwestycji.",
  },
];

const basePages: MarketingPage[] = [
  {
    slug: "o-nas",
    kind: "page",
    title: "O nas",
    metaTitle: "O nas | Stolarz Kraśnik · Meble na wymiar Kower",
    metaDescription:
      "Poznaj stolarzy z Kosina koło Kraśnika. Tworzymy nowoczesne meble kuchenne, garderoby i szafy na wymiar. Zobacz naszą pasję i standardy pracy.",
    eyebrow: "O Pracowni",
    h1: "Rzemieślnicza pasja połączona z nowoczesną produkcją.",
    intro:
      "Kower to zespół stolarzy z Kosina (koło Kraśnika) z wieloletnim doświadczeniem w projektowaniu i produkcji mebli na wymiar, zabudów kuchennych, szaf oraz dekoracyjnych lameli ściennych.",
    image: "/client-assets/about-detail-2026.png",
    imageAlt: "Praca z litym drewnem w pracowni Kower",
    leadTitle: "Pasja do drewna i szacunek do materiału.",
    lead: [
      "W naszej codziennej pracy łączymy precyzję obróbki maszynowej na sterowanych numerycznie urządzeniach z dokładnym, ręcznym pasowaniem detali.",
      "Obsługujemy klientów z Kraśnika, Janowa Lubelskiego, Lublina oraz całego województwa lubelskiego, dbając o transparentną komunikację i terminowość."
    ],
    benefits: [
      "Laserowe inwentaryzacje i dokładne pomiary 3D.",
      "Praca na płytach i blatach wiodących marek (m.in. Egger).",
      "Stosowanie niezawodnych okuć Blum objętych gwarancją.",
      "Czysty montaż bez angażowania podwykonawców."
    ],
    process: ["Rozmowa i analiza potrzeb", "Dobór materiałów i wycena", "Produkcja stolarska", "Montaż i odbiór końcowy"],
    applications: ["Mieszkania i domy jednorodzinne", "Gabinety i domowe biura (home office)", "Lokale usługowe i recepcje", "Deweloperzy i inwestycje B2B"],
    faq: [
      {
        question: "Gdzie wykonujecie meble na wymiar?",
        answer: "Obsługujemy głównie Kraśnik, Janów Lubelski, Lublin oraz okoliczne miejscowości w województwie lubelskim.",
      },
      {
        question: "Jakie materiały stosujecie w meblach?",
        answer: "Pracujemy na certyfikowanych płytach i blatach renomowanych marek (np. Egger, Swiss Krono). W standardzie stosujemy niezawodne okucia Blum z dożywotnią gwarancją.",
      },
      {
        question: "Czy można odwiedzić Waszą stolarnię?",
        answer: "Tak, nasza pracownia stolarska znajduje się w miejscowości Kosin (koło Kraśnika). Spotkania w celu omówienia projektu prosimy ustalać wcześniej telefonicznie.",
      },
    ],
    related: [
      { label: "Nasza Oferta", href: "/oferta" },
      { label: "Galeria Realizacji", href: "/realizacje" },
      { label: "Skontaktuj się", href: "/kontakt" },
    ],
    ctaLabel: "Porozmawiajmy o Twoim projekcie",
    ctaHref: "/kontakt",
  },
  {
    slug: "realizacje",
    kind: "gallery",
    title: "Realizacje",
    metaTitle: "Realizacje mebli na wymiar Kraśnik · Portfolio | Kower",
    metaDescription:
      "Zobacz galerię naszych realizacji mebli na wymiar. Zdjęcia przedstawiają rzeczywiste kuchnie, szafy wnękowe i łazienki wykonane u klientów w woj. lubelskim.",
    eyebrow: "Galeria Prac",
    h1: "Rzemiosło uwiecznione w zrealizowanych projektach.",
    intro:
      "Nasze portfolio to dowód precyzji, dbałości o detale wykończenia i spójności rysunku drewna na frontach mebli.",
    image: "/realizacje/realizacja-14.jpeg",
    imageAlt: "Kuchnia na wymiar z białymi frontami, drewnianym blatem i lamelowym akcentem",
    leadTitle: "Estetyka, która spotyka się z funkcjonalnością.",
    lead: [
      "Stawiamy na nowoczesne linie frontów, matowe wykończenia zapobiegające powstawaniu śladów oraz solidną konstrukcję szuflad.",
      "Zdjęcia w naszej galerii przedstawiają rzeczywiste projekty zrealizowane u naszych klientów."
    ],
    benefits: [
      "Rzeczywiste fotografie bez poprawek komputerowych.",
      "Inspiracje kuchenne, szafy i detale łazienkowe.",
      "Realizacje u klientów prywatnych oraz komercyjnych.",
      "Potwierdzenie rzemieślniczej dokładności łączeń."
    ],
    process: ["Inwentaryzacja 3D", "Projekt wykonawczy", "Precyzyjny montaż", "Odbiór jakościowy"],
    applications: ["Nowoczesne kuchnie", "Szafy wnękowe", "Meble łazienkowe", "Biblioteki i biurka"],
    faq: [
      {
        question: "Czy zdjęcia w galerii to wizualizacje komputerowe?",
        answer: "Nie. Wszystkie zdjęcia w naszym portfolio to rzeczywiste fotografie mebli zrealizowanych i zamontowanych przez ekipę Kower u naszych klientów.",
      },
      {
        question: "Czy mogę zamówić meble identyczne jak na zdjęciu?",
        answer: "Tak, możemy wykonać podobną zabudowę. Pamiętaj jednak, że każde meble projektujemy od zera pod konkretne wymiary pomieszczenia i indywidualne preferencje kolorystyczne.",
      },
      {
        question: "Czy realizujecie projekty innych projektantów?",
        answer: "Tak. Chętnie współpracujemy z architektami i projektantami wnętrz, realizując meble ściśle według dostarczonej dokumentacji technicznej i wizualnej.",
      },
    ],
    related: [
      { label: "Nasza Oferta", href: "/oferta" },
      { label: "Lamele Ścienne", href: "/lamele" },
      { label: "Wycena projektu", href: "/wycena" },
    ],
    ctaLabel: "Zaplanuj podobny projekt",
    ctaHref: "/wycena",
  },
  {
    slug: "kontakt",
    kind: "contact",
    title: "Kontakt",
    metaTitle: "Kontakt | Stolarnia Kosin · Meble na wymiar Kraśnik | Kower",
    metaDescription:
      "Skontaktuj się z Kower w sprawie wyceny mebli na wymiar, lameli lub cięcia płyt w Kraśniku, Janowie Lubelskim i Lublinie. Zadzwoń lub napisz do nas!",
    eyebrow: "Formularz Kontaktowy",
    h1: "Porozmawiajmy o wycenie Twoich mebli.",
    intro:
      "Skontaktuj się z naszą pracownią stolarską w Kosinie koło Kraśnika. Obsługujemy zamówienia z terenu Kraśnika, Janowa Lubelskiego i całego województwa lubelskiego. Zadzwoń, wyślij e-mail lub skorzystaj z poniższego formularza.",
    image: "/client-assets/project-stairs.jpg",
    imageAlt: "Detal schodów dębowych wykonanych przez Kower",
    leadTitle: "Pracownia Kower",
    lead: [
      `Telefon: ${siteConfig.phone}`,
      `E-mail: ${siteConfig.email}`,
      `Adres: ${siteConfig.address}`,
      `NIP: ${siteConfig.nip}`,
    ],
    benefits: [
      "Wsparcie techniczne stolarzy z wieloletnim doświadczeniem.",
      "Możliwość umówienia pomiaru laserowego u Ciebie.",
      "Szybka kalkulacja kosztów z przysłanych rysunków.",
      "Przejrzyste i jasne warunki współpracy."
    ],
    process: ["Wiadomość z wymiarami", "Kalkulacja kosztów", "Ustalenie terminu", "Pomiar w miejscu realizacji"],
    applications: ["Wyceny mebli kuchennych", "Zamówienia na lamele", "Specyfikacje cięcia płyt wiórowych", "Wyceny dla deweloperów"],
    faq: [
      {
        question: "Jak najszybciej skontaktować się w sprawie wyceny?",
        answer: "Najlepszą drogą jest przesłanie zapytania przez formularz wyceny na stronie lub bezpośredni kontakt telefoniczny. Jeśli posiadasz gotowy projekt lub rzuty, dołącz je do wiadomości.",
      },
      {
        question: "W jakich godzinach pracujecie?",
        answer: "Pracujemy od poniedziałku do piątku w godzinach 8:00 - 17:00. Na wiadomości e-mail oraz zapytania z formularzy odpowiadamy zazwyczaj w ciągu 24-48 godzin.",
      },
      {
        question: "Czy przyjeżdżacie na pomiar bez gotowego projektu?",
        answer: "Wstępną wycenę przygotowujemy na podstawie orientacyjnych wymiarów podanych przez klienta. Dokładny pomiar laserowy w miejscu inwestycji wykonujemy po akceptacji wstępnego kosztorysu.",
      },
    ],
    related: [
      { label: "Bezpłatna Wycena", href: "/wycena" },
      { label: "Nasza Oferta", href: "/oferta" },
      { label: "Polityka Prywatności", href: "/polityka-prywatnosci" },
    ],
    ctaLabel: "Przejdź do formularza wyceny",
    ctaHref: "/wycena",
    formVariant: "contact",
  },
  {
    slug: "wycena",
    kind: "estimate",
    title: "Wycena",
    metaTitle: "Bezpłatna wycena mebli na wymiar Kraśnik | Kower",
    metaDescription:
      "Uzyskaj bezpłatną wycenę mebli kuchennych, szaf i lameli ściennych w Kraśniku i Lublinie. Wypełnij prosty formularz i prześlij pliki projektu.",
    eyebrow: "Bezpłatny Kosztorys",
    h1: "Uzyskaj szczegółową, bezpłatną wycenę stolarki.",
    intro:
      "Prześlij nam rzuty mieszkania, odręczne szkice lub projekt od architekta. Zestawimy koszty materiałów, okuć i montażu.",
    image: "/client-assets/project-bathroom.jpg",
    imageAlt: "Zabudowa łazienkowa Kower w naturalnych tonach",
    leadTitle: "Co przyspieszy przygotowanie kosztorysu?",
    lead: [
      "Do wyceny mebli przydadzą się nam orientacyjne długości ścian, planowane rozmieszczenie AGD, wysokość pomieszczenia oraz preferowany typ frontów (lakier, akryl czy drewno).",
      "Dla zleceń cięcia płyt prosimy o załączenie wykazu formatek w milimetrach."
    ],
    benefits: [
      "Dokładna kalkulacja bez ukrytych dopłat.",
      "Zestawienie markowych okuć (Blum) w kosztorysie.",
      "Możliwość załączenia plików CAD, PDF i graficznych.",
      "Sugestie alternatywnych materiałów w celu optymalizacji budżetu."
    ],
    process: ["Przesłanie plików", "Analiza techniczna", "Zestawienie kosztów", "Wysłanie wyceny mailowo"],
    applications: ["Wycena kuchni", "Wycena szaf wnękowych", "Kosztorys seryjnych lameli", "Rozkrój płyt wiórowych i MDF"],
    faq: [
      {
        question: "Ile kosztuje przygotowanie wyceny?",
        answer: "Wycena mebli na wymiar jest całkowicie bezpłatna i niezobowiązująca. Szacunkowe koszty przedstawiamy na podstawie przesłanych rysunków lub rzutów.",
      },
      {
        question: "Jakie pliki mogę dołączyć do formularza?",
        answer: "Do formularza można załączyć pliki graficzne (JPG, PNG), dokumenty PDF oraz pliki CAD. Maksymalny rozmiar jednego pliku to 10 MB.",
      },
      {
        question: "Jak długo czeka się na wycenę?",
        answer: "Wstępny kosztorys przygotowujemy zazwyczaj w ciągu 3-5 dni roboczych, w zależności od liczby spływających zapytań i stopnia skomplikowania projektu.",
      },
    ],
    related: offerNavigation,
    ctaLabel: "Wyślij specyfikację do wyceny",
    ctaHref: "#formularz",
    formVariant: "estimate",
  },
  {
    slug: "polityka-prywatnosci",
    kind: "privacy",
    title: "Polityka prywatności",
    metaTitle: "Polityka prywatności | Kower Pracownia Meblarska",
    metaDescription:
      "Zasady przetwarzania danych osobowych i plików cookies w serwisie Kower Pracownia Meblarska. Poznaj zasady bezpieczeństwa formularzy.",
    eyebrow: "Informacje Prawne",
    h1: "Zasady ochrony danych osobowych.",
    intro:
      "Niniejszy dokument określa zasady przetwarzania danych osobowych przesyłanych przez formularze kontaktowe i wycenowe.",
    leadTitle: "Ochrona i administrator danych",
    lead: [
      `Administratorem danych osobowych jest Kower Pracownia Meblarska z siedzibą w Kosinie, Kosin 20, 23-235 Kosin, NIP: ${siteConfig.nip}.`,
      "Dane podane w formularzu przetwarzane są wyłącznie w celu obsługi zapytania ofertowego, przygotowania wyceny mebli na wymiar oraz realizacji kontaktu.",
      "Formularze chronione są systemami antyspamowymi reCAPTCHA, a wysyłka e-maili odbywa się za pośrednictwem bezpiecznego API serwisu Resend."
    ],
    benefits: [
      "Przetwarzanie danych wyłącznie w celach kontaktowych.",
      "Wymagana dobrowolna zgoda przed wysyłką formularza.",
      "Szyfrowanie połączenia certyfikatem SSL.",
      "Możliwość wglądu i usunięcia swoich danych na żądanie."
    ],
    process: ["Przesłanie formularza", "Zapisanie zgody", "Obsługa zapytania stolarskiego", "Usunięcie danych po realizacji kontaktu"],
    applications: ["Formularz zapytania", "Formularz wyceny", "Formularz zapytań hurtowych", "Korespondencja e-mail"],
    faq: [
      {
        question: "Czy podanie numeru telefonu w formularzu jest wymagane?",
        answer: "Nie jest to wymagane, jednak ułatwia nam to szybkie dopytanie o szczegóły projektu mebli (np. wentylację lub grubości blatów) przed wysłaniem wyceny."
      }
    ],
    related: [
      { label: "Powrót do kontaktu", href: "/kontakt" },
      { label: "Formularz wyceny", href: "/wycena" },
    ],
    ctaLabel: "Przejdź do kontaktu",
    ctaHref: "/kontakt",
  },
];

export const pages: MarketingPage[] = [...clientFeedbackPages, ...basePages];

export const blogPosts: BlogPost[] = [
  {
    slug: "jak-dobrac-lamele-do-wnetrza",
    title: "Jak dobrać lamele do wnętrza?",
    metaTitle: "Jak dobrać lamele do wnętrza? | Blog Kower",
    metaDescription:
      "Praktyczny przewodnik po doborze lameli do salonu, sypialni, przedpokoju, biura i zabudowy RTV.",
    lead:
      "Lamele najlepiej działają wtedy, gdy ich rytm, kolor i skala są podporządkowane wnętrzu, a nie odwrotnie.",
    date: "2026-05-28",
    category: "Lamele",
    sections: [
      {
        title: "Zacznij od proporcji ściany",
        body: [
          "Na dużych płaszczyznach można pozwolić sobie na mocniejszy rytm i szersze przekroje. W mniejszych wnętrzach lepiej sprawdzają się spokojniejsze podziały.",
          "Warto ustalić, czy lamele mają być tłem, akcentem czy głównym elementem kompozycji.",
        ],
      },
      {
        title: "Kolor i światło",
        body: [
          "Ciemne lamele dodają głębi, jasne porządkują ścianę bez mocnego kontrastu. Ostateczny wybór zależy od podłogi, frontów, światła i sąsiednich materiałów.",
        ],
      },
    ],
    faq: defaultFaq("lamele do wnętrza"),
    related: [
      { label: "Lamele", href: "/lamele" },
      { label: "Lamele detaliczne", href: "/lamele/klient-indywidualny" },
      { label: "Lamele na wymiar", href: "/lamele/na-wymiar" },
    ],
  },
  {
    slug: "lamele-na-wymiar-kiedy-warto",
    title: "Lamele na wymiar: kiedy warto?",
    metaTitle: "Lamele na wymiar: kiedy warto? | Blog Kower",
    metaDescription:
      "Kiedy zamówić lamele na wymiar i jak przygotować wymiary, kolor, wykończenie oraz zakres montażu.",
    lead:
      "Lamele na wymiar są najlepszym wyborem, gdy ściana, zabudowa lub inwestycja wymagają precyzyjnego dopasowania.",
    date: "2026-05-28",
    category: "Lamele",
    sections: [
      {
        title: "Gdy liczy się czyste zakończenie",
        body: [
          "Gotowe rozwiązania często wymagają docinek, które psują rytm kompozycji. Produkcja na wymiar pozwala zachować kontrolę nad długością i układem elementów.",
        ],
      },
      {
        title: "Przy inwestycjach i seriach",
        body: [
          "Powtarzalne zamówienia wymagają stałego wymiaru, koloru i standardu wykończenia. To ważne dla wykonawców, architektów i firm.",
        ],
      },
    ],
    faq: defaultFaq("lamele na wymiar"),
    related: [
      { label: "Lamele na wymiar", href: "/lamele/na-wymiar" },
      { label: "Lamele hurtowe", href: "/lamele/sprzedaz-hurtowa" },
      { label: "Wycena", href: "/wycena" },
    ],
  },
  {
    slug: "agd-do-zabudowy-o-czym-pamietac",
    title: "AGD do zabudowy: o czym pamiętać?",
    metaTitle: "AGD do zabudowy: o czym pamiętać? | Blog Kower",
    metaDescription:
      "Wentylacja, wymiary techniczne, ergonomia i bezpieczeństwo przy projektowaniu zabudowy pod AGD.",
    lead:
      "AGD do zabudowy wygląda lekko tylko wtedy, gdy projekt wcześniej uwzględnia wszystkie wymagania techniczne sprzętu.",
    date: "2026-05-28",
    category: "AGD",
    sections: [
      {
        title: "Karta techniczna jest punktem wyjścia",
        body: [
          "Wymiary wnęki, wentylacja, sposób otwierania i dostęp serwisowy powinny wynikać z dokumentacji konkretnego modelu.",
        ],
      },
      {
        title: "Ergonomia ma znaczenie",
        body: [
          "Piekarnik, mikrofalę, ekspres czy zmywarkę warto umieścić tak, aby codzienne korzystanie było naturalne i bezpieczne.",
        ],
      },
    ],
    faq: defaultFaq("AGD do zabudowy"),
    related: [
      { label: "AGD w projektach", href: "/agd" },
      { label: "AGD do zabudowy", href: "/agd/do-zabudowy" },
      { label: "Producenci AGD", href: "/agd/producenci-agd" },
    ],
  },
  {
    slug: "jak-wybrac-plyte-meblowa",
    title: "Jak wybrać płytę meblową?",
    metaTitle: "Jak wybrać płytę meblową? | Blog Kower",
    metaDescription:
      "Jak dobrać płytę meblową do budżetu, stylu, odporności, koloru, połysku, matu i struktury drewna.",
    lead:
      "Płyta meblowa powinna pasować nie tylko do koloru wnętrza, ale też do intensywności użytkowania i budżetu.",
    date: "2026-05-28",
    category: "Materiały",
    sections: [
      {
        title: "Powierzchnia i przeznaczenie",
        body: [
          "Inny materiał sprawdzi się na frontach kuchennych, inny na półkach, a jeszcze inny w zabudowie technicznej.",
        ],
      },
      {
        title: "Mat, połysk and struktura",
        body: [
          "Mat jest spokojny i elegancki, połysk mocniej odbija światło, a struktury drewna dodają wnętrzu naturalnego charakteru.",
        ],
      },
    ],
    faq: defaultFaq("płytę meblową"),
    related: [
      { label: "Producenci płyt", href: "/materialy-i-fronty/producenci-plyt-meblowych" },
      { label: "Cięcie płyt", href: "/uslugi-plytowe/ciecie-plyt" },
      { label: "Oklejanie płyt", href: "/uslugi-plytowe/oklejanie-plyt" },
    ],
  },
  {
    slug: "ciecie-i-oklejanie-plyt-jak-przygotowac-zamowienie",
    title: "Cięcie i oklejanie płyt: jak przygotować zamówienie?",
    metaTitle: "Cięcie i oklejanie płyt: jak przygotować zamówienie? | Blog Kower",
    metaDescription:
      "Lista elementów, wymiary, materiał, obrzeża i kolejność danych potrzebnych do sprawnej wyceny cięcia oraz oklejania płyt.",
    lead:
      "Dobrze przygotowana lista elementów skraca wycenę i zmniejsza ryzyko błędów produkcyjnych.",
    date: "2026-05-28",
    category: "Płyty",
    sections: [
      {
        title: "Lista formatek",
        body: [
          "Podaj długość, szerokość, ilość, grubość płyty, materiał i kierunek dekoru. Przy oklejaniu dopisz, które krawędzie mają mieć obrzeże.",
        ],
      },
      {
        title: "Materiał i obrzeże",
        body: [
          "Warto wskazać wybrany dekor oraz oczekiwaną grubość i kolor obrzeża. Jeśli nie masz pewności, można dobrać je na etapie konsultacji.",
        ],
      },
    ],
    faq: defaultFaq("cięcie i oklejanie płyt"),
    related: [
      { label: "Cięcie płyt", href: "/uslugi-plytowe/ciecie-plyt" },
      { label: "Oklejanie płyt", href: "/uslugi-plytowe/oklejanie-plyt" },
      { label: "Wycena", href: "/wycena" },
    ],
  },
  {
    slug: "oplaszczowywanie-elementow-co-daje",
    title: "Opłaszczowywanie elementów: co daje?",
    metaTitle: "Opłaszczowywanie elementów: co daje? | Blog Kower",
    metaDescription:
      "Co daje opłaszczowywanie elementów meblowych i lameli: spójność powierzchni, trwałość, estetyka i powtarzalność.",
    lead:
      "Opłaszczowywanie jest rozwiązaniem dla elementów, które mają wyglądać spójnie z wielu stron i zachować dopracowaną powierzchnię.",
    date: "2026-05-28",
    category: "Wykończenie",
    sections: [
      {
        title: "Spójna powierzchnia",
        body: [
          "Element pokryty wybranym materiałem zachowuje jednolity kolor i fakturę, co ma znaczenie przy lamelach, detalach i widocznych bokach.",
        ],
      },
      {
        title: "Produkcja jednostkowa i seryjna",
        body: [
          "Technologia sprawdza się zarówno przy pojedynczych detalach, jak i powtarzalnych seriach dla większych realizacji.",
        ],
      },
    ],
    faq: defaultFaq("opłaszczowywanie elementów"),
    related: [
      { label: "Opłaszczowywanie elementów", href: "/lamele/oplaszczowywanie-elementow" },
      { label: "Lamele hurtowe", href: "/lamele/sprzedaz-hurtowa" },
      { label: "Wycena", href: "/wycena" },
    ],
  },
];

export const allMarketingPageSlugs = Array.from(new Set(pages.map((page) => page.slug)));
export const allBlogSlugs = blogPosts.map((post) => post.slug);

export function getPageBySlug(slug: string) {
  return pages.find((page) => page.slug === slug);
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
