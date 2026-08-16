# 🎟️ Kupon - Peer-to-Peer Gift Exchange

<p align="center">
  <img src="public/app-icon.png" width="140" height="140" alt="Kupon Mascot" style="border-radius: 28px; box-shadow: 4px 4px 0px 0px #171B2B;" />
</p>

<p align="center">
  <strong>Un'esperienza digitale tattile, giocosa e moderna per creare, regalare, collezionare sticker kawaii e scambiare coupon ed esperienze con amici e partner.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-blue.svg" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF.svg" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Zustand-5.x-orange.svg" alt="Zustand" />
  <img src="https://img.shields.io/badge/Capacitor-Android-3880FF.svg" alt="Capacitor Android" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg" alt="Status" />
</p>

---

## 🌟 Caratteristiche Principali

### 🎟️ Estetica Carta Tattile & Coupon Fisici
- Bordi e linee perforate con fori circolari di strappo (*punch-holes*).
- Doppia bordatura carbone (`#171B2B`) e ombre tattili rigide (*Neo-brutalist tactile offset*).
- Palette pastello curate: *Peach*, *Matcha*, *Butter*, *Lilac*.

### 📖 Album StickerBook & Loot System Giapponese Kawaii
- **36 Sticker Vettoriali SVG Esclusivi**:
  - *Cibo & Snack 🍙*: Onigiri Felice, Dango Tricolore, Ramen Fumante, Taiyaki Dorato, Boba Milk Tea, Nigiri Imperiale.
  - *Animali & Pet 🐾*: Shiba Inu Sorridente, Coniglietto Mochi, Panda Paffuto, Polipetto Tako, Axolotl Magico, Maneki-Neko d'Oro.
  - *Tradizione & Portafortuna 🌸*: Teru Teru Bozu, Lanterna Chochin, Gru Origami, Fiore di Sakura, Daruma dei Desideri, Monte Fuji e Sole.
  - *Magia & Cosette Kawaii ✨*: Nuvola Arcobaleno, Stella Konpeito, Luna Addormentata, Pozione d'Amore, Cristallo Scintillante, Fuocherello Kitsune.
  - *Amore & Coccole 💖*: Fragolina Kawaii, Pesca Momo, Tazza Neko Latte, Lettera con Sigillo, Orsetti Innamorati, Cuore Alato Divino.
  - *Distintivi & Speciali 👑*: Timbro "SUGOI!", Ventaglio Dipinto, Medaglia Stella #1, Chiave dei Segreti, Corona Imperiale, Infinito Galattico.
- **Effetto Sticker Vinilico & Foil Olografico**: spesso contorno bianco die-cut, lucido superiore e riflessi iridescenti arcobaleno per sticker *Rari ⭐*, *Epici 🔮* e *Leggendari 👑*.
- **Mistero Assoluto**: le figurine non ancora sbloccate sono oscurate al 100% in nero solido (`#171B2B`) con un punto interrogativo bianco `?`.
- **Unboxing Interattivo delle Bustine**: animazione 3D della bustina sigillata con strappo perforato, seguita da 3 carte misteriose a faccia in giù da toccare e girare una alla volta con effetti sonori di rarità e coriandoli!
- **Progressione & Livelli**: ricevi pacchetti misteriosi salendo di livello (riscattando coupon) e condividendo coupon con gli amici.

### 🎨 Decorazione Libera dei Coupon
- Personalizza i tuoi coupon applicando gli sticker disponibili dal tuo zaino.
- **Drag-and-Drop fluido** su touchscreen e mouse (con `touch-action: none` e pointer capture a prova di scroll accidentale).
- Mini-toolbar contestuale per ruotare di 45°, ciclare le dimensioni (S/M/L) e rimuovere sticker.
- Gli sticker applicati viaggiano insieme al coupon nel QR code e nei link di condivisione e vengono visualizzati dal destinatario!

### 🎁 Passaggio di Proprietà P2P dal Vivo (Live Handover)
- Condivisione diretta tramite QR code dedicato: inquadrando il codice con la fotocamera, il Kupon si trasferisce nel portafoglio dell'amico.
- Supporto per condivisione istantanea via **WhatsApp**, **Telegram**, **Web Share API** e link claim universali (`?gift=...`).

### 📷 Scanner Fotocamera Reale (`html5-qrcode` & WebRTC)
- Scansione in tempo reale con fotocamera dello smartphone (posteriore/frontale) o webcam PC.
- Caricamento e decodifica diretta di screenshot o immagini dalla galleria.

### 🔓 Messaggio Segreto Rivelato al Riscatto
- Inserisci una sorpresa o dedica che rimane sigillata e si rivela solo al momento dello strappo fisico del biglietto!

### 🎶 Suite Sonora Tattile (Web Audio API a Zero Latenza)
- 🎟️ Suono croccante di carta perforata che si strappa (`playPaperTear`).
- ✨ Campanellino e arpeggio armonico scintillante con coriandoli (`playSuccessChime`).
- 🔓 Sblocco misterioso del messaggio segreto (`playSecretUnlocked`).
- ⚡ Bip laser dello scanner e click morbidi a bolla (`playCuteTap`).
- Controllo volume e preferenza persistente.

### ⏳ Pulizia Automatica delle 2 Ore
- I biglietti riscattati mostrano un conto alla rovescia in tempo reale e vengono automaticamente archiviati dopo 2 ore dal riscatto.

### 👤 Gestione Profilo & Reset Dati
- Scelta della mascotte o caricamento avatar personalizzato.
- Statistiche di collezione e livello profilo.
- Pulsante per esportare il backup JSON del portafoglio e pulsante per **Azzerare la Collezione StickerBook**.

---

## 🚀 Quick Start / Installazione

### Prerequisiti
- [Node.js](https://nodejs.org/) (versione 18 o superiore consigliata)
- `npm`, `yarn` o `pnpm`

### 1. Clona il repository
```bash
git clone https://github.com/DanieleTrippodo/kupon-p2p-exchange.git
cd kupon-p2p-exchange
```

### 2. Installa le dipendenze
```bash
npm install
```

### 3. Avvia il server di sviluppo
```bash
npm run dev
```
L'applicazione sarà attiva su `http://localhost:3000/`.

### 4. Compilazione Web per Produzione
```bash
npm run build
```

---

## 📱 Build APK Android (Capacitor)

L'applicazione è configurata con **Capacitor** per la compilazione su dispositivi Android:

1. **Sincronizza gli asset Web compilati con il progetto nativo**:
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Compila l'APK di Debug con Gradle**:
   ```bash
   cd android
   .\gradlew.bat assembleDebug
   ```

3. **Trova il file APK**:
   Il file `.apk` generato sarà disponibile in:
   `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Installa su dispositivo via ADB**:
   ```bash
   adb install -r "android/app/build/outputs/apk/debug/app-debug.apk"
   ```

---

## 📂 Struttura del Progetto

```text
kupon-peer-to-peer-exchange/
├── android/                    # Progetto nativo Android (Capacitor + Gradle)
├── public/                     # Asset statici (app-icon.png, favicon.png)
├── src/
│   ├── components/             # Componenti UI tattili
│   │   ├── BottomNavBar.tsx    # Barra di navigazione mobile con badge bustine
│   │   ├── CameraQRScanner.tsx # Scanner fotocamera reale WebRTC
│   │   ├── Confetti.tsx        # Animazione coriandoli celebrativi
│   │   ├── GiftClaimModal.tsx  # Ricezione e riscatto regalo da link
│   │   ├── Header.tsx          # Barra superiore con avatar e toggle audio
│   │   ├── QRCodeModal.tsx     # Modale QR (Transfer & Redeem)
│   │   ├── QRScannerModal.tsx  # Scanner fotocamera a schermo intero
│   │   ├── ShareCouponModal.tsx# Condivisione WhatsApp/Telegram/Link
│   │   ├── StickerDecorator.tsx# Canvas di posizionamento e drag degli sticker
│   │   ├── StickerSvg.tsx      # Renderer SVG 36 sticker kawaii die-cut & olografici
│   │   └── TicketCard.tsx      # Biglietto perforato con sticker applicati
│   ├── data/
│   │   └── stickersCatalog.ts  # Catalogo 36 sticker giapponesi kawaii e rarità
│   ├── hooks/
│   │   └── useCoupons.ts       # Hook con filtro reattivo 2-Hour Cleanup
│   ├── screens/
│   │   ├── CreateCouponScreen.tsx # Creazione coupon con sticker e messaggio segreto
│   │   ├── HomeScreen.tsx      # Wallet principale con stati e filtri
│   │   ├── ProfileScreen.tsx   # Gestione profilo, statistiche e reset dati
│   │   ├── ScanScreen.tsx      # Schermata scanner autonoma
│   │   └── StickersScreen.tsx  # Album StickerBook & unboxing 3D interattivo
│   ├── services/
│   │   ├── couponService.ts    # Persistenza localStorage e EventBus real-time
│   │   ├── qrService.ts        # Generazione token crittografici e packing QR
│   │   ├── soundService.ts     # Motore audio procedurale Web Audio API
│   │   └── stickerService.ts   # Loot engine, rotazione bustine, XP e progressione
│   ├── store/
│   │   └── couponStore.ts      # Store globale Zustand
│   ├── theme/
│   │   └── tokens.ts           # Design tokens, palette pastello e icone
│   ├── types/
│   │   ├── coupon.ts           # TypeScript interfaces (Coupon, UserProfile, QRPayload)
│   │   └── sticker.ts          # Type definitions per sticker, rarità e inventario
│   ├── App.tsx                 # Root layout & routing tab
│   ├── index.css               # Stili CSS, animazioni e perforazioni
│   ├── main.tsx                # Entrypoint React
│   └── test-core-logic.ts      # Suite di test automatici della logica core
├── capacitor.config.json
├── package.json
├── tailwind.config.js          # Configurazione design tokens
└── tsconfig.json
```

---

## 🛠️ Tecnologie Utilizzate

- **Framework**: React 18 con TypeScript
- **Mobile Engine**: Capacitor 7 (Android)
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS + Custom Tactile Shadows & Keyframe Animations
- **State Management**: Zustand
- **Audio Engine**: Web Audio API (Sintesi procedurale a zero latenza)
- **Camera Scanner**: `html5-qrcode` (WebRTC multipiattaforma)
- **QR Generator**: `qrcode.react` (SVG vettoriale ad alto contrasto)
- **Effetti Particellari**: `canvas-confetti`

---

## 📄 Licenza & Crediti

Sviluppato con passione da **DDD** (*Daniele Trippodo*).

*Kupon Peer-to-Peer Exchange • developed by DDD*
