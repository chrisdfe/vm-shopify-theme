import findAndInitialize from "../../utils/findAndInitialize";

const BodyScroll = {
  lock: () => {
    document.body.classList.add("menu-is-open");
  },

  unlock: () => {
    document.body.classList.remove("menu-is-open");
  },
};

class MegaMenuModule {
  isOpen = false;
}

class SearchModule {
  isOpen = false;
}

class CartModule {
  static buttonSelector = "";
  static moduleSelector = "";

  isOpen = false;

  headerElement = null;

  cartButtonElement = null;
  cartModuleElement = null;

  constructor({ headerElement, onOpen }) {
    this.headerElement = headerElement;
    this.onOpen = onOpen;

    this.cartButtonElement = this.headerElement.querySelector(
      ".js-mobile-cart-button"
    );

    this.cartModuleElement = document.querySelector(".header__cart-module");

    this.cartButtonElement.addEventListener("click", this.onButtonClick);
  }

  onButtonClick = () => {
    this.isOpen ? this.close() : this.open();
    this.onOpen();
  };

  open = () => {
    this.isOpen = true;
    this.cartModuleElement.classList.add("is-open");
    BodyScroll.lock();
  };

  close = () => {
    this.isOpen = false;
    this.cartModuleElement.classList.remove("is-open");
    BodyScroll.unlock();
  };
}

export default class HeaderMobile {
  static selector = ".header-mobile";

  // state
  menuIsOpen = false;
  searchIsOpen = false;

  // refs
  headerElement = null;
  menuButtonElement = null;
  searchButtonElement = null;
  cartButtonElement = null;
  cartModuleElement = null;
  megaMenuWrapperElement = null;
  megaMenuAccordionButtons = [];

  megaMenuAccordionMap = {};

  constructor(headerElement) {
    this.headerElement = headerElement;
  }

  initialize() {
    this.cartModule = new CartModule({
      headerElement: this.headerElement,
      onOpen: this.onCartOpen,
    });

    this.menuButtonElement = this.headerElement.querySelector(
      ".js-mobile-hamburger-button"
    );

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

    this.menuButtonElement.addEventListener("click", this.toggleMenuOpen);
    this.searchButtonElement.addEventListener(
      "click",
      this.onSearchButtonClick
    );

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
    console.log("on click");

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
        event.preventDefault();
        event.stopPropagation();
      }
    }

    if (this.cartIsOpen) {
      if (
        !event.target.closest(".js-mobile-cart-button") &&
        !event.target.closest(".header__cart-module")
      ) {
        this.cartModule.close();
        event.preventDefault();
        event.stopPropagation();
      }
    }
  };

  static findAndInitialize() {
    return findAndInitialize(HeaderMobile);
  }
}
