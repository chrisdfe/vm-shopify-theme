import HeaderWrapper from "./header/HeaderWrapper";
// function hideNavbar() {
//   $("body").removeClass("is-active").removeClass("blocked-scroll"),
//     $(".dropdown_link").toggleClass("active_link"),
//     $(".cart_container").removeClass("active_link");
// }

const header = {
  init: function () {
    const headerWrapper = HeaderWrapper.findAndInitialize();

    // $("html").on("click", function (e) {
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

  loadMegaMenu: function () {},

  loadMobileMegaMenu: function () {},

  unloadMegaMenu: function () {},

  unload: function () {
    // $("body").off("click", ".mobile_nav");
    // $("body").off("click", ".dropdown_link");
    // $("html").off("click");
    // $(".mini_cart").off("click");
    // $(".cart_content__continue-shopping").off("click");
    // $("body").off("click", '.banner a[href^="#"]');
    // $(".main_nav_wrapper.sticky_nav").remove();
  },
};

export default header;
