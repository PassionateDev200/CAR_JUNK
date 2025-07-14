/** route: src/lib/navigation.js */
// Navigation utilities for admin/site switching
export const getCallbackUrl = (currentPath) => {
  if (typeof window === "undefined") return "/";

  // Don't include admin paths in callback
  if (currentPath?.startsWith("/admin")) {
    return "/";
  }

  return currentPath || "/";
};

export const buildAdminLoginUrl = (callbackPath) => {
  if (!callbackPath || callbackPath === "/") {
    return "/admin/login";
  }

  const encodedCallback = encodeURIComponent(callbackPath);
  return `/admin/login?callback=${encodedCallback}`;
};

export const getRedirectUrl = (searchParams, defaultUrl = "/") => {
  const callback = searchParams?.get("callback");

  if (!callback) return defaultUrl;

  const decodedUrl = decodeURIComponent(callback);

  // Security check - only allow relative URLs
  if (decodedUrl.startsWith("/") && !decodedUrl.startsWith("//")) {
    return decodedUrl;
  }

  return defaultUrl;
};
