import rss from "@astrojs/rss";
import { SITE } from "../lib/config";
import {articlesHandler} from "@/lib/handlers/articles.js";

export async function GET(context) {
  const articles = await articlesHandler.allArticles();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site,
    items: articles.map((article) => ({
      title: article.title,
      pubDate: article.date_published,
      description: article.content,
      link: `/article/${article.id}/${article.slug}`,
    })),
  });
}
