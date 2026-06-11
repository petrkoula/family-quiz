/**
 * Sdílené design tokeny + Naive UI theme overrides.
 *
 * Směr „rodinné album": teplý papírový podklad, terakotový akcent, serifové
 * nadpisy (--font-display), fotky jako polaroidy. Minimum borderů — sekce
 * odděluje whitespace, ne čáry. Hodnoty drž v souladu s CSS proměnnými
 * v style.css a se specifikací v design/tokens.md (viz design/taste.md
 * pro závazná „don't" pravidla).
 */

// Jméno designové varianty — yarn screenshots ho používá jako výchozí
// název složky (screenshots/<themeName>/), ať se varianty dají porovnávat.
export const themeName = 'album';

export const tokens = {
  accent: '#c2512c',
  accentHover: '#d86a41',
  accentPressed: '#993c1d',
  ink: '#3b2f26',
  inkSoft: '#6b5b4d',
  inkMuted: '#94826f',
  canvas: '#faf5ec',
  surface: '#fffdf8',
  paperDeep: '#f1e7d3',
  fieldFill: '#f2e8d8',
  success: '#4d7340',
  successSoft: '#eaf1e2',
  hairline: 'rgba(82, 60, 39, 0.12)',
  radius: '8px',
  radiusLarge: '12px',
};

export const themeOverrides = {
  common: {
    primaryColor: tokens.accent,
    primaryColorHover: tokens.accentHover,
    primaryColorPressed: tokens.accentPressed,
    primaryColorSuppl: tokens.accent,
    infoColor: tokens.accent,
    successColor: tokens.success,
    borderRadius: tokens.radius,
    borderRadiusSmall: '6px',
    borderColor: tokens.hairline,
    textColorBase: tokens.ink,
    textColor1: tokens.ink,
    textColor2: tokens.inkSoft,
    textColor3: tokens.inkMuted,
    bodyColor: tokens.canvas,
    cardColor: tokens.surface,
    fontWeightStrong: '600',
  },
  Card: {
    borderRadius: tokens.radiusLarge,
    color: tokens.surface,
    paddingMedium: '24px',
  },
  Button: {
    fontWeight: '500',
    fontWeightStrong: '600',
    borderRadiusMedium: tokens.radius,
    borderRadiusLarge: tokens.radius,
    heightLarge: '48px',
    heightMedium: '40px',
    // tichá tlačítka na teplém papíru, ne studená šedá
    colorTertiary: 'rgba(82, 60, 39, 0.06)',
    colorTertiaryHover: 'rgba(82, 60, 39, 0.11)',
    textColorTertiary: tokens.inkSoft,
  },
  Switch: {
    railColorActive: tokens.accent,
  },
};
