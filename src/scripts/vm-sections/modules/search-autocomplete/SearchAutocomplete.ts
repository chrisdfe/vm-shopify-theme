import debounce from "../../utils/debounce";
import { getCDNImageUrl } from "./utils";

import { DropdownEventPayload } from '../header/dropdowns/DropdownManager';

type ShopifyGlobal = {
  translation: {
    coming_soon_text: string;
    from_text: string;
    all_results: string;
  };
  theme_settings: {
    display_sold_out_price: boolean;
    sold_out_text: string;
    free_text: string;
    search_items_to_display: string;
  };
};

declare var Shopify: ShopifyGlobal;

/*============================================================================
  Search autocomplete
==============================================================================*/

const getCollectionHandles = (item) =>
  item.collections.map((collection) => collection.handle);

function getSearchResultItemPrice(item) {
  if (getCollectionHandles(item).includes("coming-soon")) {
    return Shopify.translation.coming_soon_text;
  }

  if (!item.available) {
    if (Shopify.theme_settings.display_sold_out_price) {
      return `
        ${item.price} <span class="sold-out-text">${Shopify.theme_settings.sold_out_text}</span>
      `;
    }

    return `<span class="sold-out-text">${Shopify.theme_settings.sold_out_text}</span>`;
  }

  if (item.raw_compare > item.raw_price) {
    return `
      <span class="was_price">${item.compare}</span> ${item.price}
    `;
  }

  if (item.price_varies && item.price_min > 0) {
    return `${Shopify.translation.from_text} ${item.price}`;
  }

  if (item.price > 0 || item.raw_price > 0) {
    return item.price;
  }

  return Shopify.theme_settings.free_text;
}

function renderSearchResultThumbnail(item) {
  const thumbnailSrc =
    !!item.thumbnail && item.thumbnail !== "NULL"
      ? item.thumbnail
      : getCDNImageUrl("vm-logo-seagreen.png", "small");

  return `
    <div class="search-autocomplete__result__thumbnail">
      <img src="${thumbnailSrc}" />
    </div>
  `;
}

const searchResultTemplates = {
  product(item) {
    const itemPrice = getSearchResultItemPrice(item);

    return `
      <h5>${item.title}</h5>
      <div class="search-autocomplete__result__description">
        ${itemPrice}
      </div>
    `;
  },

  article(item) {
    return `
      <h5>${item.title}</h5>
      <div class="search-autocomplete__result__description">
        <p class="paragraph-3">${item.text_content}</p>
      </div>
    `;
  },

  page(item) {
    return `
      <h5>${item.title}</h5>
      <div class="search-autocomplete__result__description">
        <p class="paragraph-3">${item.text_content}</p>
      </div>
    `;
  },
};

function getDisplayObjectType(item) {
  if (item.object_type === "article") {
    return "blog post";
  }

  if (item.object_type === "product") {
    if (
      item.collections &&
      item.collections.length &&
      getCollectionHandles(item).includes("services")
    ) {
      return "service";
    }
  }

  return item.object_type;
}

function renderSearchResult(item) {
  const thumbnail = renderSearchResultThumbnail(item);

  const renderFunction = searchResultTemplates[item.object_type];
  const body = renderFunction(item);

  const displayObjectType = getDisplayObjectType(item);

  const fullTemplate = `
    <li class="search-autocomplete__result search-autocomplete__result--type-${item.object_type}">
      <a class="search-autocomplete__result-link" href="${item.url}">
        <div class="search-autocomplete__result__thumbnail-wrapper">
          ${thumbnail}
        </div>  

        <div class="search-autocomplete__result__body">
          <h6 class="search-autocomplete__result__type-heading">
            ${displayObjectType}
          </h6>

          ${body}
        </div>
      </a>
    </li>
  `;

  return fullTemplate;
}

function renderSearchResults({
  resultsList,
  totalResults,
  searchValue,
  searchUrl,
}) {
  // If we have no results
  if (totalResults === 0) {
    return `
      <li class="search-autocomplete__result search-autocomplete__result--no-results">
        <p>No results for <b>"${searchValue}"</b>.</p>
      </li>
    `;
  }

  // If we have results
  const concatenatedResults = resultsList.slice(
    0,
    Shopify.theme_settings.search_items_to_display
  );

  let renderedContents = concatenatedResults.reduce((acc, item, index) => {
    return acc + renderSearchResult(item);
  }, "");

  // The Ajax request will return at the most 5 results.
  // If there are more than 5, let's link to the search results page.
  if (totalResults >= Shopify.theme_settings.search_items_to_display) {
    renderedContents += `
        <li class="search-autocomplete__result search-autocomplete__result--see-all">
          <a class="cta-link" href="${searchUrl}*">${Shopify.translation.all_results} (${totalResults})</a>
        </li>
      `;
  }

  return renderedContents;
}

export default class SearchAutocomplete {
  shopURL: string = "";

  searchValue: string = "";

  searchFormElement = null;
  resultsListElement = null;
  inputElement = null;

  searchPath: string;

  debouncedFetchSearchResults: () => void;

  constructor(searchFormElement) {
    this.searchFormElement = searchFormElement;
  }

  init = () => {
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
      })

      window.addEventListener("header-dropdown:closed", evt => {
        const { dropdown } = (evt as CustomEvent<DropdownEventPayload>).detail;
        if (dropdown.id === "search") {
          this.inputElement.blur();
        }
      })
    }

    return this;
  };

  showDropdown = () => {
    this.resultsListElement.classList.remove("u-hidden");
  };

  hideDropdown = () => {
    this.resultsListElement.classList.add("u-hidden");
  };

  unload = () => { };

  onDocumentClick = (event) => {
    if (
      !this.searchFormElement.isSameNode(event.target) &&
      !this.searchFormElement.contains(event.target)
    ) {
      this.hideDropdown();
    }
  };

  // TODO - reconsider whether this is the right behavior
  onSearchFormSubmit = (event) => {
    event.preventDefault();
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

  getSearchUrl = (searchValue) => {
    const cleanedValue = encodeURI(searchValue);
    const searchURL = this.searchPath + cleanedValue;
    const fullSearchUrl = `${searchURL}*&view=json`;
    return fullSearchUrl;
  };

  private fetchAndDisplaySearchResults = () =>
    this.fetchSearchResults(this.searchValue).then(
      ({ searchValue, searchUrl, resultsList, totalResults }) => {
        if (searchValue !== this.searchValue) {
          return;
        }

        const renderedContents = renderSearchResults({
          searchValue,
          searchUrl,
          resultsList,
          totalResults,
        });

        this.resultsListElement.innerHTML = renderedContents;
        this.showDropdown();
      }
    );

  private fetchSearchResults = (searchValue) => {
    const searchUrl = this.getSearchUrl(searchValue);

    return fetch(searchUrl)
      .then((response) => response.json())
      .then((data) => {
        return {
          searchValue,
          searchUrl,
          resultsList: data.results,
          totalResults: data.results_count,
        };
      });
  };
}
