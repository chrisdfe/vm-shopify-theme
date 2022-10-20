export default class PromoBanner {
  closeButtonElements: HTMLElement[];

  constructor() {
    // this.element = document.querySelector(".promo-banner");
  }

  initialize() {
    // @ts-ignore TODO - switch to npm library instead
    if (Cookies.get("promo-banner") === "dismiss") {
      return;
    }

    this.showPromoBanner();

    this.closeButtonElements = Array.from(document.querySelectorAll(".js-promo-banner-close"));
    this.closeButtonElements.forEach((closeButton) => {
      closeButton.addEventListener("click", this.hidePromoBanner);
    });

    return this;
  }

  unload() {
    this.closeButtonElements.forEach((closeButton) => {
      closeButton.removeEventListener("click", this.hidePromoBanner);
    });
  }

  reset() {
    this.unload();
    this.initialize();
  }

  showPromoBanner = () => {
    document.body.classList.add("promo-banner-show");

    window.dispatchEvent(new Event('header:resize'));
  };

  hidePromoBanner = () => {
    document.body.classList.remove("promo-banner-show");
    // @ts-ignore TODO - switch to npm library instead
    Cookies.set("promo-banner", "dismiss", { expires: 30 });
    window.dispatchEvent(new Event('header:resize'));
  };
}
