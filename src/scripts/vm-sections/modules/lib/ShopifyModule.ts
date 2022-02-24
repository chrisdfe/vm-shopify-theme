interface ShopifySectionSelectEvent extends Event {
  detail: {
    sectionId: string;
    load: boolean;
  };
}

class ShopifyModule {
  constructor() {
    window.addEventListener("shopify:section:select", ((
      event: ShopifySectionSelectEvent
    ) => {
      this.onShopifySectionSelect(event);
    }) as EventListener);
  }

  onShopifySectionSelect(event: ShopifySectionSelectEvent) {}
}

export default ShopifyModule;
