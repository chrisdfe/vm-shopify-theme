(function () {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  // copied from https://davidwalsh.name/javascript-debounce-function
  function debounce(func, wait) {
    var _arguments = arguments,
        _this = this;

    var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var timeout;

    var debouncedFunction = function debouncedFunction() {
      var args = _arguments;

      var later = function later() {
        timeout = null;

        if (!immediate) {
          func.apply(_this, args);
        }
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) {
        func.apply(_this, args);
      }
    };

    return debouncedFunction;
  }

  /*============================================================================
    Search autocomplete
  ==============================================================================*/

  function getSearchResultItemPrice(item) {
    var collectionHandles = item.collections.map(function (collection) {
      return collection.handle;
    });

    if (collectionHandles.includes("coming-soon")) {
      return Shopify.translation.coming_soon_text;
    }

    if (!item.available) {
      if (Shopify.theme_settings.display_sold_out_price) {
        return "\n        ".concat(item.price, " <span class=\"sold-out-text\">").concat(Shopify.theme_settings.sold_out_text, "</span>\n      ");
      }

      return "<span class=\"sold-out-text\">".concat(Shopify.theme_settings.sold_out_text, "</span>");
    }

    if (item.raw_compare > item.raw_price) {
      return "\n      <span class=\"was_price\">".concat(item.compare, "</span> ").concat(item.price, "\n    ");
    }

    if (item.price_varies && item.price_min > 0) {
      return "".concat(Shopify.translation.from_text, " ").concat(item.price);
    }

    if (item.price > 0 || item.raw_price > 0) {
      return item.price;
    }

    return Shopify.theme_settings.free_text;
  }

  function renderSearchResultThumbnail(item) {
    if (item.thumbnail !== "NULL") {
      return "\n      <div class=\"search-autocomplete__result__thumbnail\">\n        <img src=\"".concat(item.thumbnail, "\" />\n      </div>\n    ");
    }

    return "";
  }

  var searchResultTemplates = {
    product: function product(item) {
      var itemPrice = getSearchResultItemPrice(item);
      return "\n      <h5>".concat(item.title, "</h5>\n      <div class=\"search-autocomplete__result__description\">\n        ").concat(itemPrice, "\n      </div>\n    ");
    },
    article: function article(item) {
      return "\n      <h5>".concat(item.title, "</h5>\n      <div class=\"search-autocomplete__result__description\">\n        <p class=\"paragraph-3\">").concat(item.text_content, "</p>\n      </div>\n    ");
    },
    page: function page(item) {
      return "\n      <h5>".concat(item.title, "</h5>\n      <div class=\"search-autocomplete__result__description\">\n        <p class=\"paragraph-3\">").concat(item.text_content, "</p>\n      </div>\n    ");
    }
  };

  var getCollectionHandles = function getCollectionHandles(item) {
    return item.collections.map(function (collection) {
      return collection.handle;
    });
  };

  function getDisplayObjectType(item) {
    if (item.object_type === "article") {
      return "blog post";
    }

    if (item.object_type === "product") {
      if (item.collections && item.collections.length && getCollectionHandles(item).includes("services")) {
        return "service";
      }
    }

    return item.object_type;
  }

  function renderSearchResult(item) {
    var thumbnail = renderSearchResultThumbnail(item);
    var renderFunction = searchResultTemplates[item.object_type];
    var body = renderFunction(item);
    var displayObjectType = getDisplayObjectType(item);
    var fullTemplate = "\n    <li class=\"search-autocomplete__result search-autocomplete__result--type-".concat(item.object_type, "\">\n      <a class=\"search-autocomplete__result-link\" href=\"").concat(item.url, "\">\n        <div class=\"search-autocomplete__result__thumbnail-wrapper\">\n          ").concat(thumbnail, "\n        </div>  \n\n        <div class=\"search-autocomplete__result__body\">\n          <h6 class=\"search-autocomplete__result__type-heading\">\n            ").concat(displayObjectType, "\n          </h6>\n\n          ").concat(body, "\n        </div>\n      </a>\n    </li>\n  ");
    return fullTemplate;
  }

  function renderSearchResults(_ref) {
    var resultsList = _ref.resultsList,
        totalResults = _ref.totalResults,
        searchValue = _ref.searchValue,
        searchUrl = _ref.searchUrl;

    // If we have no results
    if (totalResults === 0) {
      return "\n      <li class=\"search-autocomplete__result search-autocomplete__result--no-results\">\n        <p>No results for <b>\"".concat(searchValue, "\"</b>.</p>\n      </li>\n    ");
    } // If we have results


    var concatenatedResults = resultsList.slice(0, Shopify.theme_settings.search_items_to_display);
    var renderedContents = concatenatedResults.reduce(function (acc, item, index) {
      return acc + renderSearchResult(item);
    }, ""); // The Ajax request will return at the most 5 results.
    // If there are more than 5, let's link to the search results page.

    if (totalResults >= Shopify.theme_settings.search_items_to_display) {
      renderedContents += "\n        <li class=\"search-autocomplete__result search-autocomplete__result--see-all\">\n          <a class=\"cta-link\" href=\"".concat(searchUrl, "*\">").concat(Shopify.translation.all_results, " (").concat(totalResults, ")</a>\n        </li>\n      ");
    }

    return renderedContents;
  }

  var SearchAutocomplete = function SearchAutocomplete(searchFormElement) {
    var _this = this;

    _classCallCheck(this, SearchAutocomplete);

    _defineProperty(this, "shopURL", "");

    _defineProperty(this, "searchValue", "");

    _defineProperty(this, "searchFormElement", null);

    _defineProperty(this, "resultsListElement", null);

    _defineProperty(this, "inputElement", null);

    _defineProperty(this, "init", function () {
      _this.shopURL = document.querySelector("body").getAttribute("data-shop-url");
      _this.searchPath = "".concat(_this.shopURL, "/search?q=");
      _this.debouncedFetchSearchResults = debounce(_this.fetchSearchResults, 1000);
      var searchAutocompleteElement = document.createElement("div");
      searchAutocompleteElement.innerHTML = "\n      <div class=\"search-autocomplete\">\n        <ul class=\"search-autocomplete__results\"></ul>\n      </div>";

      _this.searchFormElement.appendChild(searchAutocompleteElement);

      _this.resultsListElement = _this.searchFormElement.querySelector(".search-autocomplete__results");
      _this.inputElement = _this.searchFormElement.querySelector('input[name="q"]');

      _this.inputElement.setAttribute("autocomplete", "off");

      _this.inputElement.addEventListener("keyup", _this.onSearchInputKeyup);

      _this.searchFormElement.addEventListener("submit", _this.onSearchFormSubmit); // Clicking outside makes the results disappear.


      document.addEventListener("click", _this.onDocumentClick);
      return _this;
    });

    _defineProperty(this, "showDropdown", function () {
      _this.resultsListElement.classList.remove("u-hidden");
    });

    _defineProperty(this, "hideDropdown", function () {
      _this.resultsListElement.classList.add("u-hidden");
    });

    _defineProperty(this, "unload", function () {});

    _defineProperty(this, "onDocumentClick", function (event) {
      if (!_this.searchFormElement.isSameNode(event.target) && !_this.searchFormElement.contains(event.target)) {
        _this.hideDropdown();
      }
    });

    _defineProperty(this, "onSearchFormSubmit", function (event) {
      event.preventDefault();
      var value = _this.inputElement.value;
      var cleanedValue = encodeURI(value);
      var newUrl = cleanedValue ? "".concat(_this.searchPath).concat(cleanedValue, "*") : "/search";
      window.location.href = newUrl;
    });

    _defineProperty(this, "onSearchInputKeyup", debounce(function () {
      _this.searchValue = _this.inputElement.value;

      if (_this.searchValue === "") {
        _this.hideDropdown();

        return;
      }

      if (_this.searchValue.length < 3) {
        return;
      }

      _this.fetchSearchResults(_this.searchValue).then(function (_ref2) {
        var searchValue = _ref2.searchValue,
            searchUrl = _ref2.searchUrl,
            resultsList = _ref2.resultsList,
            totalResults = _ref2.totalResults;

        if (searchValue !== _this.searchValue) {
          console.log("stale request", searchValue, _this.searchValue);
          return;
        }

        var renderedContents = renderSearchResults({
          searchValue: searchValue,
          searchUrl: searchUrl,
          resultsList: resultsList,
          totalResults: totalResults
        });
        _this.resultsListElement.innerHTML = renderedContents;

        _this.showDropdown();
      });
    }, 250));

    _defineProperty(this, "getSearchUrl", function (searchValue) {
      var cleanedValue = encodeURI(searchValue);
      var searchURL = _this.searchPath + cleanedValue;
      var fullSearchUrl = "".concat(searchURL, "*&view=json");
      return fullSearchUrl;
    });

    _defineProperty(this, "fetchSearchResults", function (searchValue) {
      var searchUrl = _this.getSearchUrl(searchValue);

      return fetch(searchUrl).then(function (response) {
        return response.json();
      }).then(function (data) {
        return {
          searchValue: searchValue,
          searchUrl: searchUrl,
          resultsList: data.results,
          totalResults: data.results_count
        };
      });
    });

    this.searchFormElement = searchFormElement;
  };

  var SearchAutocompleteManager = function SearchAutocompleteManager() {
    var _this2 = this;

    _classCallCheck(this, SearchAutocompleteManager);

    _defineProperty(this, "searchFormElements", []);

    _defineProperty(this, "searchAutocompletes", []);

    _defineProperty(this, "init", function () {
      _this2.searchFormElements = document.querySelectorAll("form.search_form, form.search, form.header_search_form");
      _this2.searchAutocompletes = Array.from(_this2.searchFormElements).map(function (searchFormElement) {
        return new SearchAutocomplete(searchFormElement).init();
      });
    });

    _defineProperty(this, "unload", function () {
      _this2.searchAutocompletes.forEach(function (searchAutocomplete) {
        searchAutocomplete.unload();
      });
    });
  };

  var searchAutocompleteManager = new SearchAutocompleteManager();

  // import "core-js";
  window.searchAutocomplete = searchAutocompleteManager; // intersections.init();

})();
