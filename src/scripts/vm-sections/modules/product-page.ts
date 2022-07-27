import BodyScroll from '../utils/BodyScroll';

interface ProductPageState {
  modalIsOpen: boolean;
}

export default class ProductPage {
  imageCellElements: HTMLElement[] = [];
  modalWrapperElement: HTMLElement;
  modalUnderlayElement: HTMLElement;
  stickyContentElement: HTMLElement;

  state: ProductPageState = {
    modalIsOpen: false
  };

  constructor() {
    return this;
  }

  initialize() {
    this.setupImages();
    this.setStickyContentTop();
  }

  setupImages() {
    this.imageCellElements = Array.from(document.querySelectorAll('.product-page__product-image-cell'));

    this.imageCellElements.forEach(imageCell => {
      imageCell.addEventListener("click", this.onImageCellClick)
    });

    this.modalWrapperElement = document.querySelector('.product-page__images-modal-wrapper');
    this.modalUnderlayElement = document.querySelector('.product-page__images-modal__underlay');

    this.modalUnderlayElement.addEventListener('click', this.onModalUnderlayClick);
  }

  setStickyContentTop() {
    this.stickyContentElement = document.querySelector('.product-content-wrapper');
    const header = document.querySelector('.header');
    const headerHeight = header.getBoundingClientRect().height;
    const stickyElementTop = headerHeight + 16;
    this.stickyContentElement.style.top = `${stickyElementTop}px`;
  }

  unload() {
    this.imageCellElements.forEach(imageCell => {
      imageCell.removeEventListener("click", this.onImageCellClick)
    })

    this.modalUnderlayElement.removeEventListener('click', this.onModalUnderlayClick);
  }

  onImageCellClick = (e: MouseEvent) => {
    (this.state.modalIsOpen ? this.closeModal : this.openModal)()
  }

  onModalUnderlayClick = (e: MouseEvent) => {
    this.closeModal();
  }

  openModal = () => {
    BodyScroll.lock();
    this.modalWrapperElement.classList.add('is-active')
    this.state.modalIsOpen = true;
  }

  closeModal = () => {
    BodyScroll.unlock();
    this.modalWrapperElement.classList.remove('is-active')
    this.state.modalIsOpen = false;
  }

  static isOnProductPage = () => !!document.querySelector('.product-template')
}