// functionality copied straight over from turbo
function onQuantityChange() {
  // @ts-ignore
  var e = $(this),
    // @ts-ignore
    t = $(this).siblings("input"),
    a = parseInt(t.val()),
    i = 1e29,
    o = t.attr("min") || 0;
  return (
    null != t.attr("max") && (i = t.attr("max")),
    isNaN(a) || a < o ?
      (t.val(o), !1) :
      i < a ?
        (t.val(i), !1) :
        ("plus" == e.data("func") ? a < i && t.val(a + 1) : (o < a && t.val(a - 1), e.parents(".cart_item").length && a - 1 == 0 && e.closest(".cart_item").addClass("animated fadeOutUp")), void t.trigger("change"))
  );
}

export default class ProductQuantityBox {
  initialize() {
    // @ts-ignore
    $("body").on("click", ".js-change-quantity", onQuantityChange);
  }

  unload() {
    // @ts-ignore
    $("body").off("click", ".js-change-quantity", onQuantityChange);
  }
};
