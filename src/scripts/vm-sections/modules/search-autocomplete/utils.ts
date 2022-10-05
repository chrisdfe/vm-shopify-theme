import { getSizedImageUrl } from "@shopify/theme-images";
import camelCase from "lodash-es/camelCase";
import isPlainObject from "lodash-es/isPlainObject";

const CDN_BASE_URL = "//cdn.shopify.com/s/files/1/1077/2230/t/175/";

// TODO - move to a more general location
export function getCDNImageUrl(
  imageUrl: string,
  size: string,
  version?: boolean
) {
  const sizedImageUrl = getSizedImageUrl(imageUrl, size);
  let cdnImageUrl = `${CDN_BASE_URL}assets/${sizedImageUrl}`;

  if (version) {
    cdnImageUrl += `?v=${version}`;
  }

  return cdnImageUrl;
}

export function camelizeJSON(json: any) {
  if (Array.isArray(json)) {
    return json.map(field => camelizeJSON(field));
  }

  if (isPlainObject(json)) {
    return Object.keys(json).reduce((acc, rawKey) => {
      const key = camelCase(rawKey);
      const value = camelizeJSON(json[rawKey]);
      return { ...acc, [key]: value };
    }, {});
  }

  // It's a primitive - don't transform it
  return json;
}