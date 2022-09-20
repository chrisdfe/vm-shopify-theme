type ProductVariant = {
  id: string;
  available: boolean;
  options: string[];
  price: number;
};

type ProductData = {
  variants: ProductVariant[];
  options: string[];
};

const ATTRIBUTES = {
  productOptionIndex: 'data-option-index',
  productOption: 'data-option',
  productData: 'data-product'
};

const SELECTORS = {
  ID_INPUT_ELEMENT: 'select[name="id"], input[name="id"]',
  PRODUCT_OPTION: `[${ATTRIBUTES.productOption}]`,
  ADD_TO_CART_BUTTON: '.button.add_to_cart',
  CURRENT_PRICE: '.current_price',
  WAS_PRICE: '.current_price',
  SALE_SAVINGS: '.current_price',
};

type ElementsMap = {
  idInputElement: HTMLSelectElement | HTMLInputElement,
  productOptions: HTMLElement[],
  addToCartButton: HTMLElement,
  currentPrice: HTMLElement,
  wasPrice: HTMLElement,
  saleSavings: HTMLElement,
};

export default class ProductForm {
  productData: ProductData;
  moneyFormat: string;

  elements: ElementsMap;

  currentSelectedVariant: ProductVariant;
  currentSelectedOptions: string[];

  initialize = () => {
    this.productData = this.getProductData();
    this.moneyFormat = document.body.getAttribute('data-money-format');

    this.elements = {
      idInputElement: document.querySelector(SELECTORS.ID_INPUT_ELEMENT),
      productOptions: Array.from(document.querySelectorAll('[data-option]')),
      addToCartButton: document.querySelector(SELECTORS.ADD_TO_CART_BUTTON),
      currentPrice: document.querySelector(SELECTORS.CURRENT_PRICE),
      wasPrice: document.querySelector(SELECTORS.WAS_PRICE),
      saleSavings: document.querySelector(SELECTORS.SALE_SAVINGS),
    };

    this.currentSelectedOptions = this.elements.productOptions.map((element) =>
      element.querySelector('input').value
    );

    this.setCurrentSelectedVariant();

    // add event listeners
    this.elements.productOptions.forEach((element) => {
      element.addEventListener('change', this.onProductOptionChange);
    });

    return this;
  };

  unload = () => {
    // remove event listeners
    this.elements.productOptions.forEach((element) => {
      element.removeEventListener('change', this.onProductOptionChange);
    });
  };

  private getProductData = (): ProductData => {
    const productDataElement = document.querySelector('[data-product]');
    const productDataAsString = productDataElement.getAttribute('data-product');
    return JSON.parse(productDataAsString) as ProductData;
  };

  private onProductOptionChange = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    const { value } = target;

    // Update selected variant
    const productOptionElement = target.closest(SELECTORS.PRODUCT_OPTION);
    const optionIndexAsString = productOptionElement.getAttribute(ATTRIBUTES.productOptionIndex);
    const optionIndex = parseInt(optionIndexAsString, 10);

    this.currentSelectedOptions[optionIndex] = value;

    this.setCurrentSelectedVariant();

    // for whatever reason shopify requires this [name='id'] input, otherwise
    // adding this product to the cart fails.
    this.elements.idInputElement.value = this.currentSelectedVariant.id;
    console.log('setting value to: ', this.elements.idInputElement.value);

    // Update available/unavailable text
    const variantIsAvailable = this.currentSelectedVariant?.available === true;

    if (variantIsAvailable) {
      this.elements.addToCartButton.removeAttribute('disabled');
      this.elements.addToCartButton.innerText = Shopify.translation.add_to_cart;
    } else {
      this.elements.addToCartButton.setAttribute('disabled', 'disabled');
      this.elements.addToCartButton.innerText = Shopify.translation.unavailable_text;
    }

    // update text
    this.elements.currentPrice.innerHTML =
      Shopify.formatMoney(this.currentSelectedVariant.price, this.moneyFormat);

    this.elements.productOptions.forEach((productOptionElement, otherOptionIndex) => {
      productOptionElement.querySelectorAll('input').forEach((inputElement: HTMLInputElement) => {
        const optionValue = inputElement.value;
        const fullVariantOptionValue = [...this.currentSelectedOptions].map((otherOptionValue, index) => {
          if (index === otherOptionIndex) {
            return optionValue;
          }

          return otherOptionValue;
        });

        const variantForOption = this.findVariantByOption(fullVariantOptionValue);

        if (!variantForOption?.available) {
          // TODO: not this
          inputElement.disabled = true;
          inputElement.closest('.vm-select-button').classList.add('vm-select-button--soldout');
        } else {
          inputElement.disabled = false;
          inputElement.closest('.vm-select-button').classList.remove('vm-select-button--soldout');
        }
      });
    });
  };

  private findVariantByOption = (optionValues: string[]) =>
    this.productData.variants.find(variant => {
      for (const option of optionValues) {
        if (!variant.options.includes(option)) {
          return false;
        }
      }

      return true;
    });

  private setCurrentSelectedVariant = () => {
    this.currentSelectedVariant = this.findVariantByOption(this.currentSelectedOptions);
  };

  static shouldInitialize = () => {
    return document.querySelector(`[${ATTRIBUTES.productData}]`) != null;
  };
};