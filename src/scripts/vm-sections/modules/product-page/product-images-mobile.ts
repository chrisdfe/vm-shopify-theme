import BodyScroll from '../../utils/BodyScroll';

interface ProductImagesMobileState {
  currentImageIndex: number;
}

const SELECTORS = {
  PRODUCT_IMAGE: '.product-images-mobile__image',
  DOTS: '.product-images-mobile__dots',
  DOT: '.product-images-mobile__dots__dot',
};

export default class ProductImagesMobile {
  imageElements: HTMLElement[];
  dotElements: HTMLElement[];

  state: ProductImagesMobileState = {
    currentImageIndex: 0,
  };

  initialize() {
    this.imageElements = Array.from(document.querySelectorAll(SELECTORS.PRODUCT_IMAGE));
    this.dotElements = Array.from(document.querySelectorAll(SELECTORS.DOT));

    this.dotElements.forEach(element => {
      element.addEventListener('click', this.onDotClick);
    });

    return this;
  }

  onDotClick = (e: MouseEvent) => {
    const imageIndex = (e.target as HTMLElement).getAttribute('data-image-index');
    const imageIndexAsInt = parseInt(imageIndex, 10);
    this.switchToImage(imageIndexAsInt);
  };

  switchToImage = (index: number) => {
    if (index === this.state.currentImageIndex) return;

    this.toggleImageVisibility(this.state.currentImageIndex, false);
    this.toggleDotActiveState(this.state.currentImageIndex, false);

    this.state.currentImageIndex = index;

    this.toggleImageVisibility(this.state.currentImageIndex, true);
    this.toggleDotActiveState(this.state.currentImageIndex, true);
  };

  toggleImageVisibility = (index: number, visible: boolean) => {
    this.imageElements[index].classList.toggle('is-active', visible);
  };

  toggleDotActiveState = (index: number, isActive: boolean) => {
    this.dotElements[index].classList.toggle('is-active', isActive);
  };
}