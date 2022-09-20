interface ScreenCoordinates {
  x: number;
  y: number;
}

interface ElementsMap {
  imagesContainer: HTMLElement;
  imagesContainerInner: HTMLElement;
  images: HTMLElement[];
  dots: HTMLElement[];
}

interface State {
  currentImageIndex: number;
  isSwiping: boolean;
  touchStartCoordinates?: ScreenCoordinates;
  currentTouchCoordinates?: ScreenCoordinates;
}

const SELECTORS = {
  PRODUCT_IMAGES_CONTAINER: '.product-images-mobile__images-container',
  PRODUCT_IMAGES_CONTAINER_INNER: '.product-images-mobile__images-container__inner',
  PRODUCT_IMAGE: '.product-images-mobile__image',
  DOTS: '.product-images-mobile__dots',
  DOT: '.product-images-mobile__dots__dot',
};

const getScreenCoordinatesDiff = (a: ScreenCoordinates, b: ScreenCoordinates) => ({
  x: Math.floor(a.x - b.x),
  y: Math.floor(a.y - b.y),
});

const SWIPE_PERCENTAGE_THRESHOLD = 40;

export default class ProductImagesMobile {
  elements: ElementsMap = {
    imagesContainer: null,
    imagesContainerInner: null,
    images: [],
    dots: []
  };

  state: State = {
    currentImageIndex: 0,
    isSwiping: false,
    touchStartCoordinates: null,
    currentTouchCoordinates: null,
  };

  imageContainerDimensions: {
    width: number;
    offsetTop: number;
  };

  initialize() {
    this.elements.imagesContainer = document.querySelector(SELECTORS.PRODUCT_IMAGES_CONTAINER);

    this.elements.imagesContainer.addEventListener('touchstart', this.onContainerTouchStart);
    this.elements.imagesContainer.addEventListener('touchend', this.onContainerTouchEnd);
    this.elements.imagesContainer.addEventListener('touchmove', this.onContainerTouchMove);

    this.setImageContainerDimensions();

    window.addEventListener('resize', this.setImageContainerDimensions);

    this.elements.imagesContainerInner = document.querySelector(SELECTORS.PRODUCT_IMAGES_CONTAINER_INNER);

    this.elements.images = Array.from(document.querySelectorAll(SELECTORS.PRODUCT_IMAGE));
    this.elements.dots = Array.from(document.querySelectorAll(SELECTORS.DOT));

    this.elements.dots.forEach(element => {
      element.addEventListener('click', this.onDotClick);
    });

    return this;
  }

  unload = () => {

  };

  setImageContainerDimensions = () => {
    this.imageContainerDimensions = {
      width: this.elements.imagesContainer.getBoundingClientRect().width,
      offsetTop: this.elements.imagesContainer.getBoundingClientRect().top
    };
  };

  onContainerTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];

    this.state.touchStartCoordinates = {
      x: touch.clientX,
      y: touch.clientY,
    };

    this.state.currentTouchCoordinates = { ...this.state.touchStartCoordinates };
  };

  onContainerTouchMove = (e: TouchEvent) => {
    // prevent vertical scroll
    e.preventDefault();

    const touch = e.touches[0];

    this.state.currentTouchCoordinates = {
      x: touch.clientX,
      y: touch.clientY,
    };

    const difference = this.getCurrentCoordinatesDiff();

    this.elements.imagesContainerInner.classList.add('is-active');

    const clampThreshold = this.imageContainerDimensions.width * 0.95;
    const clampedXDiff = Math.max(Math.min(difference.x, clampThreshold), -clampThreshold);
    this.setImageContainerInnerOffset(clampedXDiff);
  };

  onContainerTouchEnd = (e: TouchEvent) => {
    this.elements.imagesContainerInner.classList.remove('is-active');
    this.setImageContainerInnerOffset();

    const difference = this.getCurrentCoordinatesDiff();

    // Attempt to switch to image if user has swiped far enough
    if (Math.abs(difference.x) >= SWIPE_PERCENTAGE_THRESHOLD) {
      const newImageIndex = this.state.currentImageIndex + (
        difference.x > 0 ? -1 : 1
      );

      if (newImageIndex >= 0 && newImageIndex <= this.elements.images.length - 1) {
        this.switchToImage(newImageIndex);
      }
    }

    this.state.touchStartCoordinates = null;
    this.state.currentTouchCoordinates = null;
  };

  onDotClick = (e: MouseEvent) => {
    const imageIndex = (e.target as HTMLElement).getAttribute('data-image-index');
    const imageIndexAsInt = parseInt(imageIndex, 10);
    this.switchToImage(imageIndexAsInt);
  };

  getCurrentCoordinatesDiff = () => {
    const { currentTouchCoordinates, touchStartCoordinates } = this.state;
    return getScreenCoordinatesDiff(currentTouchCoordinates, touchStartCoordinates);
  };

  switchToImage = (index: number) => {
    if (index === this.state.currentImageIndex) return;

    this.toggleDotActiveState(this.state.currentImageIndex, false);

    this.state.currentImageIndex = index;
    this.setImageContainerInnerOffset();

    this.toggleDotActiveState(this.state.currentImageIndex, true);
  };

  getCurrentImageIndexPixelOffset = () => (
    this.imageContainerDimensions.width * this.state.currentImageIndex
  );

  setImageContainerInnerOffset = (xDiff: number = 0) => {
    const containerInnerOffset = this.getCurrentImageIndexPixelOffset();
    this.elements.imagesContainerInner.style.transform = `translateX(${(-containerInnerOffset) + xDiff}px)`;
  };

  toggleDotActiveState = (index: number, isActive: boolean) => {
    this.elements.dots[index].classList.toggle('is-active', isActive);
  };
}