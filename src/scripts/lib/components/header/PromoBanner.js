import findAndInitialize from "../../utils/findAndInitialize";

export default class PromoBanner {
  static selector = ".promo-banner";

  element = null;

  constructor(element) {
    this.element = element;
  }

  initialize() {
    if (Cookies.get("promo-banner") === "dismiss") {
      return;
    }

    // this.closeButtons =

    $("body").addClass("promo-banner-show");

    document
      .querySelectorAll(".js-promo-banner-close")
      .forEach((closeButton) => {
        closeButton.addEventListener("click", () => {
          $("body").removeClass("promo-banner-show");
          Cookies.set("promo-banner", "dismiss", { expires: 30 });
        });
      });
  }

  static findAndInitialize() {
    return findAndInitialize(PromoBanner);
  }
}
