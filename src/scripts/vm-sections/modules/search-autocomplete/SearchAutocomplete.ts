import debounce, { DebouncedFunc } from 'lodash-es/debounce';

import { DropdownEventPayload } from '../header/dropdowns/DropdownManager';

import { SearchResponse } from './types';
import { renderSearchResults } from './renderer';
import { camelizeJSON } from './utils';

export default class SearchAutocomplete {
  shopURL: string = "";

  searchValue: string = "";

  searchFormElement = null;
  resultsListElement = null;
  inputElement = null;

  searchPath: string;

  debouncedFetchSearchResults: DebouncedFunc<typeof this.fetchSearchResults>;

  constructor(searchFormElement) {
    this.searchFormElement = searchFormElement;
  }

  initialize = () => {
    this.shopURL = document.querySelector("body").getAttribute("data-shop-url");
    this.searchPath = `${this.shopURL}/search?q=`;
    this.debouncedFetchSearchResults = debounce(this.fetchSearchResults, 1000);

    const searchAutocompleteElement = document.createElement("div");
    searchAutocompleteElement.innerHTML = `
      <div class="search-autocomplete">
        <ul class="search-autocomplete__results"></ul>
      </div>`;
    this.searchFormElement.appendChild(searchAutocompleteElement);

    this.resultsListElement = this.searchFormElement.querySelector(
      ".search-autocomplete__results"
    );

    this.inputElement = this.searchFormElement.querySelector('input[name="q"]');
    this.inputElement.setAttribute("autocomplete", "off");
    this.inputElement.addEventListener("keyup", this.onSearchInputKeyup);

    this.searchFormElement.addEventListener("submit", this.onSearchFormSubmit);

    // Clicking outside makes the results disappear.
    // document.addEventListener("click", this.onDocumentClick);

    // if this search autocomplete is inside of a dropdown then set up autofocus
    if (this.searchFormElement.closest("[data-dropdown-id]")) {
      window.addEventListener("header-dropdown:opened", evt => {
        const { dropdown } = (evt as CustomEvent<DropdownEventPayload>).detail;

        if (dropdown.id === "search") {
          this.inputElement.focus();
        }
      });

      window.addEventListener("header-dropdown:closed", evt => {
        const { dropdown } = (evt as CustomEvent<DropdownEventPayload>).detail;
        if (dropdown.id === "search") {
          this.inputElement.blur();
        }
      });
    }

    return this;
  };

  unload = () => { };

  showDropdown = () => {
    this.resultsListElement.classList.remove("u-hidden");
  };

  hideDropdown = () => {
    this.resultsListElement.classList.add("u-hidden");
  };

  onDocumentClick = (event) => {
    if (
      !this.searchFormElement.isSameNode(event.target) &&
      !this.searchFormElement.contains(event.target)
    ) {
      this.hideDropdown();
    }
  };

  onSearchFormSubmit = (event) => {
    event.preventDefault();
    const url = this.getSearchPageUrl(this.searchValue + "*");
    window.location.assign(url);
    this.fetchAndDisplaySearchResults();
  };

  onSearchInputKeyup = debounce(() => {
    this.searchValue = this.inputElement.value;

    if (this.searchValue === "") {
      this.hideDropdown();
      return;
    }

    if (this.searchValue.length < 3) {
      return;
    }

    this.fetchAndDisplaySearchResults();
  }, 250);

  getSearchPageUrl = (searchValue) => {
    const cleanedValue = encodeURI(searchValue);
    return this.searchPath + cleanedValue;
  };

  getSearchUrl = (searchValue) => {
    const cleanedValue = encodeURI(searchValue);
    const searchQuery = `${cleanedValue}*`;
    const fullSearchUrl = `${this.searchPath}${searchQuery}&view=json`;
    return fullSearchUrl;
  };

  private fetchAndDisplaySearchResults = async () => {
    const searchUrl = this.getSearchUrl(this.searchValue);
    const { searchValue } = this;
    const response = await this.fetchSearchResults(searchValue);

    const renderedContents = renderSearchResults({
      searchValue,
      searchUrl,
      ...response
    });

    this.resultsListElement.innerHTML = renderedContents;
    this.showDropdown();
  };

  private fetchSearchResults = async (searchValue: string): Promise<SearchResponse> => {
    const searchUrl = this.getSearchUrl(searchValue);

    const rawResponse = await fetch(searchUrl);
    const jsonResponse = await rawResponse.json();
    const response = camelizeJSON(jsonResponse) as unknown as SearchResponse;
    return response;
  };
}
