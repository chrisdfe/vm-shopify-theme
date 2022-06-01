const ACTIVE_BUTTON_CLASSNAME = "is-active";
const OPEN_CLASSNAME = "is-open";

type HeaderDropdownCallback = (event: Event, dropdown: HeaderDropdown) => void;

interface Props {
  dropdownElement: HTMLElement;

  onDropdownButtonMouseOver: HeaderDropdownCallback;
  onDropdownButtonClick: HeaderDropdownCallback;
}

type DropdownActivationType = "click" | "hover" | null;

export default class HeaderDropdown {
  id: string;
  activationType: DropdownActivationType;

  isOpen = false;

  dropdownElement: HTMLElement;
  buttonElements: HTMLElement[];

  onDropdownButtonMouseOver: HeaderDropdownCallback;
  onDropdownButtonClick: HeaderDropdownCallback;

  constructor({
    dropdownElement,
    onDropdownButtonMouseOver,
    onDropdownButtonClick,
  }: Props) {
    this.dropdownElement = dropdownElement;

    this.onDropdownButtonMouseOver = onDropdownButtonMouseOver;
    this.onDropdownButtonClick = onDropdownButtonClick;
  }

  initialize = () => {
    this.id = this.dropdownElement.getAttribute("data-dropdown-id");

    this.buttonElements = Array.from(
      document.querySelectorAll(`[data-dropdown-button-id="${this.id}"]`)
    );

    this.activationType = (this.dropdownElement.getAttribute(
      "data-dropdown-activation-type"
    ) || "hover") as DropdownActivationType;

    this.buttonElements.forEach((element) => {
      element.classList.add("is-dropdown-button");

      // if (this.activationType === "hover") {
      element.addEventListener("mouseover", (event) => {
        this.onDropdownButtonMouseOver(event, this);
      });
      // } else {
      element.addEventListener("click", (event) => {
        this.onDropdownButtonClick(event, this);
      });
      // }
    });

    return this;
  };

  open = () => {
    this.isOpen = true;
    this.buttonElements.forEach(buttonElement => {
      buttonElement.classList.add(ACTIVE_BUTTON_CLASSNAME);
    })

    this.dropdownElement.classList.add(OPEN_CLASSNAME)
    // this.dropdownElement.classList.add("animated", "animated--snappy", "fadeInDown");

    // this.dropdownElement.addEventListener("animationend", () => {
    // this.dropdownElement.classList.remove("animated", "animated--snappy", "fadeInDown");
    // }, { once: true });

    // new TransitionTimer(10).start().then(() => {
    //   this.dropdownElement.classList.add(VISIBLE_CLASSNAME);
    // });
  };

  close = () => {
    this.isOpen = false;
    this.buttonElements.forEach(buttonElement => {
      buttonElement.classList.remove(ACTIVE_BUTTON_CLASSNAME);
    })

    this.dropdownElement.classList.remove(OPEN_CLASSNAME);
    // this.dropdownElement.classList.add("animated", "animated--snappy", "fadeOutUp");

    // this.dropdownElement.addEventListener("animationend", () => {
    //   this.dropdownElement.classList.remove("animated", "animated--snappy", "fadeOutUp");
    // }, { once: true })

    // new TransitionTimer(200).start().then(() => {
    //   this.dropdownElement.classList.remove(OPEN_CLASSNAME);
    // });
  };

  toggle = (shouldOpen: boolean) => {
    shouldOpen ? this.open() : this.close();
  };
}
