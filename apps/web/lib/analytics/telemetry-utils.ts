// Helper function to simplify user-agent parsing
export function parseUserAgent(uaStr: string | null | undefined): {
  browser: string;
  os: string;
  device: string;
} {
  if (!uaStr) {
    return { browser: "Unknown", os: "Unknown", device: "Desktop" };
  }

  const ua = uaStr.toLowerCase();
  let browser = "Unknown";
  let os = "Unknown";
  let device = "Desktop";

  // Browser Detection
  if (ua.includes("chrome") || ua.includes("chromium")) {
    if (ua.includes("edg")) browser = "Edge";
    else if (ua.includes("opr") || ua.includes("opera")) browser = "Opera";
    else browser = "Chrome";
  } else if (ua.includes("safari")) {
    if (ua.includes("chrome")) browser = "Chrome";
    else browser = "Safari";
  } else if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("msie") || ua.includes("trident")) {
    browser = "IE";
  }

  // OS Detection
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("macintosh") || ua.includes("mac os")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) os = "iOS";
  else if (ua.includes("linux")) os = "Linux";

  // Device Detection
  if (ua.includes("ipad") || (ua.includes("android") && !ua.includes("mobile"))) {
    device = "Tablet";
  } else if (ua.includes("mobile") || ua.includes("iphone") || ua.includes("ipod")) {
    device = "Mobile";
  }

  return { browser, os, device };
}
