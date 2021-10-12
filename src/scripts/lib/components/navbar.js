function initHeadheasive() {
  new Headhesive(".main_nav_wrapper", {
    offset: 700,
    throttle: 300,
    classes: {
      clone: "sticky_nav",
      stick: "sticky_nav--stick",
      unstick: "sticky_nav--unstick",
    },
    onInit: function () {
      $(".sticky_nav .secondary_logo").css("display", "none");
      $(".sticky_nav .primary_logo").css("display", "block");
      $(".sticky_nav .icon-search").css("display", "block");
      $(".sticky_nav .search_container").css("display", "none");
      $(".sticky_nav .nav:last").prepend($(".header .cart_container").clone());
      "inline" == Shopify.theme_settings.menu_position
        ? $(".sticky_nav").height()
        : $(".sticky_nav .nav").height();
    },
    onStick: function () {
      $(".sticky_nav .mini_cart").css(
        "height",
        $(".sticky_nav .main_nav").height()
      ),
        $(".sticky_nav .cart_content").css(
          "top",
          $(".sticky_nav .main_nav").height()
        );
    },
    onUnstick: function () {
      $(".cart_container").removeClass("active_link");
    },
  });
}

function hideNavbar() {
  $("body").removeClass("is-active").removeClass("blocked-scroll"),
    $(".dropdown_link").toggleClass("active_link"),
    $(".cart_container").removeClass("active_link");
}

const header = {
  init: function () {
    console.log("initializing header");

    if ($(".promo_banner").length) {
      if (Cookies.get("promo_banner") !== "dismiss") {
        $("body").addClass("promo_banner-show");
        $(".promo_banner").on("click", ".promo_banner-close", function () {
          $("body").removeClass("promo_banner-show");
          Cookies.set("promo_banner", "dismiss", { expires: 30 });
        });
      }
    }

    $("html").on("click", function (e) {
      if (
        !$(e.target).closest(".cart_container").length &&
        $(".cart_content").is(":visible")
      ) {
        hideNavbar();

        if (
          $(e.target).closest(".dropdown_container").length &&
          $(".dropdown").is(":visible") &&
          !$(e.target).hasClass("url-deadlink")
        ) {
          $("body").removeClass("is-active");
          $(".dropdown_link").removeClass("active_link");
          $(".dropdown_container").hide();
          $(".mobile_nav").find("div").removeClass("open");
        }
      }
    });

    if ($(".main_nav_wrapper").length > 1) {
      $(".main_nav_wrapper").first().remove();
    }

    if ($("#header").hasClass("mobile_nav-fixed--true")) {
      $("body").addClass("mobile_nav-fixed--true");
      $("body").on("click", '.banner a[href^="#"]', function (e) {
        e.preventDefault();
        const t = $(this).attr("href");
        const a = $("#header").outerHeight();
        $("html, body").animate({ scrollTop: $(t).offset().top - a }, 2e3);
      });
    } else {
      $("body").addClass("mobile_nav-fixed--false");
    }

    // if ($("#header .cart_content").length < 1) {
    //   $("#header .cart_container").append($(".header .cart_content").clone());
    // }

    $(".dropdown_link").attr("data-no-instant", true);
    $("body").on("click", ".dropdown_link", function (e) {
      console.log("dropdown_link click");

      if (
        ($(".nav a").removeClass("active_link"), $("#header").is(":visible"))
      ) {
        var t = $(this)
          .parents("#header")
          .find('[data-dropdown="' + $(this).data("dropdown-rel") + '"]');
        $(this).hasClass("mini_cart") ||
          $(".cart_container").removeClass("active_link");
      } else {
        if ($(this).hasClass("icon-search"))
          // window.location = $(this).attr("href"));
          // return false;
          t = $(this)
            .parents(".main_nav")
            .find('[data-dropdown="' + $(this).data("dropdown-rel") + '"]');
      }

      if (t.is(":visible") || !t.attr("class")) {
        t.hide();
        $("body").removeClass("is-active");
      } else {
        $(".dropdown_container").hide();
        t.show();
        $("body").addClass("is-active");
        $(".mobile_nav").find("div").removeClass("open");
        t.is(":visible");
      }

      e.preventDefault();
      e.stopPropagation();
      return false;
    });

    $("body").on("click", ".mobile_nav", function () {
      console.log("mobile_nav click");
      $(this).find("div").toggleClass("open");
    });

    if (Shopify.theme_settings.cart_action !== "redirect_cart") {
      $(".mini_cart").on("click", function (e) {
        let t;
        const a = $(this).parent();

        if (a.hasClass("active_link")) {
          hideNavbar();
          $("body").removeClass("blocked-scroll");
        } else {
          t = a;
          $("body").addClass("blocked-scroll");
          $(".mobile_nav div").removeClass("open");
          $(".dropdown_link").removeClass("active_link");
          t.addClass("active_link");
          $("body").addClass("blocked-scroll");

          (is_touch_device() || $(window).width() <= 798) && e.preventDefault();
        }
      });
    }

    $(".cart_content__continue-shopping").on("click", function (e) {
      hideNavbar();
    });

    $(".nav a, .logo a")
      .not(".cart_content a")
      .on("mouseenter", function () {
        $(this).hasClass("active_link") ||
          ($(".dropdown_container").hide(),
          $(".active_link").removeClass("active_link"),
          $(".is-absolute").parent().addClass("feature_image"));
      });

    $(".main_nav, .top_bar, .cart_container").on("mouseleave", function () {
      $(".dropdown_container").hide();
      $(".active_link").removeClass("active_link");
    });

    $(".dropdown_link, .dropdown_link--vertical").attr("data-click-count", 0);

    $(".dropdown_link").on("mouseover touchstart", function (e) {
      console.log("mouseover");

      if (798 < $(window).width()) {
        $(".dropdown_container").hide();
      }

      const dropdown = $(this)
        .parents(".main_nav")
        .find('[data-dropdown="' + $(this).data("dropdown-rel") + '"]');
      let a = $(this).attr("data-click-count");
      console.log("dropdown", dropdown);

      if (!$(this).hasClass("active_link")) {
        $(".active_link").removeClass("active_link");
        dropdown.show();

        if ($(this).hasClass("mini_cart")) {
          if (!$("body").hasClass("cart")) {
            $(this).parent(".cart_container").addClass("active_link");
          }
        } else {
          if (798 < $(window).width()) {
            $(this).addClass("active_link");
            $(".is-absolute").parent().removeClass("feature_image");
          }
        }

        if (is_touch_device()) {
          $(".dropdown_link").not(this).attr("data-click-count", 0);
          $(".dropdown_link").attr("data-no-instant", !0);

          if (e.type === "touchstart") {
            a++;
            $(this).attr("data-click-count", a);
          }
        }

        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    });
  },

  removeDataAttributes: function (selector) {
    const element = $(selector);
    if (element.length) {
      const dataAttributes = [];
      const attributes = a.get(0).attributes;

      for (let index = 0; index < attributes.length; index++) {
        if ("data-" === attributes[index].name.substring(0, 5)) {
          t.push(attributes[index].name);
        }
      }

      $.each(dataAttributes, function (e, t) {
        element.removeAttr(t);
      });
    }
  },

  loadMegaMenu: function () {
    $(".sticky_nav .mega-menu").remove();
    $(".header .mega-menu").remove();
    $(".mega-menu-container .mega-menu")
      .clone()
      .appendTo(".sticky_nav .main_nav");
    this.removeDataAttributes(
      ".sticky_nav .mega-menu.dropdown_container .dropdown_column"
    );

    $(".mega-menu-container .mega-menu").each(function (e) {
      const t = $(this).data("dropdown");
      $('[data-dropdown-rel="' + t + '"]')
        .find("span")
        .remove();

      $('[data-dropdown-rel="' + t + '"]')
        .not(".icon-search")
        .append(' <span class="icon-down-arrow"></span>')
        .addClass("mega-menu-parent")
        .addClass("dropdown_link")
        .removeClass("top_link");

      $('[data-dropdown="' + t + '"]').each(function (e) {
        $(this).hasClass("mega-menu") || $(this).remove();
      });

      $(this).clone().appendTo(".header .main_nav");
    });
  },

  loadMobileMegaMenu: function () {
    $(".mega-menu-container .mobile-mega-menu").each(function (e) {
      $('[data-mobile-dropdown-rel="' + $(this).data("mobile-dropdown") + '"]')
        .find("span")
        .remove();

      $(
        '[data-mobile-dropdown-rel="' +
          $(this).data("mobile-dropdown") +
          '"] > a'
      )
        .append(' <span class="right icon-down-arrow"></span>')
        .attr("data-no-instant", "true");

      $(
        '[data-mobile-dropdown-rel="' + $(this).data("mobile-dropdown") + '"]'
      ).addClass("mobile-mega-menu-parent sublink");

      $(
        '[data-mobile-dropdown-rel="' + $(this).data("mobile-dropdown") + '"]'
      ).append(this);

      $(
        '[data-mobile-dropdown-rel="' +
          $(this).data("mobile-dropdown") +
          '"] > ul'
      ).each(function (e) {
        $(this).hasClass("mobile-mega-menu") || $(this).remove();
      });
    });
  },

  unloadMegaMenu: function () {
    $(".header .mega-menu").remove();
    $(".mega-menu-container .mega-menu").each(function (e) {
      $(this).data("dropdown");
      $(
        '.mega-menu-parent[data-dropdown-rel="' +
          $(this).data("dropdown") +
          '"]'
      )
        .find(".icon-down-arrow")
        .remove();
    });
  },

  unload: function () {
    $("body").off("click", ".mobile_nav");
    $("body").off("click", ".dropdown_link");
    $("html").off("click");
    $(".mini_cart").off("click");
    $(".cart_content__continue-shopping").off("click");
    $("body").off("click", '.banner a[href^="#"]');
    $(".main_nav_wrapper.sticky_nav").remove();
  },
};

export default header;
