import debounce from '../../utils/debounce';

export default class ProductCardsManager {
  productCards: HTMLElement[];

  initialize() {
    this.productCards = Array.from(document.querySelectorAll('.product-wrap'));

    window.addEventListener('DOMContentLoaded', this.setProductCardHeights);
    window.addEventListener('resize', debounce(this.setProductCardHeights, 5));
  }

  setProductCardHeights = () => {
    this.productCards.forEach(productCard => {
      const imageWrapElement = productCard.querySelector(".product_image") as HTMLElement;
      imageWrapElement.style.height = 'auto';
      imageWrapElement.style.height = imageWrapElement.clientHeight + 'px';
    })
  }
}