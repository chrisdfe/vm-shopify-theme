const SELECTORS = {
  LAZY_LOADED_IMAGE: "[data-smooth-lazy-loading]"
};

const IS_LOADING_CLASSNAME = 'is-loading';

class LazyLoadedImage {
  element: HTMLImageElement;

  elementsToLoad: (HTMLImageElement | HTMLVideoElement)[];
  hasLoaded: boolean[];
  hasCompletelyLoaded: boolean = false;

  constructor(el) {
    this.element = el;
  }

  initialize = () => {
    // this.elementsToLoad = Array.from(this.element.querySelectorAll('img'));
    this.elementsToLoad = Array.from(this.element.querySelectorAll('img, video'));
    if (this.elementsToLoad.length === 0) return;

    this.hasLoaded = new Array(this.elementsToLoad).map(() => false);
    this.element.classList.add(IS_LOADING_CLASSNAME);

    this.elementsToLoad.forEach((element, elementIndex) => {
      const onLoad = () => {
        this.onLoad(elementIndex);
      };

      if (element.tagName === "IMG") {
        if ((element as HTMLImageElement).complete) {
          onLoad();
        } else {
          element.addEventListener('load', onLoad, { once: true });
        }
      } else if (element.tagName === "VIDEO") {
        const posterImage = new Image();
        posterImage.loading = "lazy";
        posterImage.src = (element as HTMLVideoElement).getAttribute('poster');

        if ((posterImage as HTMLImageElement).complete) {
          onLoad();
        } else {
          posterImage.addEventListener('load', onLoad, { once: true });
        }
      }
    });

    return this;
  };

  unload = () => { };

  private onLoad = (elementIndex) => {
    this.hasLoaded[elementIndex] = true;

    this.hasCompletelyLoaded = this.hasLoaded.filter(hasLoaded => !hasLoaded).length === 0;

    if (this.hasCompletelyLoaded) {
      this.element.classList.remove(IS_LOADING_CLASSNAME);
    }
  };
}

export default class SmoothLazyLoadedImagesManager {
  lazyLoadedImages: LazyLoadedImage[];

  initialize = () => {
    this.setLazyLoadedImages();

    window.addEventListener('product-recommendations-loaded', this.reset);
    window.addEventListener('collection-filters-updated', this.reset);
  };

  unload = () => {
    window.removeEventListener('product-recommendations-loaded', this.reset);
    window.removeEventListener('collection-filters-updated', this.reset);
  };

  setLazyLoadedImages = () => {
    this.lazyLoadedImages =
      Array.from(document.querySelectorAll(SELECTORS.LAZY_LOADED_IMAGE))
        .map(element => new LazyLoadedImage(element).initialize());
  };

  private reset = () => {
    console.log('resetting lazy loaded images');
    this.lazyLoadedImages.forEach((lazyLoadedImage) => {
      lazyLoadedImage.unload();
    });

    // TODO - don't completely replace
    this.setLazyLoadedImages();
  };
}