import type { MetadataRoute } from "next";
import { SITE_URL, PUBLIC_ROUTES } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: path === "/begin" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/begin" ? 0.9 : 0.6,
  }));
}
