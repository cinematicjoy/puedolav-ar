import { useEffect, useState } from "react";
import { adBanners } from "../data/adBanners";

const ROTATION_MS = 4500;

export function AdFooter() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (adBanners.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % adBanners.length);
    }, ROTATION_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  const banner = adBanners[activeIndex];

  if (!banner) return null;

  return (
    <footer className="ad-footer" aria-label="Espacio publicitario">
      <a
        className={`ad-banner ad-banner-${banner.id}`}
        href={banner.url}
        target={banner.url === "#" ? undefined : "_blank"}
        rel={banner.url === "#" ? undefined : "noreferrer"}
        aria-label={`${banner.kicker}: ${banner.title}`}
        onClick={(event) => {
          if (banner.url === "#") {
            event.preventDefault();
          }
        }}
      >
        {banner.image ? (
          <img
            className="ad-banner-image"
            src={banner.image}
            alt=""
            aria-hidden="true"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : null}

        <span className="ad-banner-kicker">{banner.kicker}</span>
        <strong>{banner.title}</strong>
        <small>{banner.description}</small>
      </a>
    </footer>
  );
}