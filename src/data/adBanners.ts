export interface AdBanner {
  id: string;
  kicker: string;
  title: string;
  description: string;
  url: string;
  image?: string;
}

export const adBanners: AdBanner[] = [
  {
    id: "banner-1",
    kicker: "Espacio publicitario",
    title: "Tu lavadero acá",
    description: "Banner local disponible",
    url: "#"
  },
  {
    id: "banner-2",
    kicker: "Promos locales",
    title: "Anunciá tu comercio",
    description: "Ideal para lavaderos y servicios",
    url: "#"
  },
  {
    id: "banner-3",
    kicker: "Zona de anuncios",
    title: "Publicidad directa",
    description: "Espacio preparado para sponsors",
    url: "#"
  }
];