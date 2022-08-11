import BodyScroll from '../../utils/BodyScroll';

interface ProductPageImagesState {
  modalIsOpen: boolean;
}

type ScrollTopMap = { [key: number]: number; };
export default class ProductPageImages {
  imageCellElements: HTMLElement[] = [];

  modalWrapperElement: HTMLElement;
  modalElement: HTMLElement;
  modalContentElement: HTMLElement;
  modalUnderlayElement: HTMLElement;

  modalThumbnailElementList: HTMLElement[];
  modalImageCellElementList: HTMLElement[];

  closeButtonElement: HTMLElement;

  modalImageScrollTopIndicies: ScrollTopMap;

  state: ProductPageImagesState = {
    modalIsOpen: false
  };

  constructor() {
    return this;
  }

  initialize() {
    this.setupImages();
    return this;
  }

  setupImages() {
    this.imageCellElements = Array.from(document.querySelectorAll('.product-page__product-image-cell'));

    this.imageCellElements.forEach(imageCell => {
      imageCell.addEventListener("click", this.onImageCellClick);
    });

    this.modalWrapperElement = document.querySelector('.product-images-modal-wrapper');
    this.modalElement = document.querySelector('.product-images-modal');
    this.modalUnderlayElement = document.querySelector('.product-images-modal__underlay');
    this.modalUnderlayElement = document.querySelector('.product-images-modal__underlay');

    this.modalThumbnailElementList =
      Array.from(document.querySelectorAll('.product-images-modal__thumbnail'));

    this.modalImageCellElementList =
      Array.from(document.querySelectorAll('.product-images-modal__image-cell'));

    this.closeButtonElement = document.querySelector('.product-images-modal__close-button');

    // Add event listeners
    this.modalUnderlayElement.addEventListener('click', this.onModalUnderlayClick);
    this.closeButtonElement.addEventListener('click', this.onModalCloseButtonClick);

    this.modalThumbnailElementList.forEach(element => {
      element.addEventListener('click', this.onModalThumbnailClick);
    });

    document.addEventListener("keydown", this.onKeyPressed);
  }

  unload() {
    this.imageCellElements.forEach(imageCell => {
      imageCell.removeEventListener("click", this.onImageCellClick);
    });

    this.modalUnderlayElement.removeEventListener('click', this.onModalUnderlayClick);
  }

  onModalThumbnailClick = (e: MouseEvent) => {
    const thumbnailWrapper = (e.target as HTMLElement).closest('.product-images-modal__thumbnail');
    const indexAsString = thumbnailWrapper.getAttribute("data-index");
    const index = parseInt(indexAsString, 10);
    const imageCell = this.modalImageCellElementList[index];
    this.modalElement.scrollTo({
      top: imageCell.getBoundingClientRect().top,
      behavior: 'smooth'
    });
    // console.log('typeof index', typeof index);
    // const scrollTop = this.modalImageScrollTopIndicies[index];
  };

  onImageCellClick = (e: MouseEvent) => {
    (this.state.modalIsOpen ? this.closeModal : this.openModal)();
  };

  onModalUnderlayClick = (e: MouseEvent) => {
    console.log("onmodalunderlayclick");
    this.closeModal();
  };

  onModalCloseButtonClick = (e: MouseEvent) => {
    this.closeModal();
  };

  onKeyPressed = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.state.modalIsOpen) {
      this.closeModal();
    }
  };

  setModalImageScrollTopIndicies = () => {
    this.modalImageScrollTopIndicies = this.modalImageCellElementList.reduce((acc, element, index) => {
      const scrollTop = element.getBoundingClientRect().top;
      return { ...acc, [index]: scrollTop };
    }, {});
    console.log("this.modalImageScrollTopIndicies");
    console.log(this.modalImageScrollTopIndicies);
  };

  openModal = () => {
    BodyScroll.lock();
    this.modalWrapperElement.classList.add('is-active');
    this.state.modalIsOpen = true;

    this.setModalImageScrollTopIndicies();
  };

  closeModal = () => {
    BodyScroll.unlock();
    this.modalWrapperElement.classList.remove('is-active');
    this.state.modalIsOpen = false;
  };

  static isOnProductPage = () => !!document.querySelector('.product-template');
}