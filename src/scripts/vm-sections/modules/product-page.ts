import ProductImagesDesktop from './product-page/product-images-desktop';
import ProductImagesMobile from './product-page/product-images-mobile';

interface ProductPageState {
  modalIsOpen: boolean;
}

export default class ProductPage {
  productImagesDesktop: ProductImagesDesktop;
  productImagesMobile: ProductImagesMobile;

  stickyContentElement: HTMLElement;

  constructor() {
    return this;
  }

  initialize() {
    this.setStickyContentTop();

    this.productImagesDesktop = new ProductImagesDesktop().initialize();
    this.productImagesMobile = new ProductImagesMobile().initialize();
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