import findAndInitialize from "../../utils/findAndInitialize";

class CartModule {
  static buttonSelector = "";
  static moduleSelector = "";

  isOpen = false;

  headerElement = null;

  cartButtonElement = null;
  cartModuleElement = null;

  constructor({ headerElement, onOpen }) {
    this.headerElement = headerElement;
  }
}

export default class HeaderMobile {
  static selector = ".header-mobile";

  // refs
  headerElement = null;
  cartModuleElement = null;

  megaMenuWrapperElement = null;
  megaMenuAccordionButtons = [];
  megaMenuAccordionMap = {};

  constructor(headerElement) {
    this.headerElement = headerElement;
  }

  initialize() {
    // this.cartModule = new CartModule({
    //   headerElement: this.headerElement,
    //   onOpen: this.onCartOpen,
    // });

    this.megaMenuWrapperElement = document.querySelector(
      ".mega-menu-container"
    );

    this.megaMenuAccordionButtons = document.querySelectorAll(
      ".mobile-menu-accordion-button"
    );

    this.searchButtonElement = this.headerElement.querySelector(
      ".js-mobile-search-button"
    );

    this.cartButtonElement = this.headerElement.querySelector(
      ".js-mobile-cart-button"
    );

    this.cartModuleElement = document.querySelector(".header__cart-module");

    this.megaMenuAccordionMap = Array.from(
      this.megaMenuAccordionButtons
    ).reduce((acc, accordionButton) => {
      const accordionId = accordionButton.getAttribute("data-accordion-id");
      const contentElement = document.querySelector(
        `.mobile-menu-accordion-content[data-accordion-id="${accordionId}"]`
      );

      return { ...acc, [accordionId]: contentElement };
    }, {});

    // this.menuButtonElement.addEventListener("click", this.toggleMenuOpen);
    // this.searchButtonElement.addEventListener(
    //   "click",
    //   this.onSearchButtonClick
    // );

    this.megaMenuAccordionButtons.forEach((accordionButton) => {
      accordionButton.addEventListener("click", this.onAccordionButtonClick);
    });

    // document.body.addEventListener("click", this.onBodyClick);
  }

  unload() {}

  openMenu = () => {
    this.menuIsOpen = true;
    this.menuButtonElement.classList.add("is-open");
    this.megaMenuWrapperElement.classList.add("is-open");
    this.lockBodyScroll();
  };

  closeMenu = () => {
    this.menuIsOpen = false;
    this.menuButtonElement.classList.remove("is-open");
    this.megaMenuWrapperElement.classList.remove("is-open");
    this.unlockBodyScroll();
  };

  toggleMenuOpen = () => {
    this.closeCart();

    this.menuIsOpen ? this.closeMenu() : this.openMenu();
  };

  openSearch = () => {};

  closeSearch = () => {};

  onSearchButtonClick = () => {};

  toggleSearchOpen = () => {
    this.closeMenu();
    this.cartModule.close();
  };

  onCartOpen = () => {
    console.log("oncartopen");
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

  static findAndInitialize() {
    return findAndInitialize(HeaderMobile);
  }
}
