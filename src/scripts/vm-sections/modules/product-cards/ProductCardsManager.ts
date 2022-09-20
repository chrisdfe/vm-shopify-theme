const SELECTORS = {
  PRODUCT_CARD: '.product-card',
  MEDIA_WRAPPER: '.product-card__media',
  PRIMARY_MEDIA: '.product-card__media__primary',
  SECONDARY_MEDIA: '.product-card__media__secondary',
};

const IS_HOVERED_CLASSNAME = 'is-hovered';

// taken from here: https://stackoverflow.com/a/36898221
const videoIsPlaying = (video: HTMLVideoElement) =>
  video.currentTime > 0 && !video.paused && !video.ended
  && video.readyState > video.HAVE_CURRENT_DATA;

class ProductCard {
  element: HTMLElement;
  mediaWrapperElement: HTMLElement;

  primaryMedia: HTMLElement;
  primaryMediaImg: HTMLImageElement;
  secondaryMedia: HTMLElement;

  constructor(el: HTMLElement) {
    this.element = el;
  }

  initialize = () => {
    this.mediaWrapperElement = this.element.querySelector(SELECTORS.MEDIA_WRAPPER);

    this.primaryMedia = this.mediaWrapperElement.querySelector(SELECTORS.PRIMARY_MEDIA) as HTMLElement;
    this.secondaryMedia = this.mediaWrapperElement.querySelector(SELECTORS.SECONDARY_MEDIA) as HTMLElement;

    if (
      this.secondaryMedia?.tagName === 'VIDEO' &&
      videoIsPlaying(this.secondaryMedia as HTMLVideoElement)
    ) {
      (this.secondaryMedia as HTMLVideoElement).pause();
    }

    if (this.secondaryMedia) {
      this.element.addEventListener('mouseover', this.onLinkMouseOver);
      this.element.addEventListener('mouseout', this.onLinkMouseOut);
    }

    return this;
  };

  unload = () => {
    if (this.secondaryMedia) {
      this.element.removeEventListener('mouseover', this.onLinkMouseOver);
      this.element.removeEventListener('mouseout', this.onLinkMouseOut);
    }
  };

  private onLinkMouseOver = () => {
    this.element.classList.add(IS_HOVERED_CLASSNAME);

    if (
      this.secondaryMedia.tagName === 'VIDEO' &&
      !videoIsPlaying(this.secondaryMedia as HTMLVideoElement)
    ) {
      (this.secondaryMedia as HTMLVideoElement).play();
    }
  };

  private onLinkMouseOut = () => {
    this.element.classList.remove(IS_HOVERED_CLASSNAME);

    if (this.secondaryMedia.tagName === 'VIDEO') {
      (this.secondaryMedia as HTMLVideoElement).currentTime = 0;
      (this.secondaryMedia as HTMLVideoElement).pause();
    }
  };
}

export default class ProductCardsManager {
  productCards: ProductCard[];

  initialize = () => {
    this.setProductCards();

    window.addEventListener('product-recommendations-loaded', this.reset);
    window.addEventListener('collection-filters-updated', this.reset);
  };

  unload = () => {
    this.productCards.forEach((productCard) => {
      productCard.unload();
    });
    window.removeEventListener('product-recommendations-loaded', this.reset);
    window.removeEventListener('collection-filters-updated', this.reset);
  };

  private setProductCards = () => {
    this.productCards =
      Array.from(document.querySelectorAll(SELECTORS.PRODUCT_CARD))
        .map(element => new ProductCard(element as HTMLElement).initialize());
  };

  private reset = () => {
    this.productCards.forEach((productCard) => {
      productCard.unload();
    });

    this.setProductCards();
  };
}