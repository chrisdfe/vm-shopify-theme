import { getSizedImageUrl } from "@shopify/theme-images";
import { CDN_BASE_URL } from "./constants";

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
