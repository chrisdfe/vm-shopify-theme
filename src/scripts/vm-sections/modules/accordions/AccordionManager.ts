import Accordion from "./Accordion";
import AccordionGroup from "./AccordionGroup";

type AccordionGroupMap = {
  [id: string]: AccordionGroup
};

export default class AccordionManager {
  accordionElements: HTMLElement[];

  accordionGroupMap: AccordionGroupMap = {
    default: new AccordionGroup('default', { singleAccordionOpenOnly: false })
  };

  initialize = (): AccordionManager => {
    this.accordionElements = Array.from(
      document.querySelectorAll(".vm-accordion-content")
    );

    this.accordionGroupMap = {};
    this.accordionElements.forEach((contentElement) => {
      // Determine which accordion group this belongs to
      let accordionGroupId = contentElement.getAttribute("data-accordion-group-id");
      if (!accordionGroupId) {
        accordionGroupId = 'default';
        contentElement.setAttribute("data-accordion-group-id", 'default');
      }

      // Create accordion and add it to group
      const accordion = new Accordion({ contentElement }).initialize();

      let accordionGroup = this.accordionGroupMap[accordionGroupId];
      if (!accordionGroup) {
        // Create new accordion group
        accordionGroup = new AccordionGroup(accordionGroupId).initialize();
        this.accordionGroupMap[accordionGroupId] = accordionGroup
      }
      accordionGroup.addAccordion(accordion);
    });

    return this;
  };
}
