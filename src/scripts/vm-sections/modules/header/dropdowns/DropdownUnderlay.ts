export default class HeaderDropdownUnderlay {
  element: Element;

  constructor() {
    this.element = document.querySelector(".header-dropdown-underlay");
  }

  show() {
    this.element.classList.add("is-active");
  }

  hide() {
    this.element.classList.remove("is-active");
  }
}
