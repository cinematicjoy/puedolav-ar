export interface LocalAd {
  id: string;
  advertiser: string;
  label: string;
  text: string;
  imageUrl?: string;
  href?: string;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
}

export const localAds: LocalAd[] = [
  {
    id: "placeholder-local",
    advertiser: "Publicidad directa",
    label: "Espacio publicitario",
    text: "Anunciá tu comercio",
    href: "",
    active: true
  }
];

export function getActiveAds(now = new Date()) {
  return localAds.filter((ad) => {
    if (!ad.active) return false;

    if (ad.startsAt && new Date(ad.startsAt) > now) return false;
    if (ad.endsAt && new Date(ad.endsAt) < now) return false;

    return true;
  });
}