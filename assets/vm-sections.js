(function () {
  'use strict';

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);

      if (enumerableOnly) {
        symbols = symbols.filter(function (sym) {
          return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        });
      }

      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
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

  /**
   * Image Helper Functions
   * -----------------------------------------------------------------------------
   * https://github.com/Shopify/slate.git.
   *
   */
  /**
   * Adds a Shopify size attribute to a URL
   *
   * @param src
   * @param size
   * @returns {*}
   */

  function getSizedImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

    if (match) {
      var prefix = src.split(match[0]);
      var suffix = match[0];
      return removeProtocol("".concat(prefix[0], "_").concat(size).concat(suffix));
    } else {
      return null;
    }
  }
  function removeProtocol(path) {
    return path.replace(/http(s)?:/, '');
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

  var CDN_BASE_URL = "//cdn.shopify.com/s/files/1/1077/2230/t/118/"; // TODO - move to a more general location

  function getCDNImageUrl(imageUrl, size, version) {
    var sizedImageUrl = getSizedImageUrl(imageUrl, size);
    var cdnImageUrl = "".concat(CDN_BASE_URL, "assets/").concat(sizedImageUrl);

    if (version) {
      cdnImageUrl += "?v=".concat(version);
    }

    return cdnImageUrl;
  }

  var getCollectionHandles = function getCollectionHandles(item) {
    return item.collections.map(function (collection) {
      return collection.handle;
    });
  };

  function getSearchResultItemPrice(item) {
    if (getCollectionHandles(item).includes("coming-soon")) {
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
    var thumbnailSrc = !!item.thumbnail && item.thumbnail !== "NULL" ? item.thumbnail : getCDNImageUrl("vm-logo-seagreen.png", "small");
    return "\n    <div class=\"search-autocomplete__result__thumbnail\">\n      <img src=\"".concat(thumbnailSrc, "\" />\n    </div>\n  ");
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

  function findAndInitialize(klass) {
    var element = document.querySelector(klass.selector);

    if (element) {
      var klassInstance = new klass(element);
      klassInstance.initialize();
      return klassInstance;
    }

    return null;
  }

  var PromoBanner = /*#__PURE__*/function () {
    function PromoBanner() {
      _classCallCheck(this, PromoBanner);

      this.element = document.querySelector(".promo-banner");
    }

    _createClass(PromoBanner, [{
      key: "initialize",
      value: function initialize() {
        if (Cookies.get("promo-banner") === "dismiss") {
          return;
        }

        document.body.classList.add("promo-banner-show");
        document.querySelectorAll(".js-promo-banner-close").forEach(function (closeButton) {
          closeButton.addEventListener("click", function () {
            document.body.classList.remove("promo-banner-show");
            Cookies.set("promo-banner", "dismiss", {
              expires: 30
            });
          });
        });
      }
    }]);

    return PromoBanner;
  }();

  var HeaderDrawer = /*#__PURE__*/function () {
    function HeaderDrawer(_ref) {
      var _this = this;

      var id = _ref.id,
          buttonElement = _ref.buttonElement,
          drawerElement = _ref.drawerElement,
          onButtonClick = _ref.onButtonClick;

      _classCallCheck(this, HeaderDrawer);

      _defineProperty(this, "isOpen", false);

      _defineProperty(this, "id", null);

      _defineProperty(this, "buttonElement", null);

      _defineProperty(this, "drawerElement", null);

      _defineProperty(this, "onButtonClick", null);

      _defineProperty(this, "open", function () {
        _this.setOpen(true);
      });

      _defineProperty(this, "close", function () {
        _this.setOpen(false);
      });

      _defineProperty(this, "setOpen", function (isOpen) {
        _this.isOpen = isOpen;

        _this.drawerElement.classList.toggle("is-open", isOpen);

        _this.buttonElement.classList.toggle("is-open", isOpen);
      });

      this.id = id;
      this.buttonElement = buttonElement;
      this.drawerElement = drawerElement;
      this.onButtonClick = onButtonClick;
    }

    _createClass(HeaderDrawer, [{
      key: "initialize",
      value: function initialize() {
        var _this2 = this;

        this.buttonElement.addEventListener("click", function () {
          _this2.onButtonClick(_this2);
        });
        return this;
      }
    }, {
      key: "unload",
      value: function unload() {}
    }]);

    return HeaderDrawer;
  }();

  var BodyScroll = {
    lock: function lock() {
      document.body.classList.add("menu-is-open");
    },
    unlock: function unlock() {
      document.body.classList.remove("menu-is-open");
    }
  };

  var HeaderDrawerManager = /*#__PURE__*/function () {
    function HeaderDrawerManager() {
      var _this = this;

      _classCallCheck(this, HeaderDrawerManager);

      _defineProperty(this, "drawerButtons", []);

      _defineProperty(this, "currentOpenDrawerId", null);

      _defineProperty(this, "drawerIdMap", {});

      _defineProperty(this, "onDrawerButtonClick", function (drawer) {
        if (_this.currentOpenDrawerId) {
          if (drawer.id === _this.currentOpenDrawerId) {
            _this.closeDrawer(drawer);
          } else {
            _this.closeDrawer(_this.getCurrentOpenDrawer());

            _this.openDrawer(drawer);
          }
        } else {
          _this.openDrawer(drawer);
        }
      });

      _defineProperty(this, "onBodyClick", function (event) {
        if (_this.currentOpenDrawerId !== null && event.target.closest("[data-drawer-id]") === null && event.target.closest("[data-drawer-button-id]") === null) {
          _this.closeDrawer(_this.getCurrentOpenDrawer());
        }
      });
    }

    _createClass(HeaderDrawerManager, [{
      key: "initialize",
      value: function initialize() {
        var _this2 = this;

        this.drawerButtons = document.querySelectorAll("[data-drawer-button-id]");
        this.drawerIdMap = Array.from(this.drawerButtons).reduce(function (acc, buttonElement) {
          var id = buttonElement.getAttribute("data-drawer-button-id");
          var drawerElement = document.querySelector("[data-drawer-id=\"".concat(id, "\"]"));
          var drawer = new HeaderDrawer({
            id: id,
            buttonElement: buttonElement,
            drawerElement: drawerElement,
            onButtonClick: _this2.onDrawerButtonClick
          }).initialize();
          return _objectSpread2(_objectSpread2({}, acc), {}, _defineProperty({}, id, drawer));
        }, {});
        document.body.addEventListener("click", this.onBodyClick);
        return this;
      }
    }, {
      key: "getCurrentOpenDrawer",
      value: function getCurrentOpenDrawer() {
        return this.drawerIdMap[this.currentOpenDrawerId];
      }
    }, {
      key: "openDrawer",
      value: function openDrawer(drawer) {
        drawer.open();
        this.currentOpenDrawerId = drawer.id;
        BodyScroll.lock();
      }
    }, {
      key: "closeDrawer",
      value: function closeDrawer(drawer) {
        drawer.close();
        this.currentOpenDrawerId = null;
        BodyScroll.unlock();
      }
    }]);

    return HeaderDrawerManager;
  }();

  var DropdownManager = /*#__PURE__*/function () {
    //
    //
    function DropdownManager() {
      _classCallCheck(this, DropdownManager);

      _defineProperty(this, "currentDropdownId", null);

      _defineProperty(this, "headerElement", null);

      _defineProperty(this, "navLinkElements", []);

      _defineProperty(this, "dropdownLinkElements", []);

      _defineProperty(this, "dropdownElements", []);

      _defineProperty(this, "dropdownIds", []);

      _defineProperty(this, "dropdownMap", {});
    }

    _createClass(DropdownManager, [{
      key: "initialize",
      value: function initialize() {
        var _this = this;

        this.headerWrapperElement = document.querySelector(".header-wrapper");
        this.dropdownLinkElements = document.querySelectorAll(".header__dropdown-link");
        this.dropdownElements = document.querySelectorAll(".header__dropdown-container");
        this.dropdownMap = Array.from(this.dropdownElements).reduce(function (acc, element) {
          var dropdownId = element.getAttribute("data-dropdown");

          if (!dropdownId) {
            return acc;
          }

          return _objectSpread2(_objectSpread2({}, acc), {}, _defineProperty({}, dropdownId, element));
        }, {});
        this.dropdownIds = Object.keys(this.dropdownMap);
        this.navLinkElements = Array.from(this.headerWrapperElement.querySelectorAll(".header-desktop__nav-link")).filter(function (element) {
          var dropdownRel = element.getAttribute("data-dropdown-rel");

          if (!dropdownRel) {
            return false;
          } // dropdownLink points to a non-existant dropdown


          if (!_this.dropdownIds.includes(dropdownRel)) {
            return false;
          }

          return true;
        });
        return this;
      }
    }, {
      key: "unload",
      value: function unload() {}
    }]);

    return DropdownManager;
  }();

  var HeaderWrapper = /*#__PURE__*/function () {
    function HeaderWrapper(headerWrapperElement) {
      _classCallCheck(this, HeaderWrapper);

      _defineProperty(this, "headerWrapperElement", null);

      _defineProperty(this, "promoBanner", null);

      _defineProperty(this, "headerDesktop", null);

      _defineProperty(this, "headerMobile", null);

      _defineProperty(this, "drawerManager", null);

      _defineProperty(this, "dropdownManager", null);

      this.headerWrapperElement = headerWrapperElement;
    }

    _createClass(HeaderWrapper, [{
      key: "initialize",
      value: function initialize() {
        this.promoBanner = new PromoBanner().initialize();
        this.drawerManager = new HeaderDrawerManager().initialize();
        this.dropdownManager = new DropdownManager().initialize();
      }
    }], [{
      key: "findAndInitialize",
      value: function findAndInitialize$1() {
        return findAndInitialize(HeaderWrapper);
      }
    }]);

    return HeaderWrapper;
  }();

  _defineProperty(HeaderWrapper, "selector", ".header-wrapper");

  var header = {
    init: function init() {
      HeaderWrapper.findAndInitialize();
      window.addEventListener("shopify:section:select", function (event) {
        console.log("section selected");
      });
    },
    loadMegaMenu: function loadMegaMenu() {},
    loadMobileMegaMenu: function loadMobileMegaMenu() {},
    unloadMegaMenu: function unloadMegaMenu() {},
    unload: function unload() {}
  };

  var cart = {
    init: function init() {
      $("#cart_form .tos_agree").length && $("body").on("click", "#cart_form input[type='submit']", function () {
        if (!$(this).parents("form").find(".tos_agree").is(":checked")) {
          var e = '<p class="warning animated bounceIn">' + Shopify.translation.agree_to_terms_warning + "</p>";
          return 0 == $("p.warning").length && $(this).before(e), !1;
        }

        $(this).submit();
      });
    }
  };

  // import intersections from "../vm-sections/modules/intersections";
  window.header = header;
  window.searchAutocomplete = searchAutocompleteManager;
  window.cart = cart; // intersections.init();

})();
