import type { VideoWidget as LiveVideo } from "apps/admin/widgets.ts";
import Video from "apps/website/components/Video.tsx";
import type { HTMLWidget as HTML } from "apps/admin/widgets.ts";
import useMedia from "../../sdk/useMedia.ts";

export interface VideoProps {
  /** @title Vídeo para Desktop (*) */
  /** @description (Inserir Vídeo ou imagem com a mesma largura. Ex: 1920px) */
  videoDesktop: LiveVideo;

  /** @title Vídeo para Mobile (*) */
  /** @description (Inserir Vídeo ou imagem com a mesma largura. Ex: 500px) */
  videoMobile: LiveVideo;
}

interface Title{
    /** @title Editor para texto */
    richtext?: HTML;  
    /** @title Tamanho da fonte - Mobile */
    /** @description (ex: 20px) */        
    sizeMobile?: string;
}

interface Subtitle{
    /** @title Mostrar o título? */    
    showSubtitle?: boolean;
    /** @title Editor para texto */    
    richtext?: HTML;
    /** @title Tamanho da fonte - Mobile */    
    /** @description (ex: 20px) */    
    sizeMobile?: string;
}

interface Position{
  /** @title Posicionamento vertical */    
  vertical?: "inferior" | "centro" | 'superior';
  /** @title Posicionamento horizontal */    
  horizontal?: "esquerda" | "centro" | "direita";
}

export interface CTAProps {
  /** @title Título - (configurações) */
  title: Title;
  /** @title Subtítulo - (configurações) */  
  subTitle?: Subtitle;
  /** @title Botão */   
  buttons: Button[];
  /** @title Posição */   
  position: Position;
    /** @title Link para o Vídeo/Banner */  
  bannerHref?: string;
}

export interface Button {
  /** @title Texto */  
  title: string;
  /** @title Link  */
  link?: string;
  // variant: "blue" | "white" | "black" | "outline";
  /** @title Cor do fundo (*)  */
  /** @description (link de cores: https://www.w3schools.com/cssref/css_colors.php) */ 
  backgroundColorButton?: string;
  /** @title Cor do texto (*)  */ 
  /** @description (link de cores: https://www.w3schools.com/cssref/css_colors.php) */   
  textColorButton?: string;
  /** @title Largura do botão - Mobile  */  
  /** @description (ex: 200px) */
  mobileWidth?: string;
  /** @title Largura do botão - Desktop  */    
  /** @description  (ex: 350px) */
  desktopWidth?: string;
}

export interface Props {
  media: VideoProps;
  cta: CTAProps;
  preload?: boolean;
}

function VideoComponent({ media }: { media: VideoProps }) {
  const isMobile = useMedia("(max-width: 767px)", true);
  // const videoSource = !isMobile ? media.videoDesktop : media.videoMobile;

  return (
    <>
      <div class="block">
        {!isMobile ? (
          <div class={`${!isMobile && 'is--desktop'} `}>
            <Video
              src={media.videoDesktop}
              width={150}
              height={150}
              class="w-full h-auto"
              loop
              muted
              autoplay
              playsInline
              loading={"eager"}
            >
              <source src={media.videoDesktop} type="video/mp4" />
            </Video>
          </div>
          )
          : 
          <div class={`${isMobile && 'is--mobile'} `}>
            <Video
              src={media.videoMobile}
              width={150}
              height={150}
              class="w-full h-auto"
              loop
              muted
              autoplay
              playsInline
              loading={"eager"}
            >
              <source src={media.videoMobile} type="video/mp4" />
            </Video>
          </div>          
        }
      </div>
    </>
  );
}

export default function HeroSectionComponent({ media, cta }: Props) {
  const horizontal = cta?.position?.horizontal === "esquerda" ? "justify-start": cta?.position?.horizontal === "centro" ? "justify-center": "justify-end";
  const horizontalText = cta?.position?.horizontal === "esquerda" ? "text-left": cta?.position?.horizontal === "centro"? "text-center": "text-right";
  const vertical = cta?.position?.vertical === "centro"? "items-center": cta?.position?.vertical === "superior" ?  "items-end" : "items-start";
  const {title: _title, subTitle, buttons, bannerHref } = cta ?? {};
  const title = _title ?? {};
  
  return (
    <section class={`relative overflow-hidden ${bannerHref ? "cursor-pointer" : "pointer-events-none"}`}
      onClick={() => bannerHref && (window.location.href = bannerHref)}
    >
      {(media as VideoProps)?.videoMobile && <VideoComponent media={media as VideoProps} />}
      <div
        class={`flex absolute w-full top-[50%] h-[calc(100%-50vw)] px-[10%] pb-[40px] lg:(top-[14vw] pb-[85px]) ${horizontal} ${horizontalText} ${vertical}`}>
        <div>
          <style
            dangerouslySetInnerHTML={{
              __html: `
                @media( max-width: 767px ){
                  h2.hero-section__title > *,
                  h2.hero-section__title > * > *,
                  h2.hero-section__title > * > * > * {
                    font-size:${title.sizeMobile} !important;
                  }  
                  
                  .hero-section__subtitle > *,                  
                  .hero-section__subtitle > * > *,
                  .hero-section__subtitle > * > * > *{
                    font-size:${title.sizeMobile} !important;
                  }              
                }
              `,
            }}
          />          
          { title && title.richtext && 
            (
              <h2 class={`hero-section__title textShadow text-[${title.sizeMobile}]`} dangerouslySetInnerHTML={{ __html: title.richtext }}></h2>
            ) 
          }
          {subTitle?.showSubtitle && subTitle.richtext &&
            (
              <span
                class={`hero-section__subtitle text-[${subTitle?.sizeMobile}] block mt-3`}
                 dangerouslySetInnerHTML={{ __html: subTitle?.richtext }}
              >
              </span>
            )
          }
          <div class={`flex flex-wrap gap-5 ${horizontal}`}>
            {(buttons ?? []).map(({ link, title, backgroundColorButton, textColorButton, mobileWidth, desktopWidth }) => {
                return (
                  <a
                    style={`color: ${textColorButton ? textColorButton : "#ffffff" }; background-color: ${backgroundColorButton ? backgroundColorButton : '#2F1893'};`}
                    class={`flex justify-center items-center mt-[20px] max-w-[160px] max-h-[40px] font-bold pointer pointer-events-auto hover:opacity-70 ${
                      mobileWidth
                        ? `w-[${mobileWidth}]`
                        : "w-[150px] max-w-[160px] max-h-[40px]"
                    } lg:${desktopWidth
                        ? `w-[${desktopWidth}]`
                        : "w-[200px] max-w-[200px] max-h-[40px]"
                    }! p-2.5 text-[12px] lg:text-[14px]! max-w-[200px] max-h-[40px] rounded-[50px] tracking-[0.7px] transition duration-300 lg:hover:(scale-110 border-none)`}
                    href={link ? link : "#"}
                  >
                    {title}
                  </a>
                );
              },
            )}
          </div>
        </div>
      </div>
    </section>
  );
}