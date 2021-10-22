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

  // function hideNavbar() {
  //   $("body").removeClass("is-active").removeClass("blocked-scroll"),
  //     $(".dropdown_link").toggleClass("active_link"),
  //     $(".cart_container").removeClass("active_link");
  // }
  function initPromoBanner() {
    var promoBannerElement = document.querySelector(".promo-banner");

    if (!promoBannerElement.length) {
      return;
    }

    if (Cookies.get("promo-banner") !== "dismiss") {
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
  }

  var header = {
    init: function init() {
      // TODO - move to promo banner
      initPromoBanner();
      $("html").on("click", function (e) {
        if (!$(e.target).closest(".cart_container").length && $(".cart_content").is(":visible")) {
          hideNavbar();

          if ($(e.target).closest(".header__dropdown-container").length && $(".dropdown").is(":visible") && !$(e.target).hasClass("url-deadlink")) {
            $("body").removeClass("is-active");
            $(".dropdown_link").removeClass("active_link");
            $(".header__dropdown-container").hide();
            $(".mobile_nav").find("div").removeClass("open");
          }
        }
      }); // if ($(".main_nav_wrapper").length > 1) {
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
      // if ($("#header .cart_content").length < 1) {
      //   $("#header .cart_container").append($(".header .cart_content").clone());
      // }

      $(".dropdown_link").attr("data-no-instant", true);
      $("body").on("click", ".dropdown_link", function (e) {
        e.preventDefault(); // console.log("dropdown_link click");

        $(".nav a").removeClass("active_link");

        if ($("#header").is(":visible")) {
          var t = $(this).parents("#header").find('[data-dropdown="' + $(this).data("dropdown-rel") + '"]');
          $(this).hasClass("mini_cart") || $(".cart_container").removeClass("active_link");
        } else {
          if ($(this).hasClass("icon-search")) // window.location = $(this).attr("href"));
            // return false;
            t = $(this).parents(".main_nav").find('[data-dropdown="' + $(this).data("dropdown-rel") + '"]');
        }

        if (t.is(":visible") || !t.attr("class")) {
          t.hide();
          $("body").removeClass("is-active");
        } else {
          $(".header__dropdown-container").hide();
          t.show();
          $("body").addClass("is-active");
          $(".mobile_nav").find("div").removeClass("open");
          t.is(":visible");
        }

        e.preventDefault();
        e.stopPropagation();
        return false;
      }); // $("body").on("click", ".mobile_nav", function () {
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
      // $(".cart_content__continue-shopping").on("click", function (e) {
      //   hideNavbar();
      // });
      // $(".nav a, .logo a")
      //   .not(".cart_content a")
      //   .on("mouseenter", function () {
      //     $(this).hasClass("active_link") ||
      //       ($(".header__dropdown-container").hide(),
      //       $(".active_link").removeClass("active_link"),
      //       $(".is-absolute").parent().addClass("feature_image"));
      //   });
      // $(".main_nav, .top_bar, .cart_container").on("mouseleave", function () {
      //   $(".header__dropdown-container").hide();
      //   $(".active_link").removeClass("active_link");
      // });
      // $(".dropdown_link, .dropdown_link--vertical").attr("data-click-count", 0);

      document.querySelectorAll(".header__dropdown-link").forEach(function (dropdownLink) {
        var dropdownRel = dropdownLink.getAttribute("data-dropdown-rel");
        var dropdownElement = document.querySelector("[data-dropdown=\"".concat(dropdownRel, "\"]"));
        dropdownLink.addEventListener("mouseover", function (event) {
          dropdownElement.classList.add("is-active");
        });
        dropdownLink.addEventListener("mouseout", function (event) {
          dropdownElement.classList.remove("is-active");
        });
      });
    },
    // removeDataAttributes: function (selector) {
    //   const element = $(selector);
    //   if (element.length) {
    //     const dataAttributes = [];
    //     const attributes = a.get(0).attributes;
    //     for (let index = 0; index < attributes.length; index++) {
    //       if ("data-" === attributes[index].name.substring(0, 5)) {
    //         t.push(attributes[index].name);
    //       }
    //     }
    //     $.each(dataAttributes, function (e, t) {
    //       element.removeAttr(t);
    //     });
    //   }
    // },
    loadMegaMenu: function loadMegaMenu() {// $(".sticky_nav .mega-menu").remove();
      // $(".header .mega-menu").remove();
      // $(".mega-menu-container .mega-menu")
      //   .clone()
      //   .appendTo(".sticky_nav .main_nav");
      // this.removeDataAttributes(
      //   ".sticky_nav .mega-menu.header__dropdown-container .dropdown_column"
      // );
      // $(".mega-menu-container .mega-menu").each(function (e) {
      //   const t = $(this).data("dropdown");
      //   $('[data-dropdown-rel="' + t + '"]')
      //     .find("span")
      //     .remove();
      //   $('[data-dropdown-rel="' + t + '"]')
      //     .not(".icon-search")
      //     .append(' <span class="icon-down-arrow"></span>')
      //     .addClass("mega-menu-parent")
      //     .addClass("dropdown_link")
      //     .removeClass("top_link");
      //   $('[data-dropdown="' + t + '"]').each(function (e) {
      //     $(this).hasClass("mega-menu") || $(this).remove();
      //   });
      // $(this).clone().appendTo(".header .main_nav");
      // });
    },
    loadMobileMegaMenu: function loadMobileMegaMenu() {// $(".mega-menu-container .mobile-mega-menu").each(function (e) {
      //   $('[data-mobile-dropdown-rel="' + $(this).data("mobile-dropdown") + '"]')
      //     .find("span")
      //     .remove();
      //   $(
      //     '[data-mobile-dropdown-rel="' +
      //       $(this).data("mobile-dropdown") +
      //       '"] > a'
      //   )
      //     .append(' <span class="right icon-down-arrow"></span>')
      //     .attr("data-no-instant", "true");
      //   $(
      //     '[data-mobile-dropdown-rel="' + $(this).data("mobile-dropdown") + '"]'
      //   ).addClass("mobile-mega-menu-parent sublink");
      //   $(
      //     '[data-mobile-dropdown-rel="' + $(this).data("mobile-dropdown") + '"]'
      //   ).append(this);
      //   $(
      //     '[data-mobile-dropdown-rel="' +
      //       $(this).data("mobile-dropdown") +
      //       '"] > ul'
      //   ).each(function (e) {
      //     $(this).hasClass("mobile-mega-menu") || $(this).remove();
      //   });
      // });
    },
    unloadMegaMenu: function unloadMegaMenu() {
      $(".header .mega-menu").remove();
      $(".mega-menu-container .mega-menu").each(function (e) {
        $(this).data("dropdown");
        $('.mega-menu-parent[data-dropdown-rel="' + $(this).data("dropdown") + '"]').find(".icon-down-arrow").remove();
      });
    },
    unload: function unload() {
      $("body").off("click", ".mobile_nav");
      $("body").off("click", ".dropdown_link");
      $("html").off("click");
      $(".mini_cart").off("click");
      $(".cart_content__continue-shopping").off("click");
      $("body").off("click", '.banner a[href^="#"]');
      $(".main_nav_wrapper.sticky_nav").remove();
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
