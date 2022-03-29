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

    return this;
  }

  unload = () => { };

  open = () => {
    this.isOpen = true;
    this.drawerElement.classList.add("is-active");
    setTimeout(() => {
      this.drawerElement.classList.add("is-open");
      this.buttonElements.forEach((element) => {
        element.classList.add("is-open");
      });
    })
  };

  close = () => {
    this.isOpen = false;
    this.drawerElement.classList.remove("is-open");
    this.buttonElements.forEach((element) => {
      element.classList.remove("is-open");
    });
    this.drawerElement.addEventListener('transitionend', () => {
      this.drawerElement.classList.remove("is-active");
    }, { once: true });
  };
}
