import findAndInitialize from "../../utils/findAndInitialize";

export default class HeaderMobile {
  static selector = ".header-mobile";

  // state
  menuIsOpen = false;
  searchIsOpen = false;
  cartIsOpen = false;

  // refs
  headerElement = null;
  menuButtonElement = null;
  searchButtonElement = null;
  cartButtonElement = null;
  megaMenuWrapperElement = null;
  megaMenuAccordionButtons = [];

  megaMenuAccordionMap = {};

  constructor(headerElement) {
    this.headerElement = headerElement;
  }

  initialize() {
    this.menuButtonElement = this.headerElement.querySelector(
      ".js-mobile-hamburger-button"
    );

    this.megaMenuWrapperElement = document.querySelector(
      ".mega-menu-container"
    );

    this.megaMenuAccordionButtons = document.querySelectorAll(
      ".mobile-menu-accordion-button"
    );

    this.cartButtonElement = this.headerElement.querySelector(
      ".js-mobile-cart-button"
    );
    this.searchButtonElement = this.headerElement.querySelector(
      ".js-mobile-search-button"
    );

    this.megaMenuAccordionMap = Array.from(
      this.megaMenuAccordionButtons
    ).reduce((acc, accordionButton) => {
      const accordionId = accordionButton.getAttribute("data-accordion-id");
      const contentElement = document.querySelector(
        `.mobile-menu-accordion-content[data-accordion-id="${accordionId}"]`
      );

      return { ...acc, [accordionId]: contentElement };
    }, {});

    this.menuButtonElement.addEventListener("click", this.toggleMenuOpen);
    this.searchButtonElement.addEventListener("click", this.toggleSearchOpen);
    this.cartButtonElement.addEventListener("click", this.toggleCartOpen);

    this.megaMenuAccordionButtons.forEach((accordionButton) => {
      accordionButton.addEventListener("click", this.onAccordionButtonClick);
    });

    document.body.addEventListener("click", this.onBodyClick);
  }

  unload() {}

  openMenu = () => {
    this.menuIsOpen = true;
    this.menuButtonElement.classList.add("is-open");
    this.megaMenuWrapperElement.classList.add("is-open");
  };

  closeMenu = () => {
    this.menuIsOpen = false;
    this.menuButtonElement.classList.remove("is-open");
    this.megaMenuWrapperElement.classList.remove("is-open");
  };

  toggleMenuOpen = () => {
    this.menuIsOpen ? this.closeMenu() : this.openMenu();
  };

  openSearch = () => {};

  closeSearch = () => {};

  toggleSearchOpen = () => {
    console.log("search toggle");
    this.closeMenu();
  };

  openCart = () => {};

  closeCart = () => {};

  toggleCartOpen = () => {
    this.closeMenu();
  };

  onAccordionButtonClick = (event) => {
    const accordionButton = event.target.closest(
      ".mobile-menu-accordion-button"
    );
    const accordionId = accordionButton.getAttribute("data-accordion-id");
    const contentElement = this.megaMenuAccordionMap[accordionId];
    accordionButton.classList.toggle("is-open");
    contentElement.classList.toggle("is-open");
  };

  onBodyClick = (event) => {
    if (this.menuIsOpen) {
      if (
        !event.target.closest(".mega-menu-container") &&
        !event.target.closest(".js-mobile-hamburger-button")
      ) {
        this.closeMenu();
      }
    }
  };

  static findAndInitialize() {
    return findAndInitialize(HeaderMobile);
  }
}
