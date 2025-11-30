/**
 * Optimizes Cloudinary image URLs dynamically.
 *
 * @param {string} url - Original Cloudinary image URL
 * @param {object} options - Optional settings
 * @param {number} options.width - Desired width of the image
 * @param {number} options.height - Desired height of the image
 * @param {boolean} options.autoFormat - Enable automatic format (webp/avif)
 * @param {boolean} options.autoQuality - Enable automatic quality
 * @returns {string} Optimized Cloudinary URL
 */
interface CloudinaryOptions {
  width?: number;
  height?: number;
  autoFormat?: boolean;
  autoQuality?: boolean;
}

export function getOptimizedCloudinaryUrl(
  url: string,
  options: CloudinaryOptions = {}
) {
  const {
    width = 800,
    height = 600,
    autoFormat = true,
    autoQuality = true,
  } = options;

  if (!url.includes("res.cloudinary.com")) return url; // Non-Cloudinary URL

  const parts = url.split("/upload/");
  if (parts.length !== 2) return url;

  const transformations = [
    autoFormat ? "f_auto" : "",
    autoQuality ? "q_auto" : "",
    `w_${width}`,
    `h_${height}`,
  ]
    .filter(Boolean)
    .join(",");

  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}
