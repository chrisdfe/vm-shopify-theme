// import intersections from "../vm-sections/modules/intersections";
import searchAutocomplete from "../vm-sections/modules/search-autocomplete";
import header from "../vm-sections/modules/header";
import cart from "../vm-sections/modules/cart";
import AccordionManager from "../vm-sections/modules/accordions/AccordionManager";

// modules with 'legacy' (i.e turbo 6) support
// attached to window and use api that app.js.liquid and utilities.js.liquid expect
// @ts-ignore
window.header = header;
// @ts-ignore
window.searchAutocomplete = searchAutocomplete;
// @ts-ignore
window.cart = cart;

// VM modules
// intersections.init();
new AccordionManager().initialize();
