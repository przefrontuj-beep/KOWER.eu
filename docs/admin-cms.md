# Panel CMS KOWER

## Moduły

- Dashboard: statystyki, ostatnie zdjęcia, zgłoszenia i aktywność.
- Realizacje: opis, kategoria, slug, status, kolejność, okładka i galeria.
- Galeria: wielokrotny upload, kompresja WebP, miniatury, widoczność i usuwanie Storage.
- Strona główna: hero, opis i przyciski CTA.
- Oferta, Lamele, Materiały: edycja treści podstron i SEO.
- Producenci: logo, kategoria, link, status i kolejność.
- Kontakt: dane firmy używane w nagłówku, stopce i danych strukturalnych.
- Zgłoszenia: status obsługi, notatka i prywatne załączniki.
- SEO: title, description, canonical, Open Graph i index/noindex.
- Kopie zapasowe: eksport danych CMS do JSON.

## Statusy publikacji

- `draft`: zapis roboczy, niewidoczny publicznie;
- `published`: widoczny na stronie;
- `hidden`: zachowany w CMS, ale niewidoczny publicznie.

## Kolekcje Firestore

`users`, `kowerGallery`, `realizations`, `offers`, `producers`, `siteSettings`, `seoEntries`, `leads`, `activityLogs`.

## Obrazy

Obrazy CMS trafiają do `kower/cms/...`, a galeria do `kower/gallery/...`. Przeglądarka tworzy wersję dużą (maks. 1920 px) i miniaturę (600 px), preferując WebP. Listy publiczne oraz panel korzystają z miniatur.

Załączniki klientów są zapisywane prywatnie w `kower/leads/{leadId}/...`.

## Eksploatacja

Przed publikacją zmian sprawdź podgląd w panelu. Regularnie pobieraj pełną kopię JSON i przechowuj ją poza aplikacją. Po zmianie reguł zawsze wykonaj test na środowisku testowym przed wdrożeniem produkcyjnym.
