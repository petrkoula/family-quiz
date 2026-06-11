/**
 * Sdílené design tokeny + Naive UI theme overrides.
 *
 * Směr „giggle": hravý, živý a trochu dětský — korálový akcent, sluníčková
 * žlutá, krémový papír, hodně zaoblené rohy a kulaté písmo (Baloo 2 na
 * nadpisy, Nunito na text). Inspirace: FamilyQuiz AI (Bubble prototyp).
 * Hodnoty drž v souladu s CSS proměnnými v style.css.
 */

// Jméno designové varianty — yarn screenshots ho používá jako výchozí
// název složky (screenshots/<themeName>/), ať se varianty dají porovnávat.
export const themeName = 'giggle';

export const tokens = {
  accent: '#f56a47',
  accentHover: '#f8825f',
  accentPressed: '#d8552f',
  sun: '#fbbd2d',
  sunSoft: '#fdeec6',
  ink: '#362117',
  inkSoft: '#6e574b',
  inkMuted: '#8d7468',
  canvas: '#fcf8f3',
  surface: '#fffdfb',
  paperDeep: '#f3eae2',
  fieldFill: '#f5ebe0',
  success: '#4f9d52',
  successSoft: '#e2f2dd',
  hairline: 'rgba(86, 56, 35, 0.14)',
  radius: '14px',
  radiusLarge: '22px',
  fontBody: "'Nunito', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};

export const themeOverrides = {
  common: {
    fontFamily: tokens.fontBody,
    fontSize: '16px',
    fontSizeMedium: '16px',
    fontSizeLarge: '17px',
    primaryColor: tokens.accent,
    primaryColorHover: tokens.accentHover,
    primaryColorPressed: tokens.accentPressed,
    primaryColorSuppl: tokens.accent,
    infoColor: tokens.accent,
    successColor: tokens.success,
    borderRadius: tokens.radius,
    borderRadiusSmall: '10px',
    borderColor: tokens.hairline,
    textColorBase: tokens.ink,
    textColor1: tokens.ink,
    textColor2: tokens.inkSoft,
    textColor3: tokens.inkMuted,
    bodyColor: tokens.canvas,
    cardColor: tokens.surface,
    fontWeightStrong: '800',
  },
  Card: {
    borderRadius: tokens.radiusLarge,
    color: tokens.surface,
    paddingMedium: '24px',
  },
  Button: {
    fontWeight: '700',
    fontWeightStrong: '800',
    fontSizeMedium: '16px',
    fontSizeLarge: '17px',
    // pilulky — kulaté tlačítko je podpisový dětský tvar téhle varianty
    borderRadiusMedium: '999px',
    borderRadiusLarge: '999px',
    heightLarge: '52px',
    heightMedium: '44px',
    // tichá tlačítka na teplém papíru, ne studená šedá
    colorTertiary: 'rgba(86, 56, 35, 0.07)',
    colorTertiaryHover: 'rgba(86, 56, 35, 0.12)',
    textColorTertiary: tokens.inkSoft,
  },
  Switch: {
    railColorActive: tokens.accent,
  },
};
