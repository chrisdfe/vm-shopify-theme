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
            this.init = function () {
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

    var BodyScroll = /** @class */ (function () {
        function BodyScroll() {
        }
        BodyScroll.lock = function () {
            document.body.classList.add("menu-is-open");
        };
        BodyScroll.unlock = function () {
            document.body.classList.remove("menu-is-open");
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
    var HeaderWrapper = /** @class */ (function () {
        function HeaderWrapper(headerWrapperElement) {
            var _this = this;
            this.headerWrapperElement = null;
            this.headerWrapperElement = headerWrapperElement;
            document.addEventListener("shopify:section:load", function (event) {
                // @ts-ignore
                console.log("shopify:section:load", event.detail.sectionId);
                // @ts-ignore
                if (HEADER_SECTIONS.includes(event.detail.sectionId)) {
                    _this.reset();
                }
            });
        }
        HeaderWrapper.prototype.initialize = function () {
            this.promoBanner = new PromoBanner().initialize();
            this.drawerManager = new HeaderDrawerManager().initialize();
            this.dropdownManager = new DropdownManager().initialize();
        };
        HeaderWrapper.prototype.unload = function () {
            // this.promoBanner.reset();
            // this.drawerManager.reset();
            this.dropdownManager.reset();
        };
        HeaderWrapper.prototype.reset = function () {
            this.unload();
            this.initialize();
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

    var ProductCardsManager = /** @class */ (function () {
        function ProductCardsManager() {
            var _this = this;
            this.setProductCardHeights = function () {
                _this.productCards.forEach(function (productCard) {
                    var imageWrapElement = productCard.querySelector(".product_image");
                    imageWrapElement.style.height = 'auto';
                    imageWrapElement.style.height = imageWrapElement.clientHeight + 'px';
                });
            };
        }
        ProductCardsManager.prototype.initialize = function () {
            this.productCards = Array.from(document.querySelectorAll('.product-wrap'));
            window.addEventListener('DOMContentLoaded', this.setProductCardHeights);
            window.addEventListener('resize', debounce(this.setProductCardHeights, 5));
        };
        return ProductCardsManager;
    }());

    var ProductPage = /** @class */ (function () {
        function ProductPage() {
            var _this = this;
            this.imageCellElements = [];
            this.state = {
                modalIsOpen: false
            };
            this.onImageCellClick = function (e) {
                (_this.state.modalIsOpen ? _this.closeModal : _this.openModal)();
            };
            this.onModalUnderlayClick = function (e) {
                _this.closeModal();
            };
            this.openModal = function () {
                BodyScroll.lock();
                _this.modalWrapperElement.classList.add('is-active');
                _this.state.modalIsOpen = true;
            };
            this.closeModal = function () {
                BodyScroll.unlock();
                _this.modalWrapperElement.classList.remove('is-active');
                _this.state.modalIsOpen = false;
            };
            return this;
        }
        ProductPage.prototype.initialize = function () {
            this.setupImages();
            this.setStickyContentTop();
        };
        ProductPage.prototype.setupImages = function () {
            var _this = this;
            this.imageCellElements = Array.from(document.querySelectorAll('.product-page__product-image-cell'));
            this.imageCellElements.forEach(function (imageCell) {
                imageCell.addEventListener("click", _this.onImageCellClick);
            });
            this.modalWrapperElement = document.querySelector('.product-page__images-modal-wrapper');
            this.modalUnderlayElement = document.querySelector('.product-page__images-modal__underlay');
            this.modalUnderlayElement.addEventListener('click', this.onModalUnderlayClick);
        };
        ProductPage.prototype.setStickyContentTop = function () {
            this.stickyContentElement = document.querySelector('.product-content-wrapper');
            var header = document.querySelector('.header');
            var headerHeight = header.getBoundingClientRect().height;
            var stickyElementTop = headerHeight + 16;
            this.stickyContentElement.style.top = "".concat(stickyElementTop, "px");
        };
        ProductPage.prototype.unload = function () {
            var _this = this;
            this.imageCellElements.forEach(function (imageCell) {
                imageCell.removeEventListener("click", _this.onImageCellClick);
            });
            this.modalUnderlayElement.removeEventListener('click', this.onModalUnderlayClick);
        };
        ProductPage.isOnProductPage = function () { return !!document.querySelector('.product-template'); };
        return ProductPage;
    }());

    // import intersections from "../vm-sections/modules/intersections";
    // modules with 'legacy' (i.e turbo 6) support
    // attached to window and use api that app.js.liquid and utilities.js.liquid expect
    // @ts-ignore
    window.header = header;
    // @ts-ignore
    window.searchAutocomplete = new SearchAutocompleteManager();
    // @ts-ignore
    window.cart = cart;
    // VM modules
    // intersections.init();
    new AccordionManager().initialize();
    new ProductCardsManager().initialize();
    if (ProductPage.isOnProductPage()) {
        new ProductPage().initialize();
    }

})();
