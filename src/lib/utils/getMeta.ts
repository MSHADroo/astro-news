import { render, type CollectionEntry } from "astro:content";
import { authorsHandler } from "@/lib/handlers/authors";
import { SITE } from "@/lib/config";
import defaultImage from "@/assets/images/default-image.jpg";
import type { ArticleMeta, Meta } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/utils/letter";
import { normalizeDate } from "@/lib/utils/date";

type GetMetaCollection = CollectionEntry<"articles" | "views">;

const renderCache = new Map<string, any>();

export const getMeta = async (
    entry: any, // Can be Astro Content or Directus article
    category?: string
): Promise<Meta | ArticleMeta> => {
  try {
    // Astro Content entry
    if (entry.collection && entry.data) {
      const collectionId = `${entry.collection}-${entry.id}`;
      if (entry.collection === "articles") {
        if (renderCache.has(collectionId)) {
          return renderCache.get(collectionId);
        }
        const { remarkPluginFrontmatter } = await render(entry);
        const authors = authorsHandler.getAuthors(entry.data.authors);
        const meta: ArticleMeta = {
          title: `${capitalizeFirstLetter(entry.data.title)} - ${SITE.title}`,
          metaTitle: capitalizeFirstLetter(entry.data.title),
          description: entry.data.description,
          ogImage: entry.data.cover.src,
          ogImageAlt: entry.data.covert_alt || entry.data.title,
          publishedTime: normalizeDate(entry.data.publishedTime),
          lastModified: remarkPluginFrontmatter.lastModified,
          authors: authors.map((author) => ({
            name: author.data.name,
            link: `${author.id}`,
          })),
          type: "article",
        };
        renderCache.set(collectionId, meta);
        return meta;
      }
      if (entry.collection === "views") {
        const collectionId = `${entry.collection}-${entry.id}`;
        const cacheKey = category ? `${collectionId}-${category}` : collectionId;
        if (renderCache.has(cacheKey)) {
          return renderCache.get(cacheKey);
        }
        const title = entry.id === "categories" && category
            ? `${capitalizeFirstLetter(category)} - ${SITE.title}`
            : entry.id === "home"
                ? SITE.title
                : `${capitalizeFirstLetter(entry.data.title)} - ${SITE.title}`;
        const meta: Meta = {
          title,
          metaTitle: capitalizeFirstLetter(entry.data.title),
          description: entry.data.description,
          ogImage: defaultImage.src,
          ogImageAlt: SITE.title,
          type: "website",
        };
        renderCache.set(cacheKey, meta);
        return meta;
      }
      throw new Error(`Invalid collection type: ${(entry as GetMetaCollection).collection}`);
    }
    // Directus article object
    if (entry.title && entry.content) {
      const meta: ArticleMeta = {
        title: `${capitalizeFirstLetter(entry.title)} - ${SITE.title}`,
        metaTitle: capitalizeFirstLetter(entry.title),
        description: entry.excerpt || entry.content.substring(0, 160),
        ogImage: entry.cover_image?.filename_download || defaultImage.src,
        ogImageAlt: entry.cover_image?.title || entry.title,
        publishedTime: normalizeDate(entry.date_published),
        lastModified: normalizeDate(entry.date_published),
        authors: [], // Add author support if available in Directus
        type: "article",
      };
      return meta;
    }
    throw new Error(`Invalid entry type for getMeta`);
  } catch (error) {
    console.error(`Error generating metadata for entry:`, error);
    throw error;
  }
};
