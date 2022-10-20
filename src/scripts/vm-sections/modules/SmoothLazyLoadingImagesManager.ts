const SELECTORS = {
  LAZY_LOADED_IMAGE: "[data-smooth-lazy-loading]"
};

const IS_ANIMATED_CLASSNAME = 'is-animated';
const IS_LOADING_CLASSNAME = 'is-loading';
const HAS_LOADED_CLASSNAME = 'has-loaded';

class LazyLoadedImage {
  element: HTMLImageElement;
  posterImage: HTMLImageElement;

  elementsToLoad: (HTMLImageElement | HTMLVideoElement)[];
  unloadCallbacks: (() => void)[];

  hasLoaded: boolean[];
  hasCompletelyLoaded: boolean = false;

  constructor(el) {
    this.element = el;
  }

  initialize = () => {
    this.elementsToLoad = Array.from(this.element.querySelectorAll('img, video'));
    if (this.elementsToLoad.length === 0) return;

    this.hasLoaded = new Array(this.elementsToLoad).map(() => false);
    this.element.classList.add(IS_LOADING_CLASSNAME);

    // Since 'onLoad' is defined in the function scope we need to also create an
    // 'unload' function to clean up the load event listener
    this.unloadCallbacks = this.elementsToLoad.map((element, elementIndex) => {
      const onLoad = () => {
        this.onLoad(elementIndex);
      };

      if (element.tagName === "IMG") {
        if ((element as HTMLImageElement).complete) {
          onLoad();
        } else {
          element.addEventListener('load', onLoad, { once: true });
          return () => { element.removeEventListener('load', onLoad); };
        }
      }

      if (element.tagName === "VIDEO") {
        this.posterImage = new Image();
        this.posterImage.loading = "lazy";
        this.posterImage.src = (element as HTMLVideoElement).getAttribute('poster');

        if ((this.posterImage as HTMLImageElement).complete) {
          onLoad();
        } else {
          this.posterImage.addEventListener('load', onLoad, { once: true });
          return () => { element.removeEventListener('load', onLoad); };
        }
      }

      // no-op unload function
      return () => { };
    });

    return this;
  };

  unload = () => {
    this.unloadCallbacks.forEach(unload => { unload(); });
  };

  private onLoad = (elementIndex) => {
    this.hasLoaded[elementIndex] = true;

    this.hasCompletelyLoaded = this.hasLoaded.filter(hasLoaded => !hasLoaded).length === 0;

    if (this.hasCompletelyLoaded) {
      this.element.classList.add(IS_ANIMATED_CLASSNAME);
      this.element.classList.remove(IS_LOADING_CLASSNAME);
      this.element.classList.add(HAS_LOADED_CLASSNAME);

      this.element.addEventListener('transitionend', () => {
        this.element.classList.remove(IS_ANIMATED_CLASSNAME);
      }, { once: true });
    }
  };
}

export default class SmoothLazyLoadedImagesManager {
  lazyLoadedImages: LazyLoadedImage[];

  initialize = () => {
    this.setLazyLoadedImages();

    window.addEventListener('product-recommendations-loaded', this.reset);
    window.addEventListener('collection-filters-updated', this.reset);

    window.addEventListener('shopify:section:load', this.onShopifySectionLoad);
  };

  unload = () => {
    window.removeEventListener('product-recommendations-loaded', this.reset);
    window.removeEventListener('collection-filters-updated', this.reset);
    window.removeEventListener('shopify:section:load', this.onShopifySectionLoad);
  };

  setLazyLoadedImages = () => {
    this.lazyLoadedImages =
      Array.from(document.querySelectorAll(SELECTORS.LAZY_LOADED_IMAGE))
        .map(element => new LazyLoadedImage(element).initialize());
  };

  private onShopifySectionLoad = (event: ShopifySectionLoadEvent) => {
    this.reset();
  };

  private reset = () => {
    this.lazyLoadedImages.forEach((lazyLoadedImage) => {
      lazyLoadedImage.unload();
    });

    // TODO - don't completely replace
    this.setLazyLoadedImages();
  };
}