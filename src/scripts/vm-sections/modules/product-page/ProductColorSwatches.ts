const SELECTORS = {
  SWATCH_FIELD: ".vm-select-buttons.vm-select-buttons--color",
  SELECT_BUTTON: ".vm-select-button",
  COLOR_NAME_TEXT: ".vm-select-buttons__color-name",
};

interface SelectButtonGroup {
  optionIndex: number;
  wrapper: HTMLElement;
  colorNameText: HTMLElement,
  buttons: HTMLElement[];
  inputs: HTMLInputElement[];
}

export default class ProductColorSwatches {
  selectButtonGroups: SelectButtonGroup[];

  initialize() {
    this.selectButtonGroups =
      Array.from(
        document.querySelectorAll(SELECTORS.SWATCH_FIELD)
      ).map((wrapper: HTMLElement) => {
        const optionIndexAsString = wrapper.getAttribute('data-option-index');
        const optionIndex = parseInt(optionIndexAsString);

        const colorNameText = wrapper.querySelector(SELECTORS.COLOR_NAME_TEXT) as HTMLElement;

        const buttons = Array.from(wrapper.querySelectorAll(SELECTORS.SELECT_BUTTON)) as HTMLElement[];
        const inputs = buttons.map(buttonElement => buttonElement.querySelector('input'));

        buttons.forEach(buttonElement => {
          buttonElement.addEventListener('mouseout', (e) => {
            const selectedValue = this.getSelectedValue(inputs);
            colorNameText.innerText = selectedValue;
          });

          buttonElement.addEventListener('mouseover', (e) => {
            const element = (e.target as HTMLElement).closest(SELECTORS.SELECT_BUTTON);
            const inputElement = element.querySelector('input');
            const value = inputElement.getAttribute('value');
            colorNameText.innerText = value;
          });
        });

        return {
          optionIndex,
          wrapper,
          colorNameText,
          buttons,
          inputs
        };
      });

    return this;
  }

  private getSelectedValue = (inputs: HTMLInputElement[]) => {
    const checkedInput = inputs.find(input => input.checked);
    return checkedInput ? checkedInput.value : '';
  };
}