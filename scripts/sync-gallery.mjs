import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { Firestore, FieldValue } from '@google-cloud/firestore';
import { Storage } from '@google-cloud/storage';

const bucketName = "kower-84922.firebasestorage.app";
const projectId = "kower-84922";
const localImagesDir = "c:\\KOWER2\\public\\realizacje";

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
  // Kuchnia nowoczesna (order 101 to 104)
  {
    file: "realizacja-01.jpeg",
    title: "Jasna kuchnia nowoczesna",
    caption: "Jasna nowoczesna kuchnia na wymiar z wbudowanym podświetleniem strefy roboczej.",
    alt: "Jasna nowoczesna kuchnia z oświetleniem LED pod szafkami",
    category: "kuchnie",
    tags: ["Kuchnia", "Jasne fronty", "Zabudowa"],
    featured: true,
    realizationId: "jasna-kuchnia-nowoczesna",
    order: 101
  },
  {
    file: "realizacja-02.jpeg",
    title: "Jasna kuchnia nowoczesna - zabudowa wysoka",
    caption: "Wysoka zabudowa kuchenna ze sprzętem AGD w słupku.",
    alt: "Wysoka zabudowa kuchenna ze sprzętem AGD",
    category: "kuchnie",
    tags: ["Kuchnia", "Jasne fronty", "Zabudowa"],
    featured: false,
    realizationId: "jasna-kuchnia-nowoczesna",
    order: 102
  },
  {
    file: "realizacja-03.jpeg",
    title: "Jasna kuchnia nowoczesna - szuflady",
    caption: "Szuflady kuchenne z systemem cichego domykania i dedykowanym organizerem.",
    alt: "Pojemne szuflady kuchenne i organizer na sztućce",
    category: "kuchnie",
    tags: ["Kuchnia", "Jasne fronty", "Zabudowa"],
    featured: false,
    realizationId: "jasna-kuchnia-nowoczesna",
    order: 103
  },
  {
    file: "realizacja-04.jpeg",
    title: "Jasna kuchnia nowoczesna - zlew",
    caption: "Strefa zlewowa z blatem laminowanym odpornym na zarysowania.",
    alt: "Zabudowa zlewowa z dopasowanym blatem roboczym",
    category: "kuchnie",
    tags: ["Kuchnia", "Jasne fronty", "Zabudowa"],
    featured: false,
    realizationId: "jasna-kuchnia-nowoczesna",
    order: 104
  },

  // Kuchnia narożna z wyspą (order 201 to 204)
  {
    file: "realizacja-05.jpeg",
    title: "Kuchnia narożna z wyspą - układ narożny",
    caption: "Układ narożny mebli kuchennych z dopasowanymi frontami.",
    alt: "Układ narożny mebli kuchennych z dekoracyjną strefą półek",
    category: "kuchnie",
    tags: ["Kuchnia", "Wyspa", "Drewno"],
    featured: false,
    realizationId: "kuchnia-narozna-z-wyspa",
    order: 201
  },
  {
    file: "realizacja-06.jpeg",
    title: "Kuchnia narożna z wyspą - wyspa",
    caption: "Wyspa kuchenna stanowiąca dodatkową strefę roboczą i jadalnianą.",
    alt: "Wyspa kuchenna z blatem imitującym naturalny kamień",
    category: "kuchnie",
    tags: ["Kuchnia", "Wyspa", "Drewno"],
    featured: false,
    realizationId: "kuchnia-narozna-z-wyspa",
    order: 202
  },
  {
    file: "realizacja-07.jpeg",
    title: "Kuchnia narożna z wyspą - strefa gotowania",
    caption: "Nowoczesna strefa gotowania w zabudowie kuchennej.",
    alt: "Strefa gotowania z płytą indukcyjną i pochłaniaczem",
    category: "kuchnie",
    tags: ["Kuchnia", "Wyspa", "Drewno"],
    featured: false,
    realizationId: "kuchnia-narozna-z-wyspa",
    order: 203
  },
  {
    file: "realizacja-08.jpeg",
    title: "Kuchnia narożna z wyspą",
    caption: "Kompletna realizacja nowoczesnej kuchni z wyspą na wymiar.",
    alt: "Widok na całą zabudowę kuchenną z wyspą roboczą",
    category: "kuchnie",
    tags: ["Kuchnia", "Wyspa", "Drewno"],
    featured: true,
    realizationId: "kuchnia-narozna-z-wyspa",
    order: 204
  },

  // Nowoczesna kuchnia w połysku (order 301)
  {
    file: "realizacja-09.jpeg",
    title: "Nowoczesna kuchnia w połysku",
    caption: "Biała kuchnia w połysku z idealnym dopasowaniem do wymiarów pomieszczenia.",
    alt: "Biała kuchnia w połysku z kontrastującym ciemnym blatem",
    category: "kuchnie",
    tags: ["Kuchnia", "Połysk", "Materiały"],
    featured: true,
    realizationId: "kuchnia-bialy-polysk",
    order: 301
  },

  // Elegancka łazienka (order 401 to 403)
  {
    file: "realizacja-10.jpeg",
    title: "Elegancka łazienka - szafka pod umywalkę",
    caption: "Szafka pod umywalkę z precyzyjnie wykonanym ryflowaniem frontów.",
    alt: "Szafka łazienkowa pod umywalkę z ryflowanymi szufladami",
    category: "łazienki",
    tags: ["Łazienka", "Ryflowanie", "MDF lakierowany"],
    featured: false,
    realizationId: "lazienka-modern-classic",
    order: 401
  },
  {
    file: "realizacja-11.jpeg",
    title: "Elegancka łazienka z szafką pod umywalkę",
    caption: "Zabudowa wnęki łazienkowej nad stelażem podtynkowym WC.",
    alt: "Zabudowa strefy WC i pralki w łazience na wymiar",
    category: "łazienki",
    tags: ["Łazienka", "Ryflowanie", "MDF lakierowany"],
    featured: true,
    realizationId: "lazienka-modern-classic",
    order: 402
  },
  {
    file: "realizacja-12.jpeg",
    title: "Elegancka łazienka - szafki wiszące",
    caption: "Szafki wiszące z lustrami optycznie powiększającymi łazienkę.",
    alt: "Pojemne szafki łazienkowe z lustrzanym frontem",
    category: "łazienki",
    tags: ["Łazienka", "Ryflowanie", "MDF lakierowany"],
    featured: false,
    realizationId: "lazienka-modern-classic",
    order: 403
  },

  // Garderoba i szafy (order 501 to 503)
  {
    file: "realizacja-13.jpeg",
    title: "Garderoba i szafy przesuwne w sypialni",
    caption: "Szafa przesuwna z lustrem w czarnej ramie aluminiowej.",
    alt: "Szafa przesuwna z lustrem i czarnymi profilami aluminiowymi",
    category: "szafy",
    tags: ["Szafa", "Garderoba", "Drzwi przesuwne"],
    featured: true,
    realizationId: "garderoba-szafy-przesuwne",
    order: 501
  },
  {
    file: "realizacja-14.jpeg",
    title: "Garderoba i szafy - wnętrze",
    caption: "Funkcjonalny podział wnętrza garderoby na strefy przechowywania.",
    alt: "Wnętrze garderoby z podświetleniem LED szuflad i półek",
    category: "szafy",
    tags: ["Szafa", "Garderoba", "Drzwi przesuwne"],
    featured: false,
    realizationId: "garderoba-szafy-przesuwne",
    order: 502
  },
  {
    file: "realizacja-15.jpeg",
    title: "Garderoba i szafy - fronty matowe",
    caption: "Praktyczne szafy na wymiar z gładkimi matowymi frontami.",
    alt: "Zabudowa garderobiana z frontami w matowej szarości",
    category: "szafy",
    tags: ["Szafa", "Garderoba", "Drzwi przesuwne"],
    featured: false,
    realizationId: "garderoba-szafy-przesuwne",
    order: 503
  },

  // Salon RTV (order 601 to 605)
  {
    file: "realizacja-16.jpeg",
    title: "Nowoczesna zabudowa RTV - wisząca szafka",
    caption: "Kontrast wiszącej szafki RTV z pionowymi lamelami z drewna.",
    alt: "Wisząca szafka RTV na tle drewnianych lameli ściennych",
    category: "realizacje",
    tags: ["RTV", "Salon", "Lamele", "LED"],
    featured: false,
    realizationId: "salon-zabudowa-rtv-lamele",
    order: 601
  },
  {
    file: "realizacja-17.jpeg",
    title: "Nowoczesna zabudowa RTV - podświetlenie",
    caption: "Podświetlenie LED podkreślające głębię lameli ściennych.",
    alt: "Liniowe podświetlenie LED strefy telewizyjnej w salonie",
    category: "realizacje",
    tags: ["RTV", "Salon", "Lamele", "LED"],
    featured: false,
    realizationId: "salon-zabudowa-rtv-lamele",
    order: 602
  },
  {
    file: "realizacja-18.jpeg",
    title: "Nowoczesna zabudowa RTV w salonie",
    caption: "Nowoczesna zabudowa RTV na całą ścianę w salonie.",
    alt: "Kompletna zabudowa meblowa salonu z wnęką na telewizor",
    category: "realizacje",
    tags: ["RTV", "Salon", "Lamele", "LED"],
    featured: true,
    realizationId: "salon-zabudowa-rtv-lamele",
    order: 603
  },
  {
    file: "realizacja-19.jpeg",
    title: "Nowoczesna zabudowa RTV - górne szafki",
    caption: "Szafki wiszące z systemem otwierania push-to-open.",
    alt: "Ukryte szafki nad telewizorem otwierane na klik",
    category: "realizacje",
    tags: ["RTV", "Salon", "Lamele", "LED"],
    featured: false,
    realizationId: "salon-zabudowa-rtv-lamele",
    order: 604
  },
  {
    file: "realizacja-20.jpeg",
    title: "Nowoczesna zabudowa RTV - detal lameli",
    caption: "Detal precyzyjnego spasowania lameli stolarskich.",
    alt: "Szczegół łączenia lameli ze ścianą meblową RTV",
    category: "realizacje",
    tags: ["RTV", "Salon", "Lamele", "LED"],
    featured: false,
    realizationId: "salon-zabudowa-rtv-lamele",
    order: 605
  },

  // Detale (order 701 to 705)
  {
    file: "realizacja-21.jpeg",
    title: "Detale rzemieślnicze - komoda",
    caption: "Dopracowana w każdym calu komoda fornirowana.",
    alt: "Komoda fornirowana z zaokrąglonymi narożnikami",
    category: "detale",
    tags: ["Komoda", "Fornir", "Detal", "Rzemiosło"],
    featured: true,
    realizationId: "detale-komody-fornir",
    order: 701
  },
  {
    file: "realizacja-22.jpeg",
    title: "Detale rzemieślnicze - rysunek drewna",
    caption: "Wyselekcjonowany fornir z naturalnym rysunkiem drewna.",
    alt: "Rysunek słojów naturalnego drewna na froncie komody",
    category: "detale",
    tags: ["Komoda", "Fornir", "Detal", "Rzemiosło"],
    featured: false,
    realizationId: "detale-komody-fornir",
    order: 702
  },
  {
    file: "realizacja-23.jpeg",
    title: "Detale rzemieślnicze - uchwyt",
    caption: "Wygodny frezowany uchwyt krawędziowy w szufladach.",
    alt: "Precyzyjne frezowanie uchwytu krawędziowego w komodzie",
    category: "detale",
    tags: ["Komoda", "Fornir", "Detal", "Rzemiosło"],
    featured: false,
    realizationId: "detale-komody-fornir",
    order: 703
  },
  {
    file: "realizacja-24.jpeg",
    title: "Detale rzemieślnicze - szuflada",
    caption: "Wewnętrzne szuflady z naturalnego drewna z domykiem.",
    alt: "Drewniane szuflady z krytymi prowadnicami i soft-close",
    category: "detale",
    tags: ["Komoda", "Fornir", "Detal", "Rzemiosło"],
    featured: false,
    realizationId: "detale-komody-fornir",
    order: 704
  },
  {
    file: "realizacja-25.jpeg",
    title: "Detale rzemieślnicze - narożnik",
    caption: "Łączenie krawędzi pod kątem 45 stopni na krawędzi komody.",
    alt: "Detal spasowania blatu fornirowanego z bokiem szafki",
    category: "detale",
    tags: ["Komoda", "Fornir", "Detal", "Rzemiosło"],
    featured: false,
    realizationId: "detale-komody-fornir",
    order: 705
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

    console.log("Initializing Firestore and Storage...");
    const db = new Firestore({ projectId });
    const storage = new Storage({ projectId });
    const bucket = storage.bucket(bucketName);

    // 1. DELETE OLD STORAGE FILES under kower/gallery/
    console.log("\n--- STEP 1: Deleting old files from Firebase Storage ---");
    const [files] = await bucket.getFiles({ prefix: 'kower/gallery/' });
    console.log(`Found ${files.length} old files under kower/gallery/`);
    for (const file of files) {
      await file.delete();
      console.log(`Deleted Storage file: ${file.name}`);
    }

    // 2. DELETE OLD FIRESTORE DOCUMENTS in kowerGallery
    console.log("\n--- STEP 2: Deleting old documents from Firestore ---");
    const gallerySnapshot = await db.collection("kowerGallery").get();
    console.log(`Found ${gallerySnapshot.size} documents in kowerGallery`);
    const batch = db.batch();
    gallerySnapshot.forEach(doc => {
      batch.delete(doc.ref);
      console.log(`Scheduled deletion of document ID: ${doc.id}`);
    });
    if (gallerySnapshot.size > 0) {
      await batch.commit();
      console.log("Firestore deletions committed.");
    }

    // 3. UPLOAD NEW IMAGES & WRITE TO FIRESTORE
    console.log("\n--- STEP 3: Uploading new files and writing documents ---");
    for (const img of imagesMetadata) {
      const localPath = path.join(localImagesDir, img.file);
      const uuidToken = crypto.randomUUID();
      const storagePath = `kower/gallery/${img.category}/${img.file}`;

      console.log(`\nUploading ${img.file} to Storage path: ${storagePath}...`);
      
      const fileStats = fs.statSync(localPath);
      const fileBytes = fileStats.size;

      // Upload file to bucket with custom metadata for download tokens
      await bucket.upload(localPath, {
        destination: storagePath,
        metadata: {
          contentType: 'image/jpeg',
          metadata: {
            firebaseStorageDownloadTokens: uuidToken
          }
        }
      });

      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodeURIComponent(storagePath)}?alt=media&token=${uuidToken}`;
      console.log(`Upload complete. Public URL: ${publicUrl}`);

      const size = imageSizes[img.file];

      const docId = img.file.replace(".jpeg", "");
      const payload = {
        title: img.title,
        caption: img.caption,
        alt: img.alt,
        category: img.category,
        tags: img.tags,
        imageUrl: publicUrl,
        thumbnailUrl: publicUrl,
        storagePath: storagePath,
        thumbnailStoragePath: storagePath,
        originalFileName: img.file,
        width: size.width,
        height: size.height,
        sizeBytes: fileBytes,
        compressedSizeBytes: fileBytes,
        thumbnailSizeBytes: fileBytes,
        format: "jpeg",
        order: img.order,
        isPublished: true,
        featured: img.featured,
        realizationId: docId,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        createdBy: "damian.k.sulima@gmail.com",
        updatedBy: "damian.k.sulima@gmail.com"
      };

      console.log(`Saving document to Firestore kowerGallery/${docId}...`);
      await db.collection("kowerGallery").doc(docId).set(payload);
      console.log(`Document saved.`);
    }

    console.log("\n--- SYNCHRONIZATION COMPLETE! ---");

  } catch (error) {
    console.error("Synchronization error:", error);
  } finally {
    if (fs.existsSync(credsPath)) {
      fs.unlinkSync(credsPath);
    }
  }
}

runSync();
