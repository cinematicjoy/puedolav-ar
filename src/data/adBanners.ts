export interface AdBanner {
  id: string;
  title: string;
  image: string;
  url: string;
}

export const adBanners: AdBanner[] = [
  {
    id: "banner-1",
    title: "Espacio publicitario",
    image: "ads/banner-1.png",
    url: "#"
  },
  {
    id: "banner-2",
    title: "Tu lavadero acá",
    image: "ads/banner-2.png",
    url: "#"
  },
  {
    id: "banner-3",
    title: "Promos locales",
    image: "ads/banner-3.png",
    url: "#"
  }
];
