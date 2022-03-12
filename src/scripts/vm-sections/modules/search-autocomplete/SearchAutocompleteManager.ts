import SearchAutocomplete from "./SearchAutocomplete";

export default class SearchAutocompleteManager {
  searchAutocompletes: SearchAutocomplete[];

  init = () => {
    const searchFormElements = document.querySelectorAll(
      "form.search_form, form.search, form.header_search_form, form.header__search-form"
    );

    console.log("searchFormElements", searchFormElements.length);

    this.searchAutocompletes = Array.from(searchFormElements).map(
      (searchFormElement) => {
        return new SearchAutocomplete(searchFormElement).init();
      }
    );
  };

  unload = () => {
    this.searchAutocompletes.forEach((searchAutocomplete) => {
      searchAutocomplete.unload();
    });
  };
}
