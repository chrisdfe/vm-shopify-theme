import HeaderDrawer from "./Drawer";

const BodyScroll = {
  lock: () => {
    document.body.classList.add("menu-is-open");
  },

  unlock: () => {
    document.body.classList.remove("menu-is-open");
  },
};

export default class HeaderDrawerManager {
  drawerButtons = [];

  currentOpenDrawerId = null;
  drawerIdMap = {};

  initialize() {
    this.drawerButtons = document.querySelectorAll("[data-drawer-button-id]");
    this.drawerIdMap = Array.from(this.drawerButtons).reduce(
      (acc, buttonElement) => {
        const id = buttonElement.getAttribute("data-drawer-button-id");
        const drawerElement = document.querySelector(
          `[data-drawer-id="${id}"]`
        );

        const drawer = new HeaderDrawer({
          id,
          buttonElement,
          drawerElement,
          onButtonClick: this.onDrawerButtonClick,
        }).initialize();

        return { ...acc, [id]: drawer };
      },
      {}
    );

    document.body.addEventListener("click", this.onBodyClick);

    return this;
  }

  onDrawerButtonClick = (drawer) => {
    if (this.currentOpenDrawerId) {
      if (drawer.id === this.currentOpenDrawerId) {
        this.closeDrawer(drawer);
      } else {
        this.closeDrawer(this.getCurrentOpenDrawer());
        this.openDrawer(drawer);
      }
    } else {
      this.openDrawer(drawer);
    }
  };

  onBodyClick = (event) => {
    if (
      this.currentOpenDrawerId !== null &&
      event.target.closest("[data-drawer-id]") === null &&
      event.target.closest("[data-drawer-button-id]") === null
    ) {
      this.closeDrawer(this.getCurrentOpenDrawer());
    }
  };

  getCurrentOpenDrawer() {
    return this.drawerIdMap[this.currentOpenDrawerId];
  }

  openDrawer(drawer) {
    drawer.open();
    this.currentOpenDrawerId = drawer.id;
    BodyScroll.lock();
  }

  closeDrawer(drawer) {
    drawer.close();
    this.currentOpenDrawerId = null;
    BodyScroll.unlock();
  }
}
