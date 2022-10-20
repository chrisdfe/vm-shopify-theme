import SearchAutocompleteManager from "../vm-sections/modules/search-autocomplete/SearchAutocompleteManager";
import HeaderWrapper from "../vm-sections/modules/header";
import Cart from "../vm-sections/modules/Cart";
import AccordionManager from "../vm-sections/modules/accordions/AccordionManager";
import ProductCardsManager from "../vm-sections/modules/product-cards/ProductCardsManager";
import ProductPage from "../vm-sections/modules/product-page";
import SmoothLazyLoadingImagesManager from "../vm-sections/modules/SmoothLazyLoadingImagesManager";
import ProductQuantityBox from "../vm-sections/modules/ProductQuantityBox";
import ProductReccomendations from "../vm-sections/modules/product-page/product-recommendations";

new HeaderWrapper().initialize();
new Cart().initialize();
new SearchAutocompleteManager().initialize();
new AccordionManager().initialize();
new ProductCardsManager().initialize();
new SmoothLazyLoadingImagesManager().initialize();
new ProductQuantityBox().initialize();
new ProductReccomendations().initialize();

if (ProductPage.isOnProductPage()) {
  new ProductPage().initialize();
}
