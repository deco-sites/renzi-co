import HeroVideoBannerCarroussel from "$store/components/ui/HeroVideoBannerCarroussel.tsx";
import type { BannerProps } from "$store/components/ui/HeroVideoBannerCarroussel.tsx";

export default function HeroSection(props: BannerProps) {
  return <HeroVideoBannerCarroussel {...props} />;
}