import findAndInitialize from "../../utils/findAndInitialize";

import PromoBanner from "./PromoBanner";
import HeaderDesktop from "./HeaderDesktop";
import HeaderMobile from "./HeaderMobile";

export default class HeaderWrapper {
  static selector = ".header-wrapper";

  headerWrapperElement = null;

  promoBanner = null;
  headerDesktop = null;
  headerMobile = null;

  constructor(headerWrapperElement) {
    this.headerWrapperElement = headerWrapperElement;
  }

  initialize() {
    this.promoBanner = PromoBanner.findAndInitialize();
    this.headerDesktop = HeaderDesktop.findAndInitialize();
    this.headerMobile = HeaderMobile.findAndInitialize();
  }

  static findAndInitialize() {
    return findAndInitialize(HeaderWrapper);
  }
}
