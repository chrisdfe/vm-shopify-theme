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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
    function PromoBanner(element) {
      _classCallCheck(this, PromoBanner);

      _defineProperty(this, "element", null);

      this.element = element;
    }

    _createClass(PromoBanner, [{
      key: "initialize",
      value: function initialize() {
        if (Cookies.get("promo-banner") === "dismiss") {
          return;
        } // this.closeButtons =


        $("body").addClass("promo-banner-show");
        document.querySelectorAll(".js-promo-banner-close").forEach(function (closeButton) {
          closeButton.addEventListener("click", function () {
            $("body").removeClass("promo-banner-show");
            Cookies.set("promo-banner", "dismiss", {
              expires: 30
            });
          });
        });
      }
    }], [{
      key: "findAndInitialize",
      value: function findAndInitialize$1() {
        return findAndInitialize(PromoBanner);
      }
    }]);

    return PromoBanner;
  }();

  _defineProperty(PromoBanner, "selector", ".promo-banner");

  var HeaderDesktop = /*#__PURE__*/function () {
    //
    //
    function HeaderDesktop(headerElement) {
      _classCallCheck(this, HeaderDesktop);

      _defineProperty(this, "currentDropdownId", null);

      _defineProperty(this, "headerElement", null);

      _defineProperty(this, "dropdownNavLinkElements", []);

      _defineProperty(this, "dropdownLinkElements", []);

      _defineProperty(this, "dropdownElements", []);

      _defineProperty(this, "dropdownIds", []);

      _defineProperty(this, "dropdownMap", {});

      this.headerElement = headerElement;
    }

    _createClass(HeaderDesktop, [{
      key: "initialize",
      value: function initialize() {
        var _this = this;

        this.headerWrapperElement = document.querySelector(".header-wrapper");
        this.dropdownLinkElements = this.headerElement.querySelectorAll(".header__dropdown-link");
        this.dropdownElements = document.querySelectorAll(".header__dropdown-container");
        this.dropdownMap = Array.from(this.dropdownElements).reduce(function (acc, element) {
          var dropdownId = element.getAttribute("data-dropdown");

          if (!dropdownId) {
            return acc;
          }

          return _objectSpread2(_objectSpread2({}, acc), {}, _defineProperty({}, dropdownId, element));
        }, {});
        this.dropdownIds = Object.keys(this.dropdownMap);
        this.dropdownNavLinkElements = Array.from(this.headerElement.querySelectorAll(".header-desktop__nav-link")).filter(function (element) {
          var dropdownRel = element.getAttribute("data-dropdown-rel");

          if (!dropdownRel) {
            return false;
          } // dropdownLink points to a non-existant dropdown


          if (!_this.dropdownIds.includes(dropdownRel)) {
            return false;
          }

          return true;
        }); // Ideally we'd add this class in the liquid itself but the entire list of
        // dropdown ids isn't available to the header snippet

        this.dropdownNavLinkElements.forEach(function (dropdownLink) {
          dropdownLink.classList.add("is-dropdown-link");
        });
        var allDropdownLinkElements = [].concat(_toConsumableArray(this.dropdownLinkElements), _toConsumableArray(this.dropdownNavLinkElements));
        allDropdownLinkElements.forEach(function (dropdownLink) {
          var dropdownId = dropdownLink.getAttribute("data-dropdown-rel");
          var dropdownElement = _this.dropdownMap[dropdownId]; // TODO -
          // 1) store current active dropdownId
          // 2) deactivate current dropdown

          dropdownLink.addEventListener("mouseover", function (event) {
            if (_this.currentDropdownId && _this.currentDropdownId !== dropdownId) {
              var otherDropdownElement = _this.dropdownMap[_this.currentDropdownId];
              otherDropdownElement.classList.remove("is-active");
            }

            _this.currentDropdownId = dropdownId;
            dropdownElement.classList.add("is-active");
          });
        }); // TODO
        // - if the mouse is within the header still the dropdown should not close

        this.headerWrapperElement.addEventListener("mouseleave", function (event) {
          // console.log("event.target");
          console.log(event.target.closest(".header-wrapper")); // if (!event.target.closest(".header-wrapper")) {
          // console.log("mouseout", event.target);
          // dropdownElement.classList.remove("is-active");

          if (_this.currentDropdownId) {
            var otherDropdownElement = _this.dropdownMap[_this.currentDropdownId];
            otherDropdownElement.classList.remove("is-active");
          }

          _this.currentDropdownId = null; // }
        });
      }
    }], [{
      key: "findAndInitialize",
      value: function findAndInitialize$1() {
        return findAndInitialize(HeaderDesktop);
      }
    }]);

    return HeaderDesktop;
  }();

  _defineProperty(HeaderDesktop, "selector", ".header-desktop");

  var CartModule = function CartModule(_ref) {
    var headerElement = _ref.headerElement;
        _ref.onOpen;

    _classCallCheck(this, CartModule);

    _defineProperty(this, "isOpen", false);

    _defineProperty(this, "headerElement", null);

    _defineProperty(this, "cartButtonElement", null);

    _defineProperty(this, "cartModuleElement", null);

    this.headerElement = headerElement;
  };

  _defineProperty(CartModule, "buttonSelector", "");

  _defineProperty(CartModule, "moduleSelector", "");

  var HeaderMobile = /*#__PURE__*/function () {
    // refs
    function HeaderMobile(headerElement) {
      var _this = this;

      _classCallCheck(this, HeaderMobile);

      _defineProperty(this, "headerElement", null);

      _defineProperty(this, "cartModuleElement", null);

      _defineProperty(this, "megaMenuWrapperElement", null);

      _defineProperty(this, "megaMenuAccordionButtons", []);

      _defineProperty(this, "megaMenuAccordionMap", {});

      _defineProperty(this, "openMenu", function () {
        _this.menuIsOpen = true;

        _this.menuButtonElement.classList.add("is-open");

        _this.megaMenuWrapperElement.classList.add("is-open");

        _this.lockBodyScroll();
      });

      _defineProperty(this, "closeMenu", function () {
        _this.menuIsOpen = false;

        _this.menuButtonElement.classList.remove("is-open");

        _this.megaMenuWrapperElement.classList.remove("is-open");

        _this.unlockBodyScroll();
      });

      _defineProperty(this, "toggleMenuOpen", function () {
        _this.closeCart();

        _this.menuIsOpen ? _this.closeMenu() : _this.openMenu();
      });

      _defineProperty(this, "openSearch", function () {});

      _defineProperty(this, "closeSearch", function () {});

      _defineProperty(this, "onSearchButtonClick", function () {});

      _defineProperty(this, "toggleSearchOpen", function () {
        _this.closeMenu();

        _this.cartModule.close();
      });

      _defineProperty(this, "onCartOpen", function () {
        console.log("oncartopen");
      });

      _defineProperty(this, "onAccordionButtonClick", function (event) {
        var accordionButton = event.target.closest(".mobile-menu-accordion-button");
        var accordionId = accordionButton.getAttribute("data-accordion-id");
        var contentElement = _this.megaMenuAccordionMap[accordionId];
        accordionButton.classList.toggle("is-open");
        contentElement.classList.toggle("is-open");
      });

      this.headerElement = headerElement;
    }

    _createClass(HeaderMobile, [{
      key: "initialize",
      value: function initialize() {
        var _this2 = this;

        // this.cartModule = new CartModule({
        //   headerElement: this.headerElement,
        //   onOpen: this.onCartOpen,
        // });
        this.megaMenuWrapperElement = document.querySelector(".mega-menu-container");
        this.megaMenuAccordionButtons = document.querySelectorAll(".mobile-menu-accordion-button");
        this.searchButtonElement = this.headerElement.querySelector(".js-mobile-search-button");
        this.cartButtonElement = this.headerElement.querySelector(".js-mobile-cart-button");
        this.cartModuleElement = document.querySelector(".header__cart-module");
        this.megaMenuAccordionMap = Array.from(this.megaMenuAccordionButtons).reduce(function (acc, accordionButton) {
          var accordionId = accordionButton.getAttribute("data-accordion-id");
          var contentElement = document.querySelector(".mobile-menu-accordion-content[data-accordion-id=\"".concat(accordionId, "\"]"));
          return _objectSpread2(_objectSpread2({}, acc), {}, _defineProperty({}, accordionId, contentElement));
        }, {}); // this.menuButtonElement.addEventListener("click", this.toggleMenuOpen);
        // this.searchButtonElement.addEventListener(
        //   "click",
        //   this.onSearchButtonClick
        // );

        this.megaMenuAccordionButtons.forEach(function (accordionButton) {
          accordionButton.addEventListener("click", _this2.onAccordionButtonClick);
        }); // document.body.addEventListener("click", this.onBodyClick);
      }
    }, {
      key: "unload",
      value: function unload() {}
    }], [{
      key: "findAndInitialize",
      value: function findAndInitialize$1() {
        return findAndInitialize(HeaderMobile);
      }
    }]);

    return HeaderMobile;
  }();

  _defineProperty(HeaderMobile, "selector", ".header-mobile");

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
        return _this.setOpen(true);
      });

      _defineProperty(this, "close", function () {
        return _this.setOpen(false);
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

        console.log("initializing");
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

  var HeaderWrapper = /*#__PURE__*/function () {
    function HeaderWrapper(headerWrapperElement) {
      _classCallCheck(this, HeaderWrapper);

      _defineProperty(this, "headerWrapperElement", null);

      _defineProperty(this, "promoBanner", null);

      _defineProperty(this, "headerDesktop", null);

      _defineProperty(this, "headerMobile", null);

      _defineProperty(this, "drawerManager", null);

      this.headerWrapperElement = headerWrapperElement;
    }

    _createClass(HeaderWrapper, [{
      key: "initialize",
      value: function initialize() {
        this.promoBanner = PromoBanner.findAndInitialize();
        this.headerDesktop = HeaderDesktop.findAndInitialize();
        this.headerMobile = HeaderMobile.findAndInitialize();
        this.drawerManager = new HeaderDrawerManager().initialize();
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

  //   $("body").removeClass("is-active").removeClass("blocked-scroll"),
  //     $(".dropdown_link").toggleClass("active_link"),
  //     $(".cart_container").removeClass("active_link");
  // }

  var header = {
    init: function init() {
      HeaderWrapper.findAndInitialize(); // $("html").on("click", function (e) {
      //   if (
      //     !$(e.target).closest(".cart_container").length &&
      //     $(".cart_content").is(":visible")
      //   ) {
      //     hideNavbar();
      //     if (
      //       $(e.target).closest(".header__dropdown-container").length &&
      //       $(".dropdown").is(":visible") &&
      //       !$(e.target).hasClass("url-deadlink")
      //     ) {
      //       $("body").removeClass("is-active");
      //       $(".dropdown_link").removeClass("active_link");
      //       $(".header__dropdown-container").hide();
      //       $(".mobile_nav").find("div").removeClass("open");
      //     }
      //   }
      // });
      // if ($(".main_nav_wrapper").length > 1) {
      //   $(".main_nav_wrapper").first().remove();
      // }
      // if ($("#header").hasClass("mobile_nav-fixed--true")) {
      //   $("body").addClass("mobile_nav-fixed--true");
      //   $("body").on("click", '.banner a[href^="#"]', function (e) {
      //     e.preventDefault();
      //     const t = $(this).attr("href");
      //     const a = $("#header").outerHeight();
      //     $("html, body").animate({ scrollTop: $(t).offset().top - a }, 2e3);
      //   });
      // } else {
      //   $("body").addClass("mobile_nav-fixed--false");
      // }
      // $(".dropdown_link").attr("data-no-instant", true);
      // $("body").on("click", ".dropdown_link", function (e) {
      //   e.preventDefault();
      //   // console.log("dropdown_link click");
      //   $(".nav a").removeClass("active_link");
      //   if ($("#header").is(":visible")) {
      //     var t = $(this)
      //       .parents("#header")
      //       .find('[data-dropdown="' + $(this).data("dropdown-rel") + '"]');
      //     $(this).hasClass("mini_cart") ||
      //       $(".cart_container").removeClass("active_link");
      //   } else {
      //     if ($(this).hasClass("icon-search"))
      //       // window.location = $(this).attr("href"));
      //       // return false;
      //       t = $(this)
      //         .parents(".main_nav")
      //         .find('[data-dropdown="' + $(this).data("dropdown-rel") + '"]');
      //   }
      //   if (t.is(":visible") || !t.attr("class")) {
      //     t.hide();
      //     $("body").removeClass("is-active");
      //   } else {
      //     $(".header__dropdown-container").hide();
      //     t.show();
      //     $("body").addClass("is-active");
      //     $(".mobile_nav").find("div").removeClass("open");
      //     t.is(":visible");
      //   }
      //   e.preventDefault();
      //   e.stopPropagation();
      //   return false;
      // });
      // $("body").on("click", ".mobile_nav", function () {
      //   console.log("mobile_nav click");
      //   $(this).find("div").toggleClass("open");
      // });
      // if (Shopify.theme_settings.cart_action !== "redirect_cart") {
      //   $(".mini_cart").on("click", function (e) {
      //     let t;
      //     const a = $(this).parent();
      //     if (a.hasClass("active_link")) {
      //       hideNavbar();
      //       $("body").removeClass("blocked-scroll");
      //     } else {
      //       t = a;
      //       $("body").addClass("blocked-scroll");
      //       $(".mobile_nav div").removeClass("open");
      //       $(".dropdown_link").removeClass("active_link");
      //       t.addClass("active_link");
      //       $("body").addClass("blocked-scroll");
      //       (is_touch_device() || $(window).width() <= 798) && e.preventDefault();
      //     }
      //   });
      // }
    },
    loadMegaMenu: function loadMegaMenu() {},
    loadMobileMegaMenu: function loadMobileMegaMenu() {},
    unloadMegaMenu: function unloadMegaMenu() {},
    unload: function unload() {// $("body").off("click", ".mobile_nav");
      // $("body").off("click", ".dropdown_link");
      // $("html").off("click");
      // $(".mini_cart").off("click");
      // $(".cart_content__continue-shopping").off("click");
      // $("body").off("click", '.banner a[href^="#"]');
      // $(".main_nav_wrapper.sticky_nav").remove();
    }
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

  // import intersections from "../lib/intersections";
  window.searchAutocomplete = searchAutocompleteManager;
  window.header = header;
  window.cart = cart; // intersections.init();

})();
