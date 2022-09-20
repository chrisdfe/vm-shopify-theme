const SELECTORS = {
  PRODUCT_CARD: '.product-card',
  MEDIA_WRAPPER: '.product-card__media',
  PRIMARY_MEDIA: '.product-card__primary-media',
  SECONDARY_MEDIA: '.product-card__primary-media',
};

const IS_HOVERED_CLASSNAME = 'is-hovered';

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

    this.primaryMedia = this.mediaWrapperElement.children[0] as HTMLElement;
    this.secondaryMedia = this.mediaWrapperElement.children[1] as HTMLElement;

    if (this.secondaryMedia.tagName === 'VIDEO') {
      (this.secondaryMedia as HTMLVideoElement).pause();
    }

    this.element.addEventListener('mouseover', this.onLinkMouseOver);
    this.element.addEventListener('mouseout', this.onLinkMouseOut);

    return this;
  };

  unload = () => {
    this.element.removeEventListener('mouseover', this.onLinkMouseOver);
    this.element.removeEventListener('mouseout', this.onLinkMouseOut);
  };

  private onLinkMouseOver = () => {
    this.element.classList.add(IS_HOVERED_CLASSNAME);
    if (this.secondaryMedia.tagName === 'VIDEO') {
      (this.secondaryMedia as HTMLVideoElement).play();
    }
  };

  private onLinkMouseOut = () => {
    this.element.classList.remove(IS_HOVERED_CLASSNAME);
    if (this.secondaryMedia.tagName === 'VIDEO') {
      console.log('pausing');
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