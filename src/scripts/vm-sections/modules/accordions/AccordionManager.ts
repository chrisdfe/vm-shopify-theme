import Accordion from "./Accordion";

export default class AccordionManager {
  accordionElements: Element[];
  accordionMap: { [id: string]: Accordion };

  constructor() {}

  initialize = (): AccordionManager => {
    this.accordionElements = Array.from(
      document.querySelectorAll(".vm-accordion-content")
    );

    console.log("this.accordionElements", this.accordionElements.length);

    this.accordionMap = this.accordionElements.reduce((acc, contentElement) => {
      const accordionId = contentElement.getAttribute("data-accordion-id");
      const accordion = new Accordion({ contentElement }).initialize();

      return { ...acc, [accordionId]: accordion };
    }, {});

    return this;
  };
}
