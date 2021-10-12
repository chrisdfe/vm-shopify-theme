const cart = {
  init: function () {
    $("#cart_form .tos_agree").length &&
      $("body").on("click", "#cart_form input[type='submit']", function () {
        if (!$(this).parents("form").find(".tos_agree").is(":checked")) {
          var e =
            '<p class="warning animated bounceIn">' +
            Shopify.translation.agree_to_terms_warning +
            "</p>";
          return 0 == $("p.warning").length && $(this).before(e), !1;
        }
        $(this).submit();
      });
  },
};

export default cart;
