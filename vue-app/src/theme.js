/**
 * Sdílené design tokeny + Naive UI theme overrides.
 *
 * Cíl: čistý, světlý, minimalistický vzhled — minimum borderů, jeden akcentní
 * odstín, jemné stíny místo rámečků. Hodnoty drž v souladu s CSS proměnnými
 * v style.css (stejná paleta pro Naive komponenty i ručně psané scoped CSS).
 */

export const tokens = {
  accent: '#6366f1',
  accentHover: '#818cf8',
  accentPressed: '#4f46e5',
  ink: '#1e293b',
  inkSoft: '#475569',
  inkMuted: '#94a3b8',
  canvas: '#f6f7f9',
  surface: '#ffffff',
  hairline: 'rgba(15, 23, 42, 0.07)',
  radius: '14px',
  radiusLarge: '20px',
};

export const themeOverrides = {
  common: {
    primaryColor: tokens.accent,
    primaryColorHover: tokens.accentHover,
    primaryColorPressed: tokens.accentPressed,
    primaryColorSuppl: tokens.accent,
    infoColor: tokens.accent,
    borderRadius: tokens.radius,
    borderRadiusSmall: '10px',
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
  },
  Switch: {
    railColorActive: tokens.accent,
  },
};
