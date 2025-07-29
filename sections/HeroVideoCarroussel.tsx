import HeroVideoCarrousselComponent from "$store/components/ui/HeroVideoCarroussel.tsx";
import type { BannerProps } from "$store/components/ui/HeroVideoCarroussel.tsx";

export default function HeroSection(props: BannerProps) {
  return <HeroVideoCarrousselComponent {...props} />;
}