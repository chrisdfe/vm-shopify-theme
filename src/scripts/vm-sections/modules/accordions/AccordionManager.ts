import Accordion from "./Accordion";

export default class AccordionManager {
  accordionElements: HTMLElement[];
  accordionMap: { [id: string]: Accordion };

  constructor() {}

  initialize = (): AccordionManager => {
    this.accordionElements = Array.from(
      document.querySelectorAll(".vm-accordion-content")
    );

    this.accordionMap = this.accordionElements.reduce((acc, contentElement) => {
      const accordionId = contentElement.getAttribute("data-accordion-id");
      const accordion = new Accordion({ contentElement }).initialize();

      return { ...acc, [accordionId]: accordion };
    }, {});

    return this;
  };
}
