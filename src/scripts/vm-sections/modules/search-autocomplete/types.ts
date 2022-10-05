export type SearchResultType = "page" | "product" | "article";

// just a stub for now
export type ShopifyCollection = {
  handle: string;
};

// Unfortunately when the a field value is null the shopify api uses an empty string value
//  which is what these "string | ___" types are about
export type SearchResult = {
  available: boolean,
  collections: string | ShopifyCollection[],
  objectType: SearchResultType;
  compare: string;
  price: string;
  rawPrice: string | number;
  priceMin: string | number;
  priceVaries: string | number;
  rawCompare: string | number;
  textContent: string;
  thumbnail: string;
  title: string;
  url: string;
};

export type SearchResponse = {
  results: SearchResult[],
  resultsCount: number;
};
