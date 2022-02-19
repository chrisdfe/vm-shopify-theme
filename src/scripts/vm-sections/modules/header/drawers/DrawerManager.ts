import HeaderDrawer from "./Drawer";
import BodyScroll from "./BodyScroll";

export default class HeaderDrawerManager {
  drawerElements: NodeListOf<Element>;

  currentOpenDrawerId: string | null;
  drawerIdMap: { [drawerId: string]: HeaderDrawer };

  initialize() {
    this.drawerElements = document.querySelectorAll("[data-drawer-id]");

    this.drawerIdMap = Array.from(this.drawerElements).reduce(
      (acc, drawerElement) => {
        const drawer = new HeaderDrawer({
          drawerElement,
          onButtonClick: this.onDrawerButtonClick,
        }).initialize();

        return { ...acc, [drawer.id]: drawer };
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
      this.getCurrentOpenDrawer() &&
      event.target.closest("[data-drawer-id]") === null &&
      event.target.closest("[data-drawer-button-id]") === null
    ) {
      this.closeDrawer(this.getCurrentOpenDrawer());
    }
  };

  getCurrentOpenDrawer() {
    if (!this.currentOpenDrawerId) {
      return null;
    }

    console.log("this.currentOpenDrawerId", this.currentOpenDrawerId);

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
