declare global {
  var Shopify: {
    translation: {
      coming_soon_text: string;
      from_text: string;
      all_results: string;
      agree_to_terms_warning: string;
      add_to_cart: string;
      unavailable_text: string;
    };
    theme_settings: {
      display_sold_out_price: boolean;
      sold_out_text: string;
      free_text: string;
      search_items_to_display: string;
    };
    formatMoney: (amount: number, format: string) => string;
  };
}

export { }; 