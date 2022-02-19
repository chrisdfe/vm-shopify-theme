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

  var PromoBanner = /** @class */ (function () {
      function PromoBanner() {
          // this.element = document.querySelector(".promo-banner");
      }
      PromoBanner.prototype.initialize = function () {
          // @ts-ignore TODO - switch to npm library instead
          if (Cookies.get("promo-banner") === "dismiss") {
              return;
          }
          document.body.classList.add("promo-banner-show");
          document
              .querySelectorAll(".js-promo-banner-close")
              .forEach(function (closeButton) {
              closeButton.addEventListener("click", function () {
                  document.body.classList.remove("promo-banner-show");
                  // @ts-ignore TODO - switch to npm library instead
                  Cookies.set("promo-banner", "dismiss", { expires: 30 });
              });
          });
          return this;
      };
      return PromoBanner;
  }());

  var _assign = function __assign() {
    _assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) {
          if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
      }

      return t;
    };

    return _assign.apply(this, arguments);
  };

  var HeaderDrawer = /** @class */ (function () {
      function HeaderDrawer(_a) {
          var _this = this;
          var drawerElement = _a.drawerElement, onButtonClick = _a.onButtonClick;
          this.isOpen = false;
          this.unload = function () { };
          this.open = function () {
              _this.toggle(true);
          };
          this.close = function () {
              _this.toggle(false);
          };
          this.toggle = function (isOpen) {
              _this.isOpen = isOpen;
              _this.drawerElement.classList.toggle("is-open", isOpen);
              _this.buttonElements.forEach(function (element) {
                  element.classList.toggle("is-open", isOpen);
              });
          };
          this.drawerElement = drawerElement;
          this.onButtonClick = onButtonClick;
      }
      HeaderDrawer.prototype.initialize = function () {
          var _this = this;
          this.id = this.drawerElement.getAttribute("data-drawer-id");
          console.log("this.id", this.id);
          this.buttonElements = Array.from(document.querySelectorAll("[data-drawer-button-id=\"".concat(this.id, "\"]")));
          console.log("this.buttonElement", this.buttonElements.length);
          this.buttonElements.forEach(function (element) {
              element.addEventListener("click", function () {
                  _this.onButtonClick(_this);
              });
          });
          return this;
      };
      return HeaderDrawer;
  }());

  var BodyScroll = {
      lock: function () {
          document.body.classList.add("menu-is-open");
      },
      unlock: function () {
          document.body.classList.remove("menu-is-open");
      }
  };

  var HeaderDrawerManager = /** @class */ (function () {
      function HeaderDrawerManager() {
          var _this = this;
          this.onDrawerButtonClick = function (drawer) {
              if (_this.currentOpenDrawerId) {
                  if (drawer.id === _this.currentOpenDrawerId) {
                      _this.closeDrawer(drawer);
                  }
                  else {
                      _this.closeDrawer(_this.getCurrentOpenDrawer());
                      _this.openDrawer(drawer);
                  }
              }
              else {
                  _this.openDrawer(drawer);
              }
          };
          this.onBodyClick = function (event) {
              if (_this.getCurrentOpenDrawer() &&
                  event.target.closest("[data-drawer-id]") === null &&
                  event.target.closest("[data-drawer-button-id]") === null) {
                  _this.closeDrawer(_this.getCurrentOpenDrawer());
              }
          };
      }
      HeaderDrawerManager.prototype.initialize = function () {
          var _this = this;
          this.drawerElements = document.querySelectorAll("[data-drawer-id]");
          this.drawerIdMap = Array.from(this.drawerElements).reduce(function (acc, drawerElement) {
              var _a;
              var drawer = new HeaderDrawer({
                  drawerElement: drawerElement,
                  onButtonClick: _this.onDrawerButtonClick
              }).initialize();
              return _assign(_assign({}, acc), (_a = {}, _a[drawer.id] = drawer, _a));
          }, {});
          document.body.addEventListener("click", this.onBodyClick);
          return this;
      };
      HeaderDrawerManager.prototype.getCurrentOpenDrawer = function () {
          if (!this.currentOpenDrawerId) {
              return null;
          }
          console.log("this.currentOpenDrawerId", this.currentOpenDrawerId);
          return this.drawerIdMap[this.currentOpenDrawerId];
      };
      HeaderDrawerManager.prototype.openDrawer = function (drawer) {
          drawer.open();
          this.currentOpenDrawerId = drawer.id;
          BodyScroll.lock();
      };
      HeaderDrawerManager.prototype.closeDrawer = function (drawer) {
          drawer.close();
          this.currentOpenDrawerId = null;
          BodyScroll.unlock();
      };
      return HeaderDrawerManager;
  }());

  var OPEN_CLASSNAME = "is-active";
  var HeaderDropdown = /** @class */ (function () {
      function HeaderDropdown(element) {
          var _this = this;
          this.isOpen = false;
          this.initialize = function () {
              _this.id = _this.dropdownElement.getAttribute("data-dropdown");
              _this.buttonElements = Array.from(document.querySelectorAll("[data-dropdown-rel=\"".concat(_this.id, "\"]")));
              console.log("this.buttonElements", _this.id);
              console.log("this.buttonElements", _this.buttonElements.length);
              _this.buttonElements.forEach(function (element) {
                  element.classList.add("is-dropdown-button");
                  element.addEventListener("click", function (event) {
                      _this.onButtonElementClick(event, element);
                  });
              });
              return _this;
          };
          this.onButtonElementClick = function (event, element) {
              event.preventDefault();
              console.log("click", _this.id);
              _this.toggle(!_this.isOpen);
          };
          this.open = function () {
              _this.isOpen = true;
              _this.dropdownElement.classList.add(OPEN_CLASSNAME);
          };
          this.close = function () {
              _this.isOpen = false;
              _this.dropdownElement.classList.remove(OPEN_CLASSNAME);
          };
          this.toggle = function (isOpen) {
              _this.isOpen = isOpen;
              _this.dropdownElement.classList.toggle(OPEN_CLASSNAME, isOpen);
          };
          this.dropdownElement = element;
      }
      HeaderDropdown.prototype.unload = function () { };
      return HeaderDropdown;
  }());

  var DropdownManager = /** @class */ (function () {
      // navLinkElements: Element[];
      function DropdownManager() {
          //
          this.currentDropdownId = null;
      }
      DropdownManager.prototype.initialize = function () {
          this.headerWrapperElement = document.querySelector(".header-wrapper");
          this.dropdownLinkElements = document.querySelectorAll(".vm-header-dropdown-link");
          this.dropdownElements = document.querySelectorAll(".vm-header-dropdown");
          this.dropdownMap = Array.from(this.dropdownElements).reduce(function (acc, element) {
              var _a;
              var dropdown = new HeaderDropdown(element).initialize();
              return _assign(_assign({}, acc), (_a = {}, _a[dropdown.id] = dropdown, _a));
          }, {});
          this.dropdownIds = Object.keys(this.dropdownMap);
          // TODO - put this inside of Dropdown instead?
          // this.navLinkElements = Array.from(
          //   document.querySelectorAll(".header-desktop__nav-link")
          // ).filter((element) => {
          //   const dropdownRel = element.getAttribute("data-dropdown-rel");
          //   if (!dropdownRel) {
          //     return false;
          //   }
          //   // dropdownLink points to a non-existant dropdown
          //   if (!this.dropdownIds.includes(dropdownRel)) {
          //     return false;
          //   }
          //   return true;
          // });
          return this;
      };
      DropdownManager.prototype.onDropdownHover = function (dropdown) {
          console.log("ondropdownhover");
      };
      DropdownManager.prototype.unload = function () { };
      return DropdownManager;
  }());

  var HeaderWrapper = /** @class */ (function () {
      function HeaderWrapper(headerWrapperElement) {
          this.headerWrapperElement = null;
          this.headerWrapperElement = headerWrapperElement;
      }
      HeaderWrapper.prototype.initialize = function () {
          this.promoBanner = new PromoBanner().initialize();
          this.drawerManager = new HeaderDrawerManager().initialize();
          this.dropdownManager = new DropdownManager().initialize();
      };
      HeaderWrapper.findAndInitialize = function () {
          return findAndInitialize(HeaderWrapper);
      };
      HeaderWrapper.selector = ".header-wrapper";
      return HeaderWrapper;
  }());

  var header = {
      init: function () {
          HeaderWrapper.findAndInitialize();
          // window.addEventListener("shopify:section:select", (event) => {
          //   console.log("section selected");
          // });
      },
      loadMegaMenu: function () { },
      loadMobileMegaMenu: function () { },
      unloadMegaMenu: function () { },
      unload: function () { }
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
  // @ts-ignore
  window.header = header;
  // @ts-ignore
  window.searchAutocomplete = searchAutocompleteManager;
  // @ts-ignore
  window.cart = cart;
  // intersections.init();

})();
