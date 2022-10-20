import ProductImagesDesktop from './ProductImagesDesktop';
import ProductImagesMobile from './ProductImagesMobile';
// import ProductColorSwatches from './product-color-swatches';
import ProductForm from './ProductForm';

import ProductRecommendations from './product-recommendations';

export default class ProductPage {
  productImagesDesktop: ProductImagesDesktop;
  productImagesMobile: ProductImagesMobile;
  // productColorSwatches: ProductColorSwatches;
  productForm: ProductForm;

  stickyContentElement: HTMLElement;

  constructor() {
    return this;
  }

  initialize() {
    this.setStickyContentTop();

    this.productImagesDesktop = new ProductImagesDesktop().initialize();
    this.productImagesMobile = new ProductImagesMobile().initialize();
    // this.productColorSwatches = new ProductColorSwatches().initialize();
    if (ProductForm.shouldInitialize()) {
      this.productForm = new ProductForm().initialize();
    }

    // functionality ported straight over from turbo
    new ProductRecommendations().initialize();
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