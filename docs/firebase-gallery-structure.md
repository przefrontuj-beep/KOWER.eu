# Struktura realizacji i galerii

Publiczna galeria korzysta najpierw z opublikowanych dokumentów `realizations`. Jeżeli kolekcja jest pusta, zachowany jest fallback do dotychczasowej kolekcji `kowerGallery`, a następnie do danych lokalnych.

## `realizations/{id}`

```ts
{
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  category: string;
  location: string;
  date: string;
  coverImage: string;
  coverImagePath: string;
  coverImageId: string;
  images: {
    id: string;
    src: string;
    thumbnailUrl: string;
    alt: string;
    caption: string;
    storagePath: string;
    thumbnailStoragePath: string;
    width: number;
    height: number;
    order: number;
  }[];
  featured: boolean;
  status: "draft" | "published" | "hidden";
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## `kowerGallery/{id}`

Kolekcja przechowuje pojedyncze obrazy, ich miniatury, metadane, kategorię, status publikacji i opcjonalne `realizationId`.

Pliki są zapisywane w:

```txt
kower/gallery/{category}/{unique-name}.webp
kower/gallery/{category}/{unique-name}_thumb.webp
```

Panel kompresuje obrazy przed wysłaniem, ogranicza kolejkę do 20 plików i używa miniatur w listach. Usunięcie obrazu usuwa dokument oraz oba pliki Storage.
