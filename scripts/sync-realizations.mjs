import fs from 'fs';
import path from 'path';
import { Firestore, FieldValue } from '@google-cloud/firestore';

const projectId = "kower-84922";

const imageSizes = {
  "realizacja-01.jpeg": { width: 1600, height: 1200 },
  "realizacja-02.jpeg": { width: 1200, height: 1600 },
  "realizacja-03.jpeg": { width: 1600, height: 1200 },
  "realizacja-04.jpeg": { width: 1600, height: 1200 },
  "realizacja-05.jpeg": { width: 1200, height: 1600 },
  "realizacja-06.jpeg": { width: 1600, height: 1200 },
  "realizacja-07.jpeg": { width: 1600, height: 1200 },
  "realizacja-08.jpeg": { width: 2048, height: 1536 },
  "realizacja-09.jpeg": { width: 1600, height: 1200 },
  "realizacja-10.jpeg": { width: 1200, height: 1600 },
  "realizacja-11.jpeg": { width: 1600, height: 1200 },
  "realizacja-12.jpeg": { width: 1600, height: 1200 },
  "realizacja-13.jpeg": { width: 1600, height: 1200 },
  "realizacja-14.jpeg": { width: 1600, height: 1200 },
  "realizacja-15.jpeg": { width: 1200, height: 1600 },
  "realizacja-16.jpeg": { width: 2048, height: 1536 },
  "realizacja-17.jpeg": { width: 2048, height: 1536 },
  "realizacja-18.jpeg": { width: 1600, height: 1200 },
  "realizacja-19.jpeg": { width: 1600, height: 1200 },
  "realizacja-20.jpeg": { width: 1200, height: 1600 },
  "realizacja-21.jpeg": { width: 2048, height: 1536 },
  "realizacja-22.jpeg": { width: 2048, height: 1536 },
  "realizacja-23.jpeg": { width: 1600, height: 1200 },
  "realizacja-24.jpeg": { width: 1600, height: 1200 },
  "realizacja-25.jpeg": { width: 1536, height: 2048 }
};

const imagesMetadata = [
  // Kuchnie (01 - 09)
  {
    file: "realizacja-01.jpeg",
    title: "Jasna kuchnia nowoczesna - Strefa robocza",
    caption: "Jasna nowoczesna kuchnia na wymiar z wbudowanym podświetleniem strefy roboczej.",
    alt: "Jasna nowoczesna kuchnia z oświetleniem LED pod szafkami",
    category: "Kuchnie",
    tags: ["Kuchnia", "Jasne fronty", "Zabudowa"],
    featured: true,
    order: 1
  },
  {
    file: "realizacja-02.jpeg",
    title: "Jasna kuchnia nowoczesna - Słupek AGD",
    caption: "Wysoka zabudowa kuchenna ze sprzętem AGD w słupku.",
    alt: "Wysoka zabudowa kuchenna ze sprzętem AGD",
    category: "Kuchnie",
    tags: ["Kuchnia", "Jasne fronty", "AGD"],
    featured: true,
    order: 2
  },
  {
    file: "realizacja-03.jpeg",
    title: "Jasna kuchnia nowoczesna - Szuflady",
    caption: "Szuflady kuchenne z systemem cichego domykania i dedykowanym organizerem.",
    alt: "Pojemne szuflady kuchenne i organizer na sztućce",
    category: "Kuchnie",
    tags: ["Kuchnia", "Szuflady", "Akcesoria"],
    featured: true,
    order: 3
  },
  {
    file: "realizacja-04.jpeg",
    title: "Jasna kuchnia nowoczesna - Zlew",
    caption: "Strefa zlewowa z blatem laminowanym odpornym na zarysowania.",
    alt: "Zabudowa zlewowa z dopasowanym blatem roboczym",
    category: "Kuchnie",
    tags: ["Kuchnia", "Zlew", "Blat"],
    featured: true,
    order: 4
  },
  {
    file: "realizacja-05.jpeg",
    title: "Kuchnia narożna - Zabudowa wisząca",
    caption: "Układ narożny mebli kuchennych z dopasowanymi frontami.",
    alt: "Układ narożny mebli kuchennych z dekoracyjną strefą półek",
    category: "Kuchnie",
    tags: ["Kuchnia", "Drewno", "Zabudowa"],
    featured: true,
    order: 5
  },
  {
    file: "realizacja-06.jpeg",
    title: "Kuchnia narożna - Wyspa",
    caption: "Wyspa kuchenna stanowiąca dodatkową strefę roboczą i jadalnianą.",
    alt: "Wyspa kuchenna z blatem imitującym naturalny kamień",
    category: "Kuchnie",
    tags: ["Kuchnia", "Wyspa", "Blat kamienny"],
    featured: true,
    order: 6
  },
  {
    file: "realizacja-07.jpeg",
    title: "Kuchnia narożna - Płyta indukcyjna",
    caption: "Nowoczesna strefa gotowania w zabudowie kuchennej.",
    alt: "Strefa gotowania z płytą indukcyjną i pochłaniaczem",
    category: "Kuchnie",
    tags: ["Kuchnia", "Indukcja", "Płyta"],
    featured: true,
    order: 7
  },
  {
    file: "realizacja-08.jpeg",
    title: "Kuchnia narożna - Widok ogólny",
    caption: "Kompletna realizacja nowoczesnej kuchni z wyspą na wymiar.",
    alt: "Widok na całą zabudowę kuchenną z wyspą roboczą",
    category: "Kuchnie",
    tags: ["Kuchnia", "Wyspa", "Narożna"],
    featured: true,
    order: 8
  },
  {
    file: "realizacja-09.jpeg",
    title: "Kuchnia w białym połysku",
    caption: "Biała kuchnia w połysku z idealnym dopasowaniem do wymiarów pomieszczenia.",
    alt: "Biała kuchnia w połysku z kontrastującym ciemnym blatem",
    category: "Kuchnie",
    tags: ["Kuchnia", "Biały połysk", "Minimalizm"],
    featured: true,
    order: 9
  },

  // Łazienki (10 - 12)
  {
    file: "realizacja-10.jpeg",
    title: "Elegancka łazienka - Szafka pod umywalkę",
    caption: "Szafka pod umywalkę z precyzyjnie wykonanym ryflowaniem frontów.",
    alt: "Szafka łazienkowa pod umywalkę z ryflowanymi szufladami",
    category: "Łazienki",
    tags: ["Łazienka", "Szafka pod umywalkę", "Ryflowanie"],
    featured: true,
    order: 10
  },
  {
    file: "realizacja-11.jpeg",
    title: "Elegancka łazienka - Zabudowa WC i pralki",
    caption: "Zabudowa wnęki łazienkowej nad stelażem podtynkowym WC.",
    alt: "Zabudowa strefy WC i pralki w łazience na wymiar",
    category: "Łazienki",
    tags: ["Łazienka", "Zabudowa WC", "Pralka"],
    featured: true,
    order: 11
  },
  {
    file: "realizacja-12.jpeg",
    title: "Elegancka łazienka - Lustra",
    caption: "Szafki wiszące z lustrami optycznie powiększającymi łazienkę.",
    alt: "Pojemne szafki łazienkowe z lustrzanym frontem",
    category: "Łazienki",
    tags: ["Łazienka", "Szafki wiszące", "Lustra"],
    featured: true,
    order: 12
  },

  // Szafy i garderoby (13 - 15)
  {
    file: "realizacja-13.jpeg",
    title: "Szafa przesuwna z lustrem w sypialni",
    caption: "Szafa przesuwna z lustrem w czarnej ramie aluminiowej.",
    alt: "Szafa przesuwna z lustrem i czarnymi profilami aluminiowymi",
    category: "Szafy i garderoby",
    tags: ["Szafa", "Przesuwna", "Lustro"],
    featured: true,
    order: 13
  },
  {
    file: "realizacja-14.jpeg",
    title: "Pojemna garderoba z oświetleniem LED",
    caption: "Funkcjonalny podział wnętrza garderoby na strefy przechowywania.",
    alt: "Wnętrze garderoby z podświetleniem LED szuflad i półek",
    category: "Szafy i garderoby",
    tags: ["Garderoba", "LED", "Szuflady"],
    featured: true,
    order: 14
  },
  {
    file: "realizacja-15.jpeg",
    title: "Garderoba w matowej szarości",
    caption: "Praktyczne szafy na wymiar z gładkimi matowymi frontami.",
    alt: "Zabudowa garderobiana z frontami w matowej szarości",
    category: "Szafy i garderoby",
    tags: ["Garderoba", "Matowe fronty", "Szarość"],
    featured: true,
    order: 15
  },

  // Zabudowy nietypowe (16 - 20)
  {
    file: "realizacja-16.jpeg",
    title: "Zabudowa RTV - Wisząca szafka",
    caption: "Kontrast wiszącej szafki RTV z pionowymi lamelami z drewna.",
    alt: "Wisząca szafka RTV na tle drewnianych lameli ściennych",
    category: "Zabudowy nietypowe",
    tags: ["RTV", "Salon", "Lamele"],
    featured: true,
    order: 16
  },
  {
    file: "realizacja-17.jpeg",
    title: "Zabudowa RTV - Podświetlenie LED",
    caption: "Podświetlenie LED podkreślające głębię lameli ściennych.",
    alt: "Liniowe podświetlenie LED strefy telewizyjnej w salonie",
    category: "Zabudowy nietypowe",
    tags: ["RTV", "Oświetlenie LED", "Lamele"],
    featured: true,
    order: 17
  },
  {
    file: "realizacja-18.jpeg",
    title: "Zabudowa RTV - Widok ogólny",
    caption: "Nowoczesna zabudowa RTV na całą ścianę w salonie.",
    alt: "Kompletna zabudowa meblowa salonu z wnęką na telewizor",
    category: "Zabudowy nietypowe",
    tags: ["RTV", "Salon", "Podświetlenie"],
    featured: true,
    order: 18
  },
  {
    file: "realizacja-19.jpeg",
    title: "Zabudowa RTV - Górne szafki",
    caption: "Szafki wiszące z systemem otwierania push-to-open.",
    alt: "Ukryte szafki nad telewizorem otwierane na klik",
    category: "Zabudowy nietypowe",
    tags: ["RTV", "Szafki wiszące", "Push-to-open"],
    featured: true,
    order: 19
  },
  {
    file: "realizacja-20.jpeg",
    title: "Zabudowa RTV - Łączenie lameli",
    caption: "Detal precyzyjnego spasowania lameli stolarskich.",
    alt: "Szczegół łączenia lameli ze ścianą meblową RTV",
    category: "Zabudowy nietypowe",
    tags: ["RTV", "Lamele", "Detal"],
    featured: true,
    order: 20
  },

  // Detale (21 - 25)
  {
    file: "realizacja-21.jpeg",
    title: "Komoda fornirowana",
    caption: "Dopracowana w każdym calu komoda fornirowana.",
    alt: "Komoda fornirowana z zaokrąglonymi narożnikami",
    category: "Detale",
    tags: ["Komoda", "Fornir", "Rzemiosło"],
    featured: true,
    order: 21
  },
  {
    file: "realizacja-22.jpeg",
    title: "Rysunek forniru komody",
    caption: "Wyselekcjonowany fornir z naturalnym rysunkiem drewna.",
    alt: "Rysunek słojów naturalnego drewna na froncie komody",
    category: "Detale",
    tags: ["Komoda", "Fornir", "Detal"],
    featured: true,
    order: 22
  },
  {
    file: "realizacja-23.jpeg",
    title: "Frezowany uchwyt komody",
    caption: "Wygodny frezowany uchwyt krawędziowy w szufladach.",
    alt: "Precyzyjne frezowanie uchwytu krawędziowego w komodzie",
    category: "Detale",
    tags: ["Komoda", "Uchwyt frezowany", "Detal"],
    featured: true,
    order: 23
  },
  {
    file: "realizacja-24.jpeg",
    title: "Drewniane szuflady komody",
    caption: "Wewnętrzne szuflady z naturalnego drewna z domykiem.",
    alt: "Drewniane szuflady z krytymi prowadnicami i soft-close",
    category: "Detale",
    tags: ["Komoda", "Drewniane szuflady", "Akcesoria"],
    featured: true,
    order: 24
  },
  {
    file: "realizacja-25.jpeg",
    title: "Detal spasowania komody",
    caption: "Łączenie krawędzi pod kątem 45 stopni na krawędzi komody.",
    alt: "Detal spasowania blatu fornirowanego z bokiem szafki",
    category: "Detale",
    tags: ["Komoda", "Spasowanie", "Detal rzemieślniczy"],
    featured: true,
    order: 25
  }
];

async function runSync() {
  const credsPath = path.resolve('scratch/temp-creds.json');
  try {
    console.log("Loading CLI credentials...");
    const config = JSON.parse(fs.readFileSync('C:\\Users\\damia\\.config\\configstore\\firebase-tools.json', 'utf8'));
    const refreshToken = config.tokens.refresh_token;

    const creds = {
      type: "authorized_user",
      client_id: "563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com",
      client_secret: "j9iVZfS8kkCEFUPaAeJV0sAi",
      refresh_token: refreshToken
    };

    fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2));
    process.env.GOOGLE_APPLICATION_CREDENTIALS = credsPath;

    console.log("Initializing Firestore...");
    const db = new Firestore({ projectId });

    // 1. GET PUBLIC URLS FROM kowerGallery
    console.log("\n--- STEP 1: Fetching public URLs from kowerGallery ---");
    const gallerySnapshot = await db.collection("kowerGallery").get();
    const galleryMap = new Map();
    gallerySnapshot.forEach(doc => {
      const data = doc.data();
      galleryMap.set(doc.id, {
        imageUrl: data.imageUrl,
        storagePath: data.storagePath
      });
    });
    console.log(`Mapped ${galleryMap.size} files.`);

    // 2. DELETE OLD DOCUMENTS in realizations
    console.log("\n--- STEP 2: Deleting old documents from realizations ---");
    const realizationsSnapshot = await db.collection("realizations").get();
    console.log(`Found ${realizationsSnapshot.size} documents in realizations`);
    const deleteBatch = db.batch();
    realizationsSnapshot.forEach(doc => {
      deleteBatch.delete(doc.ref);
      console.log(`Scheduled deletion of realization ID: ${doc.id}`);
    });
    if (realizationsSnapshot.size > 0) {
      await deleteBatch.commit();
      console.log("Firestore realizations deletions committed.");
    }

    // 3. WRITE NEW REALIZATIONS
    console.log("\n--- STEP 3: Writing new realizations ---");
    const writeBatch = db.batch();
    
    for (const item of imagesMetadata) {
      const docId = item.file.replace(".jpeg", "");
      const media = galleryMap.get(docId);
      if (!media) {
        console.warn(`Warning: Media details for ${docId} not found in kowerGallery! Skipping.`);
        continue;
      }

      const size = imageSizes[item.file];
      const payload = {
        title: item.title,
        slug: docId,
        status: "published",
        category: item.category,
        description: item.caption,
        longDescription: "",
        coverImage: media.imageUrl,
        coverImagePath: media.storagePath,
        coverImageId: docId,
        order: item.order,
        images: [
          {
            id: docId,
            src: media.imageUrl,
            alt: item.alt,
            caption: item.caption,
            width: size.width,
            height: size.height,
            order: 1,
            storagePath: media.storagePath
          }
        ],
        tags: item.tags,
        featured: item.featured,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        createdBy: "damian.k.sulima@gmail.com",
        updatedBy: "damian.k.sulima@gmail.com"
      };

      console.log(`Saving realization document realizations/${docId}...`);
      writeBatch.set(db.collection("realizations").doc(docId), payload);
    }

    await writeBatch.commit();
    console.log("\n--- REALIZATIONS SYNCHRONIZATION COMPLETE! ---");

  } catch (error) {
    console.error("Synchronization error:", error);
  } finally {
    if (fs.existsSync(credsPath)) {
      fs.unlinkSync(credsPath);
    }
  }
}

runSync();
