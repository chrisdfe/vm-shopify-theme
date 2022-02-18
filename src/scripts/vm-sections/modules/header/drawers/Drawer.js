export default class HeaderDrawer {
  isOpen = false;

  id = null;
  buttonElement = null;
  drawerElement = null;
  onButtonClick = null;

  constructor({ id, buttonElement, drawerElement, onButtonClick }) {
    this.id = id;
    this.buttonElement = buttonElement;
    this.drawerElement = drawerElement;
    this.onButtonClick = onButtonClick;
  }

  initialize() {
    this.buttonElement.addEventListener("click", () => {
      this.onButtonClick(this);
    });

    return this;
  }

  unload() {}

  open = () => {
    this.setOpen(true);
  };

  close = () => {
    this.setOpen(false);
  };

  setOpen = (isOpen) => {
    this.isOpen = isOpen;
    this.drawerElement.classList.toggle("is-open", isOpen);
    this.buttonElement.classList.toggle("is-open", isOpen);
  };
}
