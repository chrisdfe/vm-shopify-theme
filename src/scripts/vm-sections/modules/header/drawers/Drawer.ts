import debounce from "../../../utils/debounce";

const getElementHeight = (element: Element) =>
  element.getBoundingClientRect().height;

const getHeaderHeight = () => {
  const promoBanner = document.querySelector(".promo-banner");
  const headerDesktop = document.querySelector(".header-desktop");
  const headerMobile = document.querySelector(".header-mobile");

  return (
    getElementHeight(promoBanner) +
    getElementHeight(headerDesktop) +
    getElementHeight(headerMobile)
  );
};

export default class HeaderDrawer {
  isOpen = false;

  id: string;
  buttonElements: Element[];
  drawerElement: Element;

  onButtonClick: (event: Event, drawer: HeaderDrawer) => void;

  constructor({ drawerElement, onButtonClick }) {
    this.drawerElement = drawerElement;
    this.onButtonClick = onButtonClick;
  }

  initialize() {
    this.id = this.drawerElement.getAttribute("data-drawer-id");

    this.buttonElements = Array.from(
      document.querySelectorAll(`[data-drawer-button-id="${this.id}"]`)
    );

    this.buttonElements.forEach((element) => {
      element.addEventListener("click", (event: Event) => {
        this.onButtonClick(event, this);
      });
    });

    console.log("test");

    return this;
  }

  unload = () => {};

  open = () => {
    this.toggle(true);
  };

  close = () => {
    this.toggle(false);
  };

  toggle = (isOpen) => {
    this.isOpen = isOpen;
    this.drawerElement.classList.toggle("is-open", isOpen);
    this.buttonElements.forEach((element) => {
      element.classList.toggle("is-open", isOpen);
    });
  };
}
