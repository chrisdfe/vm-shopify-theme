export default class HeaderDrawer {
  isOpen = false;

  id: string;
  buttonElements: Element[];
  drawerElement: Element;

  onButtonClick: (Drawer) => void;

  constructor({ drawerElement, onButtonClick }) {
    this.drawerElement = drawerElement;
    this.onButtonClick = onButtonClick;
  }

  initialize() {
    this.id = this.drawerElement.getAttribute("data-drawer-id");
    console.log("this.id", this.id);

    this.buttonElements = Array.from(
      document.querySelectorAll(`[data-drawer-button-id="${this.id}"]`)
    );
    console.log("this.buttonElement", this.buttonElements.length);

    this.buttonElements.forEach((element) => {
      element.addEventListener("click", () => {
        this.onButtonClick(this);
      });
    });

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
