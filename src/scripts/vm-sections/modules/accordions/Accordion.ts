type AccordionEventHandler = (accordion: Accordion) => void;

interface Props {
  contentElement: HTMLElement;
  onOpen?: AccordionEventHandler,
  onClose?: AccordionEventHandler,
}

const OPEN_CLASSNAME = "is-open";
const IS_ANIMATED_CLASSNAME = 'is-animated';

export default class Accordion {
  id: string;
  groupId: string;

  isOpen: boolean = false;

  buttonElements: HTMLElement[];
  contentElement: HTMLElement;

  onOpen: AccordionEventHandler = () => { };
  onClose: AccordionEventHandler = () => { };

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

    const defaultOpenState = this.contentElement.getAttribute("data-accordion-is-open");
    this.toggle(defaultOpenState === 'true');

    return this;
  };

  onButtonClick = () => {
    this.toggle(!this.isOpen);
  };

  getGroupId = () => {
    let accordionGroupId = this.contentElement.getAttribute("data-accordion-group-id");

    if (!accordionGroupId) {
      accordionGroupId = 'default';
      this.contentElement.setAttribute("data-accordion-group-id", 'default');
    }

    return accordionGroupId;
  };

  open = () => {
    this.isOpen = true;
    this.contentElement.classList.add(OPEN_CLASSNAME);
    this.buttonElements.forEach((buttonElement) => {
      buttonElement.classList.add(OPEN_CLASSNAME);
    });

    this.onOpen(this);

    // slideDown-style animation
    this.contentElement.style.height = "auto";
    const height = this.contentElement.clientHeight + "px";
    this.contentElement.style.height = "0";
    setTimeout(() => {
      this.contentElement.style.height = height;
    }, 0);
  };

  close = () => {
    this.isOpen = false;
    this.buttonElements.forEach((buttonElement) => {
      buttonElement.classList.remove(OPEN_CLASSNAME);
    });

    this.onClose(this);

    // slideDown-style animation
    this.contentElement.style.height = "0";
    this.contentElement.addEventListener(
      "transitionend",
      () => {
        // Check this.isOpen to avoid animation weirdness if the button
        // is clicked on before the transition ends
        if (!this.isOpen) {
          this.contentElement.classList.remove(OPEN_CLASSNAME);
        }
      },
      {
        once: true,
      }
    );
  };

  toggle = (shouldOpen: boolean) => {
    shouldOpen ? this.open() : this.close();
  };
}
