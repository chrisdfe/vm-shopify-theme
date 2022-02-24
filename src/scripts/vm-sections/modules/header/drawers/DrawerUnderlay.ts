export default class HeaderDrawerUnderlay {
  element: Element;

  constructor() {
    this.element = document.querySelector(".header-drawer-underlay");
  }

  show() {
    this.element.classList.add("is-active");
  }

  hide() {
    this.element.classList.remove("is-active");
  }
}
