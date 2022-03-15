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
            return "".concat(Shopify.translation.from_text, " ").concat(item.price);
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
                document.addEventListener("click", _this.onDocumentClick);
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
            // TODO - reconsider whether this is the right behavior
            this.onSearchFormSubmit = function (event) {
                event.preventDefault();
                var value = _this.inputElement.value;
                var cleanedValue = encodeURI(value);
                var newUrl = cleanedValue
                    ? "".concat(_this.searchPath).concat(cleanedValue, "*")
                    : "/search";
                window.location.href = newUrl;
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
                _this.fetchSearchResults(_this.searchValue).then(function (_a) {
                    var searchValue = _a.searchValue, searchUrl = _a.searchUrl, resultsList = _a.resultsList, totalResults = _a.totalResults;
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
            }, 250);
            this.getSearchUrl = function (searchValue) {
                var cleanedValue = encodeURI(searchValue);
                var searchURL = _this.searchPath + cleanedValue;
                var fullSearchUrl = "".concat(searchURL, "*&view=json");
                return fullSearchUrl;
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
                console.log("searchFormElements", searchFormElements.length);
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

    var BodyScroll = /** @class */ (function () {
        function BodyScroll() {
            this.lock = function () {
                document.body.classList.add("menu-is-open");
            };
            this.unlock = function () {
                document.body.classList.remove("menu-is-open");
            };
        }
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
                console.log('animationend');
                _this.element.classList.remove("animated", "fadeIn");
            }, { once: true });
        };
        HeaderDrawerUnderlay.prototype.hide = function () {
            var _this = this;
            this.element.classList.add("animated", "animated--snappy", "fadeOut");
            this.element.addEventListener("animationend", function () {
                _this.element.classList.remove("animated", "fadeOut", "is-active");
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
            console.log("test");
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
                _this.bodyScroll.lock();
                _this.drawerUnderlay.show();
            };
            this.closeDrawer = function (drawer) {
                drawer.close();
                _this.currentOpenDrawerId = null;
                _this.bodyScroll.unlock();
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
            this.bodyScroll = new BodyScroll();
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
                    if (_this.activationType === "hover") {
                        element.addEventListener("mouseover", function (event) {
                            _this.onDropdownButtonMouseOver(event, _this);
                        });
                    }
                    else {
                        element.addEventListener("click", function (event) {
                            _this.onDropdownButtonClick(event, _this);
                        });
                    }
                });
                return _this;
            };
            this.open = function () {
                _this.isOpen = true;
                _this.buttonElements.forEach(function (buttonElement) {
                    buttonElement.classList.add(ACTIVE_BUTTON_CLASSNAME);
                });
                _this.dropdownElement.classList.add(OPEN_CLASSNAME$1);
                // new TransitionTimer(10).start().then(() => {
                //   this.dropdownElement.classList.add(VISIBLE_CLASSNAME);
                // });
            };
            this.close = function () {
                _this.isOpen = false;
                _this.buttonElements.forEach(function (buttonElement) {
                    buttonElement.classList.remove(ACTIVE_BUTTON_CLASSNAME);
                });
                // this.dropdownElement.classList.remove(VISIBLE_CLASSNAME);
                _this.dropdownElement.classList.remove(OPEN_CLASSNAME$1);
                // new TransitionTimer(200).start().then(() => {
                //   this.dropdownElement.classList.remove(OPEN_CLASSNAME);
                // });
            };
            this.toggle = function (shouldOpen) {
                shouldOpen ? _this.open() : _this.close();
            };
            this.dropdownElement = dropdownElement;
            this.onDropdownButtonMouseOver = onDropdownButtonMouseOver;
            this.onDropdownButtonClick = onDropdownButtonClick;
        }
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
                _this.closeCurrentOpenDropdown();
                _this.openDropdown(dropdown);
            };
            // TODO - check
            this.onHeaderMouseOut = function (event) {
                var currentOpenDropdown = _this.getCurrentOpenDropdown();
                if (!currentOpenDropdown ||
                    currentOpenDropdown.activationType === "click") {
                    return;
                }
                var toElement = event.relatedTarget;
                // If the mouse is no longer within the header content, area hide the dropdown
                if (toElement && !toElement.closest(".header-content-wrapper")) {
                    _this.closeCurrentOpenDropdown();
                }
            };
            this.onDropdownButtonClick = function (event, dropdown) {
                event.preventDefault();
                // TODO - don't open if the button being clicked is for the current dropdown
                //        in that case - close the dropdown
                var currentDropdown = _this.getCurrentOpenDropdown();
                if (currentDropdown) {
                    _this.closeDropdown(currentDropdown);
                    if (currentDropdown.id !== dropdown.id) {
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
            };
            this.closeDropdown = function (dropdown) {
                dropdown.close();
                _this.currentDropdownId = null;
                _this.headerUnderlay.hide();
            };
        }
        DropdownManager.prototype.initialize = function () {
            var _this = this;
            this.headerContentWrapperElement = document.querySelector(".header-content-wrapper");
            this.headerContentWrapperElement.addEventListener("mouseout", function (event) {
                _this.onHeaderMouseOut(event);
            });
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
            return this;
        };
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

    var OPEN_CLASSNAME = "is-open";
    var Accordion = /** @class */ (function () {
        function Accordion(_a) {
            var _this = this;
            var contentElement = _a.contentElement;
            this.isOpen = false;
            this.initialize = function () {
                _this.id = _this.contentElement.getAttribute("data-accordion-id");
                _this.buttonElements = Array.from(document.querySelectorAll("[data-accordion-button-id=".concat(_this.id, "]")));
                _this.buttonElements.forEach(function (buttonElement) {
                    buttonElement.addEventListener("click", _this.onButtonClick);
                });
                return _this;
            };
            this.onButtonClick = function () {
                _this.toggle(!_this.isOpen);
            };
            this.open = function () {
                _this.isOpen = true;
                _this.contentElement.classList.add(OPEN_CLASSNAME);
                _this.buttonElements.forEach(function (buttonElement) {
                    buttonElement.classList.add(OPEN_CLASSNAME);
                });
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

    var AccordionManager = /** @class */ (function () {
        function AccordionManager() {
            var _this = this;
            this.initialize = function () {
                _this.accordionElements = Array.from(document.querySelectorAll(".vm-accordion-content"));
                _this.accordionMap = _this.accordionElements.reduce(function (acc, contentElement) {
                    var _a;
                    var accordionId = contentElement.getAttribute("data-accordion-id");
                    var accordion = new Accordion({ contentElement: contentElement }).initialize();
                    return _assign(_assign({}, acc), (_a = {}, _a[accordionId] = accordion, _a));
                }, {});
                return _this;
            };
        }
        return AccordionManager;
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

})();
