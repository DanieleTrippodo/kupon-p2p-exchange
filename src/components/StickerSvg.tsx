import React from 'react';
import { STICKERS_CATALOG } from '../data/stickersCatalog';
import { StickerRarity } from '../types/sticker';

interface StickerSvgProps {
  id: string;
  className?: string;
  isSilhouette?: boolean;
  rarity?: StickerRarity;
}

export const StickerSvg: React.FC<StickerSvgProps> = ({
  id,
  className = 'w-full h-full',
  isSilhouette = false,
  rarity,
}) => {
  const stroke = '#171B2B';
  const strokeWidth = 2.5;

  const resolvedRarity = rarity || STICKERS_CATALOG.find((s) => s.id === id)?.rarity || 'common';
  const isHolo = resolvedRarity === 'epic' || resolvedRarity === 'legendary';
  const isRare = resolvedRarity === 'rare';

  const renderContent = () => {
    switch (id) {
      // 1. Onigiri Felice (Rice ball + seaweed + cute face)
      case 'stk_onigiri_cute':
        return (
          <g>
            <path
              d="M32 10 Q14 20 16 46 Q32 54 48 46 Q50 20 32 10 Z"
              fill="#FFFFFF"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Nori sheet */}
            <path d="M24 38 L40 38 L38 51 Q32 53 26 51 Z" fill="#1E293B" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Kawaii Face */}
            <circle cx="27" cy="28" r="1.8" fill={stroke} />
            <circle cx="37" cy="28" r="1.8" fill={stroke} />
            <circle cx="27.6" cy="27.4" r="0.6" fill="#FFF" />
            <circle cx="37.6" cy="27.4" r="0.6" fill="#FFF" />
            <ellipse cx="22" cy="32" rx="2.5" ry="1.4" fill="#FF8BA7" />
            <ellipse cx="42" cy="32" rx="2.5" ry="1.4" fill="#FF8BA7" />
            <path d="M30 32 Q32 34.5 34 32" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 2. Dango Tricolore (3 balls on a bamboo stick)
      case 'stk_dango_trio':
        return (
          <g>
            {/* Bamboo stick */}
            <line x1="14" y1="52" x2="52" y2="14" stroke="#D4C79D" strokeWidth="4" strokeLinecap="round" />
            <line x1="14" y1="52" x2="52" y2="14" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            {/* Matcha Green Dango */}
            <circle cx="22" cy="44" r="9" fill="#86EFAC" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Milk White Dango */}
            <circle cx="33" cy="33" r="9" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Sakura Pink Dango (with cute face) */}
            <circle cx="44" cy="22" r="9" fill="#FFB5A7" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="41" cy="20" r="1.2" fill={stroke} />
            <circle cx="47" cy="20" r="1.2" fill={stroke} />
            <ellipse cx="38.5" cy="23" rx="1.5" ry="0.9" fill="#FF8BA7" />
            <ellipse cx="49.5" cy="23" rx="1.5" ry="0.9" fill="#FF8BA7" />
            <path d="M43 23 Q44 25 45 23" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );

      // 3. Ramen Fumante (Noodle bowl + naruto + egg + cute face)
      case 'stk_ramen_bowl':
        return (
          <g>
            {/* Steam spirals */}
            <path d="M26 12 Q24 6 28 4" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <path d="M36 12 Q38 6 34 4" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            {/* Chopsticks */}
            <line x1="20" y1="18" x2="48" y2="10" stroke="#D4C79D" strokeWidth="3" strokeLinecap="round" />
            {/* Bowl Body */}
            <path d="M14 26 Q14 50 32 50 Q50 50 50 26 Z" fill="#EF4444" stroke={stroke} strokeWidth={strokeWidth} />
            <ellipse cx="32" cy="26" rx="18" ry="5" fill="#FDE047" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Narutomaki (pink swirl) */}
            <circle cx="26" cy="26" r="4.5" fill="#FFF" stroke={stroke} strokeWidth="1.5" />
            <path d="M24 26 Q26 23 27 26 Q28 28 25 27" fill="none" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" />
            {/* Boiled Egg */}
            <ellipse cx="38" cy="26" rx="4.5" ry="3.5" fill="#FFF" stroke={stroke} strokeWidth="1.5" />
            <circle cx="38" cy="26" r="2" fill="#F59E0B" />
            {/* Bowl Face */}
            <circle cx="28" cy="38" r="1.5" fill="#FFF" />
            <circle cx="36" cy="38" r="1.5" fill="#FFF" />
            <ellipse cx="24" cy="41" rx="2" ry="1.2" fill="#FCA5A5" />
            <ellipse cx="40" cy="41" rx="2" ry="1.2" fill="#FCA5A5" />
            <path d="M30 41 Q32 44 34 41" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      // 4. Taiyaki Dorato (Fish waffle)
      case 'stk_taiyaki_fish':
        return (
          <g>
            {/* Fish Waffle Body */}
            <path
              d="M12 32 C12 20 28 16 42 22 L52 14 L50 32 L52 50 L42 42 C28 48 12 44 12 32 Z"
              fill="#F4A261"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Scales Waffle Pattern */}
            <path d="M26 24 Q30 28 26 32 Q30 36 26 40" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M34 26 Q38 30 34 34 Q38 38 34 40" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            {/* Eye & Smile */}
            <circle cx="20" cy="27" r="2" fill={stroke} />
            <circle cx="20.7" cy="26.3" r="0.6" fill="#FFF" />
            <ellipse cx="17" cy="33" rx="1.8" ry="1.2" fill="#FF8BA7" />
            <path d="M14 31 Q17 33 19 31" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 5. Boba Milk Tea (Bubble tea with heart straw)
      case 'stk_boba_milk':
        return (
          <g>
            {/* Straw */}
            <path d="M36 6 L32 20" stroke="#884F44" strokeWidth="4" strokeLinecap="round" />
            {/* Cup Body */}
            <path d="M18 20 L46 20 L42 54 Q32 56 22 54 Z" fill="#DEE1F8" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Tea Liquid */}
            <path d="M20 26 L44 26 L42 52 Q32 54 22 52 Z" fill="#FBCFE8" />
            {/* Tapioca Pearls */}
            <circle cx="26" cy="46" r="2.5" fill="#475569" />
            <circle cx="32" cy="48" r="2.5" fill="#475569" />
            <circle cx="38" cy="46" r="2.5" fill="#475569" />
            <circle cx="29" cy="41" r="2.5" fill="#475569" />
            <circle cx="35" cy="41" r="2.5" fill="#475569" />
            {/* Face */}
            <circle cx="27" cy="32" r="1.5" fill={stroke} />
            <circle cx="37" cy="32" r="1.5" fill={stroke} />
            <ellipse cx="23" cy="35" rx="2" ry="1.2" fill="#FF8BA7" />
            <ellipse cx="41" cy="35" rx="2" ry="1.2" fill="#FF8BA7" />
            <path d="M30 35 Q32 38 34 35" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 6. Nigiri Imperiale (Gold sushi)
      case 'stk_sushi_nigiri':
        return (
          <g>
            {/* Rice */}
            <rect x="16" y="32" width="32" height="16" rx="8" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Salmon */}
            <path d="M12 24 C12 18, 52 18, 52 24 C52 30, 12 30, 12 24 Z" fill="#FF7F50" stroke={stroke} strokeWidth={strokeWidth} />
            <path d="M22 20 L26 28" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M32 19 L36 29" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M42 20 L46 28" stroke="#FFF" strokeWidth="1.5" strokeLinecap="round" />
            {/* Nori Band */}
            <rect x="28" y="20" width="8" height="28" rx="2" fill="#1E293B" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Face on Nori */}
            <circle cx="30.5" cy="32" r="1" fill="#FFF" />
            <circle cx="33.5" cy="32" r="1" fill="#FFF" />
            <path d="M31 35 Q32 36.5 33 35" fill="none" stroke="#FFF" strokeWidth="1" strokeLinecap="round" />
          </g>
        );

      // 7. Shiba Inu Sorridente (Cute Shiba Puppy)
      case 'stk_shiba_inu':
        return (
          <g>
            {/* Pointy Ears */}
            <polygon points="16,24 14,10 26,16" fill="#F59E0B" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <polygon points="48,24 50,10 38,16" fill="#F59E0B" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <polygon points="18,22 17,14 24,18" fill="#FFF0ED" />
            <polygon points="46,22 47,14 40,18" fill="#FFF0ED" />
            {/* Head */}
            <circle cx="32" cy="34" r="16" fill="#F59E0B" stroke={stroke} strokeWidth={strokeWidth} />
            {/* White Muzzle Cheek Patch */}
            <path d="M20 34 C20 44, 44 44, 44 34 C44 30, 20 30, 20 34 Z" fill="#FFFFFF" />
            {/* Eyebrows dots */}
            <circle cx="25" cy="25" r="1.5" fill="#FFF" />
            <circle cx="39" cy="25" r="1.5" fill="#FFF" />
            {/* Eyes */}
            <circle cx="26" cy="31" r="1.8" fill={stroke} />
            <circle cx="38" cy="31" r="1.8" fill={stroke} />
            {/* Nose & Tongue */}
            <ellipse cx="32" cy="34" rx="2" ry="1.5" fill={stroke} />
            <path d="M32 36 L32 39" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            <path d="M30 39 Q32 45 34 39 Z" fill="#FF8BA7" stroke={stroke} strokeWidth="1.5" />
            <ellipse cx="21" cy="36" rx="2" ry="1.2" fill="#FF8BA7" />
            <ellipse cx="43" cy="36" rx="2" ry="1.2" fill="#FF8BA7" />
          </g>
        );

      // 8. Coniglietto Mochi (White cute bunny)
      case 'stk_coniglietto_mochi':
        return (
          <g>
            {/* Long Ears */}
            <ellipse cx="24" cy="16" rx="5" ry="12" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} transform="rotate(-10 24 16)" />
            <ellipse cx="40" cy="16" rx="5" ry="12" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} transform="rotate(10 40 16)" />
            <ellipse cx="24" cy="16" rx="2.5" ry="8" fill="#FFD1D9" />
            <ellipse cx="40" cy="16" rx="2.5" ry="8" fill="#FFD1D9" />
            {/* Head */}
            <ellipse cx="32" cy="36" rx="16" ry="14" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Eyes */}
            <circle cx="25" cy="33" r="1.8" fill={stroke} />
            <circle cx="39" cy="33" r="1.8" fill={stroke} />
            {/* Nose & Mouth (ω shape) */}
            <polygon points="31,37 33,37 32,38.5" fill="#FF8BA7" />
            <path d="M32 38.5 Q29 41 27 39" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            <path d="M32 38.5 Q35 41 37 39" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            <ellipse cx="19" cy="37" rx="2.5" ry="1.5" fill="#FFCCD5" />
            <ellipse cx="45" cy="37" rx="2.5" ry="1.5" fill="#FFCCD5" />
          </g>
        );

      // 9. Panda Paffuto (Panda with bamboo)
      case 'stk_panda_bamboo':
        return (
          <g>
            {/* Ears */}
            <circle cx="18" cy="18" r="6" fill="#1E293B" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="46" cy="18" r="6" fill="#1E293B" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Head */}
            <circle cx="32" cy="35" r="17" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Eye Patches */}
            <ellipse cx="24" cy="32" rx="4.5" ry="3.5" fill="#1E293B" transform="rotate(-15 24 32)" />
            <ellipse cx="40" cy="32" rx="4.5" ry="3.5" fill="#1E293B" transform="rotate(15 40 32)" />
            <circle cx="24" cy="32" r="1.5" fill="#FFF" />
            <circle cx="40" cy="32" r="1.5" fill="#FFF" />
            {/* Nose & Mouth */}
            <ellipse cx="32" cy="37" rx="2" ry="1.5" fill={stroke} />
            <path d="M30 40 Q32 43 34 40" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            <ellipse cx="19" cy="38" rx="2.5" ry="1.4" fill="#FF8BA7" />
            <ellipse cx="45" cy="38" rx="2.5" ry="1.4" fill="#FF8BA7" />
            {/* Bamboo leaf */}
            <path d="M36 43 Q44 41 46 47 Q40 47 36 43 Z" fill="#10B981" stroke={stroke} strokeWidth="1.5" />
          </g>
        );

      // 10. Polipetto Tako (Red cute octopus)
      case 'stk_polipetto_tako':
        return (
          <g>
            {/* Tentacles */}
            <path d="M18 42 Q14 52 20 52 Q26 52 24 44" fill="#EF4444" stroke={stroke} strokeWidth={strokeWidth} />
            <path d="M26 44 Q28 54 32 54 Q36 54 34 44" fill="#EF4444" stroke={stroke} strokeWidth={strokeWidth} />
            <path d="M36 44 Q38 52 44 52 Q48 52 44 42" fill="#EF4444" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Big Round Head */}
            <circle cx="32" cy="28" r="16" fill="#EF4444" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Eyes */}
            <circle cx="26" cy="26" r="2" fill={stroke} />
            <circle cx="38" cy="26" r="2" fill={stroke} />
            <circle cx="26.8" cy="25.3" r="0.7" fill="#FFF" />
            <circle cx="38.8" cy="25.3" r="0.7" fill="#FFF" />
            {/* Cute "O" Mouth */}
            <ellipse cx="32" cy="32" rx="2.5" ry="3.5" fill="#FFE4E6" stroke={stroke} strokeWidth="1.5" />
            <ellipse cx="20" cy="31" rx="2.5" ry="1.4" fill="#FDA4AF" />
            <ellipse cx="44" cy="31" rx="2.5" ry="1.4" fill="#FDA4AF" />
          </g>
        );

      // 11. Axolotl Magico (Pink axolotl)
      case 'stk_axolotl_rosa':
        return (
          <g>
            {/* Gills (Frills on sides) */}
            <path d="M16 22 Q8 18 10 26 Q8 32 16 30" fill="#F43F5E" stroke={stroke} strokeWidth={strokeWidth} />
            <path d="M48 22 Q56 18 54 26 Q56 32 48 30" fill="#F43F5E" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Head */}
            <ellipse cx="32" cy="32" rx="17" ry="14" fill="#FBCFE8" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Cute Dot Eyes */}
            <circle cx="24" cy="30" r="1.8" fill={stroke} />
            <circle cx="40" cy="30" r="1.8" fill={stroke} />
            {/* Sweet Wide Smile */}
            <path d="M28 34 Q32 38 36 34" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            <ellipse cx="20" cy="34" rx="2.5" ry="1.5" fill="#FDA4AF" />
            <ellipse cx="44" cy="34" rx="2.5" ry="1.5" fill="#FDA4AF" />
          </g>
        );

      // 12. Maneki-Neko d'Oro (Lucky Cat with Koban)
      case 'stk_maneki_neko':
        return (
          <g>
            {/* Ears */}
            <polygon points="18,22 14,8 26,14" fill="#FFF" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <polygon points="46,22 50,8 38,14" fill="#FFF" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <polygon points="17,19 15,11 23,15" fill="#EF4444" />
            <polygon points="47,19 49,11 41,15" fill="#EF4444" />
            {/* Head */}
            <circle cx="32" cy="30" r="16" fill="#FFF" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Red Collar & Gold Bell */}
            <rect x="22" y="42" width="20" height="4" rx="2" fill="#EF4444" stroke={stroke} strokeWidth="1.5" />
            <circle cx="32" cy="46" r="3" fill="#FACC15" stroke={stroke} strokeWidth="1.5" />
            {/* Waving Paw (Right) */}
            <path d="M44 26 C50 18, 54 24, 48 32 Z" fill="#FFF" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Eyes (Winking & Happy) */}
            <path d="M23 28 Q26 31 29 28" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            <path d="M35 28 Q38 31 41 28" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            {/* Whiskers */}
            <line x1="14" y1="30" x2="20" y2="30" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="33" x2="20" y2="33" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
            <ellipse cx="21" cy="33" rx="2" ry="1.2" fill="#FDA4AF" />
            <ellipse cx="43" cy="33" rx="2" ry="1.2" fill="#FDA4AF" />
            {/* Koban Gold Coin in Left Paw */}
            <ellipse cx="24" cy="48" rx="6" ry="4" fill="#FACC15" stroke={stroke} strokeWidth={strokeWidth} transform="rotate(30 24 48)" />
          </g>
        );

      // 13. Teru Teru Bozu (Weather ghost)
      case 'stk_teru_teru':
        return (
          <g>
            {/* Hanging String */}
            <line x1="32" y1="4" x2="32" y2="14" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Round Head */}
            <circle cx="32" cy="24" r="12" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Red Ribbon */}
            <ellipse cx="32" cy="35" rx="5" ry="2" fill="#EF4444" stroke={stroke} strokeWidth="1.5" />
            {/* Flowing Cloth Body */}
            <path d="M26 36 L14 54 Q32 50 50 54 L38 36 Z" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            {/* Face */}
            <circle cx="28" cy="22" r="1.5" fill={stroke} />
            <circle cx="36" cy="22" r="1.5" fill={stroke} />
            <ellipse cx="24" cy="25" rx="2" ry="1.2" fill="#FF8BA7" />
            <ellipse cx="40" cy="25" rx="2" ry="1.2" fill="#FF8BA7" />
            <path d="M30 25 Q32 28 34 25" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 14. Lanterna Chochin (Red Japanese lantern)
      case 'stk_lanterna_matsuri':
        return (
          <g>
            {/* Top & Bottom Black Caps */}
            <rect x="22" y="10" width="20" height="4" rx="2" fill="#1E293B" stroke={stroke} strokeWidth={strokeWidth} />
            <rect x="22" y="46" width="20" height="4" rx="2" fill="#1E293B" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Tassel */}
            <line x1="32" y1="50" x2="32" y2="58" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
            {/* Oval Paper Lantern Body */}
            <ellipse cx="32" cy="30" rx="16" ry="17" fill="#EF4444" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Ribs */}
            <ellipse cx="32" cy="30" rx="9" ry="17" fill="none" stroke="#DC2626" strokeWidth="1.5" />
            <line x1="16" y1="30" x2="48" y2="30" stroke="#DC2626" strokeWidth="1.5" />
            {/* Face */}
            <circle cx="28" cy="28" r="1.5" fill="#FFF" />
            <circle cx="36" cy="28" r="1.5" fill="#FFF" />
            <path d="M30 32 Q32 34.5 34 32" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      // 15. Gru Origami (Paper Crane)
      case 'stk_origami_gru':
        return (
          <g>
            {/* Wings & Body */}
            <polygon points="32,24 8,16 24,38" fill="#38BDF8" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <polygon points="32,24 56,16 40,38" fill="#BAE6FD" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            {/* Head & Neck */}
            <polygon points="24,38 12,28 14,26 26,34" fill="#0284C7" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            {/* Tail */}
            <polygon points="40,38 52,30 50,28 38,34" fill="#0284C7" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            {/* Body Diamond */}
            <polygon points="32,24 24,38 32,48 40,38" fill="#E0F2FE" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
          </g>
        );

      // 16. Fiore di Sakura (Cherry Blossom)
      case 'stk_sakura_blossom':
        return (
          <g>
            {/* 5 Notched Petals */}
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <g key={i} transform={`rotate(${angle} 32 32)`}>
                <path
                  d="M32 32 C26 22, 24 10, 30 8 L32 10 L34 8 C40 10, 38 22, 32 32 Z"
                  fill="#FFCCD5"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeLinejoin="round"
                />
              </g>
            ))}
            {/* Center Pistils & Face */}
            <circle cx="32" cy="32" r="7" fill="#FF8BA7" stroke={stroke} strokeWidth="1.5" />
            <circle cx="30" cy="31" r="1" fill={stroke} />
            <circle cx="34" cy="31" r="1" fill={stroke} />
            <path d="M31 33 Q32 34.5 33 33" fill="none" stroke={stroke} strokeWidth="1" strokeLinecap="round" />
          </g>
        );

      // 17. Daruma dei Desideri (Red goal Daruma)
      case 'stk_daruma_rosso':
        return (
          <g>
            {/* Round Body */}
            <circle cx="32" cy="34" r="18" fill="#DC2626" stroke={stroke} strokeWidth={strokeWidth} />
            {/* White Face Inset */}
            <circle cx="32" cy="30" r="12" fill="#FFF0ED" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Big Eyebrows (Crane shape) */}
            <path d="M22 24 Q26 21 28 24" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M36 24 Q38 21 42 24" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
            {/* One eye filled (Goal set!), one blank */}
            <circle cx="25" cy="29" r="2.5" fill={stroke} />
            <circle cx="39" cy="29" r="2.5" fill="none" stroke={stroke} strokeWidth="1.5" />
            {/* Moustache & Gold Kanji */}
            <path d="M28 35 Q32 33 36 35" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
            <circle cx="32" cy="44" r="3" fill="#FACC15" />
          </g>
        );

      // 18. Monte Fuji e Sole (Fuji-san)
      case 'stk_monte_fuji':
        return (
          <g>
            {/* Red Rising Sun */}
            <circle cx="32" cy="22" r="16" fill="#EF4444" />
            {/* Mountain Base */}
            <polygon points="32,18 8,50 56,50" fill="#3B82F6" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            {/* Snow Cap with serrated edge */}
            <path d="M32 18 L20 34 Q24 38 28 34 Q32 38 36 34 Q40 38 44 34 L32 18 Z" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            {/* Cute Face on Mountain */}
            <circle cx="28" cy="42" r="1.5" fill="#FFF" />
            <circle cx="36" cy="42" r="1.5" fill="#FFF" />
            <ellipse cx="24" cy="44" rx="2" ry="1.2" fill="#FF8BA7" />
            <ellipse cx="40" cy="44" rx="2" ry="1.2" fill="#FF8BA7" />
            <path d="M30 44 Q32 46.5 34 44" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" />
          </g>
        );

      // 19. Nuvola Arcobaleno (Cute cloud)
      case 'stk_nuvoletta_pioggia':
        return (
          <g>
            {/* Pastel Rain Drops */}
            <circle cx="20" cy="48" r="2.5" fill="#38BDF8" />
            <circle cx="32" cy="51" r="2.5" fill="#EC4899" />
            <circle cx="44" cy="48" r="2.5" fill="#FACC15" />
            {/* Cloud Puffs */}
            <path
              d="M18 40 C12 40, 10 32, 16 26 C16 18, 28 16, 32 20 C36 14, 48 16, 48 26 C54 30, 52 40, 46 40 Z"
              fill="#FFFFFF"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Face */}
            <circle cx="27" cy="30" r="1.5" fill={stroke} />
            <circle cx="37" cy="30" r="1.5" fill={stroke} />
            <ellipse cx="23" cy="33" rx="2" ry="1.2" fill="#FF8BA7" />
            <ellipse cx="41" cy="33" rx="2" ry="1.2" fill="#FF8BA7" />
            <path d="M30 33 Q32 35.5 34 33" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 20. Stella Konpeito (Star sugar candy)
      case 'stk_stella_konpeito':
        return (
          <g>
            {/* 5-Point Star Body */}
            <polygon
              points="32,8 39,22 55,24 43,36 47,52 32,44 17,52 21,36 9,24 25,22"
              fill="#FDE047"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Face */}
            <circle cx="27" cy="30" r="1.8" fill={stroke} />
            <circle cx="37" cy="30" r="1.8" fill={stroke} />
            <circle cx="27.6" cy="29.3" r="0.6" fill="#FFF" />
            <circle cx="37.6" cy="29.3" r="0.6" fill="#FFF" />
            <ellipse cx="22" cy="34" rx="2" ry="1.2" fill="#FF8BA7" />
            <ellipse cx="42" cy="34" rx="2" ry="1.2" fill="#FF8BA7" />
            <path d="M30 34 Q32 37 34 34" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 21. Luna Addormentata (Sleepy moon with cap)
      case 'stk_luna_nanna':
        return (
          <g>
            {/* Moon Crescent */}
            <path
              d="M32 10 C18 10, 10 24, 14 40 C18 52, 34 56, 44 48 C30 46, 26 28, 38 18 C36 14, 34 12, 32 10 Z"
              fill="#FACC15"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Night Cap */}
            <path d="M32 10 Q40 4 48 10 Q42 16 36 16 Z" fill="#818CF8" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="48" cy="10" r="3" fill="#FFF" stroke={stroke} strokeWidth="1.5" />
            {/* Sleeping Face */}
            <path d="M22 32 Q25 35 28 32" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            <ellipse cx="20" cy="35" rx="2" ry="1.2" fill="#FF8BA7" />
          </g>
        );

      // 22. Pozione d'Amore (Heart flask bottle)
      case 'stk_pozione_amore':
        return (
          <g>
            {/* Cork */}
            <rect x="28" y="10" width="8" height="6" rx="2" fill="#D4C79D" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Bottle Neck */}
            <rect x="29" y="16" width="6" height="6" fill="#E2E8F0" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Heart Flask Body */}
            <path
              d="M32 50 C20 40, 14 32, 14 26 C14 20, 20 18, 25 18 C29 18, 31 20, 32 22 C33 20, 35 18, 39 18 C44 18, 50 20, 50 26 C50 32, 44 40, 32 50 Z"
              fill="#F472B6"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Bubbles & Highlight */}
            <circle cx="26" cy="32" r="2.5" fill="#FFF" opacity="0.6" />
            <circle cx="36" cy="28" r="1.5" fill="#FFF" opacity="0.6" />
            <circle cx="32" cy="38" r="2" fill="#FFF" opacity="0.6" />
          </g>
        );

      // 23. Cristallo Scintillante (Glitter Gem)
      case 'stk_diamante_scintilla':
        return (
          <g>
            <polygon points="32,54 12,26 22,12 42,12 52,26" fill="#38BDF8" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <polygon points="32,54 24,26 40,26" fill="#7DD3FC" stroke={stroke} strokeWidth={strokeWidth} />
            <polygon points="22,12 24,26 40,26 42,12" fill="#BAE6FD" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Face */}
            <circle cx="29" cy="34" r="1.5" fill={stroke} />
            <circle cx="35" cy="34" r="1.5" fill={stroke} />
            <ellipse cx="26" cy="37" rx="1.8" ry="1" fill="#FF8BA7" />
            <ellipse cx="38" cy="37" rx="1.8" ry="1" fill="#FF8BA7" />
            <path d="M30 38 Q32 40 34 38" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 24. Fuocherello Kitsune (Fox spirit fire)
      case 'stk_fiamma_spirito':
        return (
          <g>
            {/* Outer Flame */}
            <path
              d="M32 8 C32 18, 48 24, 48 38 C48 48, 40 54, 32 54 C24 54, 16 48, 16 38 C16 28, 26 22, 28 14 Z"
              fill="#F97316"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Inner Flame */}
            <path d="M32 26 C32 32, 40 36, 40 42 C40 48, 36 50, 32 50 C28 50, 24 48, 24 42 C24 36, 30 32, 32 26 Z" fill="#FDE047" />
            {/* Face */}
            <circle cx="28" cy="40" r="1.5" fill={stroke} />
            <circle cx="36" cy="40" r="1.5" fill={stroke} />
            <ellipse cx="25" cy="43" rx="1.8" ry="1.2" fill="#FF8BA7" />
            <ellipse cx="39" cy="43" rx="1.8" ry="1.2" fill="#FF8BA7" />
            <path d="M30 43 Q32 45.5 34 43" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 25. Fragolina Kawaii (Cute Strawberry)
      case 'stk_fragolina_dolce':
        return (
          <g>
            {/* Strawberry Heart Body */}
            <path
              d="M32 52 C16 44, 14 26, 18 18 C24 16, 40 16, 46 18 C50 26, 48 44, 32 52 Z"
              fill="#EF4444"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Green Leaf Crown */}
            <path d="M32 18 L24 10 L30 14 L32 8 L34 14 L40 10 L32 18 Z" fill="#10B981" stroke={stroke} strokeWidth="1.5" />
            {/* Yellow Seeds */}
            <circle cx="24" cy="24" r="1" fill="#FDE047" />
            <circle cx="40" cy="24" r="1" fill="#FDE047" />
            <circle cx="32" cy="44" r="1" fill="#FDE047" />
            {/* Face */}
            <circle cx="27" cy="32" r="1.5" fill={stroke} />
            <circle cx="37" cy="32" r="1.5" fill={stroke} />
            <ellipse cx="23" cy="35" rx="2" ry="1.2" fill="#FFA4B6" />
            <ellipse cx="41" cy="35" rx="2" ry="1.2" fill="#FFA4B6" />
            <path d="M30 35 Q32 37.5 34 35" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 26. Pesca Momo (Peach)
      case 'stk_pesca_momo':
        return (
          <g>
            {/* Leaf */}
            <path d="M32 16 Q42 10 44 18 Q36 20 32 16 Z" fill="#10B981" stroke={stroke} strokeWidth="1.5" />
            {/* Peach Body */}
            <path
              d="M32 16 C22 14, 12 24, 14 36 C16 48, 30 52, 32 52 C34 52, 48 48, 50 36 C52 24, 42 14, 32 16 Z"
              fill="#FFB5A7"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Crease line */}
            <path d="M32 16 C30 24, 30 30, 32 34" fill="none" stroke="#F43F5E" strokeWidth="1.5" strokeLinecap="round" />
            {/* Face */}
            <circle cx="25" cy="36" r="1.5" fill={stroke} />
            <circle cx="39" cy="36" r="1.5" fill={stroke} />
            <ellipse cx="21" cy="39" rx="2" ry="1.2" fill="#F43F5E" />
            <ellipse cx="43" cy="39" rx="2" ry="1.2" fill="#F43F5E" />
            <path d="M30 39 Q32 41.5 34 39" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 27. Tazza Neko Latte (Cat mug latte)
      case 'stk_tazza_neko':
        return (
          <g>
            {/* Cup Handle */}
            <path d="M46 30 C54 30, 54 42, 46 42" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            {/* Cup Body with Cat Ears */}
            <path
              d="M16 22 L20 14 L24 22 L40 22 L44 14 L48 22 C48 22, 46 48, 32 48 C18 48, 16 22, 16 22 Z"
              fill="#FFF0ED"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Cat Face */}
            <circle cx="27" cy="32" r="1.5" fill={stroke} />
            <circle cx="37" cy="32" r="1.5" fill={stroke} />
            <ellipse cx="23" cy="35" rx="2" ry="1.2" fill="#FF8BA7" />
            <ellipse cx="41" cy="35" rx="2" ry="1.2" fill="#FF8BA7" />
            <polygon points="31,34 33,34 32,35.5" fill="#FF8BA7" />
            <path d="M30 36 Q32 38 34 36" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 28. Lettera con Sigillo (Love letter)
      case 'stk_lettera_amore':
        return (
          <g>
            {/* Envelope Base */}
            <rect x="14" y="20" width="36" height="26" rx="4" fill="#FFFFFF" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Flap Triangles */}
            <polyline points="14,20 32,35 50,20" fill="none" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Heart Wax Seal */}
            <path
              d="M32 38 C30 35, 27 35, 26 38 C26 41, 32 44, 32 44 C32 44, 38 41, 38 38 C37 35, 34 35, 32 38 Z"
              fill="#EF4444"
              stroke={stroke}
              strokeWidth="1.5"
            />
          </g>
        );

      // 29. Orsetti Innamorati (Hugging pastel bears)
      case 'stk_abbraccio_orsi':
        return (
          <g>
            {/* Bear 1 (Peach) */}
            <circle cx="24" cy="34" r="13" fill="#FFB5A7" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="16" cy="24" r="4" fill="#FFB5A7" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Bear 2 (Lilac) */}
            <circle cx="40" cy="34" r="13" fill="#DEE1F8" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="48" cy="24" r="4" fill="#DEE1F8" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Faces */}
            <path d="M19 33 Q22 36 25 33" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            <ellipse cx="17" cy="36" rx="1.8" ry="1" fill="#FF8BA7" />
            <path d="M39 33 Q42 36 45 33" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
            <ellipse cx="47" cy="36" rx="1.8" ry="1" fill="#FF8BA7" />
            {/* Little Floating Heart */}
            <path
              d="M32 16 C30 13, 27 13, 26 16 C26 19, 32 23, 32 23 C32 23, 38 19, 38 16 C37 13, 34 13, 32 16 Z"
              fill="#EF4444"
              stroke={stroke}
              strokeWidth="1.5"
            />
          </g>
        );

      // 30. Cuore Alato Divino (Heart with wings)
      case 'stk_cuore_kawaii':
        return (
          <g>
            {/* Left Wing */}
            <path d="M20 28 C10 24, 6 34, 16 38 C12 38, 10 44, 20 40" fill="#FFF" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            {/* Right Wing */}
            <path d="M44 28 C54 24, 58 34, 48 38 C52 38, 54 44, 44 40" fill="#FFF" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            {/* Heart */}
            <path
              d="M32 50 C20 40, 16 32, 16 24 C16 18, 22 14, 27 14 C30 14, 31 16, 32 18 C33 16, 34 14, 37 14 C42 14, 48 18, 48 24 C48 32, 44 40, 32 50 Z"
              fill="#FF6B8B"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinejoin="round"
            />
            {/* Face */}
            <circle cx="27" cy="28" r="1.5" fill={stroke} />
            <circle cx="37" cy="28" r="1.5" fill={stroke} />
            <ellipse cx="23" cy="31" rx="2" ry="1.2" fill="#FFCCD5" />
            <ellipse cx="41" cy="31" rx="2" ry="1.2" fill="#FFCCD5" />
            <path d="M30 31 Q32 33.5 34 31" fill="none" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" />
          </g>
        );

      // 31. Timbro "SUGOI!" (Japanese Stamp)
      case 'stk_timbro_sugoi':
        return (
          <g>
            <circle cx="32" cy="32" r="20" fill="#FEE2E2" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="32" cy="32" r="16" fill="#EF4444" stroke={stroke} strokeWidth="1.5" strokeDasharray="3 2" />
            <text x="32" y="37" textAnchor="middle" fill="#FFF" fontSize="11" fontFamily="sans-serif" fontWeight="900">
              SUGOI!
            </text>
          </g>
        );

      // 32. Ventaglio Dipinto (Sensu fan)
      case 'stk_ventaglio_oro':
        return (
          <g>
            <path d="M12 42 A24 24 0 0 1 52 42 L32 46 Z" fill="#FDE047" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            {/* Rib lines */}
            <line x1="32" y1="46" x2="20" y2="24" stroke={stroke} strokeWidth="1.5" />
            <line x1="32" y1="46" x2="32" y2="18" stroke={stroke} strokeWidth="1.5" />
            <line x1="32" y1="46" x2="44" y2="24" stroke={stroke} strokeWidth="1.5" />
            {/* Little sakura blossom in center */}
            <circle cx="32" cy="28" r="3" fill="#EC4899" />
          </g>
        );

      // 33. Medaglia Stella #1 (Gold medal)
      case 'stk_medaglia_star':
        return (
          <g>
            <polygon points="20,10 32,28 26,28 16,10" fill="#3B82F6" stroke={stroke} strokeWidth={strokeWidth} />
            <polygon points="44,10 32,28 38,28 48,10" fill="#EF4444" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="32" cy="36" r="14" fill="#FACC15" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="32" cy="36" r="10" fill="#FDE047" stroke={stroke} strokeWidth="1.5" />
            <text x="32" y="42" textAnchor="middle" fill={stroke} fontSize="16" fontFamily="sans-serif" fontWeight="900">
              1
            </text>
          </g>
        );

      // 34. Chiave dei Segreti (Heart gold key)
      case 'stk_sigillo_doro':
        return (
          <g>
            {/* Heart Bow */}
            <path d="M32 10 C27 4, 18 10, 24 20 L32 28 L40 20 C46 10, 37 4, 32 10 Z" fill="#F59E0B" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="32" cy="16" r="2.5" fill="#FFF" stroke={stroke} strokeWidth={strokeWidth} />
            {/* Shaft & Teeth */}
            <line x1="32" y1="28" x2="32" y2="52" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
            <line x1="32" y1="44" x2="38" y2="44" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
            <line x1="32" y1="50" x2="40" y2="50" stroke={stroke} strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      // 35. Corona Imperiale (Imperial Crown)
      case 'stk_corona_shogun':
        return (
          <g>
            <path d="M14 42 L18 20 L26 30 L32 14 L38 30 L46 20 L50 42 Z" fill="#FACC15" stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />
            <rect x="12" y="42" width="40" height="7" rx="3.5" fill="#F59E0B" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="18" cy="18" r="2.5" fill="#EF4444" />
            <circle cx="32" cy="12" r="3" fill="#3B82F6" />
            <circle cx="46" cy="18" r="2.5" fill="#10B981" />
          </g>
        );

      // 36. Infinito Galattico (Cosmic Infinity)
      case 'stk_cristallo_cosmico':
      default:
        return (
          <g>
            <path
              d="M20 32 C12 24, 12 40, 20 40 C28 40, 36 24, 44 24 C52 24, 52 40, 44 40 C36 40, 28 24, 20 24"
              fill="none"
              stroke="#A855F7"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M20 32 C12 24, 12 40, 20 40 C28 40, 36 24, 44 24 C52 24, 52 40, 44 40 C36 40, 28 24, 20 24"
              fill="none"
              stroke={stroke}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            <polygon points="32,10 34,16 40,16 35,20 37,26 32,22 27,26 29,20 24,16 30,16" fill="#FACC15" stroke={stroke} strokeWidth={strokeWidth} />
            <circle cx="16" cy="18" r="2" fill="#F472B6" />
            <circle cx="48" cy="16" r="2" fill="#38BDF8" />
          </g>
        );
    }
  };

  const holoGradientId = `holo-grad-${id}`;
  const goldGradientId = `gold-grad-${id}`;

  // SOLID BLACK SILHOUETTE FOR UNDISCOVERED STICKERS
  if (isSilhouette) {
    return (
      <svg
        viewBox="0 0 64 64"
        className={`${className} filter drop-shadow-[0_2px_3px_rgba(23,27,43,0.35)] select-none`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Die-Cut White Vinyl Base Outline */}
        <g stroke="#FFFFFF" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" fill="#FFFFFF">
          {renderContent()}
        </g>
        {/* 100% PURE SOLID BLACK MYSTERY SILHOUETTE (No internal lines or face revealed) */}
        <g stroke="#171B2B" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" fill="#171B2B">
          {renderContent()}
        </g>
        {/* Mysterious White Question Mark Badge in the Center */}
        <circle cx="32" cy="32" r="10" fill="#FFFFFF" />
        <text
          x="32"
          y="36.5"
          textAnchor="middle"
          fill="#171B2B"
          fontSize="13"
          fontFamily="sans-serif"
          fontWeight="900"
        >
          ?
        </text>
      </svg>
    );
  }

  // DISCOVERED VINYL STICKER WITH WHITE DIE-CUT BORDER & FOIL EFFECTS
  return (
    <svg
      viewBox="0 0 64 64"
      className={`${className} select-none filter drop-shadow-[0_3px_4px_rgba(23,27,43,0.22)] transition-transform`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Holographic Iridescent Foil Gradient */}
        <linearGradient id={holoGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF9A9E" stopOpacity="0.55" />
          <stop offset="25%" stopColor="#FECFEF" stopOpacity="0.6" />
          <stop offset="50%" stopColor="#A1C4FD" stopOpacity="0.65" />
          <stop offset="75%" stopColor="#C2E9FB" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FFD1FF" stopOpacity="0.55" />
        </linearGradient>

        {/* Rare Gold Shimmer Gradient */}
        <linearGradient id={goldGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#FDE047" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#D97706" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      {/* 1. PHYSICAL DIE-CUT WHITE VINYL BORDER (Outer Contour) */}
      <g stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
        {renderContent()}
      </g>

      {/* 2. MAIN ARTWORK CONTENT (Vibrant Japanese Kawaii Vector) */}
      {renderContent()}

      {/* 3. HOLOGRAPHIC FOIL SHIMMER (For Epic & Legendary) */}
      {isHolo && (
        <g opacity="0.4" pointerEvents="none">
          <ellipse cx="32" cy="32" rx="26" ry="26" fill={`url(#${holoGradientId})`} />
          <polygon points="18,16 20,20 24,20 21,23 22,27 18,24 14,27 15,23 12,20 16,20" fill="#FFF" opacity="0.85" />
          <polygon points="46,42 47.5,45 50.5,45 48,47.5 49,50.5 46,48.5 43,50.5 44,47.5 41.5,45 44.5,45" fill="#FFF" opacity="0.85" />
        </g>
      )}

      {/* 4. RARE GOLDEN GLINT (For Rare) */}
      {isRare && (
        <g opacity="0.3" pointerEvents="none">
          <ellipse cx="32" cy="32" rx="24" ry="24" fill={`url(#${goldGradientId})`} />
        </g>
      )}

      {/* 5. REALISTIC GLOSSY VINYL TOP HIGHLIGHT */}
      <path
        d="M16 16 Q32 8 48 16 Q44 24 32 20 Q20 24 16 16 Z"
        fill="#FFFFFF"
        opacity="0.3"
        pointerEvents="none"
      />
    </svg>
  );
};
