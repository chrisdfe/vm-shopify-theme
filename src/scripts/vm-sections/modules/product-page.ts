import ProductImagesDesktop from './product-page/product-images-desktop';
import ProductImagesMobile from './product-page/product-images-mobile';
import ProductColorSwatches from './product-page/product-color-swatches';
import ProductVariants from './product-page/product-variants';

interface ProductPageState {
  modalIsOpen: boolean;
}

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
    this.productVariants = new ProductVariants().initialize();
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