const OPEN_CLASSNAME = "is-active";

export default class HeaderDropdown {
  isOpen = false;

  id: string;
  dropdownElement: Element;
  buttonElements: Element[];

  constructor(element: Element) {
    this.dropdownElement = element;
  }

  initialize = () => {
    this.id = this.dropdownElement.getAttribute("data-dropdown");

    this.buttonElements = Array.from(
      document.querySelectorAll(`[data-dropdown-rel="${this.id}"]`)
    );

    console.log("this.buttonElements", this.id);
    console.log("this.buttonElements", this.buttonElements.length);

    this.buttonElements.forEach((element) => {
      element.classList.add("is-dropdown-button");

      element.addEventListener("click", (event) => {
        this.onButtonElementClick(event, element);
      });
    });

    return this;
  };

  onButtonElementClick = (event, element) => {
    event.preventDefault();
    console.log("click", this.id);
    this.toggle(!this.isOpen);
  };

  unload() {}

  open = () => {
    this.isOpen = true;
    this.dropdownElement.classList.add(OPEN_CLASSNAME);
  };

  close = () => {
    this.isOpen = false;
    this.dropdownElement.classList.remove(OPEN_CLASSNAME);
  };

  toggle = (isOpen) => {
    this.isOpen = isOpen;
    this.dropdownElement.classList.toggle(OPEN_CLASSNAME, isOpen);
  };
}
