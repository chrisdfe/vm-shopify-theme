import { isString } from 'lodash-es';
import { SearchResult, SearchResponse } from './types';
import { getCDNImageUrl } from './utils';

const TEMPLATES = {
  product(result: SearchResult) {
    const itemPrice = getSearchResultPrice(result);

    return `
      <h5>${result.title}</h5>
      <div class="search-autocomplete__result__description">
        ${itemPrice}
      </div>
    `;
  },

  article(result: SearchResult) {
    return `
      <h5>${result.title}</h5>
      <div class="search-autocomplete__result__description">
        <p class="paragraph-3">${result.textContent}</p>
      </div>
    `;
  },

  page(result: SearchResult) {
    return `
      <h5>${result.title}</h5>
      <div class="search-autocomplete__result__description">
        <p class="paragraph-3">${result.textContent}</p>
      </div>
    `;
  },
};


const getCollectionHandles = (result: SearchResult) =>
  Array.isArray(result.collections)
    ? result.collections.map((collection) => collection.handle)
    : [];

function getSearchResultPrice(result: SearchResult) {
  if (getCollectionHandles(result).includes("coming-soon")) {
    return Shopify.translation.coming_soon_text;
  }

  if (!result.available) {
    if (Shopify.theme_settings.display_sold_out_price) {
      return `
        ${result.price} <span class="sold-out-text">${Shopify.theme_settings.sold_out_text}</span>
      `;
    }

    return `<span class="sold-out-text">${Shopify.theme_settings.sold_out_text}</span>`;
  }

  // TODO - check for string
  if (result.rawCompare > result.rawPrice) {
    return `
      <span class="was_price">${result.compare}</span> ${result.price}
    `;
  }

  if (result.priceVaries && result.priceMin > 0) {
    return `<span class="from-text">${Shopify.translation.from_text}</span> ${result.price}`;
  }

  // TODO - check for string
  if (
    (!isString(result.price) && result.price > 0) ||
    (!isString(result.rawPrice) && result.rawPrice > 0)
  ) {
    return result.price;
  }

  return Shopify.theme_settings.free_text;
}

function renderSearchResultThumbnail(result: SearchResult) {
  const thumbnailSrc =
    !!result.thumbnail && result.thumbnail !== "NULL"
      ? result.thumbnail
      : getCDNImageUrl("vm-logo-seagreen.png", "small");

  return `
    <div class="search-autocomplete__result__thumbnail">
      <img src="${thumbnailSrc}" />
    </div>
  `;
}

function getDisplayObjectType(result: SearchResult) {
  if (result.objectType === "article") {
    return "blog post";
  }

  if (result.objectType === "product") {
    if (
      result.collections &&
      result.collections.length &&
      getCollectionHandles(result).includes("services")
    ) {
      return "service";
    }
  }

  return result.objectType;
}

function renderSearchResult(result: SearchResult) {
  const thumbnail = renderSearchResultThumbnail(result);

  const renderFunction = TEMPLATES[result.objectType];
  const body = renderFunction(result);

  const displayObjectType = getDisplayObjectType(result);

  const fullTemplate = `
    <li class="search-autocomplete__result search-autocomplete__result--type-${result.objectType}">
      <a class="search-autocomplete__result-link" href="${result.url}">
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

export function renderSearchResults({
  results,
  resultsCount,
  searchValue,
  searchUrl,
}: SearchResponse & { searchValue: string, searchUrl: string; }) {
  if (resultsCount === 0) {
    return `
      <li class="search-autocomplete__result search-autocomplete__result--no-results">
        <p>No results for <b>"${searchValue}"</b>.</p>
      </li>
    `;
  }

  // If we have results
  const concatenatedResults = results.slice(
    0,
    Shopify.theme_settings.search_items_to_display
  );

  let renderedContents = concatenatedResults.reduce((acc, item, index) => {
    return acc + renderSearchResult(item);
  }, "");

  // The Ajax request will return at the most 5 results.
  // If there are more than 5, let's link to the search results page.
  if (resultsCount >= Shopify.theme_settings.search_items_to_display) {
    renderedContents += `
        <li class="search-autocomplete__result search-autocomplete__result--see-all">
          <a class="cta-link" href="${searchUrl}*">${Shopify.translation.all_results} (${resultsCount})</a>
        </li>
      `;
  }

  return renderedContents;
}