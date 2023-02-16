const ATTRIBUTES = {
  GROUP_ID: 'data-vm-tab-group-id',
  TAB_ID: 'data-vm-tab-id',
};

const SELECTORS = {
  TABS_WRAPPER: '.vm-product-tabs-wrapper',
  TAB_BUTTON: '.vm-product-tab-button',
  TAB_CONTENT: '.vm-product-tab-content',
};

const IS_ACTIVE_CLASSNAME = 'is-active';

type ProductTabGroup = {
  groupId: string;
  tabButtonWrapperElement: HTMLElement;
  tabButtonElements: HTMLElement[];
  tabContentElements: HTMLElement[];
};

type State = {
  activeTabMap: {
    [groupId: string]: string;
  };
};

export default class ProductTabs {
  state: State = {
    activeTabMap: {}
  };

  productTabGroups: ProductTabGroup[];

  initialize = () => {
    const allContentElements = Array.from(document.querySelectorAll(SELECTORS.TAB_CONTENT));

    this.productTabGroups =
      Array.from(document.querySelectorAll(SELECTORS.TABS_WRAPPER))
        .map(element => {
          const groupId = element.getAttribute(ATTRIBUTES.GROUP_ID);
          console.log('groupId', groupId);

          const tabButtonElements = Array.from(element.querySelectorAll(SELECTORS.TAB_BUTTON)).map(element => element as HTMLElement);

          tabButtonElements.forEach(element => {
            element.addEventListener("click", this.onTabButtonClick);
          });

          const tabContentElements = allContentElements.filter(element => element.getAttribute(ATTRIBUTES.GROUP_ID) === groupId).map(element => element as HTMLElement);

          return {
            groupId,
            tabButtonWrapperElement: element as HTMLElement,
            tabButtonElements,
            tabContentElements
          };
        });

    // Set default tab/content
    this.productTabGroups.forEach(({ groupId, tabButtonElements }) => {
      let activeTab = tabButtonElements.find(element => element.classList.contains(IS_ACTIVE_CLASSNAME));

      if (!activeTab) {
        activeTab = tabButtonElements[0];
      }

      const activeTabId = activeTab.getAttribute(ATTRIBUTES.TAB_ID);
      this.state.activeTabMap[groupId] = activeTabId;

      this.setActiveTabContent(groupId);
    });

    return this;
  };

  unload = () => {
    this.productTabGroups.forEach(({ tabButtonElements }) => {
      tabButtonElements.forEach((element) => {
        // unbind event listeners
        element.removeEventListener("click", this.onTabButtonClick);
      });
    });
  };

  onTabButtonClick = (e: MouseEvent) => {
    const buttonElement = e.target as HTMLElement;
    const tabGroup = this.productTabGroups.find(tabGroup => tabGroup.tabButtonElements.includes(buttonElement));

    const { groupId } = tabGroup;

    const tabId = buttonElement.getAttribute(ATTRIBUTES.TAB_ID);
    console.log('switching to: ', tabId);

    this.state.activeTabMap[groupId] = tabId;
    this.setActiveTabContent(groupId);
  };

  private setActiveTabContent = (groupId: string) => {
    const activeTabId = this.state.activeTabMap[groupId];
    const tabGroup = this.productTabGroups.find(tabGroup => tabGroup.groupId === groupId);

    // set active tab
    tabGroup.tabButtonElements.forEach((element) => {
      if (element.getAttribute(ATTRIBUTES.TAB_ID) === activeTabId) {
        element.classList.add(IS_ACTIVE_CLASSNAME);
      } else {
        element.classList.remove(IS_ACTIVE_CLASSNAME);
      }
    });

    // set active content
    tabGroup.tabContentElements.forEach(contentElement => {
      if (contentElement.getAttribute(ATTRIBUTES.TAB_ID) === activeTabId) {
        contentElement.classList.add(IS_ACTIVE_CLASSNAME);
      } else {
        contentElement.classList.remove(IS_ACTIVE_CLASSNAME);
      }
    });
  };
}