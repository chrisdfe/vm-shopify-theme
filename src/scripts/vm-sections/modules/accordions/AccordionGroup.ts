import Accordion from './Accordion';

type AccordionGroupOptions = {
  singleAccordionOpenOnly: boolean;
};

type AccordionGroupState = {
  currentAccordionId: string;
};

type AccordionMap = {
  [id: string]: Accordion;
};

export default class AccordionGroup {
  id: string;

  private options: AccordionGroupOptions = {
    singleAccordionOpenOnly: false
  };

  private state: AccordionGroupState;

  private accordionMap: AccordionMap = {};

  constructor(id: string, options = {}) {
    this.id = id;
    this.options = { ...this.options, ...options };
  }

  initialize() {
    const wrapperElement = document.querySelector(`[data-accordion-group-wrapper="${this.id}"]`);

    if (wrapperElement) {
      // initialize options
      const singleAccordionOpenOnly = wrapperElement.getAttribute('data-accordion-group-option-single-open-only');

      this.options.singleAccordionOpenOnly = singleAccordionOpenOnly === "true";
    }

    return this;
  }

  addAccordion(accordion: Accordion) {
    this.accordionMap[accordion.id] = accordion;
    accordion.onOpen = this.onAccordionOpen;
  }

  private onAccordionOpen = (accordion: Accordion) => {
    if (this.options.singleAccordionOpenOnly) {
      this.closeAllAccordionsExcept(accordion.id);
    }
  };

  private closeAllAccordionsExcept(targetAccordionId: string) {
    Object.keys(this.accordionMap).forEach(accordionId => {
      if (accordionId !== targetAccordionId) {
        const accordion = this.accordionMap[accordionId];
        accordion.close();
      }
    });
  }
}