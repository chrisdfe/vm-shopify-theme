import ProductPageImages from './product-page/product-images-modal';

interface ProductPageState {
  modalIsOpen: boolean;
}

export default class ProductPage {
  productPageImages: ProductPageImages;

  stickyContentElement: HTMLElement;

  constructor() {
    return this;
  }

  initialize() {
    this.setStickyContentTop();

    this.productPageImages = new ProductPageImages().initialize();
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