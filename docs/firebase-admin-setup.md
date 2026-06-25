# Konfiguracja Firebase i panelu KOWER

Panel administracyjny działa pod adresem:

`/kower-admin-2026`

Samo ukrycie adresu panelu nie jest zabezpieczeniem. Prawdziwe zabezpieczenie musi być w Firebase Rules.

## 1. Zmienne środowiskowe

Skopiuj `.env.example` do `.env.local` i uzupełnij konfigurację aplikacji webowej Firebase. Wartości `NEXT_PUBLIC_FIREBASE_*` identyfikują projekt, ale nie nadają uprawnień administracyjnych.

Do serwerowego zapisu zgłoszeń i prywatnych załączników skonfiguruj:

```ini
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_STORAGE_BUCKET=
```

Na produkcji ustaw te wartości w panelu hostingu. Nie zapisuj klucza prywatnego w repozytorium.

Formularz kontaktowy korzysta opcjonalnie z:

```ini
RESEND_API_KEY=
KOWER_CONTACT_EMAIL=
KOWER_FORM_FROM=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY=
```

## 2. Konto administratora

1. Włącz logowanie Email/Password w Firebase Authentication.
2. Utwórz użytkownika administratora.
3. W Firestore utwórz dokument `users/{uid}`:

```json
{
  "role": "admin",
  "disabled": false
}
```

Alternatywnie backend może ustawić custom claim `admin: true`. Reguły obsługują oba warianty.

## 3. Reguły i indeksy

Pliki źródłowe:

- `firebase/firestore.rules`
- `firebase/storage.rules`
- `firebase/firestore.indexes.json`

Wdrożenie po sprawdzeniu właściwego projektu:

```powershell
npx -y firebase-tools@latest deploy --only firestore:rules,firestore:indexes,storage
```

Reguły zapewniają:

- publiczny odczyt wyłącznie opublikowanych treści;
- publiczny zapis tylko nowego, zwalidowanego zgłoszenia;
- zapis CMS, usuwanie i upload wyłącznie dla administratora;
- prywatność załączników formularza;
- limity MIME i rozmiaru obrazów w Storage.

## 4. App Check i reCAPTCHA

App Check jest inicjalizowany dopiero po ustawieniu `NEXT_PUBLIC_FIREBASE_APP_CHECK_SITE_KEY`. Najpierw zarejestruj domeny produkcyjne w Firebase App Check, sprawdź metryki, a następnie włącz egzekwowanie dla Firestore i Storage.

Formularz używa reCAPTCHA v3, jeśli ustawiono oba klucze. Bez sekretu serwerowego formularz nadal działa, ale ochrona reCAPTCHA nie jest egzekwowana.

## 5. Pierwsze uruchomienie

1. Uruchom `npm run dev`.
2. Otwórz `/kower-admin-2026/login`.
3. Zaloguj się kontem z rolą `admin`.
4. Zaimportuj istniejące treści przyciskami w panelach Oferta, Producenci i SEO.
5. Sprawdź edycję kontaktu, hero, realizacji i eksport kopii danych.

## 6. Ważne uwagi

- Reguły z repozytorium nie działają na produkcji, dopóki nie zostaną wdrożone.
- Firebase Admin SDK omija Security Rules, dlatego jest używany wyłącznie w kontrolowanych route handlerach.
- Prywatne załączniki są udostępniane administratorowi przez krótkotrwały podpisany URL.
- Po zmianie zmiennych środowiskowych wykonaj nowy deployment aplikacji.
