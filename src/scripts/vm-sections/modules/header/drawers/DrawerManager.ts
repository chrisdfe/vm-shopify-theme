import debounce from "../../../utils/debounce";

import BodyScroll from "../modules/BodyScroll";
import DrawerUnderlay from "./DrawerUnderlay";

import HeaderDrawer from "./Drawer";

interface Props {
  onDrawerOpen: (drawer: HeaderDrawer) => void;
}

export default class HeaderDrawerManager {
  drawerElements: NodeListOf<Element>;

  currentOpenDrawerId: string | null;
  drawerIdMap: { [drawerId: string]: HeaderDrawer };

  drawerUnderlay: DrawerUnderlay;

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

    this.drawerUnderlay = new DrawerUnderlay();

    document.body.addEventListener("click", this.onBodyClick);
    window.addEventListener("resize", this.onWindowResize);

    return this;
  }

  private onDrawerButtonClick = (event: Event, drawer: HeaderDrawer) => {
    event.preventDefault();

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

  private onBodyClick = (event: Event) => {
    if (
      this.getCurrentOpenDrawer() &&
      event.target instanceof Element &&
      event.target.closest("[data-drawer-id]") === null &&
      event.target.closest("[data-drawer-button-id]") === null
    ) {
      this.closeDrawer(this.getCurrentOpenDrawer());
    }
  };

  private onWindowResize = debounce(() => {
    const currentOpenDrawer = this.getCurrentOpenDrawer();
    if (currentOpenDrawer) {
      this.closeDrawer(currentOpenDrawer);
    }
  }, 100);

  getCurrentOpenDrawer = () => {
    if (!this.currentOpenDrawerId) {
      return null;
    }

    return this.drawerIdMap[this.currentOpenDrawerId];
  };

  closeCurrentOpenDrawer = () => {
    const currentOpenDrawer = this.getCurrentOpenDrawer();

    if (currentOpenDrawer) {
      this.closeDrawer(currentOpenDrawer);
    }
  };

  openDrawer = (drawer: HeaderDrawer) => {
    drawer.open();
    this.currentOpenDrawerId = drawer.id;

    BodyScroll.lock();
    this.drawerUnderlay.show();
  };

  closeDrawer = (drawer: HeaderDrawer) => {
    drawer.close();
    this.currentOpenDrawerId = null;

    BodyScroll.unlock();
    this.drawerUnderlay.hide();
  };
}
