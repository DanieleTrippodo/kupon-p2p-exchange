import { ColorTheme } from '../types/coupon';

export const COLORS = {
  background: '#FAF8FF',
  onBackground: '#171B2B',
  
  // Brand pastels (Stitch Design System)
  themes: {
    peach: {
      name: 'Peach',
      bg: '#FFB5A7',
      text: '#7A443A',
      badgeBg: '#FFDAD3',
      dark: '#884F44',
      light: '#FFF0ED',
      dim: '#FEB4A6',
    },
    matcha: {
      name: 'Matcha',
      bg: '#C9E7CA',
      text: '#4E6952',
      badgeBg: '#CCEACD',
      dark: '#4A654E',
      light: '#EFF8F0',
      dim: '#B1CEB2',
    },
    butter: {
      name: 'Butter',
      bg: '#D4C79D',
      text: '#5C5332',
      badgeBg: '#F0E2B7',
      dark: '#675E3C',
      light: '#FAF7EE',
      dim: '#D3C69D',
    },
    lilac: {
      name: 'Lilac',
      bg: '#DEE1F8',
      text: '#3C3F5E',
      badgeBg: '#E4E7FE',
      dark: '#52577A',
      light: '#F3F4FE',
      dim: '#D6D9EF',
    },
  },
  
  // Tactile Outlines & Shadows
  stroke: '#171B2B',
  shadowColor: '#171B2B',
  surface: '#FAF8FF',
  surfaceCard: '#FFFFFF',
  error: '#BA1A1A',
  errorContainer: '#FFDAD6',
};

export interface IconCategory {
  name: string;
  icons: { id: string; label: string }[];
}

export const ICON_CATEGORIES: IconCategory[] = [
  {
    name: 'Cibo & Drink 🍕☕',
    icons: [
      { id: 'local_cafe', label: 'Caffè' },
      { id: 'local_pizza', label: 'Pizza' },
      { id: 'local_bar', label: 'Cocktail / Drink' },
      { id: 'icecream', label: 'Gelato' },
      { id: 'restaurant', label: 'Cena al Ristorante' },
      { id: 'lunch_dining', label: 'Burger & Panino' },
      { id: 'bakery_dining', label: 'Croissant / Brioche' },
      { id: 'ramen_dining', label: 'Ramen & Sushi' },
      { id: 'cake', label: 'Torta / Dolce' },
      { id: 'cookie', label: 'Biscotto' },
      { id: 'local_dining', label: 'Pranzo Insieme' },
      { id: 'sports_bar', label: 'Birra in Compagnia' },
    ],
  },
  {
    name: 'Amore, Affetto & Coccole ❤️',
    icons: [
      { id: 'favorite', label: 'Abbraccio / Amore' },
      { id: 'volunteer_activism', label: 'Mani Cuore / Cura' },
      { id: 'spa', label: 'Massaggio / Relax' },
      { id: 'self_improvement', label: 'Momento Zen / Pace' },
      { id: 'sentiment_very_satisfied', label: 'Sorriso / Buongiorno' },
      { id: 'diversity_1', label: 'Passeggiata Insieme' },
      { id: 'family_restroom', label: 'Tempo Insieme' },
      { id: 'pets', label: 'Coccola Cucciolo' },
    ],
  },
  {
    name: 'Favori, Aiuti & Casa 🧹🧺',
    icons: [
      { id: 'cleaning_services', label: 'Pulizie di Casa' },
      { id: 'local_laundry_service', label: 'Fare il Bucato' },
      { id: 'countertops', label: 'Lavare i Piatti' },
      { id: 'soup_kitchen', label: 'Cucino Io Stasera!' },
      { id: 'directions_car', label: 'Passaggio in Auto' },
      { id: 'handyman', label: 'Riparazione / Fai da Te' },
      { id: 'shopping_cart', label: 'Faccio Io la Spesa' },
      { id: 'local_shipping', label: 'Aiuto Trasloco' },
    ],
  },
  {
    name: 'Svago, Giochi & Film 🎮🍿',
    icons: [
      { id: 'movie', label: 'Cinema / Film' },
      { id: 'sports_esports', label: 'Sessione Gaming' },
      { id: 'tv', label: 'Maratona Serie TV' },
      { id: 'casino', label: 'Serata Giochi da Tavolo' },
      { id: 'music_note', label: 'Concerto / Musica' },
      { id: 'theater_comedy', label: 'Teatro / Spettacolo' },
      { id: 'headphones', label: 'Playlist Dedicata' },
      { id: 'stadium', label: 'Partita allo Stadio' },
    ],
  },
  {
    name: 'Regali, Shopping & Feste 🎁🎉',
    icons: [
      { id: 'redeem', label: 'Regalo a Scelta' },
      { id: 'shopping_bag', label: 'Sessione Shopping' },
      { id: 'celebration', label: 'Festa / Brindisi' },
      { id: 'card_giftcard', label: 'Buono Spesa' },
      { id: 'diamond', label: 'Desiderio Speciale' },
      { id: 'auto_awesome', label: 'Jolly / Carta Bianca' },
    ],
  },
  {
    name: 'Viaggi, Sport & Outdoor ✈️🏕️',
    icons: [
      { id: 'flight', label: 'Biglietto / Viaggio' },
      { id: 'directions_bus', label: 'Biglietto Bus/Treno' },
      { id: 'hiking', label: 'Trekking / Montagna' },
      { id: 'beach_access', label: 'Giornata al Mare' },
      { id: 'fitness_center', label: 'Sessione Allenamento' },
      { id: 'pool', label: 'Piscina / Nuotata' },
      { id: 'kayaking', label: 'Avventura sul Fiume' },
      { id: 'park', label: 'Picnic al Parco' },
    ],
  },
];

export const ICONS = ICON_CATEGORIES.flatMap((cat) =>
  cat.icons.map((ic) => ({ id: ic.id, label: ic.label, icon: ic.id }))
);

export const MASCOT = {
  avatarUrl: '/app-icon.png',
  mascotWink:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB9uJ8qK5DT6squaEADbkg_F-6FXK-sJ7VtJy5B2vYPZjZt1roLn3DAR5ea4PzLzGuCIJWlWgMn2h2tyYQJNibU4YVJXytAxz_rp5Ua_McXF87EyMf8glo4CeGsRwiqQuSUv36kTMnZ4a4VDUbnbPMStIh9ygWa-4WIzEj9Gm7clWuaD1G5QEMCE7_Omcz0jdahz1Rf-8qxfNEDXfcAz5obAnb4wc3btSM9hIMjgbgE0MlAZF9FhxgPbQ',
  mascotCheer:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAbmlUgPuXWt2SsF9lwaE-QEA2Dm7LaEctH0NbTwwF0Yr_6iL-Rf3LJ6SnSh8ot4XQBIHpEBLRdLhoRcYzqeid2dhHk7cIiDPgn0FXzshRz8ztsoXrnXAVjJlb9fegGVTiC8FB9jEC5NxwmIrB_-TrLl6ErQWYip2l_tpzvJ74LiUjJgmWbdPZ-l90p6BH7biM20KAOqtjMmM2DZZaFoTSNQSoioJXc2q5c2rCGPBsR50jDLqf44yS32yxCmoXQ_HT6wEkyyQcynTuCfSQ',
};

export const AVATARS = [
  {
    id: 'app-official-icon',
    label: 'Kupon Ufficiale Mascotte 🎟️✨',
    url: '/app-icon.png',
  },
  {
    id: 'mascot-wink',
    label: 'Kupon Occhiolino 😉',
    url: MASCOT.mascotWink,
  },
  {
    id: 'mascot-cheer',
    label: 'Kupon Felice & Braccia Su 🙌',
    url: MASCOT.mascotCheer,
  },
  {
    id: 'mascot-chef',
    label: 'Kupon Chef / Pizza Lover 🍕',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGNDx8PfLJD7tsx6m7gFRLKycQQ6sPPf5Ko2Mlx5vJ6wFoCZJ-clSGvZXTtMvaMoKpxHFq1gDp9kf9GZZyt_VtPibOLW70BVe7Uc4zPEwl0aYY-ykMgCh--c3vMQ-Am1LDK6yvuZXdaR7RNo155-kPmdMP-sW8Pz62o5jWr7bn8CQJBcNYLBns38y6-DqyR5jBxavRProWhs2jCCeZA4LuNiYwvgQst93EbwGLgDA1LgzHsOjRihod-L3_jipwMlyy28mSKnwKH8zbjko',
  },
  {
    id: 'mascot-star',
    label: 'Kupon VIP Stella ⭐',
    url: 'https://lh3.googleusercontent.com/aida/AP1WRLvpeVkKcCK65SKJyM6a-DoLBiQEa7u1_TNmPNL_YH7HnyL16MRgav2mWEKTzYJKr0tlHNO6bU3mIf_QIjsS-m1eRLRCtsk9jSMRg5atQjRvEAxAJX9SYSwpiKUpzw7I6RBQJTugTZ_wksFVutFRhKftI4ZAMfrkjqHH9ZpYQ0wUJrkYVMn823_499ndp-U0Qlir0UqJ9IUrrIcQ9RFY9Y5utq1sUFI_PNblTWMEmKSnwsN6e5GlCF29qFy7',
  },
];

export const THEME_CLASSES: Record<
  ColorTheme,
  {
    bg: string;
    text: string;
    dimText: string;
    badge: string;
    border: string;
    glow: string;
  }
> = {
  peach: {
    bg: 'bg-[#FFB5A7]',
    text: 'text-[#7A443A]',
    dimText: 'text-[#7A443A]/80',
    badge: 'bg-[#FFDAD3]',
    border: 'border-[#7A443A]/30',
    glow: 'rgba(255, 181, 167, 0.4)',
  },
  matcha: {
    bg: 'bg-[#C9E7CA]',
    text: 'text-[#4E6952]',
    dimText: 'text-[#4E6952]/80',
    badge: 'bg-[#CCEACD]',
    border: 'border-[#4E6952]/30',
    glow: 'rgba(201, 231, 202, 0.4)',
  },
  butter: {
    bg: 'bg-[#D4C79D]',
    text: 'text-[#5C5332]',
    dimText: 'text-[#5C5332]/80',
    badge: 'bg-[#F0E2B7]',
    border: 'border-[#5C5332]/30',
    glow: 'rgba(212, 199, 157, 0.4)',
  },
  lilac: {
    bg: 'bg-[#DEE1F8]',
    text: 'text-[#3C3F5E]',
    dimText: 'text-[#3C3F5E]/80',
    badge: 'bg-[#E4E7FE]',
    border: 'border-[#3C3F5E]/30',
    glow: 'rgba(222, 225, 248, 0.4)',
  },
};
