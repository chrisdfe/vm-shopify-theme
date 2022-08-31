import BodyScroll from '../../utils/BodyScroll';

interface ProductImagesDesktopState {
  modalIsOpen: boolean;
  isAnimating: boolean;
  selectedModalImageIndex: number;
}

const ATTRIBUTES = {
  MODAL_TOGGLE_ELEMENT_INDEX: 'data-product-images-modal-toggle-index'
};

const SELECTORS = {
  MODAL_TOGGLE_ELEMENT: "[data-product-images-modal-toggle]",
  MODAL_TOGGLE_ELEMENT_INDEX: `[${ATTRIBUTES.MODAL_TOGGLE_ELEMENT_INDEX}]`,
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
  modalToggleElements: HTMLElement[] = [];

  modalWrapperElement: HTMLElement;
  modalElement: HTMLElement;
  modalContentElement: HTMLElement;
  modalUnderlayElement: HTMLElement;

  modalThumbnailElementList: HTMLElement[];

  modalImageCellListWrapperElement: HTMLElement;
  modalImageCellElementList: HTMLElement[];


  modalImageScrollTopIndicies: number[];

  state: ProductImagesDesktopState = {
    modalIsOpen: false,
    isAnimating: false,
    selectedModalImageIndex: 0,
  };

  initialize() {
    this.modalToggleElements = Array.from(document.querySelectorAll(SELECTORS.MODAL_TOGGLE_ELEMENT));
    this.modalToggleElements.forEach(element => {
      element.addEventListener("click", this.onModalToggleElementClick);
    });

    this.modalWrapperElement = document.querySelector(SELECTORS.MODAL_WRAPPER);
    this.modalElement = document.querySelector(SELECTORS.MODAL);
    this.modalContentElement = document.querySelector(SELECTORS.MODAL_CONTENT);

    this.modalThumbnailElementList =
      Array.from(document.querySelectorAll(SELECTORS.MODAL_THUMBNAIL));

    this.modalImageCellListWrapperElement =
      document.querySelector(SELECTORS.MODAL_IMAGE_CELL_LIST_WRAPPER);


    this.modalImageCellElementList =
      Array.from(document.querySelectorAll(SELECTORS.MODAL_IMAGE_CELL));


    // Add event listeners
    this.modalContentElement.addEventListener("click", this.onModalContentClick);

    this.modalThumbnailElementList.forEach(element => {
      element.addEventListener('click', this.onModalThumbnailClick);
    });

    this.modalImageCellListWrapperElement.addEventListener('wheel', this.onModalImagesWheel);

    document.addEventListener("keydown", this.onKeyPressed);
    document.addEventListener('resize', this.onWindowResize);

    return this;
  }

  unload() {
    this.modalToggleElements.forEach(element => {
      element.removeEventListener("click", this.onModalToggleElementClick);
    });

    document.removeEventListener("keydown", this.onKeyPressed);
    document.removeEventListener('resize', this.onWindowResize);
  }

  onModalThumbnailClick = (e: MouseEvent) => {
    const thumbnailWrapper = (e.target as HTMLElement).closest(SELECTORS.MODAL_THUMBNAIL);
    const indexAsString = thumbnailWrapper.getAttribute("data-index");
    const index = parseInt(indexAsString, 10);

    this.setSelectedModalImage(index);
  };

  onModalToggleElementClick = (e: MouseEvent) => {
    const element = (e.target as HTMLElement).closest(SELECTORS.MODAL_TOGGLE_ELEMENT);
    if (this.state.modalIsOpen) {
      this.closeModal();
    } else {
      const imageIndexAsString = element.getAttribute(ATTRIBUTES.MODAL_TOGGLE_ELEMENT_INDEX);
      const imageIndex = (imageIndexAsString) ? parseInt(imageIndexAsString) : 0;
      this.openModal(imageIndex);
    }
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

  onKeyPressed = (e: KeyboardEvent) => {
    if (e.key === "Escape" && this.state.modalIsOpen) {
      this.closeModal();
    }
  };

  onWindowResize = () => {
    this.setModalImageScrollTopIndicies();
  };

  onModalImagesWheel = () => {
    const currentScrollTop = this.modalImageCellListWrapperElement.scrollTop;

    let currentImageIndex = 0;
    for (let index = this.modalImageScrollTopIndicies.length - 1; index >= 0; index--) {
      const scrollTop = this.modalImageScrollTopIndicies[index];
      if (currentScrollTop > scrollTop) {
        currentImageIndex = index;
        break;
      }
    }

    if (currentImageIndex != this.state.selectedModalImageIndex) {
      this.setSelectedModalImage(currentImageIndex, { scroll: false });
    }
  };

  setModalImageScrollTopIndicies = () => {
    this.modalImageScrollTopIndicies = this.modalImageCellElementList.map((element, index) => {
      return element.offsetTop;
    });
  };

  setSelectedModalImage = (index: number, { scroll = true }: { scroll?: boolean; } = {}) => {
    this.modalThumbnailElementList[this.state.selectedModalImageIndex].classList.remove('is-active');

    this.state.selectedModalImageIndex = index;

    this.modalThumbnailElementList[this.state.selectedModalImageIndex].classList.add('is-active');

    if (scroll) {
      this.scrollToSelectedModalImage();
    }
  };

  scrollToSelectedModalImage = () => {
    const newScrollTop = this.modalImageScrollTopIndicies[this.state.selectedModalImageIndex];

    this.modalImageCellListWrapperElement.scrollTo({
      top: newScrollTop,
      behavior: 'smooth'
    });
  };

  openModal = (imageIndex: number) => {
    if (this.state.isAnimating) {
      return;
    }

    BodyScroll.lock('modal');

    this.modalWrapperElement.classList.add('is-active');

    this.modalElement.classList.add('animated', 'animated--snappy', 'fadeIn');
    this.state.isAnimating = true;

    this.setSelectedModalImage(imageIndex);

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