export default class PromoBanner {
  constructor() {
    // this.element = document.querySelector(".promo-banner");
  }

  initialize() {
    // @ts-ignore TODO - switch to npm library instead
    if (Cookies.get("promo-banner") === "dismiss") {
      return;
    }

    this.showPromoBanner();

    document
      .querySelectorAll(".js-promo-banner-close")
      .forEach((closeButton) => {
        closeButton.addEventListener("click", () => {
          this.hidePromoBanner();
        });
      });

    return this;
  }

  showPromoBanner = () => {
    document.body.classList.add("promo-banner-show");

    window.dispatchEvent(new Event('header:resize'));
  }

  hidePromoBanner = () => {
    document.body.classList.remove("promo-banner-show");
    // @ts-ignore TODO - switch to npm library instead
    Cookies.set("promo-banner", "dismiss", { expires: 30 });
    window.dispatchEvent(new Event('header:resize'));
  }
}
