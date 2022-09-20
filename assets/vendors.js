/* ==================================================
#Cookie
#Waypoints
#Responsive iFrames
#URL parser
#Object-fit polyfill
#Offscreen check
#Lazyframe
#Fancybox
#Plyr

/* ===============================================
  #Zoom
================================================== */

/*!
  Zoom 1.7.15
  license: MIT
  http://www.jacklmoore.com/zoom
*/
(function ($) { var defaults = { url: false, callback: false, target: false, duration: 120, on: "mouseover", touch: true, onZoomIn: false, onZoomOut: false, magnify: 1 }; $.zoom = function (target, source, img, magnify) { var targetHeight, targetWidth, sourceHeight, sourceWidth, xRatio, yRatio, offset, $target = $(target), position = $target.css("position"), $source = $(source); $target.css("position", /(absolute|fixed)/.test(position) ? position : "relative"); $target.css("overflow", "hidden"); img.style.width = img.style.height = ""; $(img).addClass("zoomImg").css({ position: "absolute", top: 0, left: 0, opacity: 0, width: img.width * magnify, height: img.height * magnify, border: "none", maxWidth: "none", maxHeight: "none" }).appendTo(target); return { init: function () { targetWidth = $target.outerWidth(); targetHeight = $target.outerHeight(); if (source === $target[0]) { sourceWidth = targetWidth; sourceHeight = targetHeight } else { sourceWidth = $source.outerWidth(); sourceHeight = $source.outerHeight() } xRatio = (img.width - targetWidth) / sourceWidth; yRatio = (img.height - targetHeight) / sourceHeight; offset = $source.offset() }, move: function (e) { var left = e.pageX - offset.left, top = e.pageY - offset.top; top = Math.max(Math.min(top, sourceHeight), 0); left = Math.max(Math.min(left, sourceWidth), 0); img.style.left = left * -xRatio + "px"; img.style.top = top * -yRatio + "px" } } }; $.fn.zoom = function (options) { return this.each(function () { var settings = $.extend({}, defaults, options || {}), target = settings.target || this, source = this, $source = $(source), $target = $(target), img = document.createElement("img"), $img = $(img), mousemove = "mousemove.zoom", clicked = false, touched = false, $urlElement; if (!settings.url) { $urlElement = $source.find("img"); if ($urlElement[0]) { settings.url = $urlElement.data("src") || $urlElement.attr("src") } if (!settings.url) { return } } (function () { var position = $target.css("position"); var overflow = $target.css("overflow"); $source.one("zoom.destroy", function () { $source.off(".zoom"); $target.css("position", position); $target.css("overflow", overflow); $img.remove() }) })(); img.onload = function () { var zoom = $.zoom(target, source, img, settings.magnify); function start(e) { zoom.init(); zoom.move(e); $img.stop().fadeTo($.support.opacity ? settings.duration : 0, 1, $.isFunction(settings.onZoomIn) ? settings.onZoomIn.call(img) : false) } function stop() { $img.stop().fadeTo(settings.duration, 0, $.isFunction(settings.onZoomOut) ? settings.onZoomOut.call(img) : false) } if (settings.on === "grab") { $source.on("mousedown.zoom", function (e) { if (e.which === 1) { $(document).one("mouseup.zoom", function () { stop(); $(document).off(mousemove, zoom.move) }); start(e); $(document).on(mousemove, zoom.move); e.preventDefault() } }) } else if (settings.on === "click") { $source.on("click.zoom", function (e) { if (clicked) { return } else { clicked = true; start(e); $(document).on(mousemove, zoom.move); $(document).one("click.zoom", function () { stop(); clicked = false; $(document).off(mousemove, zoom.move) }); return false } }) } else if (settings.on === "toggle") { $source.on("click.zoom", function (e) { if (clicked) { stop() } else { start(e) } clicked = !clicked }) } else if (settings.on === "mouseover") { zoom.init(); $source.on("mouseenter.zoom", start).on("mouseleave.zoom", stop).on(mousemove, zoom.move) } if (settings.touch) { $source.on("touchstart.zoom", function (e) { e.preventDefault(); if (touched) { touched = false; stop() } else { touched = true; start(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]) } }).on("touchmove.zoom", function (e) { e.preventDefault(); zoom.move(e.originalEvent.touches[0] || e.originalEvent.changedTouches[0]) }).on("touchend.zoom", function (e) { e.preventDefault(); if (touched) { touched = false; stop() } }) } if ($.isFunction(settings.callback)) { settings.callback.call(img) } }; img.src = settings.url }) }; $.fn.zoom.defaults = defaults })(window.jQuery);



/* ===============================================
  #Cookie
================================================== */

/*!
 * JavaScript Cookie v2.1.4
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */

!function (e) { var n = !1; if ("function" == typeof define && define.amd && (define(e), n = !0), "object" == typeof exports && (module.exports = e(), n = !0), !n) { var o = window.Cookies, t = window.Cookies = e(); t.noConflict = function () { return window.Cookies = o, t } } }(function () { function e() { for (var e = 0, n = {}; e < arguments.length; e++) { var o = arguments[e]; for (var t in o) n[t] = o[t] } return n } function n(o) { function t(n, r, i) { var c; if ("undefined" != typeof document) { if (arguments.length > 1) { if ("number" == typeof (i = e({ path: "/" }, t.defaults, i)).expires) { var a = new Date; a.setMilliseconds(a.getMilliseconds() + 864e5 * i.expires), i.expires = a } i.expires = i.expires ? i.expires.toUTCString() : ""; try { c = JSON.stringify(r), /^[\{\[]/.test(c) && (r = c) } catch (e) { } r = o.write ? o.write(r, n) : encodeURIComponent(String(r)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent), n = (n = (n = encodeURIComponent(String(n))).replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)).replace(/[\(\)]/g, escape); var f = ""; for (var s in i) i[s] && (f += "; " + s, !0 !== i[s] && (f += "=" + i[s])); return document.cookie = n + "=" + r + f } n || (c = {}); for (var p = document.cookie ? document.cookie.split("; ") : [], d = /(%[0-9A-Z]{2})+/g, u = 0; u < p.length; u++) { var l = p[u].split("="), C = l.slice(1).join("="); '"' === C.charAt(0) && (C = C.slice(1, -1)); try { var g = l[0].replace(d, decodeURIComponent); if (C = o.read ? o.read(C, g) : o(C, g) || C.replace(d, decodeURIComponent), this.json) try { C = JSON.parse(C) } catch (e) { } if (n === g) { c = C; break } n || (c[g] = C) } catch (e) { } } return c } } return t.set = t, t.get = function (e) { return t.call(t, e) }, t.getJSON = function () { return t.apply({ json: !0 }, [].slice.call(arguments)) }, t.defaults = {}, t.remove = function (n, o) { t(n, "", e(o, { expires: -1 })) }, t.withConverter = n, t } return n(function () { }) });

/* ===============================================
  #Waypoints
================================================== */

/*!
Waypoints - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!function () { "use strict"; function t(o) { if (!o) throw new Error("No options passed to Waypoint constructor"); if (!o.element) throw new Error("No element option passed to Waypoint constructor"); if (!o.handler) throw new Error("No handler option passed to Waypoint constructor"); this.key = "waypoint-" + e, this.options = t.Adapter.extend({}, t.defaults, o), this.element = this.options.element, this.adapter = new t.Adapter(this.element), this.callback = o.handler, this.axis = this.options.horizontal ? "horizontal" : "vertical", this.enabled = this.options.enabled, this.triggerPoint = null, this.group = t.Group.findOrCreate({ name: this.options.group, axis: this.axis }), this.context = t.Context.findOrCreateByElement(this.options.context), t.offsetAliases[this.options.offset] && (this.options.offset = t.offsetAliases[this.options.offset]), this.group.add(this), this.context.add(this), i[this.key] = this, e += 1 } var e = 0, i = {}; t.prototype.queueTrigger = function (t) { this.group.queueTrigger(this, t) }, t.prototype.trigger = function (t) { this.enabled && this.callback && this.callback.apply(this, t) }, t.prototype.destroy = function () { this.context.remove(this), this.group.remove(this), delete i[this.key] }, t.prototype.disable = function () { return this.enabled = !1, this }, t.prototype.enable = function () { return this.context.refresh(), this.enabled = !0, this }, t.prototype.next = function () { return this.group.next(this) }, t.prototype.previous = function () { return this.group.previous(this) }, t.invokeAll = function (t) { var e = []; for (var o in i) e.push(i[o]); for (var n = 0, r = e.length; r > n; n++)e[n][t]() }, t.destroyAll = function () { t.invokeAll("destroy") }, t.disableAll = function () { t.invokeAll("disable") }, t.enableAll = function () { t.invokeAll("enable") }, t.refreshAll = function () { t.Context.refreshAll() }, t.viewportHeight = function () { return window.innerHeight || document.documentElement.clientHeight }, t.viewportWidth = function () { return document.documentElement.clientWidth }, t.adapters = [], t.defaults = { context: window, continuous: !0, enabled: !0, group: "default", horizontal: !1, offset: 0 }, t.offsetAliases = { "bottom-in-view": function () { return this.context.innerHeight() - this.adapter.outerHeight() }, "right-in-view": function () { return this.context.innerWidth() - this.adapter.outerWidth() } }, window.Waypoint = t }(), function () { "use strict"; function t(t) { window.setTimeout(t, 1e3 / 60) } function e(t) { this.element = t, this.Adapter = n.Adapter, this.adapter = new this.Adapter(t), this.key = "waypoint-context-" + i, this.didScroll = !1, this.didResize = !1, this.oldScroll = { x: this.adapter.scrollLeft(), y: this.adapter.scrollTop() }, this.waypoints = { vertical: {}, horizontal: {} }, t.waypointContextKey = this.key, o[t.waypointContextKey] = this, i += 1, this.createThrottledScrollHandler(), this.createThrottledResizeHandler() } var i = 0, o = {}, n = window.Waypoint, r = window.onload; e.prototype.add = function (t) { var e = t.options.horizontal ? "horizontal" : "vertical"; this.waypoints[e][t.key] = t, this.refresh() }, e.prototype.checkEmpty = function () { var t = this.Adapter.isEmptyObject(this.waypoints.horizontal), e = this.Adapter.isEmptyObject(this.waypoints.vertical); t && e && (this.adapter.off(".waypoints"), delete o[this.key]) }, e.prototype.createThrottledResizeHandler = function () { function t() { e.handleResize(), e.didResize = !1 } var e = this; this.adapter.on("resize.waypoints", function () { e.didResize || (e.didResize = !0, n.requestAnimationFrame(t)) }) }, e.prototype.createThrottledScrollHandler = function () { function t() { e.handleScroll(), e.didScroll = !1 } var e = this; this.adapter.on("scroll.waypoints", function () { (!e.didScroll || n.isTouch) && (e.didScroll = !0, n.requestAnimationFrame(t)) }) }, e.prototype.handleResize = function () { n.Context.refreshAll() }, e.prototype.handleScroll = function () { var t = {}, e = { horizontal: { newScroll: this.adapter.scrollLeft(), oldScroll: this.oldScroll.x, forward: "right", backward: "left" }, vertical: { newScroll: this.adapter.scrollTop(), oldScroll: this.oldScroll.y, forward: "down", backward: "up" } }; for (var i in e) { var o = e[i], n = o.newScroll > o.oldScroll, r = n ? o.forward : o.backward; for (var s in this.waypoints[i]) { var a = this.waypoints[i][s], l = o.oldScroll < a.triggerPoint, h = o.newScroll >= a.triggerPoint, p = l && h, u = !l && !h; (p || u) && (a.queueTrigger(r), t[a.group.id] = a.group) } } for (var c in t) t[c].flushTriggers(); this.oldScroll = { x: e.horizontal.newScroll, y: e.vertical.newScroll } }, e.prototype.innerHeight = function () { return this.element == this.element.window ? n.viewportHeight() : this.adapter.innerHeight() }, e.prototype.remove = function (t) { delete this.waypoints[t.axis][t.key], this.checkEmpty() }, e.prototype.innerWidth = function () { return this.element == this.element.window ? n.viewportWidth() : this.adapter.innerWidth() }, e.prototype.destroy = function () { var t = []; for (var e in this.waypoints) for (var i in this.waypoints[e]) t.push(this.waypoints[e][i]); for (var o = 0, n = t.length; n > o; o++)t[o].destroy() }, e.prototype.refresh = function () { var t, e = this.element == this.element.window, i = e ? void 0 : this.adapter.offset(), o = {}; this.handleScroll(), t = { horizontal: { contextOffset: e ? 0 : i.left, contextScroll: e ? 0 : this.oldScroll.x, contextDimension: this.innerWidth(), oldScroll: this.oldScroll.x, forward: "right", backward: "left", offsetProp: "left" }, vertical: { contextOffset: e ? 0 : i.top, contextScroll: e ? 0 : this.oldScroll.y, contextDimension: this.innerHeight(), oldScroll: this.oldScroll.y, forward: "down", backward: "up", offsetProp: "top" } }; for (var r in t) { var s = t[r]; for (var a in this.waypoints[r]) { var l, h, p, u, c, d = this.waypoints[r][a], f = d.options.offset, w = d.triggerPoint, y = 0, g = null == w; d.element !== d.element.window && (y = d.adapter.offset()[s.offsetProp]), "function" == typeof f ? f = f.apply(d) : "string" == typeof f && (f = parseFloat(f), d.options.offset.indexOf("%") > -1 && (f = Math.ceil(s.contextDimension * f / 100))), l = s.contextScroll - s.contextOffset, d.triggerPoint = y + l - f, h = w < s.oldScroll, p = d.triggerPoint >= s.oldScroll, u = h && p, c = !h && !p, !g && u ? (d.queueTrigger(s.backward), o[d.group.id] = d.group) : !g && c ? (d.queueTrigger(s.forward), o[d.group.id] = d.group) : g && s.oldScroll >= d.triggerPoint && (d.queueTrigger(s.forward), o[d.group.id] = d.group) } } return n.requestAnimationFrame(function () { for (var t in o) o[t].flushTriggers() }), this }, e.findOrCreateByElement = function (t) { return e.findByElement(t) || new e(t) }, e.refreshAll = function () { for (var t in o) o[t].refresh() }, e.findByElement = function (t) { return o[t.waypointContextKey] }, window.onload = function () { r && r(), e.refreshAll() }, n.requestAnimationFrame = function (e) { var i = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || t; i.call(window, e) }, n.Context = e }(), function () { "use strict"; function t(t, e) { return t.triggerPoint - e.triggerPoint } function e(t, e) { return e.triggerPoint - t.triggerPoint } function i(t) { this.name = t.name, this.axis = t.axis, this.id = this.name + "-" + this.axis, this.waypoints = [], this.clearTriggerQueues(), o[this.axis][this.name] = this } var o = { vertical: {}, horizontal: {} }, n = window.Waypoint; i.prototype.add = function (t) { this.waypoints.push(t) }, i.prototype.clearTriggerQueues = function () { this.triggerQueues = { up: [], down: [], left: [], right: [] } }, i.prototype.flushTriggers = function () { for (var i in this.triggerQueues) { var o = this.triggerQueues[i], n = "up" === i || "left" === i; o.sort(n ? e : t); for (var r = 0, s = o.length; s > r; r += 1) { var a = o[r]; (a.options.continuous || r === o.length - 1) && a.trigger([i]) } } this.clearTriggerQueues() }, i.prototype.next = function (e) { this.waypoints.sort(t); var i = n.Adapter.inArray(e, this.waypoints), o = i === this.waypoints.length - 1; return o ? null : this.waypoints[i + 1] }, i.prototype.previous = function (e) { this.waypoints.sort(t); var i = n.Adapter.inArray(e, this.waypoints); return i ? this.waypoints[i - 1] : null }, i.prototype.queueTrigger = function (t, e) { this.triggerQueues[e].push(t) }, i.prototype.remove = function (t) { var e = n.Adapter.inArray(t, this.waypoints); e > -1 && this.waypoints.splice(e, 1) }, i.prototype.first = function () { return this.waypoints[0] }, i.prototype.last = function () { return this.waypoints[this.waypoints.length - 1] }, i.findOrCreate = function (t) { return o[t.axis][t.name] || new i(t) }, n.Group = i }(), function () { "use strict"; function t(t) { this.$element = e(t) } var e = window.jQuery, i = window.Waypoint; e.each(["innerHeight", "innerWidth", "off", "offset", "on", "outerHeight", "outerWidth", "scrollLeft", "scrollTop"], function (e, i) { t.prototype[i] = function () { var t = Array.prototype.slice.call(arguments); return this.$element[i].apply(this.$element, t) } }), e.each(["extend", "inArray", "isEmptyObject"], function (i, o) { t[o] = e[o] }), i.adapters.push({ name: "jquery", Adapter: t }), i.Adapter = t }(), function () { "use strict"; function t(t) { return function () { var i = [], o = arguments[0]; return t.isFunction(arguments[0]) && (o = t.extend({}, arguments[1]), o.handler = arguments[0]), this.each(function () { var n = t.extend({}, o, { element: this }); "string" == typeof n.context && (n.context = t(this).closest(n.context)[0]), i.push(new e(n)) }), i } } var e = window.Waypoint; window.jQuery && (window.jQuery.fn.waypoint = t(window.jQuery)), window.Zepto && (window.Zepto.fn.waypoint = t(window.Zepto)) }();

/*!
Waypoints Infinite Scroll Shortcut - 4.0.0
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!function () { "use strict"; function t(n) { this.options = i.extend({}, t.defaults, n), this.container = this.options.element, "auto" !== this.options.container && (this.container = this.options.container), this.$container = i(this.container), this.$more = i(this.options.more), this.$more.length && (this.setupHandler(), this.waypoint = new o(this.options)) } var i = window.jQuery, o = window.Waypoint; t.prototype.setupHandler = function () { this.options.handler = i.proxy(function () { this.options.onBeforePageLoad(), this.destroy(), this.$container.addClass(this.options.loadingClass), i.get(i(this.options.more).attr("href"), i.proxy(function (t) { var n = i(i.parseHTML(t)), e = n.find(this.options.more), s = n.find(this.options.items); s.length || (s = n.filter(this.options.items)), this.$container.append(s), this.$container.removeClass(this.options.loadingClass), e.length || (e = n.filter(this.options.more)), e.length ? (this.$more.replaceWith(e), this.$more = e, this.waypoint = new o(this.options)) : this.$more.remove(), this.options.onAfterPageLoad(s) }, this)) }, this) }, t.prototype.destroy = function () { this.waypoint && this.waypoint.destroy() }, t.defaults = { container: "auto", items: ".infinite-item", more: ".infinite-more-link", offset: "bottom-in-view", loadingClass: "infinite-loading", onBeforePageLoad: i.noop, onAfterPageLoad: i.noop }, o.Infinite = t }();


/* ===============================================
  #URL parser
================================================== */

/*! js-url - v2.5.0 - 2017-04-22 */
!function () { var a = function () { function a() { } function b(a) { return decodeURIComponent(a.replace(/\+/g, " ")) } function c(a, b) { var c = a.charAt(0), d = b.split(c); return c === a ? d : (a = parseInt(a.substring(1), 10), d[a < 0 ? d.length + a : a - 1]) } function d(a, c) { for (var d = a.charAt(0), e = c.split("&"), f = [], g = {}, h = [], i = a.substring(1), j = 0, k = e.length; j < k; j++)if (f = e[j].match(/(.*?)=(.*)/), f || (f = [e[j], e[j], ""]), "" !== f[1].replace(/\s/g, "")) { if (f[2] = b(f[2] || ""), i === f[1]) return f[2]; h = f[1].match(/(.*)\[([0-9]+)\]/), h ? (g[h[1]] = g[h[1]] || [], g[h[1]][h[2]] = f[2]) : g[f[1]] = f[2] } return d === a ? g : g[i] } return function (b, e) { var f, g = {}; if ("tld?" === b) return a(); if (e = e || window.location.toString(), !b) return e; if (b = b.toString(), f = e.match(/^mailto:([^\/].+)/)) g.protocol = "mailto", g.email = f[1]; else { if ((f = e.match(/(.*?)\/#\!(.*)/)) && (e = f[1] + f[2]), (f = e.match(/(.*?)#(.*)/)) && (g.hash = f[2], e = f[1]), g.hash && b.match(/^#/)) return d(b, g.hash); if ((f = e.match(/(.*?)\?(.*)/)) && (g.query = f[2], e = f[1]), g.query && b.match(/^\?/)) return d(b, g.query); if ((f = e.match(/(.*?)\:?\/\/(.*)/)) && (g.protocol = f[1].toLowerCase(), e = f[2]), (f = e.match(/(.*?)(\/.*)/)) && (g.path = f[2], e = f[1]), g.path = (g.path || "").replace(/^([^\/])/, "/$1"), b.match(/^[\-0-9]+$/) && (b = b.replace(/^([^\/])/, "/$1")), b.match(/^\//)) return c(b, g.path.substring(1)); if (f = c("/-1", g.path.substring(1)), f && (f = f.match(/(.*?)\.(.*)/)) && (g.file = f[0], g.filename = f[1], g.fileext = f[2]), (f = e.match(/(.*)\:([0-9]+)$/)) && (g.port = f[2], e = f[1]), (f = e.match(/(.*?)@(.*)/)) && (g.auth = f[1], e = f[2]), g.auth && (f = g.auth.match(/(.*)\:(.*)/), g.user = f ? f[1] : g.auth, g.pass = f ? f[2] : void 0), g.hostname = e.toLowerCase(), "." === b.charAt(0)) return c(b, g.hostname); a() && (f = g.hostname.match(a()), f && (g.tld = f[3], g.domain = f[2] ? f[2] + "." + f[3] : void 0, g.sub = f[1] || void 0)), g.port = g.port || ("https" === g.protocol ? "443" : "80"), g.protocol = g.protocol || ("443" === g.port ? "https" : "http") } return b in g ? g[b] : "{}" === b ? g : void 0 } }(); "function" == typeof window.define && window.define.amd ? window.define("js-url", [], function () { return a }) : ("undefined" != typeof window.jQuery && window.jQuery.extend({ url: function (a, b) { return window.url(a, b) } }), window.url = a) }();


/* ===============================================
  #Offscreen check
================================================== */

/*
 * jQuery offscreen plugin
 *
 * Copyright Cory LaViska for A Beautiful Site, LLC
 *
 * @license: http://opensource.org/licenses/MIT
 *
 */
(function ($) {
  $.extend($.expr[':'], {
    'off-top': function (el) {
      return $(el).offset().top < $(window).scrollTop();
    },
    'off-right': function (el) {
      return $(el).offset().left + $(el).outerWidth() - $(window).scrollLeft() > $(window).width();
    },
    'off-bottom': function (el) {
      return $(el).offset().top + $(el).outerHeight() - $(window).scrollTop() > $(window).height();
    },
    'off-left': function (el) {
      return $(el).offset().left < $(window).scrollLeft();
    },
    'off-screen': function (el) {
      return $(el).is(':off-top, :off-right, :off-bottom, :off-left');
    }
  });
})(jQuery);

/* ===============================================
  #Lazyframe
================================================== */

/* Lazyframe */
!function (e, t) { "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.lazyframe = t() }(this, function () { "use strict"; var e = Object.assign || function (e) { for (var t = 1; t < arguments.length; t++) { var n = arguments[t]; for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]) } return e }; return function () { function t(t) { if (d = e({}, m, arguments.length <= 1 ? void 0 : arguments[1]), "string" == typeof t) for (var i = document.querySelectorAll(t), o = 0; o < i.length; o++)n(i[o]); else if (void 0 === t.length) n(t); else if (t.length > 1) for (var r = 0; r < t.length; r++)n(t[r]); else n(t[0]); d.lazyload && a() } function n(e) { var t = this; if (e instanceof HTMLElement != !1 && !e.classList.contains("lazyframe--loaded")) { var n = { el: e, settings: i(e) }; n.el.addEventListener("click", function () { n.el.appendChild(n.iframe); var i = e.querySelectorAll("iframe"); n.settings.onAppend.call(t, i[0]) }), d.lazyload ? l(n) : u(n, !!n.settings.thumbnail) } } function i(t) { var n = Array.prototype.slice.apply(t.attributes).filter(function (e) { return "" !== e.value }).reduce(function (e, t) { return e[0 === t.name.indexOf("data-") ? t.name.split("data-")[1] : t.name] = t.value, e }, {}), i = e({}, d, n, { y: t.offsetTop, parameters: o(n.src) }); if (i.vendor) { var r = i.src.match(p.regex[i.vendor]); i.id = p.condition[i.vendor](r) } return i } function o(e) { var t = e.split("?"); if (t[1]) { t = t[1]; return -1 !== t.indexOf("autoplay") ? t : t + "&autoplay=1" } return "autoplay=1" } function r(e) { return !!e.vendor && ((!e.title || !e.thumbnail) && ("youtube" !== e.vendor && "youtube_nocookie" !== e.vendor || !!e.apikey)) } function u(e) { var t = this; r(e.settings) ? s(e, function (n, i) { if (!n) { var o = i[0], r = i[1]; if (r.settings.title || (r.settings.title = p.response[r.settings.vendor].title(o)), !r.settings.thumbnail) { var u = p.response[r.settings.vendor].thumbnail(o); r.settings.thumbnail = u, e.settings.onThumbnailLoad.call(t, u) } l(r, !0) } }) : l(e, !0) } function s(e, t) { var n = p.endpoints[e.settings.vendor](e.settings), i = new XMLHttpRequest; i.open("GET", n, !0), i.onload = function () { if (i.status >= 200 && i.status < 400) { var n = JSON.parse(i.responseText); t(null, [n, e]) } else t(!0) }, i.onerror = function () { t(!0) }, i.send() } function a() { var e = this, t = window.innerHeight, n = f.length, i = function (t, i) { t.settings.initialized = !0, t.el.classList.add("lazyframe--loaded"), n--, u(t), t.settings.initinview && t.el.click(), t.settings.onLoad.call(e, t) }; f.filter(function (e) { return e.settings.y < t }).forEach(i); var o = function (e, t, n) { var i = void 0; return function () { var o = this, r = arguments, u = function () { i = null, n || e.apply(o, r) }, s = n && !i; clearTimeout(i), i = setTimeout(u, t), s && e.apply(o, r) } }(function () { s = r < window.pageYOffset, r = window.pageYOffset, s && f.filter(function (e) { return e.settings.y < t + r && !1 === e.settings.initialized }).forEach(i), 0 === n && window.removeEventListener("scroll", o, !1) }, d.debounce), r = 0, s = !1; window.addEventListener("scroll", o, !1) } function l(e, t) { if (e.iframe = c(e.settings), e.settings.thumbnail && t && (e.el.style.backgroundImage = "url(" + e.settings.thumbnail + ")"), e.settings.title && 0 === e.el.children.length) { var n = document.createDocumentFragment(), i = document.createElement("span"); i.className = "lazyframe__title", i.innerHTML = e.settings.title, n.appendChild(i), e.el.appendChild(n) } d.lazyload || (e.el.classList.add("lazyframe--loaded"), e.settings.onLoad.call(this, e), f.push(e)), e.settings.initialized || f.push(e) } function c(e) { var t = document.createDocumentFragment(), n = document.createElement("iframe"); if (e.vendor && (e.src = p.src[e.vendor](e)), n.setAttribute("id", "lazyframe-" + e.id), n.setAttribute("src", e.src), n.setAttribute("frameborder", 0), n.setAttribute("allowfullscreen", ""), "vine" === e.vendor) { var i = document.createElement("script"); i.setAttribute("src", "https://platform.vine.co/static/scripts/embed.js"), t.appendChild(i) } return t.appendChild(n), t } var d = void 0, f = [], m = { vendor: void 0, id: void 0, src: void 0, thumbnail: void 0, title: void 0, apikey: void 0, initialized: !1, parameters: void 0, y: void 0, debounce: 250, lazyload: !0, initinview: !1, onLoad: function (e) { }, onAppend: function (e) { }, onThumbnailLoad: function (e) { } }, p = { regex: { youtube_nocookie: /(?:youtube-nocookie\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=)))([a-zA-Z0-9_-]{6,11})/, youtube: /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/, vimeo: /vimeo\.com\/(?:video\/)?([0-9]*)(?:\?|)/, vine: /vine.co\/v\/(.*)/ }, condition: { youtube: function (e) { return !(!e || 11 != e[1].length) && e[1] }, youtube_nocookie: function (e) { return !(!e || 11 != e[1].length) && e[1] }, vimeo: function (e) { return !!(e && 9 === e[1].length || 8 === e[1].length) && e[1] }, vine: function (e) { return !(!e || 11 !== e[1].length) && e[1] } }, src: { youtube: function (e) { return "https://www.youtube.com/embed/" + e.id + "/?" + e.parameters }, youtube_nocookie: function (e) { return "https://www.youtube-nocookie.com/embed/" + e.id + "/?" + e.parameters }, vimeo: function (e) { return "https://player.vimeo.com/video/" + e.id + "/?" + e.parameters }, vine: function (e) { return "https://vine.co/v/" + e.id + "/embed/simple" } }, endpoints: { youtube: function (e) { return "https://www.googleapis.com/youtube/v3/videos?id=" + e.id + "&key=" + e.apikey + "&fields=items(snippet(title,thumbnails))&part=snippet" }, youtube_nocookie: function (e) { return "https://www.googleapis.com/youtube/v3/videos?id=" + e.id + "&key=" + e.apikey + "&fields=items(snippet(title,thumbnails))&part=snippet" }, vimeo: function (e) { return "https://vimeo.com/api/oembed.json?url=https%3A//vimeo.com/" + e.id }, vine: function (e) { return "https://vine.co/oembed.json?url=https%3A%2F%2Fvine.co%2Fv%2F" + e.id } }, response: { youtube: { title: function (e) { return e.items[0].snippet.title }, thumbnail: function (e) { var t = e.items[0].snippet.thumbnails; return (t.maxres || t.standard || t.high || t.medium || t.default).url } }, youtube_nocookie: { title: function (e) { return e.items[0].snippet.title }, thumbnail: function (e) { var t = e.items[0].snippet.thumbnails; return (t.maxres || t.standard || t.high || t.medium || t.default).url } }, vimeo: { title: function (e) { return e.title }, thumbnail: function (e) { return e.thumbnail_url } }, vine: { title: function (e) { return e.title }, thumbnail: function (e) { return e.thumbnail_url } } } }; return t }() });
