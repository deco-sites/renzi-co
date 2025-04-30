import HeroVideoCarrousselComponent from "$store/islands/HeroVideoCarroussel.tsx";
import type { BannerProps } from "$store/components/ui/HeroVideoCarroussel.tsx";

export default function HeroSection(props: BannerProps) {
  return <HeroVideoCarrousselComponent {...props} />;
}