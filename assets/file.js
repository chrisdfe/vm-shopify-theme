(function () {
  'use strict';

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  var freeGlobal$1 = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal$1 || freeSelf || Function('return this')();

  var root$1 = root;

  /**
   * Gets the timestamp of the number of milliseconds that have elapsed since
   * the Unix epoch (1 January 1970 00:00:00 UTC).
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Date
   * @returns {number} Returns the timestamp.
   * @example
   *
   * _.defer(function(stamp) {
   *   console.log(_.now() - stamp);
   * }, _.now());
   * // => Logs the number of milliseconds it took for the deferred invocation.
   */
  var now = function() {
    return root$1.Date.now();
  };

  var now$1 = now;

  /** Used to match a single whitespace character. */
  var reWhitespace = /\s/;

  /**
   * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
   * character of `string`.
   *
   * @private
   * @param {string} string The string to inspect.
   * @returns {number} Returns the index of the last non-whitespace character.
   */
  function trimmedEndIndex(string) {
    var index = string.length;

    while (index-- && reWhitespace.test(string.charAt(index))) {}
    return index;
  }

  /** Used to match leading whitespace. */
  var reTrimStart = /^\s+/;

  /**
   * The base implementation of `_.trim`.
   *
   * @private
   * @param {string} string The string to trim.
   * @returns {string} Returns the trimmed string.
   */
  function baseTrim(string) {
    return string
      ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
      : string;
  }

  /** Built-in value references. */
  var Symbol = root$1.Symbol;

  var Symbol$1 = Symbol;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto$1.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /** Built-in value references. */
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = baseTrim(value);
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max,
      nativeMin = Math.min;

  /**
   * Creates a debounced function that delays invoking `func` until after `wait`
   * milliseconds have elapsed since the last time the debounced function was
   * invoked. The debounced function comes with a `cancel` method to cancel
   * delayed `func` invocations and a `flush` method to immediately invoke them.
   * Provide `options` to indicate whether `func` should be invoked on the
   * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
   * with the last arguments provided to the debounced function. Subsequent
   * calls to the debounced function return the result of the last `func`
   * invocation.
   *
   * **Note:** If `leading` and `trailing` options are `true`, `func` is
   * invoked on the trailing edge of the timeout only if the debounced function
   * is invoked more than once during the `wait` timeout.
   *
   * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
   * until to the next tick, similar to `setTimeout` with a timeout of `0`.
   *
   * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
   * for details over the differences between `_.debounce` and `_.throttle`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to debounce.
   * @param {number} [wait=0] The number of milliseconds to delay.
   * @param {Object} [options={}] The options object.
   * @param {boolean} [options.leading=false]
   *  Specify invoking on the leading edge of the timeout.
   * @param {number} [options.maxWait]
   *  The maximum time `func` is allowed to be delayed before it's invoked.
   * @param {boolean} [options.trailing=true]
   *  Specify invoking on the trailing edge of the timeout.
   * @returns {Function} Returns the new debounced function.
   * @example
   *
   * // Avoid costly calculations while the window size is in flux.
   * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
   *
   * // Invoke `sendMail` when clicked, debouncing subsequent calls.
   * jQuery(element).on('click', _.debounce(sendMail, 300, {
   *   'leading': true,
   *   'trailing': false
   * }));
   *
   * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
   * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
   * var source = new EventSource('/stream');
   * jQuery(source).on('message', debounced);
   *
   * // Cancel the trailing debounced invocation.
   * jQuery(window).on('popstate', debounced.cancel);
   */
  function debounce(func, wait, options) {
    var lastArgs,
        lastThis,
        maxWait,
        result,
        timerId,
        lastCallTime,
        lastInvokeTime = 0,
        leading = false,
        maxing = false,
        trailing = true;

    if (typeof func != 'function') {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    wait = toNumber(wait) || 0;
    if (isObject(options)) {
      leading = !!options.leading;
      maxing = 'maxWait' in options;
      maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
      trailing = 'trailing' in options ? !!options.trailing : trailing;
    }

    function invokeFunc(time) {
      var args = lastArgs,
          thisArg = lastThis;

      lastArgs = lastThis = undefined;
      lastInvokeTime = time;
      result = func.apply(thisArg, args);
      return result;
    }

    function leadingEdge(time) {
      // Reset any `maxWait` timer.
      lastInvokeTime = time;
      // Start the timer for the trailing edge.
      timerId = setTimeout(timerExpired, wait);
      // Invoke the leading edge.
      return leading ? invokeFunc(time) : result;
    }

    function remainingWait(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime,
          timeWaiting = wait - timeSinceLastCall;

      return maxing
        ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;
    }

    function shouldInvoke(time) {
      var timeSinceLastCall = time - lastCallTime,
          timeSinceLastInvoke = time - lastInvokeTime;

      // Either this is the first call, activity has stopped and we're at the
      // trailing edge, the system time has gone backwards and we're treating
      // it as the trailing edge, or we've hit the `maxWait` limit.
      return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
        (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
    }

    function timerExpired() {
      var time = now$1();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      // Restart the timer.
      timerId = setTimeout(timerExpired, remainingWait(time));
    }

    function trailingEdge(time) {
      timerId = undefined;

      // Only invoke if we have `lastArgs` which means `func` has been
      // debounced at least once.
      if (trailing && lastArgs) {
        return invokeFunc(time);
      }
      lastArgs = lastThis = undefined;
      return result;
    }

    function cancel() {
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
      lastInvokeTime = 0;
      lastArgs = lastCallTime = lastThis = timerId = undefined;
    }

    function flush() {
      return timerId === undefined ? result : trailingEdge(now$1());
    }

    function debounced() {
      var time = now$1(),
          isInvoking = shouldInvoke(time);

      lastArgs = arguments;
      lastThis = this;
      lastCallTime = time;

      if (isInvoking) {
        if (timerId === undefined) {
          return leadingEdge(lastCallTime);
        }
        if (maxing) {
          // Handle invocations in a tight loop.
          clearTimeout(timerId);
          timerId = setTimeout(timerExpired, wait);
          return invokeFunc(lastCallTime);
        }
      }
      if (timerId === undefined) {
        timerId = setTimeout(timerExpired, wait);
      }
      return result;
    }
    debounced.cancel = cancel;
    debounced.flush = flush;
    return debounced;
  }

  /*============================================================================
    Search autocomplete
  ==============================================================================*/
  // TODO - use a npm package instead
  // copied from https://davidwalsh.name/javascript-debounce-function
  // function debounce(func, wait, immediate = false) {
  //   let timeout;

  //   const debouncedFunction = () => {
  //     const args = arguments;

  //     const later = () => {
  //       timeout = null;

  //       if (!immediate) {
  //         func.apply(this, args);
  //       }
  //     };

  //     const callNow = immediate && !timeout;
  //     clearTimeout(timeout);
  //     timeout = setTimeout(later, wait);

  //     if (callNow) {
  //       func.apply(this, args);
  //     }
  //   };

  //   return debouncedFunction;
  // }

  function getSearchResultItemPrice(item) {
    const collectionHandles = item.collections.map(
      (collection) => collection.handle
    );

    if (collectionHandles.includes("coming-soon")) {
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
    if (item.thumbnail !== "NULL") {
      return `
      <div class="search-autocomplete__result__thumbnail">
        <img src="${item.thumbnail}" />
      </div>
    `;
    }

    return "";
  }

  const searchResultTemplates = {
    product(item) {
      const itemPrice = getSearchResultItemPrice(item);

      return `
      <h5>${item.title}</h5>
      <div class="search-autocomplete__result__description">${itemPrice}</div>
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

  function renderSearchResult(item) {
    const thumbnail = renderSearchResultThumbnail(item);

    const renderFunction = searchResultTemplates[item.object_type];
    const body = renderFunction(item);

    const fullTemplate = `
    <li class="search-autocomplete__result search-autocomplete__result--type-${item.object_type}">
      <a href="${item.url}">
        <div class="search-autocomplete__result__thumbnail-wrapper">
          ${thumbnail}
        </div>  

        <div class="search-autocomplete__result__body">
          <h6 class="search-autocomplete__result__type-heading">
            ${item.object_type}
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
          <a href="${searchUrl}*">${Shopify.translation.all_results} (${totalResults})</a>
        </li>
      `;
    }

    return renderedContents;
  }

  class SearchAutocomplete {
    shopURL = "";

    searchValue = "";

    searchFormElement = null;
    resultsListElement = null;
    inputElement = null;

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
      document.addEventListener("click", this.onDocumentClick);

      return this;
    };

    showDropdown = () => {
      this.resultsListElement.classList.remove("u-hidden");
    };

    hideDropdown = () => {
      this.resultsListElement.classList.add("u-hidden");
    };

    unload = () => {};

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

      const value = this.inputElement.value;
      const cleanedValue = encodeURI(value);

      const newUrl = cleanedValue
        ? `${this.searchPath}${cleanedValue}*`
        : "/search";

      window.location.href = newUrl;
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

      this.fetchSearchResults(this.searchValue).then(
        ({ searchValue, resultsList, totalResults }) => {
          if (searchValue !== this.searchValue) {
            console.log("stale request", searchValue, this.searchValue);
            return;
          }

          const renderedContents = renderSearchResults({
            resultsList,
            totalResults,
            searchValue,
          });

          this.resultsListElement.innerHTML = renderedContents;
          this.showDropdown();
        }
      );
    }, 250);

    getSearchUrl = (searchValue) => {
      const cleanedValue = encodeURI(searchValue);
      const searchURL = this.searchPath + cleanedValue;
      const fullSearchUrl = `${searchURL}*&view=json`;
      return fullSearchUrl;
    };

    fetchSearchResults = (searchValue) => {
      console.log("fetchSearchResults");
      console.log(this);

      const searchUrl = this.getSearchUrl(searchValue);
      return fetch(searchUrl)
        .then((response) => response.json())
        .then((data) => {
          return {
            searchValue,
            resultsList: data.results,
            totalResults: data.results_count,
          };
        });
    };
  }

  class SearchAutocompleteManager {
    searchFormElements = [];
    searchAutocompletes = [];

    init = () => {
      this.searchFormElements = document.querySelectorAll(
        "form.search_form, form.search, form.header_search_form"
      );

      this.searchAutocompletes = Array.from(this.searchFormElements).map(
        (searchFormElement) => {
          return new SearchAutocomplete(searchFormElement).init();
        }
      );
    };

    unload = () => {
      this.searchAutocompletes.forEach((searchAutocomplete) => {
        searchAutocomplete.unload();
      });
    };
  }

  const searchAutocompleteManager = new SearchAutocompleteManager();

  // import intersections from "../lib/intersections";

  window.searchAutocomplete = searchAutocompleteManager;

  // intersections.init();

})();
