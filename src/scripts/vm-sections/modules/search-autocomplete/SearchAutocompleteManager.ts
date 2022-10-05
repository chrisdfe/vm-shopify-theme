import SearchAutocomplete from "./SearchAutocomplete";

export default class SearchAutocompleteManager {
  searchAutocompletes: SearchAutocomplete[];

  initialize = () => {
    const searchFormElements = document.querySelectorAll(
      "form.search_form, form.search, form.header_search_form, form.header__search-form"
    );

    this.searchAutocompletes = Array.from(searchFormElements).map(
      (searchFormElement) => {
        return new SearchAutocomplete(searchFormElement).initialize();
      }
    );
  };

  unload = () => {
    this.searchAutocompletes.forEach((searchAutocomplete) => {
      searchAutocomplete.unload();
    });
  };
}
