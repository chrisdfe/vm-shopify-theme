import ProductImagesDesktop from './product-images-desktop';
import ProductImagesMobile from './product-images-mobile';
import ProductColorSwatches from './product-color-swatches';
import ProductVariants from './product-variants';

import initializeProductRecommendations from './product-recommendations';

export default class ProductPage {
  productImagesDesktop: ProductImagesDesktop;
  productImagesMobile: ProductImagesMobile;
  productColorSwatches: ProductColorSwatches;
  productVariants: ProductVariants;

  stickyContentElement: HTMLElement;

  constructor() {
    return this;
  }

  initialize() {
    this.setStickyContentTop();

    this.productImagesDesktop = new ProductImagesDesktop().initialize();
    this.productImagesMobile = new ProductImagesMobile().initialize();
    this.productColorSwatches = new ProductColorSwatches().initialize();
    if (ProductVariants.shouldInitialize()) {
      this.productVariants = new ProductVariants().initialize();
    }

    // functionality ported straight over from turbo
    initializeProductRecommendations();
  }

  setStickyContentTop() {
    this.stickyContentElement = document.querySelector('.product-content-wrapper');
    const header = document.querySelector('.header');
    const headerHeight = header.getBoundingClientRect().height;
    const stickyElementTop = headerHeight + 16;
    this.stickyContentElement.style.top = `${stickyElementTop}px`;
  }

  unload() {

  }

  static isOnProductPage = () => !!document.querySelector('.product-template');
}