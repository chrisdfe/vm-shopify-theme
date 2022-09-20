// @ts-nocheck
// functionality ported straight over from turbo
export default function initialize() {
  var e = $(".meta-related-recommended-collection"),
    t = $(".product-recommendations"),
    a = t.data("productId"),
    i = t.data("limit"),
    o = t.data("enabled"),
    n = e.data("enabled"),
    l = $("[data-product-recommendations-container]"),
    s = $(".js-recommended-products-slider");
  if (e.length) {
    if (!n) {
      l.empty();
      return;
    };
    l.html(e.html()),
      $("[data-product-recommendations-container] .js-product_section .product_form_options").each(function () {
        0 === $(this).find("select").length && new Shopify.OptionSelectors($(this).data("select-id"), {
          product: $(this).data("product"),
          onVariantSelected: selectCallback,
          enableHistoryState: $(this).data("enable-state")
        });
      }),
      Shopify.PaymentButton && Shopify.PaymentButton.init(),
      $(".recommended-products-section").empty();
  } else if (t.length) {
    if (!o) return void l.empty();
    $.ajax({
      type: "GET",
      url: "/recommendations/products?section_id=product-recommendations&limit=" + i + "&product_id=" + a,
      success: function (e) {
        var t = $(e).find(".product-recommendations").html();
        l.empty();
        l.html(t);
        $("[data-product-recommendations-container] .js-product_section .product_form_options").each(function () {
          new Shopify.OptionSelectors($(this).data("select-id"), {
            product: $(this).data("product"),
            onVariantSelected: selectCallback,
            enableHistoryState: $(this).data("enable-state")
          });
        });
        Currency.show_multiple_currencies && currencyConverter.convertCurrencies();
        Shopify.PaymentButton && Shopify.PaymentButton.init();

        if ($("[data-recommended-product-count]").data() === 0) {
          $("[data-product-recommendations-container]").hide();
        } else {
          window.dispatchEvent(new Event('product-recommendations-loaded'));
        }
      }
    });
  } else l.hide();
}