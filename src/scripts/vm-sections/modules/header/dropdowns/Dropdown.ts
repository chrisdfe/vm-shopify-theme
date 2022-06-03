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

      element.addEventListener("mouseover", this.onDropdownButtonMouseOverInternal);
      element.addEventListener("click", this.onDropdownButtonClickInternal);
    });

    return this;
  };

  unload() {
    this.buttonElements.forEach((element) => {
      element.classList.remove("is-dropdown-button");

      element.removeEventListener("mouseover", this.onDropdownButtonMouseOverInternal);
      element.removeEventListener("click", this.onDropdownButtonClickInternal);
    });
  }

  open = () => {
    this.isOpen = true;
    this.buttonElements.forEach(buttonElement => {
      buttonElement.classList.add(ACTIVE_BUTTON_CLASSNAME);
    })

    this.dropdownElement.classList.add(OPEN_CLASSNAME)
  };

  close = () => {
    this.isOpen = false;
    this.buttonElements.forEach(buttonElement => {
      buttonElement.classList.remove(ACTIVE_BUTTON_CLASSNAME);
    })

    this.dropdownElement.classList.remove(OPEN_CLASSNAME);
  };

  toggle = (shouldOpen: boolean) => {
    shouldOpen ? this.open() : this.close();
  };

  private onDropdownButtonMouseOverInternal = (event) => {
    this.onDropdownButtonMouseOver(event, this);
  }

  private onDropdownButtonClickInternal = (event) => {
    this.onDropdownButtonClick(event, this);
  }
}
