export const SITE_SETTING_KEYS = [
  "phone",
  "email",
  "address",
  "facebookUrl",
  "instagramUrl",
  "rayeenShadiUrl",
] as const;

export type SiteSettingKey = (typeof SITE_SETTING_KEYS)[number];

export type PublicSiteSettings = Record<SiteSettingKey, string>;

export const DEFAULT_SITE_SETTINGS: PublicSiteSettings = {
  phone: "+91 99199 90421",
  email: "allindiajamiatrayeen@yahoo.com",
  address: "India",
  facebookUrl: "https://www.facebook.com/share/1DfVWVoZgv/",
  instagramUrl:
    "https://www.instagram.com/allindiajamiatrayeen?stkn=MTM3bTA1bm1oZDN2Nw==",
  rayeenShadiUrl: "https://rayeenshaadi.com/",
};

export function isSiteSettingKey(key: string): key is SiteSettingKey {
  return (SITE_SETTING_KEYS as readonly string[]).includes(key);
}
