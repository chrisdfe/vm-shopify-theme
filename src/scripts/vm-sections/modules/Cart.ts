export default class Cart {
  initialize = () => {
    if ($("#cart_form .tos_agree")) {
      $("body").on("click", "#cart_form input[type='submit']", function () {
        if (!$(this).parents("form").find(".tos_agree").is(":checked")) {
          const e =
            '<p class="warning animated bounceIn">' +
            Shopify.translation.agree_to_terms_warning +
            "</p>";
          return 0 == $("p.warning").length && $(this).before(e);
        }
        $(this).submit();
      });
    }
  };
};

