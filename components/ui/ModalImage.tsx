export default function ModalImage(){
    const closeModalImage = ()=>{
        const elementModalImage = document?.querySelector<HTMLElement>('.modal-image-mobile');
        const elementBody = document.body;
        elementModalImage && elementModalImage.classList.contains('is-active') &&  elementModalImage.classList.remove('is-active');
        elementBody && elementBody.classList.remove('is-overflow-hidder');
    }  
    
    return (
        <>
          <div class="modal-image-mobile">
            <div class="close-modal" onClick={closeModalImage}></div>
            <img />
          </div>        
        </>
    )
}