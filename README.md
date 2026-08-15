# 🎟️ Kupon - Peer-to-Peer Gift Exchange

<p align="center">
  <img src="public/app-icon.png" width="140" height="140" alt="Kupon Mascot" style="border-radius: 28px; box-shadow: 4px 4px 0px 0px #171B2B;" />
</p>

<p align="center">
  <strong>Un'esperienza digitale tattile, giocosa e moderna per creare, regalare e scambiare coupon ed esperienze con amici e partner.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-blue.svg" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-blue.svg" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.x-646CFF.svg" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC.svg" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Zustand-5.x-orange.svg" alt="Zustand" />
  <img src="https://img.shields.io/badge/Status-Production%20Ready-brightgreen.svg" alt="Status" />
</p>

---

## 🌟 Caratteristiche Principali

- 🎟️ **Estetica Carta Tattile & Perforazioni Fisiche**:
  - Bordi e linee perforate con fori circolari di strappo (*punch-holes*).
  - Doppia bordatura carbone (`#171B2B`) e ombre tattili rigide (*Neo-brutalist tactile offset*).
  - Palette pastello curate: *Peach*, *Matcha*, *Butter*, *Lilac*.

- 🎁 **Passaggio di Proprietà P2P dal Vivo (Live Handover)**:
  - Condivisione diretta tramite QR code dedicato: inquadrando il codice con la fotocamera, il Kupon si aggiunge nel portafoglio dell'amico e viene rimosso dal mittente (senza essere consumato subito).
  - Supporto per condivisione istantanea via **WhatsApp**, **Telegram**, **Web Share API** e link claim universali (`?gift=...`).

- 📷 **Scanner con Fotocamera Reale (`html5-qrcode` & WebRTC)**:
  - Scansione in tempo reale con la fotocamera dello smartphone (posteriore/frontale) o webcam del PC.
  - Caricamento e decodifica diretta di immagini o screenshot con QR code dalla galleria.

- 🔓 **Messaggio Segreto Rivelato al Riscatto**:
  - Inserisci una sorpresa o dedica che rimane sigillata e crittografata durante lo stato attivo e si rivela solo al momento dello strappo fisico del biglietto!

- 🎶 **Suite Sonora Tattile (Web Audio API a Zero Latenza)**:
  - 🎟️ Suono croccante di carta perforata che si strappa (`playPaperTear`).
  - ✨ Campanellino e arpeggio armonico scintillante con coriandoli (`playSuccessChime`).
  - 🔓 Sblocco misterioso del messaggio segreto (`playSecretUnlocked`).
  - ⚡ Bip laser dello scanner e click morbidi a bolla (`playCuteTap`).
  - Controllo volume e mute con preferenza persistente.

- ⏳ **Regola di Pulizia Automatica delle 2 Ore**:
  - I biglietti strappati mostrano un conto alla rovescia in tempo reale e vengono automaticamente archiviati dopo 2 ore dal riscatto.

- 👤 **Personalizzazione Profilo Completa**:
  - Scelta tra diverse espressioni della mascotte o caricamento foto/selfie personalizzata.
  - Modifica di nome, nickname `@handle`, bio e firma predefinita del mittente.
  - Esportazione backup del portafoglio in formato **JSON**.

- 💡 **Catalogo Modelli & Idee Regalo Pronte all'Uso**:
  - Modelli già configurati (*Caffè & Cornetto, Pizza & Birra, Massaggio Relax, Cinema Popcorn, Passaggio Auto, Cena Speciale*) pronti all'invio in 1 click.

---

## 🚀 Quick Start / Installazione

### Prerequisiti
- [Node.js](https://nodejs.org/) (versione 18 o superiore consigliata)
- `npm`, `yarn` o `pnpm`

### 1. Clona il repository
```bash
git clone https://github.com/TUO_USERNAME/kupon-p2p-exchange.git
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

### 4. Compilazione per la Produzione
```bash
npm run build
```

---

## 📂 Struttura del Progetto

```text
kupon-peer-to-peer-exchange/
├── public/                     # Asset pubblici (app-icon.png, favicon.png)
├── src/
│   ├── components/             # Componenti UI tattili
│   │   ├── BottomNavBar.tsx    # Barra di navigazione mobile
│   │   ├── CameraQRScanner.tsx # Scanner fotocamera reale WebRTC
│   │   ├── Confetti.tsx        # Animazione coriandoli celebrativi
│   │   ├── GiftClaimModal.tsx  # Modale di ricezione regalo da link
│   │   ├── Header.tsx          # Barra superiore con avatar e toggle audio
│   │   ├── QRCodeModal.tsx     # Modale presentazione QR (Transfer & Redeem)
│   │   ├── QRScannerModal.tsx  # Modale scanner fotocamera a schermo intero
│   │   ├── ShareCouponModal.tsx# Pannello condivisione WhatsApp/Telegram/Link
│   │   └── TicketCard.tsx      # Biglietto perforato a due stati (Attivo / Strappato)
│   ├── hooks/
│   │   └── useCoupons.ts       # Hook con filtro reattivo 2-Hour Cleanup
│   ├── screens/
│   │   ├── CreateCouponScreen.tsx # Builder coupon con 50+ icone e messaggi segreti
│   │   ├── DealsScreen.tsx     # Catalogo modelli e idee regalo rapide
│   │   ├── HomeScreen.tsx      # Wallet principale con stati e filtri
│   │   ├── ProfileScreen.tsx   # Gestione profilo, avatar e statistiche
│   │   └── ScanScreen.tsx      # Schermata scanner autonoma
│   ├── services/
│   │   ├── couponService.ts    # Persistenza localStorage e EventBus real-time
│   │   ├── qrService.ts        # Generazione token crittografici e packing QR
│   │   └── soundService.ts     # Motore audio procedurale Web Audio API
│   ├── store/
│   │   └── couponStore.ts      # Store globale Zustand
│   ├── theme/
│   │   └── tokens.ts           # Design tokens, palette pastello e icone
│   ├── types/
│   │   └── coupon.ts           # TypeScript interfaces (Coupon, UserProfile, QRPayload)
│   ├── App.tsx                 # Root layout & routing tab
│   ├── index.css               # Stili CSS, animazioni laser e perforazioni
│   └── main.tsx                # Entrypoint React
├── package.json
├── tailwind.config.js          # Configurazione design tokens Google Stitch
└── tsconfig.json
```

---

## 🛠️ Tecnologie Utilizzate

- **Framework**: React 18 con TypeScript
- **Bundler**: Vite 6
- **Styling**: Tailwind CSS + Custom Tactile Shadows & Animations
- **State Management**: Zustand
- **Audio Engine**: Web Audio API (Sintesi procedurale a zero latenza)
- **Camera Scanner**: `html5-qrcode` (Supporto WebRTC multipiattaforma)
- **QR Generator**: `qrcode.react` (SVG vettoriale ad alto contrasto)
- **Effetti Particellari**: `canvas-confetti`

---

## 📄 Licenza & Crediti

Sviluppato con passione da **DDD**.

*Kupon Peer-to-Peer Exchange • developed by DDD*
