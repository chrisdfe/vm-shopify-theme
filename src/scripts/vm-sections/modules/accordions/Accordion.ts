interface Props {
  contentElement: Element;
}

const OPEN_CLASSNAME = "is-open";

export default class Accordion {
  id: string;
  isOpen: boolean = false;

  buttonElements: Element[];
  contentElement: Element;

  constructor({ contentElement }: Props) {
    this.contentElement = contentElement;
  }

  initialize = (): Accordion => {
    this.id = this.contentElement.getAttribute("data-accordion-id");

    this.buttonElements = Array.from(
      document.querySelectorAll(`[data-accordion-button-id=${this.id}]`)
    );

    this.buttonElements.forEach((buttonElement) => {
      buttonElement.addEventListener("click", this.onButtonClick);
    });

    return this;
  };

  onButtonClick = () => {
    console.log("clickity click");
    this.toggle(!this.isOpen);
  };

  open = () => {
    this.isOpen = true;
    this.contentElement.classList.add(OPEN_CLASSNAME);
    this.buttonElements.forEach((buttonElement) => {
      buttonElement.classList.add(OPEN_CLASSNAME);
    });
  };

  close = () => {
    this.isOpen = false;
    this.contentElement.classList.remove(OPEN_CLASSNAME);
    this.buttonElements.forEach((buttonElement) => {
      buttonElement.classList.remove(OPEN_CLASSNAME);
    });
  };

  toggle = (shouldOpen: boolean) => {
    shouldOpen ? this.open() : this.close();
  };
}
