export default function ScrollButtonFloating() {
    addEventListener("scroll", ({ target }: Event) => {
      if (target && target instanceof Document) {
        const btnScrollY = target?.querySelectorAll('[data-deco="add-to-cart"]')[1].getClientRects()[0].top;
        // @ts-ignore: Ignorando erro
        const footerContainer = target?.querySelector<HTMLElement>('.footer-container').getClientRects()[0].top;
  
        if (target && footerContainer && btnScrollY < -38 ) {
          target.querySelector(".floating")?.classList.remove("is-hidden");
          target.querySelector(".floating__button")?.classList.remove("is-hidden");
  
          if(window.matchMedia("(max-width: 1536px)").matches){
            if( footerContainer <= 320  ){
              target.querySelector(".floating")?.classList.add("is-hidden");
              target.querySelector(".floating__button")?.classList.add("is-hidden");
            }         
          } else {
            if( footerContainer <= 500  ){
              target.querySelector(".floating")?.classList.add("is-hidden");
              target.querySelector(".floating__button")?.classList.add("is-hidden");
            }           
          }      
        } 
        else {
          target.querySelector(".floating")?.classList.add("is-hidden");
          target.querySelector(".floating__button")?.classList.add("is-hidden");    
        }      
      }
    });
  }