const ATTRIBUTES = {
  productOptionIndex: 'data-option-index',
  productOption: 'data-option',
};

const SELECTORS = {
  productOptionElement: `[${ATTRIBUTES.productOption}]`
};

export default class ProductVariants {
  productData: any;
  currentSelectedVariant: any;

  productOptionElements: HTMLElement[];
  currentSelectedOptions: string[];

  initialize = () => {
    const productDataElement = document.querySelector('[data-product]');
    const productDataAsString = productDataElement.getAttribute('data-product');
    this.productData = JSON.parse(productDataAsString);
    console.log(this.productData);

    this.currentSelectedOptions = new Array(this.productData.options.length);

    this.productOptionElements = Array.from(document.querySelectorAll('[data-option]'));
    this.productOptionElements.forEach((element, elementIndex) => {
      const input = element.querySelector('input');
      console.log('input', input.value);
      this.currentSelectedOptions[elementIndex] = input.value;

      element.addEventListener('change', this.onProductOptionChange);
    });

    console.log('this.currentSelectedOptions', this.currentSelectedOptions);
    this.setCurrentSelectedVariant();
    console.log('this.currentSelectedVariant', this.currentSelectedVariant);

    return this;
  };

  unload = () => { };

  private onProductOptionChange = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;

    const { value } = target;
    const productOptionElement = target.closest(SELECTORS.productOptionElement);
    const optionIndexAsString = productOptionElement.getAttribute(ATTRIBUTES.productOptionIndex);
    const optionIndex = parseInt(optionIndexAsString, 10);


    this.currentSelectedOptions[optionIndex] = value;

    this.setCurrentSelectedVariant();
    const variantIsAvailable = this.currentSelectedVariant?.available === true;
  };

  private setCurrentSelectedVariant = () => {
    this.currentSelectedVariant = this.productData.variants.find(variant => {
      for (const option of this.currentSelectedOptions) {
        if (!variant.options.includes(option)) {
          return false;
        }
      }
      return true;
    });
  };
};