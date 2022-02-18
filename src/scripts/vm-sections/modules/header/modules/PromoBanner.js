export default class PromoBanner {
  constructor() {
    this.element = document.querySelector(".promo-banner");
  }

  initialize() {
    if (Cookies.get("promo-banner") === "dismiss") {
      return;
    }

    document.body.classList.add("promo-banner-show");

    document
      .querySelectorAll(".js-promo-banner-close")
      .forEach((closeButton) => {
        closeButton.addEventListener("click", () => {
          document.body.classList.remove("promo-banner-show");
          Cookies.set("promo-banner", "dismiss", { expires: 30 });
        });
      });
  }
}
