import BodyScroll from '../../utils/BodyScroll';

interface ProductImagesDesktopState {
  modalIsOpen: boolean;
  isAnimating: boolean;
}

type ScrollTopMap = { [key: number]: number; };

const SELECTORS = {
  PRODUCT_IMAGE_CELL: ".product-page__product-image-cell",
  MODAL_WRAPPER: ".product-images-modal-wrapper",
  MODAL: ".product-images-modal",
  MODAL_UNDERLAY: ".product-images-modal__underlay",
  MODAL_CONTENT: ".product-images-modal__content",
  MODAL_THUMBNAIL_LIST_WRAPPER: ".product-images-modal__thumbnail-list",
  MODAL_THUMBNAIL: ".product-images-modal__thumbnail",
  MODAL_IMAGE_CELL: ".product-images-modal__image-cell",
  MODAL_IMAGE_CELL_LIST_WRAPPER: ".product-images-modal__image-cell-list",
  MODAL_CLOSE_BUTTON: ".product-images-modal__close-button"
};

export default class ProductImagesDesktop {
  imageCellElements: HTMLElement[] = [];

  modalWrapperElement: HTMLElement;
  modalElement: HTMLElement;
  modalContentElement: HTMLElement;
  modalUnderlayElement: HTMLElement;

  modalThumbnailElementList: HTMLElement[];

  modalImageCellListWrapperElement: HTMLElement;
  modalImageCellElementList: HTMLElement[];

  closeButtonElement: HTMLElement;

  modalImageScrollTopIndicies: ScrollTopMap;

  state: ProductImagesDesktopState = {
    modalIsOpen: false,
    isAnimating: false
  };

  initialize() {
    this.setupImages();
    return this;
  }

  setupImages() {
    this.imageCellElements = Array.from(document.querySelectorAll(SELECTORS.PRODUCT_IMAGE_CELL));

    this.imageCellElements.forEach(imageCell => {
      imageCell.addEventListener("click", this.onImageCellClick);
    });

    this.modalWrapperElement = document.querySelector(SELECTORS.MODAL_WRAPPER);
    this.modalElement = document.querySelector(SELECTORS.MODAL);
    this.modalUnderlayElement = document.querySelector(SELECTORS.MODAL_UNDERLAY);
    this.modalContentElement = document.querySelector(SELECTORS.MODAL_CONTENT);

    this.modalThumbnailElementList =
      Array.from(document.querySelectorAll(SELECTORS.MODAL_THUMBNAIL));

    this.modalImageCellListWrapperElement = document.querySelector(SELECTORS.MODAL_IMAGE_CELL_LIST_WRAPPER);
    this.modalImageCellElementList =
      Array.from(document.querySelectorAll(SELECTORS.MODAL_IMAGE_CELL));

    this.closeButtonElement = document.querySelector(SELECTORS.MODAL_CLOSE_BUTTON);

    // Add event listeners
    this.modalContentElement.addEventListener("click", this.onModalContentClick);
    this.closeButtonElement.addEventListener('click', this.onModalCloseButtonClick);

    this.modalThumbnailElementList.forEach(element => {
      element.addEventListener('click', this.onModalThumbnailClick);
    });

    document.addEventListener("keydown", this.onKeyPressed);
    document.addEventListener('resize', this.onWindowResize);
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

    const newScrollTop = imageCell.offsetTop;

    this.modalImageCellListWrapperElement.scrollTo({
      top: newScrollTop,
      behavior: 'smooth'
    });
  };

  onImageCellClick = (e: MouseEvent) => {
    (this.state.modalIsOpen ? this.closeModal : this.openModal)();
  };

  onModalUnderlayClick = (e: MouseEvent) => {
    this.closeModal();
  };

  onModalContentClick = (e: MouseEvent) => {
    e.stopPropagation();
    const targetElement = e.target as HTMLElement;

    if (
      !targetElement.closest(SELECTORS.MODAL_THUMBNAIL_LIST_WRAPPER) &&
      !targetElement.closest(SELECTORS.MODAL_IMAGE_CELL_LIST_WRAPPER)
    ) {
      this.closeModal();
    }
  };

  onModalCloseButtonClick = (e: MouseEvent) => {
    this.closeModal();
  };

  onKeyPressed = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.state.modalIsOpen) {
      this.closeModal();
    }
  };

  onWindowResize = () => {
    this.setModalImageScrollTopIndicies();
  };

  setModalImageScrollTopIndicies = () => {
    this.modalImageScrollTopIndicies = this.modalImageCellElementList.reduce((acc, element, index) => {
      const scrollTop = element.offsetTop;
      return { ...acc, [index]: scrollTop };
    }, {});
  };

  openModal = () => {
    if (this.state.isAnimating) {
      return;
    }

    BodyScroll.lock('modal');

    this.modalWrapperElement.classList.add('is-active');

    this.modalElement.classList.add('animated', 'animated--snappy', 'fadeIn');
    this.state.isAnimating = true;

    this.modalElement.addEventListener('animationend', () => {
      this.state.modalIsOpen = true;
      this.state.isAnimating = false;
      this.modalElement.classList.remove('animated', 'animated--snappy', 'fadeIn');
      this.setModalImageScrollTopIndicies();
    }, { once: true });
  };

  closeModal = () => {
    if (this.state.isAnimating) {
      return;
    }

    BodyScroll.unlock('modal');

    this.modalElement.classList.add('animated', 'animated--snappy', 'fadeOut');
    this.state.isAnimating = true;

    this.modalElement.addEventListener('animationend', () => {
      this.state.isAnimating = false;
      this.state.modalIsOpen = false;
      this.modalWrapperElement.classList.remove('is-active');
      this.modalElement.classList.remove('animated', 'animated--snappy', 'fadeOut');
    }, { once: true });
  };

  static isOnProductPage = () => !!document.querySelector('.product-template');
}