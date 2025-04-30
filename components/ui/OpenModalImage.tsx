export default function OpenModalImage(){
    const openModalImage = ( { target }: Event) =>{
        const elementModalImage = document.querySelector<HTMLElement>('.modal-image-mobile');
        const elementBody = document.body;
        const isMobile = window.matchMedia("(max-width: 767px)").matches;
        
        if( isMobile ){
          if( elementBody && target && target instanceof Element ){
            if( target.nextSibling && target.nextSibling instanceof HTMLImageElement ){
              const src = target.nextSibling.getAttribute('src');
              if( src && elementModalImage ){
                // @ts-ignore: Ignorando erro
                elementModalImage.querySelector<HTMLImageElement>('img').setAttribute('src', src);
                elementModalImage.classList.add('is-active');
                elementBody.classList.add('is-overflow-hidder');
              }
            }
          }    
        }
    }
    
    return (
        <>
            <div class="overlay-image absolute w-full h-full left-0" onClick={openModalImage}></div>        
        </>
    )
}