export default class HeaderDrawerUnderlay {
  element: Element;

  constructor() {
    this.element = document.querySelector(".header-drawer-underlay");
  }

  show() {
    this.element.classList.add("is-active");
    this.element.classList.add("animated", "animated--snappy", "fadeIn");

    this.element.addEventListener("animationend",() => {
      console.log('animationend')
      this.element.classList.remove("animated", "fadeIn");
    }, { once: true })
  }
  
  hide() {
    this.element.classList.add("animated", "animated--snappy", "fadeOut");
    
    this.element.addEventListener("animationend",() => {
      this.element.classList.remove("animated", "fadeOut", "is-active");
    }, { once: true })
  }
}
