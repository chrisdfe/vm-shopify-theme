(function () {
    'use strict';

    // copied from https://davidwalsh.name/javascript-debounce-function
    function debounce(func, wait, immediate) {
        var _this = this;
        if (immediate === void 0) { immediate = false; }
        var timeout;
        var debouncedFunction = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
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

    var CDN_BASE_URL = "//cdn.shopify.com/s/files/1/1077/2230/t/118/";

    // TODO - move to a more general location
    function getCDNImageUrl(imageUrl, size, version) {
        var sizedImageUrl = getSizedImageUrl(imageUrl, size);
        var cdnImageUrl = "".concat(CDN_BASE_URL, "assets/").concat(sizedImageUrl);
        if (version) {
            cdnImageUrl += "?v=".concat(version);
        }
        return cdnImageUrl;
    }

    /*============================================================================
      Search autocomplete
    ==============================================================================*/
    var getCollectionHandles = function (item) {
        return item.collections.map(function (collection) { return collection.handle; });
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
            return "<span class=\"from-text\">".concat(Shopify.translation.from_text, "</span> ").concat(item.price);
        }
        if (item.price > 0 || item.raw_price > 0) {
            return item.price;
        }
        return Shopify.theme_settings.free_text;
    }
    function renderSearchResultThumbnail(item) {
        var thumbnailSrc = !!item.thumbnail && item.thumbnail !== "NULL"
            ? item.thumbnail
            : getCDNImageUrl("vm-logo-seagreen.png", "small");
        return "\n    <div class=\"search-autocomplete__result__thumbnail\">\n      <img src=\"".concat(thumbnailSrc, "\" />\n    </div>\n  ");
    }
    var searchResultTemplates = {
        product: function (item) {
            var itemPrice = getSearchResultItemPrice(item);
            return "\n      <h5>".concat(item.title, "</h5>\n      <div class=\"search-autocomplete__result__description\">\n        ").concat(itemPrice, "\n      </div>\n    ");
        },
        article: function (item) {
            return "\n      <h5>".concat(item.title, "</h5>\n      <div class=\"search-autocomplete__result__description\">\n        <p class=\"paragraph-3\">").concat(item.text_content, "</p>\n      </div>\n    ");
        },
        page: function (item) {
            return "\n      <h5>".concat(item.title, "</h5>\n      <div class=\"search-autocomplete__result__description\">\n        <p class=\"paragraph-3\">").concat(item.text_content, "</p>\n      </div>\n    ");
        }
    };
    function getDisplayObjectType(item) {
        if (item.object_type === "article") {
            return "blog post";
        }
        if (item.object_type === "product") {
            if (item.collections &&
                item.collections.length &&
                getCollectionHandles(item).includes("services")) {
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
    function renderSearchResults(_a) {
        var resultsList = _a.resultsList, totalResults = _a.totalResults, searchValue = _a.searchValue, searchUrl = _a.searchUrl;
        // If we have no results
        if (totalResults === 0) {
            return "\n      <li class=\"search-autocomplete__result search-autocomplete__result--no-results\">\n        <p>No results for <b>\"".concat(searchValue, "\"</b>.</p>\n      </li>\n    ");
        }
        // If we have results
        var concatenatedResults = resultsList.slice(0, Shopify.theme_settings.search_items_to_display);
        var renderedContents = concatenatedResults.reduce(function (acc, item, index) {
            return acc + renderSearchResult(item);
        }, "");
        // The Ajax request will return at the most 5 results.
        // If there are more than 5, let's link to the search results page.
        if (totalResults >= Shopify.theme_settings.search_items_to_display) {
            renderedContents += "\n        <li class=\"search-autocomplete__result search-autocomplete__result--see-all\">\n          <a class=\"cta-link\" href=\"".concat(searchUrl, "*\">").concat(Shopify.translation.all_results, " (").concat(totalResults, ")</a>\n        </li>\n      ");
        }
        return renderedContents;
    }
    var SearchAutocomplete = /** @class */ (function () {
        function SearchAutocomplete(searchFormElement) {
            var _this = this;
            this.shopURL = "";
            this.searchValue = "";
            this.searchFormElement = null;
            this.resultsListElement = null;
            this.inputElement = null;
            this.init = function () {
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
                _this.searchFormElement.addEventListener("submit", _this.onSearchFormSubmit);
                // Clicking outside makes the results disappear.
                // document.addEventListener("click", this.onDocumentClick);
                // if this search autocomplete is inside of a dropdown then set up autofocus
                if (_this.searchFormElement.closest("[data-dropdown-id]")) {
                    window.addEventListener("header-dropdown:opened", function (evt) {
                        var dropdown = evt.detail.dropdown;
                        if (dropdown.id === "search") {
                            _this.inputElement.focus();
                        }
                    });
                    window.addEventListener("header-dropdown:closed", function (evt) {
                        var dropdown = evt.detail.dropdown;
                        if (dropdown.id === "search") {
                            _this.inputElement.blur();
                        }
                    });
                }
                return _this;
            };
            this.showDropdown = function () {
                _this.resultsListElement.classList.remove("u-hidden");
            };
            this.hideDropdown = function () {
                _this.resultsListElement.classList.add("u-hidden");
            };
            this.unload = function () { };
            this.onDocumentClick = function (event) {
                if (!_this.searchFormElement.isSameNode(event.target) &&
                    !_this.searchFormElement.contains(event.target)) {
                    _this.hideDropdown();
                }
            };
            this.onSearchFormSubmit = function (event) {
                event.preventDefault();
                console.log("search");
                var url = _this.getSearchPageUrl(_this.searchValue + "*");
                window.location.assign(url);
                _this.fetchAndDisplaySearchResults();
            };
            this.onSearchInputKeyup = debounce(function () {
                _this.searchValue = _this.inputElement.value;
                if (_this.searchValue === "") {
                    _this.hideDropdown();
                    return;
                }
                if (_this.searchValue.length < 3) {
                    return;
                }
                _this.fetchAndDisplaySearchResults();
            }, 250);
            this.getSearchPageUrl = function (searchValue) {
                var cleanedValue = encodeURI(searchValue);
                return _this.searchPath + cleanedValue;
            };
            this.getSearchUrl = function (searchValue) {
                var cleanedValue = encodeURI(searchValue);
                var searchURL = _this.searchPath + cleanedValue;
                var fullSearchUrl = "".concat(searchURL, "*&view=json");
                return fullSearchUrl;
            };
            this.fetchAndDisplaySearchResults = function () {
                return _this.fetchSearchResults(_this.searchValue).then(function (_a) {
                    var searchValue = _a.searchValue, searchUrl = _a.searchUrl, resultsList = _a.resultsList, totalResults = _a.totalResults;
                    if (searchValue !== _this.searchValue) {
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
            };
            this.fetchSearchResults = function (searchValue) {
                var searchUrl = _this.getSearchUrl(searchValue);
                return fetch(searchUrl)
                    .then(function (response) { return response.json(); })
                    .then(function (data) {
                    return {
                        searchValue: searchValue,
                        searchUrl: searchUrl,
                        resultsList: data.results,
                        totalResults: data.results_count
                    };
                });
            };
            this.searchFormElement = searchFormElement;
        }
        return SearchAutocomplete;
    }());

    var SearchAutocompleteManager = /** @class */ (function () {
        function SearchAutocompleteManager() {
            var _this = this;
            this.initialize = function () {
                var searchFormElements = document.querySelectorAll("form.search_form, form.search, form.header_search_form, form.header__search-form");
                _this.searchAutocompletes = Array.from(searchFormElements).map(function (searchFormElement) {
                    return new SearchAutocomplete(searchFormElement).init();
                });
            };
            this.unload = function () {
                _this.searchAutocompletes.forEach(function (searchAutocomplete) {
                    searchAutocomplete.unload();
                });
            };
        }
        return SearchAutocompleteManager;
    }());

    var PromoBanner = /** @class */ (function () {
        function PromoBanner() {
            this.showPromoBanner = function () {
                document.body.classList.add("promo-banner-show");
                window.dispatchEvent(new Event('header:resize'));
            };
            this.hidePromoBanner = function () {
                document.body.classList.remove("promo-banner-show");
                // @ts-ignore TODO - switch to npm library instead
                Cookies.set("promo-banner", "dismiss", { expires: 30 });
                window.dispatchEvent(new Event('header:resize'));
            };
            // this.element = document.querySelector(".promo-banner");
        }
        PromoBanner.prototype.initialize = function () {
            var _this = this;
            // @ts-ignore TODO - switch to npm library instead
            if (Cookies.get("promo-banner") === "dismiss") {
                return;
            }
            this.showPromoBanner();
            this.closeButtonElements = Array.from(document.querySelectorAll(".js-promo-banner-close"));
            this.closeButtonElements.forEach(function (closeButton) {
                closeButton.addEventListener("click", _this.hidePromoBanner);
            });
            return this;
        };
        PromoBanner.prototype.unload = function () {
            var _this = this;
            this.closeButtonElements.forEach(function (closeButton) {
                closeButton.removeEventListener("click", _this.hidePromoBanner);
            });
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
    function __spreadArray(to, from, pack) {
      if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
      return to.concat(ar || Array.prototype.slice.call(from));
    }

    var BodyScroll = /** @class */ (function () {
        function BodyScroll() {
        }
        BodyScroll.lock = function (type) {
            if (type === void 0) { type = 'menu'; }
            var className = "".concat(type, "-is-open");
            document.body.classList.add(className);
        };
        BodyScroll.unlock = function (type) {
            if (type === void 0) { type = 'menu'; }
            var className = "".concat(type, "-is-open");
            document.body.classList.remove(className);
        };
        return BodyScroll;
    }());

    var HeaderDrawerUnderlay = /** @class */ (function () {
        function HeaderDrawerUnderlay() {
            this.element = document.querySelector(".header-drawer-underlay");
        }
        HeaderDrawerUnderlay.prototype.show = function () {
            var _this = this;
            this.element.classList.add("is-active");
            this.element.classList.add("animated", "animated--snappy", "fadeIn");
            this.element.addEventListener("animationend", function () {
                _this.element.classList.remove("animated", "fadeIn");
            }, { once: true });
        };
        HeaderDrawerUnderlay.prototype.hide = function () {
            var _this = this;
            this.element.classList.add("animated", "animated--snappy", "fadeOut");
            this.element.addEventListener("animationend", function () {
                _this.element.classList.remove("animated", "animated--snappy", "fadeOut", "is-active");
            }, { once: true });
        };
        return HeaderDrawerUnderlay;
    }());

    var HeaderDrawer = /** @class */ (function () {
        function HeaderDrawer(_a) {
            var _this = this;
            var drawerElement = _a.drawerElement, onButtonClick = _a.onButtonClick;
            this.isOpen = false;
            this.unload = function () { };
            this.open = function () {
                _this.isOpen = true;
                _this.drawerElement.classList.add("is-active");
                setTimeout(function () {
                    _this.drawerElement.classList.add("is-open");
                    _this.buttonElements.forEach(function (element) {
                        element.classList.add("is-open");
                    });
                });
            };
            this.close = function () {
                _this.isOpen = false;
                _this.drawerElement.classList.remove("is-open");
                _this.buttonElements.forEach(function (element) {
                    element.classList.remove("is-open");
                });
                _this.drawerElement.addEventListener('transitionend', function () {
                    _this.drawerElement.classList.remove("is-active");
                }, { once: true });
            };
            this.drawerElement = drawerElement;
            this.onButtonClick = onButtonClick;
        }
        HeaderDrawer.prototype.initialize = function () {
            var _this = this;
            this.id = this.drawerElement.getAttribute("data-drawer-id");
            this.buttonElements = Array.from(document.querySelectorAll("[data-drawer-button-id=\"".concat(this.id, "\"]")));
            this.buttonElements.forEach(function (element) {
                element.addEventListener("click", function (event) {
                    _this.onButtonClick(event, _this);
                });
            });
            return this;
        };
        return HeaderDrawer;
    }());

    var HeaderDrawerManager = /** @class */ (function () {
        function HeaderDrawerManager() {
            var _this = this;
            this.onDrawerButtonClick = function (event, drawer) {
                event.preventDefault();
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
                    event.target instanceof Element &&
                    event.target.closest("[data-drawer-id]") === null &&
                    event.target.closest("[data-drawer-button-id]") === null) {
                    _this.closeDrawer(_this.getCurrentOpenDrawer());
                }
            };
            this.onWindowResize = debounce(function () {
                var currentOpenDrawer = _this.getCurrentOpenDrawer();
                if (currentOpenDrawer) {
                    _this.closeDrawer(currentOpenDrawer);
                }
            }, 100);
            this.getCurrentOpenDrawer = function () {
                if (!_this.currentOpenDrawerId) {
                    return null;
                }
                return _this.drawerIdMap[_this.currentOpenDrawerId];
            };
            this.closeCurrentOpenDrawer = function () {
                var currentOpenDrawer = _this.getCurrentOpenDrawer();
                if (currentOpenDrawer) {
                    _this.closeDrawer(currentOpenDrawer);
                }
            };
            this.openDrawer = function (drawer) {
                drawer.open();
                _this.currentOpenDrawerId = drawer.id;
                BodyScroll.lock();
                _this.drawerUnderlay.show();
            };
            this.closeDrawer = function (drawer) {
                drawer.close();
                _this.currentOpenDrawerId = null;
                BodyScroll.unlock();
                _this.drawerUnderlay.hide();
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
            this.drawerUnderlay = new HeaderDrawerUnderlay();
            document.body.addEventListener("click", this.onBodyClick);
            window.addEventListener("resize", this.onWindowResize);
            return this;
        };
        return HeaderDrawerManager;
    }());

    var HeaderDropdownUnderlay = /** @class */ (function () {
        function HeaderDropdownUnderlay() {
            this.element = document.querySelector(".header-dropdown-underlay");
        }
        HeaderDropdownUnderlay.prototype.show = function () {
            this.element.classList.add("is-active");
        };
        HeaderDropdownUnderlay.prototype.hide = function () {
            this.element.classList.remove("is-active");
        };
        return HeaderDropdownUnderlay;
    }());

    var ACTIVE_BUTTON_CLASSNAME = "is-active";
    var OPEN_CLASSNAME$1 = "is-open";
    var HeaderDropdown = /** @class */ (function () {
        function HeaderDropdown(_a) {
            var _this = this;
            var dropdownElement = _a.dropdownElement, onDropdownButtonMouseOver = _a.onDropdownButtonMouseOver, onDropdownButtonClick = _a.onDropdownButtonClick;
            this.isOpen = false;
            this.initialize = function () {
                _this.id = _this.dropdownElement.getAttribute("data-dropdown-id");
                _this.buttonElements = Array.from(document.querySelectorAll("[data-dropdown-button-id=\"".concat(_this.id, "\"]")));
                _this.activationType = (_this.dropdownElement.getAttribute("data-dropdown-activation-type") || "hover");
                _this.buttonElements.forEach(function (element) {
                    element.classList.add("is-dropdown-button");
                    element.addEventListener("mouseover", _this.onDropdownButtonMouseOverInternal);
                    element.addEventListener("click", _this.onDropdownButtonClickInternal);
                });
                return _this;
            };
            this.open = function () {
                _this.isOpen = true;
                _this.buttonElements.forEach(function (buttonElement) {
                    buttonElement.classList.add(ACTIVE_BUTTON_CLASSNAME);
                });
                _this.dropdownElement.classList.add(OPEN_CLASSNAME$1);
            };
            this.close = function () {
                _this.isOpen = false;
                _this.buttonElements.forEach(function (buttonElement) {
                    buttonElement.classList.remove(ACTIVE_BUTTON_CLASSNAME);
                });
                _this.dropdownElement.classList.remove(OPEN_CLASSNAME$1);
            };
            this.toggle = function (shouldOpen) {
                shouldOpen ? _this.open() : _this.close();
            };
            this.onDropdownButtonMouseOverInternal = function (event) {
                _this.onDropdownButtonMouseOver(event, _this);
            };
            this.onDropdownButtonClickInternal = function (event) {
                _this.onDropdownButtonClick(event, _this);
            };
            this.dropdownElement = dropdownElement;
            this.onDropdownButtonMouseOver = onDropdownButtonMouseOver;
            this.onDropdownButtonClick = onDropdownButtonClick;
        }
        HeaderDropdown.prototype.unload = function () {
            var _this = this;
            this.buttonElements.forEach(function (element) {
                element.classList.remove("is-dropdown-button");
                element.removeEventListener("mouseover", _this.onDropdownButtonMouseOverInternal);
                element.removeEventListener("click", _this.onDropdownButtonClickInternal);
            });
        };
        return HeaderDropdown;
    }());

    var DropdownManager = /** @class */ (function () {
        function DropdownManager() {
            var _this = this;
            this.currentDropdownId = null;
            this.onBodyClick = function (event) {
                var currentOpenDropdown = _this.getCurrentOpenDropdown();
                if (currentOpenDropdown &&
                    currentOpenDropdown.activationType === "click" &&
                    event.target instanceof Element &&
                    event.target.closest("[data-dropdown-id]") === null &&
                    event.target.closest("[data-dropdown-button-id]") === null) {
                    _this.closeCurrentOpenDropdown();
                }
            };
            this.onDropdownButtonMouseOver = function (event, dropdown) {
                var currentOpenDropdown = _this.getCurrentOpenDropdown();
                if (currentOpenDropdown && currentOpenDropdown.activationType === "click") {
                    return;
                }
                if (dropdown.activationType === "click") {
                    return;
                }
                _this.closeCurrentOpenDropdown();
                _this.openDropdown(dropdown);
            };
            // TODO - check
            this.onHeaderMouseOut = function (event) {
                var currentOpenDropdown = _this.getCurrentOpenDropdown();
                if (!currentOpenDropdown || currentOpenDropdown.activationType === "click") {
                    return;
                }
                var toElement = event.relatedTarget;
                // If the mouse is no longer within the header content, area hide the dropdown
                // if (toElement && !toElement.closest(".header-content-wrapper")) {
                if (toElement &&
                    !toElement.closest(".header-desktop__navbar") &&
                    !toElement.closest('.vm-header-drawer__content')) {
                    _this.closeCurrentOpenDropdown();
                }
            };
            this.onDropdownButtonClick = function (event, dropdown) {
                event.preventDefault();
                var currentOpenDropdown = _this.getCurrentOpenDropdown();
                if (currentOpenDropdown) {
                    _this.closeDropdown(currentOpenDropdown);
                    if (currentOpenDropdown.id !== dropdown.id) {
                        _this.openDropdown(dropdown);
                    }
                }
                else {
                    _this.openDropdown(dropdown);
                }
            };
            this.getCurrentOpenDropdown = function () { return _this.dropdownMap[_this.currentDropdownId]; };
            this.closeCurrentOpenDropdown = function () {
                var currentDropdown = _this.getCurrentOpenDropdown();
                if (currentDropdown) {
                    _this.closeDropdown(currentDropdown);
                }
            };
            this.openDropdown = function (dropdown) {
                _this.currentDropdownId = dropdown.id;
                dropdown.open();
                _this.headerUnderlay.show();
                window.dispatchEvent(new CustomEvent("header-dropdown:opened", { detail: { dropdown: dropdown } }));
            };
            this.closeDropdown = function (dropdown) {
                dropdown.close();
                _this.currentDropdownId = null;
                window.dispatchEvent(new CustomEvent("header-dropdown:closed", { detail: { dropdown: dropdown } }));
                _this.headerUnderlay.hide();
            };
        }
        DropdownManager.prototype.initialize = function () {
            var _this = this;
            this.headerContentWrapperElement = document.querySelector(".header-content-wrapper");
            this.headerContentWrapperElement.addEventListener("mouseout", this.onHeaderMouseOut);
            this.headerUnderlay = new HeaderDropdownUnderlay();
            this.dropdownElements = document.querySelectorAll(".vm-header-dropdown");
            this.dropdownMap = Array.from(this.dropdownElements).reduce(function (acc, dropdownElement) {
                var _a;
                var dropdown = new HeaderDropdown({
                    dropdownElement: dropdownElement,
                    onDropdownButtonMouseOver: _this.onDropdownButtonMouseOver,
                    onDropdownButtonClick: _this.onDropdownButtonClick
                }).initialize();
                return _assign(_assign({}, acc), (_a = {}, _a[dropdown.id] = dropdown, _a));
            }, {});
            this.dropdownIds = Object.keys(this.dropdownMap);
            document.body.addEventListener("click", this.onBodyClick);
            // document.body.addEventListener("shopify:section:load")
            return this;
        };
        DropdownManager.prototype.unload = function () {
            var _this = this;
            this.headerContentWrapperElement.removeEventListener("mouseout", this.onHeaderMouseOut);
            this.dropdownIds.forEach(function (dropdownId) {
                var dropdown = _this.dropdownMap[dropdownId];
                dropdown.unload();
            });
            document.documentElement.removeEventListener("mouseleave", this.closeCurrentOpenDropdown);
        };
        DropdownManager.prototype.reset = function () {
            this.unload();
            this.initialize();
        };
        return DropdownManager;
    }());

    var HEADER_SECTIONS = [
        'header',
        'mega-menu-1',
        'mega-menu-2',
        'mega-menu-3',
        'mega-menu-4',
        'mega-menu-5',
        'mega-menu-6',
    ];
    var SELECTORS$6 = {
        wrapper: ".header-wrapper"
    };
    var Header = /** @class */ (function () {
        function Header() {
            this.headerWrapperElement = null;
        }
        Header.prototype.initialize = function () {
            var _this = this;
            this.headerWrapperElement = document.querySelector(SELECTORS$6.wrapper);
            document.addEventListener("shopify:section:load", function (event) {
                if (HEADER_SECTIONS.includes(event.detail.sectionId)) {
                    _this.reset();
                }
            });
            this.promoBanner = new PromoBanner().initialize();
            this.drawerManager = new HeaderDrawerManager().initialize();
            this.dropdownManager = new DropdownManager().initialize();
        };
        Header.prototype.unload = function () {
            // this.promoBanner.reset();
            // this.drawerManager.reset();
            this.dropdownManager.reset();
        };
        Header.prototype.reset = function () {
            this.unload();
            this.initialize();
        };
        return Header;
    }());

    var Cart = /** @class */ (function () {
        function Cart() {
            this.initialize = function () {
                if ($("#cart_form .tos_agree")) {
                    $("body").on("click", "#cart_form input[type='submit']", function () {
                        if (!$(this).parents("form").find(".tos_agree").is(":checked")) {
                            var e = '<p class="warning animated bounceIn">' +
                                Shopify.translation.agree_to_terms_warning +
                                "</p>";
                            return 0 == $("p.warning").length && $(this).before(e);
                        }
                        $(this).submit();
                    });
                }
            };
        }
        return Cart;
    }());

    var OPEN_CLASSNAME = "is-open";
    var Accordion = /** @class */ (function () {
        function Accordion(_a) {
            var _this = this;
            var contentElement = _a.contentElement;
            this.isOpen = false;
            this.onOpen = function () { };
            this.onClose = function () { };
            this.initialize = function () {
                _this.id = _this.contentElement.getAttribute("data-accordion-id");
                _this.buttonElements = Array.from(document.querySelectorAll("[data-accordion-button-id=".concat(_this.id, "]")));
                _this.buttonElements.forEach(function (buttonElement) {
                    buttonElement.addEventListener("click", _this.onButtonClick);
                });
                var defaultOpenState = _this.contentElement.getAttribute("data-accordion-is-open");
                _this.toggle(defaultOpenState === 'true');
                return _this;
            };
            this.onButtonClick = function () {
                _this.toggle(!_this.isOpen);
            };
            this.getGroupId = function () {
                var accordionGroupId = _this.contentElement.getAttribute("data-accordion-group-id");
                if (!accordionGroupId) {
                    accordionGroupId = 'default';
                    _this.contentElement.setAttribute("data-accordion-group-id", 'default');
                }
                return accordionGroupId;
            };
            this.open = function () {
                _this.isOpen = true;
                _this.contentElement.classList.add(OPEN_CLASSNAME);
                _this.buttonElements.forEach(function (buttonElement) {
                    buttonElement.classList.add(OPEN_CLASSNAME);
                });
                _this.onOpen(_this);
                // slideDown-style animation
                _this.contentElement.style.height = "auto";
                var height = _this.contentElement.clientHeight + "px";
                _this.contentElement.style.height = "0";
                setTimeout(function () {
                    _this.contentElement.style.height = height;
                }, 0);
            };
            this.close = function () {
                _this.isOpen = false;
                _this.buttonElements.forEach(function (buttonElement) {
                    buttonElement.classList.remove(OPEN_CLASSNAME);
                });
                _this.onClose(_this);
                // slideDown-style animation
                _this.contentElement.style.height = "0";
                _this.contentElement.addEventListener("transitionend", function () {
                    // Check this.isOpen to avoid animation weirdness if the button
                    // is clicked on before the transition ends
                    if (!_this.isOpen) {
                        _this.contentElement.classList.remove(OPEN_CLASSNAME);
                    }
                }, {
                    once: true
                });
            };
            this.toggle = function (shouldOpen) {
                shouldOpen ? _this.open() : _this.close();
            };
            this.contentElement = contentElement;
        }
        return Accordion;
    }());

    var AccordionGroup = /** @class */ (function () {
        function AccordionGroup(id, options) {
            var _this = this;
            if (options === void 0) { options = {}; }
            this.options = {
                singleAccordionOpenOnly: false
            };
            this.accordionMap = {};
            this.onAccordionOpen = function (accordion) {
                if (_this.options.singleAccordionOpenOnly) {
                    _this.closeAllAccordionsExcept(accordion.id);
                }
            };
            this.id = id;
            this.options = _assign(_assign({}, this.options), options);
        }
        AccordionGroup.prototype.initialize = function () {
            var wrapperElement = document.querySelector("[data-accordion-group-wrapper=\"".concat(this.id, "\"]"));
            if (wrapperElement) {
                // initialize options
                var singleAccordionOpenOnly = wrapperElement.getAttribute('data-accordion-group-option-single-open-only');
                this.options.singleAccordionOpenOnly = singleAccordionOpenOnly === "true";
            }
            return this;
        };
        AccordionGroup.prototype.addAccordion = function (accordion) {
            this.accordionMap[accordion.id] = accordion;
            accordion.onOpen = this.onAccordionOpen;
        };
        AccordionGroup.prototype.closeAllAccordionsExcept = function (targetAccordionId) {
            var _this = this;
            Object.keys(this.accordionMap).forEach(function (accordionId) {
                if (accordionId !== targetAccordionId) {
                    var accordion = _this.accordionMap[accordionId];
                    accordion.close();
                }
            });
        };
        return AccordionGroup;
    }());

    var AccordionManager = /** @class */ (function () {
        function AccordionManager() {
            var _this = this;
            this.accordionGroupMap = {
                "default": new AccordionGroup('default', { singleAccordionOpenOnly: false })
            };
            this.initialize = function () {
                _this.accordionElements = Array.from(document.querySelectorAll(".vm-accordion-content"));
                _this.accordionGroupMap = {};
                _this.accordionElements.forEach(function (contentElement) {
                    // Determine which accordion group this belongs to
                    var accordionGroupId = contentElement.getAttribute("data-accordion-group-id");
                    if (!accordionGroupId) {
                        accordionGroupId = 'default';
                        contentElement.setAttribute("data-accordion-group-id", 'default');
                    }
                    // Create accordion and add it to group
                    var accordion = new Accordion({ contentElement: contentElement }).initialize();
                    var accordionGroup = _this.accordionGroupMap[accordionGroupId];
                    if (!accordionGroup) {
                        // Create new accordion group
                        accordionGroup = new AccordionGroup(accordionGroupId).initialize();
                        _this.accordionGroupMap[accordionGroupId] = accordionGroup;
                    }
                    accordionGroup.addAccordion(accordion);
                });
                return _this;
            };
        }
        return AccordionManager;
    }());

    var SELECTORS$5 = {
        PRODUCT_CARD: '.product-card',
        MEDIA_WRAPPER: '.product-card__media',
        PRIMARY_MEDIA: '.product-card__primary-media',
        SECONDARY_MEDIA: '.product-card__primary-media'
    };
    var IS_HOVERED_CLASSNAME = 'is-hovered';
    var ProductCard = /** @class */ (function () {
        function ProductCard(el) {
            var _this = this;
            this.initialize = function () {
                _this.mediaWrapperElement = _this.element.querySelector(SELECTORS$5.MEDIA_WRAPPER);
                _this.primaryMedia = _this.mediaWrapperElement.children[0];
                _this.secondaryMedia = _this.mediaWrapperElement.children[1];
                if (_this.secondaryMedia.tagName === 'VIDEO') {
                    _this.secondaryMedia.pause();
                }
                _this.element.addEventListener('mouseover', _this.onLinkMouseOver);
                _this.element.addEventListener('mouseout', _this.onLinkMouseOut);
                return _this;
            };
            this.unload = function () {
                _this.element.removeEventListener('mouseover', _this.onLinkMouseOver);
                _this.element.removeEventListener('mouseout', _this.onLinkMouseOut);
            };
            this.onLinkMouseOver = function () {
                _this.element.classList.add(IS_HOVERED_CLASSNAME);
                if (_this.secondaryMedia.tagName === 'VIDEO') {
                    _this.secondaryMedia.play();
                }
            };
            this.onLinkMouseOut = function () {
                _this.element.classList.remove(IS_HOVERED_CLASSNAME);
                if (_this.secondaryMedia.tagName === 'VIDEO') {
                    console.log('pausing');
                    _this.secondaryMedia.currentTime = 0;
                    _this.secondaryMedia.pause();
                }
            };
            this.element = el;
        }
        return ProductCard;
    }());
    var ProductCardsManager = /** @class */ (function () {
        function ProductCardsManager() {
            var _this = this;
            this.initialize = function () {
                _this.setProductCards();
                window.addEventListener('product-recommendations-loaded', _this.reset);
                window.addEventListener('collection-filters-updated', _this.reset);
            };
            this.unload = function () {
                _this.productCards.forEach(function (productCard) {
                    productCard.unload();
                });
                window.removeEventListener('product-recommendations-loaded', _this.reset);
                window.removeEventListener('collection-filters-updated', _this.reset);
            };
            this.setProductCards = function () {
                _this.productCards =
                    Array.from(document.querySelectorAll(SELECTORS$5.PRODUCT_CARD))
                        .map(function (element) { return new ProductCard(element).initialize(); });
            };
            this.reset = function () {
                _this.productCards.forEach(function (productCard) {
                    productCard.unload();
                });
                _this.setProductCards();
            };
        }
        return ProductCardsManager;
    }());

    var ATTRIBUTES$1 = {
        MODAL_TOGGLE_ELEMENT_INDEX: 'data-product-images-modal-toggle-index'
    };
    var SELECTORS$4 = {
        MODAL_TOGGLE_ELEMENT: "[data-product-images-modal-toggle]",
        MODAL_TOGGLE_ELEMENT_INDEX: "[".concat(ATTRIBUTES$1.MODAL_TOGGLE_ELEMENT_INDEX, "]"),
        MODAL_WRAPPER: ".product-images-modal-wrapper",
        MODAL: ".product-images-modal",
        MODAL_UNDERLAY: ".product-images-modal__underlay",
        MODAL_CONTENT: ".product-images-modal__content",
        MODAL_THUMBNAIL_LIST_WRAPPER: ".product-images-modal__thumbnail-list",
        MODAL_THUMBNAIL: ".product-images-modal__thumbnail",
        MODAL_IMAGE_CELL: ".product-images-modal__image-cell",
        MODAL_IMAGE_CELL_LIST_WRAPPER: ".product-images-modal__image-cell-list",
        MODAL_CLOSE_BUTTON: ".product-images-modal__close-button"
    };
    var ProductImagesDesktop = /** @class */ (function () {
        function ProductImagesDesktop() {
            var _this = this;
            this.modalToggleElements = [];
            this.state = {
                modalIsOpen: false,
                isAnimating: false,
                selectedModalImageIndex: 0
            };
            this.unload = function () {
                // remove event listeners
                _this.modalContentElement.removeEventListener("click", _this.onModalContentClick);
                _this.modalToggleElements.forEach(function (element) {
                    element.removeEventListener("click", _this.onModalToggleElementClick);
                });
                _this.modalImageCellListWrapperElement.removeEventListener('wheel', _this.onModalImagesWheel);
                document.removeEventListener("keydown", _this.onKeyPressed);
                document.removeEventListener('resize', _this.onWindowResize);
                window.removeEventListener('resize', _this.debouncedSetModalImageScrollTopIndicies);
            };
            this.onModalThumbnailClick = function (e) {
                var thumbnailWrapper = e.target.closest(SELECTORS$4.MODAL_THUMBNAIL);
                var indexAsString = thumbnailWrapper.getAttribute("data-index");
                var index = parseInt(indexAsString, 10);
                _this.setSelectedModalImage(index);
            };
            this.onModalToggleElementClick = function (e) {
                var element = e.target.closest(SELECTORS$4.MODAL_TOGGLE_ELEMENT);
                if (_this.state.modalIsOpen) {
                    _this.closeModal();
                }
                else {
                    var imageIndexAsString = element.getAttribute(ATTRIBUTES$1.MODAL_TOGGLE_ELEMENT_INDEX);
                    var imageIndex = (imageIndexAsString) ? parseInt(imageIndexAsString) : 0;
                    console.log('imageIndex', imageIndex);
                    _this.openModal(imageIndex);
                }
            };
            this.onModalContentClick = function (e) {
                e.stopPropagation();
                var targetElement = e.target;
                if (!targetElement.closest(SELECTORS$4.MODAL_THUMBNAIL_LIST_WRAPPER) &&
                    !targetElement.closest(SELECTORS$4.MODAL_IMAGE_CELL_LIST_WRAPPER)) {
                    _this.closeModal();
                }
            };
            this.onKeyPressed = function (e) {
                if (e.key === "Escape" && _this.state.modalIsOpen) {
                    _this.closeModal();
                }
            };
            this.onWindowResize = function () {
                _this.setModalImageScrollTopIndicies();
            };
            this.onModalImagesWheel = function () {
                var currentScrollTop = _this.modalImageCellListWrapperElement.scrollTop;
                var currentImageIndex = 0;
                for (var index = _this.modalImageScrollTopIndicies.length - 1; index >= 0; index--) {
                    var scrollTop = _this.modalImageScrollTopIndicies[index];
                    if (currentScrollTop > scrollTop) {
                        currentImageIndex = index;
                        break;
                    }
                }
                if (currentImageIndex != _this.state.selectedModalImageIndex) {
                    _this.setSelectedModalImage(currentImageIndex, { scroll: false });
                }
            };
            this.setModalImageScrollTopIndicies = function () {
                console.log('setModalImageScrollTopIndicies');
                _this.modalImageScrollTopIndicies = _this.modalImageCellElementList.map(function (element, index) {
                    return element.offsetTop;
                });
            };
            this.setSelectedModalImage = function (index, _a) {
                var _b = _a === void 0 ? {} : _a, _c = _b.scroll, scroll = _c === void 0 ? true : _c;
                _this.modalThumbnailElementList[_this.state.selectedModalImageIndex].classList.remove('is-active');
                _this.state.selectedModalImageIndex = index;
                _this.modalThumbnailElementList[_this.state.selectedModalImageIndex].classList.add('is-active');
                if (scroll) {
                    _this.scrollToSelectedModalImage();
                }
            };
            this.scrollToSelectedModalImage = function () {
                var newScrollTop = _this.modalImageScrollTopIndicies[_this.state.selectedModalImageIndex];
                _this.modalImageCellListWrapperElement.scrollTo({
                    top: newScrollTop,
                    behavior: 'smooth'
                });
            };
            this.openModal = function (imageIndex) {
                if (_this.state.isAnimating) {
                    return;
                }
                BodyScroll.lock('modal');
                _this.modalWrapperElement.classList.add('is-active');
                _this.modalElement.classList.add('animated', 'animated--snappy', 'fadeIn');
                _this.state.isAnimating = true;
                _this.setSelectedModalImage(imageIndex);
                _this.modalElement.addEventListener('animationend', function () {
                    _this.state.modalIsOpen = true;
                    _this.state.isAnimating = false;
                    _this.modalElement.classList.remove('animated', 'animated--snappy', 'fadeIn');
                    _this.setModalImageScrollTopIndicies();
                    _this.scrollToSelectedModalImage();
                }, { once: true });
            };
            this.closeModal = function () {
                if (_this.state.isAnimating) {
                    return;
                }
                BodyScroll.unlock('modal');
                _this.modalElement.classList.add('animated', 'animated--snappy', 'fadeOut');
                _this.state.isAnimating = true;
                _this.modalElement.addEventListener('animationend', function () {
                    _this.state.isAnimating = false;
                    _this.state.modalIsOpen = false;
                    _this.modalWrapperElement.classList.remove('is-active');
                    _this.modalElement.classList.remove('animated', 'animated--snappy', 'fadeOut');
                }, { once: true });
            };
        }
        ProductImagesDesktop.prototype.initialize = function () {
            var _this = this;
            this.modalToggleElements = Array.from(document.querySelectorAll(SELECTORS$4.MODAL_TOGGLE_ELEMENT));
            this.modalToggleElements.forEach(function (element) {
                element.addEventListener("click", _this.onModalToggleElementClick);
            });
            this.modalWrapperElement = document.querySelector(SELECTORS$4.MODAL_WRAPPER);
            this.modalElement = document.querySelector(SELECTORS$4.MODAL);
            this.modalContentElement = document.querySelector(SELECTORS$4.MODAL_CONTENT);
            this.modalThumbnailElementList =
                Array.from(document.querySelectorAll(SELECTORS$4.MODAL_THUMBNAIL));
            this.modalImageCellListWrapperElement =
                document.querySelector(SELECTORS$4.MODAL_IMAGE_CELL_LIST_WRAPPER);
            this.modalImageCellElementList =
                Array.from(document.querySelectorAll(SELECTORS$4.MODAL_IMAGE_CELL));
            this.setModalImageScrollTopIndicies();
            // Add event listeners
            this.modalContentElement.addEventListener("click", this.onModalContentClick);
            this.modalThumbnailElementList.forEach(function (element) {
                element.addEventListener('click', _this.onModalThumbnailClick);
            });
            this.modalImageCellListWrapperElement.addEventListener('wheel', this.onModalImagesWheel);
            document.addEventListener("keydown", this.onKeyPressed);
            document.addEventListener('resize', this.onWindowResize);
            this.debouncedSetModalImageScrollTopIndicies = debounce(this.setModalImageScrollTopIndicies, 100);
            window.addEventListener('resize', this.debouncedSetModalImageScrollTopIndicies);
            return this;
        };
        ProductImagesDesktop.isOnProductPage = function () { return !!document.querySelector('.product-template'); };
        return ProductImagesDesktop;
    }());

    var SELECTORS$3 = {
        PRODUCT_IMAGES_CONTAINER: '.product-images-mobile__images-container',
        PRODUCT_IMAGES_CONTAINER_INNER: '.product-images-mobile__images-container__inner',
        PRODUCT_IMAGE: '.product-images-mobile__image',
        DOTS: '.product-images-mobile__dots',
        DOT: '.product-images-mobile__dots__dot'
    };
    var getScreenCoordinatesDiff = function (a, b) { return ({
        x: Math.floor(a.x - b.x),
        y: Math.floor(a.y - b.y)
    }); };
    var SWIPE_PERCENTAGE_THRESHOLD = 40;
    var ProductImagesMobile = /** @class */ (function () {
        function ProductImagesMobile() {
            var _this = this;
            this.elements = {
                imagesContainer: null,
                imagesContainerInner: null,
                images: [],
                dots: []
            };
            this.state = {
                currentImageIndex: 0,
                isSwiping: false,
                touchStartCoordinates: null,
                currentTouchCoordinates: null
            };
            this.unload = function () {
            };
            this.setImageContainerDimensions = function () {
                _this.imageContainerDimensions = {
                    width: _this.elements.imagesContainer.getBoundingClientRect().width,
                    offsetTop: _this.elements.imagesContainer.getBoundingClientRect().top
                };
            };
            this.onContainerTouchStart = function (e) {
                var touch = e.touches[0];
                _this.state.touchStartCoordinates = {
                    x: touch.clientX,
                    y: touch.clientY
                };
                _this.state.currentTouchCoordinates = _assign({}, _this.state.touchStartCoordinates);
            };
            this.onContainerTouchMove = function (e) {
                // prevent vertical scroll
                e.preventDefault();
                var touch = e.touches[0];
                _this.state.currentTouchCoordinates = {
                    x: touch.clientX,
                    y: touch.clientY
                };
                var difference = _this.getCurrentCoordinatesDiff();
                _this.elements.imagesContainerInner.classList.add('is-active');
                var clampThreshold = _this.imageContainerDimensions.width * 0.95;
                var clampedXDiff = Math.max(Math.min(difference.x, clampThreshold), -clampThreshold);
                _this.setImageContainerInnerOffset(clampedXDiff);
            };
            this.onContainerTouchEnd = function (e) {
                _this.elements.imagesContainerInner.classList.remove('is-active');
                _this.setImageContainerInnerOffset();
                var difference = _this.getCurrentCoordinatesDiff();
                // Attempt to switch to image if user has swiped far enough
                if (Math.abs(difference.x) >= SWIPE_PERCENTAGE_THRESHOLD) {
                    var newImageIndex = _this.state.currentImageIndex + (difference.x > 0 ? -1 : 1);
                    if (newImageIndex >= 0 && newImageIndex <= _this.elements.images.length - 1) {
                        _this.switchToImage(newImageIndex);
                    }
                }
                _this.state.touchStartCoordinates = null;
                _this.state.currentTouchCoordinates = null;
            };
            this.onDotClick = function (e) {
                var imageIndex = e.target.getAttribute('data-image-index');
                var imageIndexAsInt = parseInt(imageIndex, 10);
                _this.switchToImage(imageIndexAsInt);
            };
            this.getCurrentCoordinatesDiff = function () {
                var _a = _this.state, currentTouchCoordinates = _a.currentTouchCoordinates, touchStartCoordinates = _a.touchStartCoordinates;
                return getScreenCoordinatesDiff(currentTouchCoordinates, touchStartCoordinates);
            };
            this.switchToImage = function (index) {
                if (index === _this.state.currentImageIndex)
                    return;
                _this.toggleDotActiveState(_this.state.currentImageIndex, false);
                _this.state.currentImageIndex = index;
                _this.setImageContainerInnerOffset();
                _this.toggleDotActiveState(_this.state.currentImageIndex, true);
            };
            this.getCurrentImageIndexPixelOffset = function () { return (_this.imageContainerDimensions.width * _this.state.currentImageIndex); };
            this.setImageContainerInnerOffset = function (xDiff) {
                if (xDiff === void 0) { xDiff = 0; }
                var containerInnerOffset = _this.getCurrentImageIndexPixelOffset();
                _this.elements.imagesContainerInner.style.transform = "translateX(".concat((-containerInnerOffset) + xDiff, "px)");
            };
            this.toggleDotActiveState = function (index, isActive) {
                _this.elements.dots[index].classList.toggle('is-active', isActive);
            };
        }
        ProductImagesMobile.prototype.initialize = function () {
            var _this = this;
            this.elements.imagesContainer = document.querySelector(SELECTORS$3.PRODUCT_IMAGES_CONTAINER);
            this.elements.imagesContainer.addEventListener('touchstart', this.onContainerTouchStart);
            this.elements.imagesContainer.addEventListener('touchend', this.onContainerTouchEnd);
            this.elements.imagesContainer.addEventListener('touchmove', this.onContainerTouchMove);
            this.setImageContainerDimensions();
            window.addEventListener('resize', this.setImageContainerDimensions);
            this.elements.imagesContainerInner = document.querySelector(SELECTORS$3.PRODUCT_IMAGES_CONTAINER_INNER);
            this.elements.images = Array.from(document.querySelectorAll(SELECTORS$3.PRODUCT_IMAGE));
            this.elements.dots = Array.from(document.querySelectorAll(SELECTORS$3.DOT));
            this.elements.dots.forEach(function (element) {
                element.addEventListener('click', _this.onDotClick);
            });
            return this;
        };
        return ProductImagesMobile;
    }());

    var SELECTORS$2 = {
        SWATCH_FIELD: ".vm-select-buttons.vm-select-buttons--color",
        SELECT_BUTTON: ".vm-select-button",
        COLOR_NAME_TEXT: ".vm-select-buttons__color-name"
    };
    var ProductColorSwatches = /** @class */ (function () {
        function ProductColorSwatches() {
            this.getSelectedValue = function (inputs) {
                var checkedInput = inputs.find(function (input) { return input.checked; });
                return checkedInput ? checkedInput.value : '';
            };
        }
        ProductColorSwatches.prototype.initialize = function () {
            var _this = this;
            this.selectButtonGroups =
                Array.from(document.querySelectorAll(SELECTORS$2.SWATCH_FIELD)).map(function (wrapper) {
                    var optionIndexAsString = wrapper.getAttribute('data-option-index');
                    var optionIndex = parseInt(optionIndexAsString);
                    var colorNameText = wrapper.querySelector(SELECTORS$2.COLOR_NAME_TEXT);
                    var buttons = Array.from(wrapper.querySelectorAll(SELECTORS$2.SELECT_BUTTON));
                    var inputs = buttons.map(function (buttonElement) { return buttonElement.querySelector('input'); });
                    buttons.forEach(function (buttonElement) {
                        buttonElement.addEventListener('mouseout', function (e) {
                            var selectedValue = _this.getSelectedValue(inputs);
                            colorNameText.innerText = selectedValue;
                        });
                        buttonElement.addEventListener('mouseover', function (e) {
                            var element = e.target.closest(SELECTORS$2.SELECT_BUTTON);
                            var inputElement = element.querySelector('input');
                            var value = inputElement.getAttribute('value');
                            colorNameText.innerText = value;
                        });
                    });
                    return {
                        optionIndex: optionIndex,
                        wrapper: wrapper,
                        colorNameText: colorNameText,
                        buttons: buttons,
                        inputs: inputs
                    };
                });
            return this;
        };
        return ProductColorSwatches;
    }());

    var ATTRIBUTES = {
        productOptionIndex: 'data-option-index',
        productOption: 'data-option',
        productData: 'data-product'
    };
    var SELECTORS$1 = {
        PRODUCT_OPTION: "[".concat(ATTRIBUTES.productOption, "]"),
        ADD_TO_CART_BUTTON: '.button.add_to_cart',
        CURRENT_PRICE: '.current_price',
        WAS_PRICE: '.current_price',
        SALE_SAVINGS: '.current_price'
    };
    var ProductVariants = /** @class */ (function () {
        function ProductVariants() {
            var _this = this;
            this.initialize = function () {
                _this.productData = _this.getProductData();
                _this.moneyFormat = document.body.getAttribute('data-money-format');
                _this.elements = {
                    productOptions: Array.from(document.querySelectorAll('[data-option]')),
                    addToCartButton: document.querySelector(SELECTORS$1.ADD_TO_CART_BUTTON),
                    currentPrice: document.querySelector(SELECTORS$1.CURRENT_PRICE),
                    wasPrice: document.querySelector(SELECTORS$1.WAS_PRICE),
                    saleSavings: document.querySelector(SELECTORS$1.SALE_SAVINGS)
                };
                _this.currentSelectedOptions = _this.elements.productOptions.map(function (element) {
                    return element.querySelector('input').value;
                });
                _this.setCurrentSelectedVariant();
                // add event listeners
                _this.elements.productOptions.forEach(function (element) {
                    element.addEventListener('change', _this.onProductOptionChange);
                });
                return _this;
            };
            this.unload = function () {
                // remove event listeners
                _this.elements.productOptions.forEach(function (element) {
                    element.removeEventListener('change', _this.onProductOptionChange);
                });
            };
            this.getProductData = function () {
                var productDataElement = document.querySelector('[data-product]');
                var productDataAsString = productDataElement.getAttribute('data-product');
                return JSON.parse(productDataAsString);
            };
            this.onProductOptionChange = function (e) {
                var _a;
                var target = e.target;
                var value = target.value;
                var productOptionElement = target.closest(SELECTORS$1.PRODUCT_OPTION);
                var optionIndexAsString = productOptionElement.getAttribute(ATTRIBUTES.productOptionIndex);
                var optionIndex = parseInt(optionIndexAsString, 10);
                _this.currentSelectedOptions[optionIndex] = value;
                _this.setCurrentSelectedVariant();
                var variantIsAvailable = ((_a = _this.currentSelectedVariant) === null || _a === void 0 ? void 0 : _a.available) === true;
                if (variantIsAvailable) {
                    _this.elements.addToCartButton.removeAttribute('disabled');
                    _this.elements.addToCartButton.innerText = Shopify.translation.add_to_cart;
                }
                else {
                    _this.elements.addToCartButton.setAttribute('disabled', 'disabled');
                    _this.elements.addToCartButton.innerText = Shopify.translation.unavailable_text;
                }
                _this.elements.currentPrice.innerHTML =
                    Shopify.formatMoney(_this.currentSelectedVariant.price, _this.moneyFormat);
                _this.elements.productOptions.forEach(function (productOptionElement, otherOptionIndex) {
                    productOptionElement.querySelectorAll('input').forEach(function (inputElement) {
                        var optionValue = inputElement.value;
                        var fullVariantOptionValue = __spreadArray([], _this.currentSelectedOptions, true).map(function (otherOptionValue, index) {
                            if (index === otherOptionIndex) {
                                return optionValue;
                            }
                            return otherOptionValue;
                        });
                        var variantForOption = _this.findVariantByOption(fullVariantOptionValue);
                        if (!(variantForOption === null || variantForOption === void 0 ? void 0 : variantForOption.available)) {
                            // TODO: not this
                            inputElement.disabled = true;
                            inputElement.closest('.vm-select-button').classList.add('vm-select-button--soldout');
                        }
                        else {
                            inputElement.disabled = false;
                            inputElement.closest('.vm-select-button').classList.remove('vm-select-button--soldout');
                        }
                    });
                });
            };
            this.findVariantByOption = function (optionValues) {
                return _this.productData.variants.find(function (variant) {
                    for (var _i = 0, optionValues_1 = optionValues; _i < optionValues_1.length; _i++) {
                        var option = optionValues_1[_i];
                        if (!variant.options.includes(option)) {
                            return false;
                        }
                    }
                    return true;
                });
            };
            this.setCurrentSelectedVariant = function () {
                _this.currentSelectedVariant = _this.findVariantByOption(_this.currentSelectedOptions);
            };
        }
        ProductVariants.shouldInitialize = function () {
            return document.querySelector("[".concat(ATTRIBUTES.productData, "]")) != null;
        };
        return ProductVariants;
    }());

    // @ts-nocheck
    // functionality ported straight over from turbo
    function initialize() {
        var e = $(".meta-related-recommended-collection"), t = $(".product-recommendations"), a = t.data("productId"), i = t.data("limit"), o = t.data("enabled"), n = e.data("enabled"), l = $("[data-product-recommendations-container]"); $(".js-recommended-products-slider");
        if (e.length) {
            if (!n) {
                l.empty();
                return;
            }
            l.html(e.html()),
                $("[data-product-recommendations-container] .js-product_section .product_form_options").each(function () {
                    0 === $(this).find("select").length && new Shopify.OptionSelectors($(this).data("select-id"), {
                        product: $(this).data("product"),
                        onVariantSelected: selectCallback,
                        enableHistoryState: $(this).data("enable-state")
                    });
                }),
                Shopify.PaymentButton && Shopify.PaymentButton.init(),
                $(".recommended-products-section").empty();
        }
        else if (t.length) {
            if (!o)
                return void l.empty();
            $.ajax({
                type: "GET",
                url: "/recommendations/products?section_id=product-recommendations&limit=" + i + "&product_id=" + a,
                success: function (e) {
                    var t = $(e).find(".product-recommendations").html();
                    l.empty();
                    l.html(t);
                    $("[data-product-recommendations-container] .js-product_section .product_form_options").each(function () {
                        new Shopify.OptionSelectors($(this).data("select-id"), {
                            product: $(this).data("product"),
                            onVariantSelected: selectCallback,
                            enableHistoryState: $(this).data("enable-state")
                        });
                    });
                    Currency.show_multiple_currencies && currencyConverter.convertCurrencies();
                    Shopify.PaymentButton && Shopify.PaymentButton.init();
                    if ($("[data-recommended-product-count]").data() === 0) {
                        $("[data-product-recommendations-container]").hide();
                    }
                    else {
                        window.dispatchEvent(new Event('product-recommendations-loaded'));
                    }
                }
            });
        }
        else
            l.hide();
    }

    var ProductPage = /** @class */ (function () {
        function ProductPage() {
            return this;
        }
        ProductPage.prototype.initialize = function () {
            this.setStickyContentTop();
            this.productImagesDesktop = new ProductImagesDesktop().initialize();
            this.productImagesMobile = new ProductImagesMobile().initialize();
            this.productColorSwatches = new ProductColorSwatches().initialize();
            if (ProductVariants.shouldInitialize()) {
                this.productVariants = new ProductVariants().initialize();
            }
            // functionality ported straight over from turbo
            initialize();
        };
        ProductPage.prototype.setStickyContentTop = function () {
            this.stickyContentElement = document.querySelector('.product-content-wrapper');
            var header = document.querySelector('.header');
            var headerHeight = header.getBoundingClientRect().height;
            var stickyElementTop = headerHeight + 16;
            this.stickyContentElement.style.top = "".concat(stickyElementTop, "px");
        };
        ProductPage.prototype.unload = function () {
        };
        ProductPage.isOnProductPage = function () { return !!document.querySelector('.product-template'); };
        return ProductPage;
    }());

    var SELECTORS = {
        LAZY_LOADED_IMAGE: "[data-smooth-lazy-loading]"
    };
    var IS_LOADING_CLASSNAME = 'is-loading';
    var LazyLoadedImage = /** @class */ (function () {
        function LazyLoadedImage(el) {
            var _this = this;
            this.hasCompletelyLoaded = false;
            this.initialize = function () {
                // this.elementsToLoad = Array.from(this.element.querySelectorAll('img'));
                _this.elementsToLoad = Array.from(_this.element.querySelectorAll('img, video'));
                if (_this.elementsToLoad.length === 0)
                    return;
                _this.hasLoaded = new Array(_this.elementsToLoad).map(function () { return false; });
                _this.element.classList.add(IS_LOADING_CLASSNAME);
                _this.elementsToLoad.forEach(function (element, elementIndex) {
                    var onLoad = function () {
                        _this.onLoad(elementIndex);
                    };
                    if (element.tagName === "IMG") {
                        if (element.complete) {
                            onLoad();
                        }
                        else {
                            element.addEventListener('load', onLoad, { once: true });
                        }
                    }
                    else if (element.tagName === "VIDEO") {
                        if (element.readyState === 4) {
                            onLoad();
                        }
                        else {
                            element.addEventListener('loadeddata', onLoad, { once: true });
                        }
                    }
                });
                return _this;
            };
            this.unload = function () { };
            this.onLoad = function (elementIndex) {
                _this.hasLoaded[elementIndex] = true;
                _this.hasCompletelyLoaded = _this.hasLoaded.filter(function (hasLoaded) { return !hasLoaded; }).length === 0;
                if (_this.hasCompletelyLoaded) {
                    _this.element.classList.remove(IS_LOADING_CLASSNAME);
                }
            };
            this.element = el;
        }
        return LazyLoadedImage;
    }());
    var SmoothLazyLoadedImagesManager = /** @class */ (function () {
        function SmoothLazyLoadedImagesManager() {
            var _this = this;
            this.initialize = function () {
                _this.setLazyLoadedImages();
                window.addEventListener('product-recommendations-loaded', _this.reset);
                window.addEventListener('collection-filters-updated', _this.reset);
            };
            this.unload = function () {
                window.removeEventListener('product-recommendations-loaded', _this.reset);
                window.removeEventListener('collection-filters-updated', _this.reset);
            };
            this.setLazyLoadedImages = function () {
                _this.lazyLoadedImages =
                    Array.from(document.querySelectorAll(SELECTORS.LAZY_LOADED_IMAGE))
                        .map(function (element) { return new LazyLoadedImage(element).initialize(); });
            };
            this.reset = function () {
                console.log('resetting lazy loaded images');
                _this.lazyLoadedImages.forEach(function (lazyLoadedImage) {
                    lazyLoadedImage.unload();
                });
                // TODO - don't completely replace
                _this.setLazyLoadedImages();
            };
        }
        return SmoothLazyLoadedImagesManager;
    }());

    // @ts-nocheck
    // functionality copied straight over from turbo
    function initializeQuantityBox() {
        $("body").on("click", ".js-change-quantity", function () {
            var e = $(this), t = $(this).siblings("input"), a = parseInt(t.val()), i = 1e29, o = t.attr("min") || 0;
            return (null != t.attr("max") && (i = t.attr("max")),
                isNaN(a) || a < o ?
                    (t.val(o), !1) :
                    i < a ?
                        (t.val(i), !1) :
                        ("plus" == e.data("func") ? a < i && t.val(a + 1) : (o < a && t.val(a - 1), e.parents(".cart_item").length && a - 1 == 0 && e.closest(".cart_item").addClass("animated fadeOutUp")), void t.trigger("change")));
        });
    }

    // import intersections from "../vm-sections/modules/intersections";
    new Header().initialize();
    new Cart().initialize();
    new SearchAutocompleteManager().initialize();
    new AccordionManager().initialize();
    new ProductCardsManager().initialize();
    new SmoothLazyLoadedImagesManager().initialize();
    initializeQuantityBox();
    if (ProductPage.isOnProductPage()) {
        new ProductPage().initialize();
    }

})();
