import { useEffect, useState } from "react";
import { adBanners } from "../data/adBanners";
import { AdSlot } from "./AdSlot";

function assetPath(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`.replace(/\/\/+/, "/");
}

export function AdFooter() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % adBanners.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const banner = adBanners[index];

  return (
    <footer className="ad-footer">
      <a href={banner.url} className="ad-banner" aria-label={banner.title}>
        <img src={assetPath(banner.image)} alt="" />
        <AdSlot title={banner.title} />
      </a>
    </footer>
  );
}
