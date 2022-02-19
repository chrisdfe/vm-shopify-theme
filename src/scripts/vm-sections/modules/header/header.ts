import HeaderWrapper from "./HeaderWrapper";

const header = {
  init: function () {
    const headerWrapper = HeaderWrapper.findAndInitialize();

    // window.addEventListener("shopify:section:select", (event) => {
    //   console.log("section selected");
    // });
  },

  loadMegaMenu: function () {},

  loadMobileMegaMenu: function () {},

  unloadMegaMenu: function () {},

  unload: function () {},
};

export default header;
