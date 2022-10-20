// @ts-nocheck
// functionality ported straight over from turbo
function onCartClick() {
  if (!$(this).parents("form").find(".tos_agree").is(":checked")) {
    const e =
      '<p class="warning animated bounceIn">' +
      Shopify.translation.agree_to_terms_warning +
      "</p>";
    return 0 == $("p.warning").length && $(this).before(e);
  }
  $(this).submit();
}

export default class Cart {
  showTosAgreement: boolean;

  initialize() {
    this.showTosAgreement = $("#cart_form .tos_agree");

    if (this.showTosAgreement) {
      $("body").on("click", "#cart_form input[type='submit']", onCartClick);
    }
  };

  unload() {
    if (this.showTosAgreement) {
      $("body").off("click", "#cart_form input[type='submit']", onCartClick);
    }
  }
};

