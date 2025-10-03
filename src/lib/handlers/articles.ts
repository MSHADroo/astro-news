import {GraphQLClient, gql} from 'graphql-request';

const DIRECTUS_GRAPHQL_ENDPOINT = process.env.DIRECTUS_GRAPHQL_ENDPOINT || 'http://localhost:8055/graphql';

const client = new GraphQLClient(DIRECTUS_GRAPHQL_ENDPOINT);

const ARTICLE_BY_ID_QUERY = gql`
  query getArticleById($id: GraphQLStringOrFloat!) {
  articles(filter: { id: { _eq: $id } }) {
    id
    title
    excerpt
    content
    cover_image {
      id
      filename_download
      title
      type
      width
      height
    }
    source_url
    slug
    status
    views_count
    tags {
      tags_id {
        id
        name
      }
    }
    is_featured
    category {
      id
      name
      slug
    }
    seo_title
      seo_description
      date_published
      gallery {}
  }
}
`;


const ARTICLES_QUERY = gql`
  query getArticles($filter: articles_filter, $limit: Int, $offset: Int, $sort: [String!]) {
    articles(filter: $filter, limit: $limit, offset: $offset, sort: $sort) {
      id
      title
      excerpt
      content
      cover_image {
        id
        title
        filename_download
        storage
        location
        embed
        width
        height
      }
      source_url
      slug
      status
      views_count
      tags {
        tags_id {
          id
          name
          slug
        }
      }
      is_featured
      category {
        id
        name
      }
      seo_title
      seo_description
      date_published
      gallery {}
    }
  }
`;

const ARTICLES_FOR_ROUTES_QUERY = gql`
  query getArticles($filter: articles_filter, $limit: Int, $offset: Int, $sort: [String!]) {
    articles(filter: $filter, limit: $limit, offset: $offset, sort: $sort) {
      id
      slug
    }
  }
`;


type Article = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    // publishedTime: string;
    is_featured: boolean;
    // isMainHeadline?: boolean;
    // isSubHeadline?: boolean;
    cover_image?: {
        id: string;
        filename_download: string;
        title?: string;
        type?: string;
        width?: number;
        height?: number;
    };
    date_published?: string
    seo_title?: string
    seo_description?: string
    source_url: string;
    category?: {
        id: number;
        name: string;
    };
    // author?: {
    //   id: string;
    //   name: string;
    //   avatar?: {
    //     id: string;
    //     filename_download: string;
    //   };
    // };
};

type ArticlesQueryResponse = {
    articles: Article[];
};

async function fetchArticleById(id: string): Promise<Article | null> {
    const data = await client.request<{ articles: Article[] }>(ARTICLE_BY_ID_QUERY, {id});
    return data.articles[0] || null;
}

// filter: Directus filter object, limit, offset, sort are optional
async function fetchArticles(filter: any = {}, limit?: number, offset?: number, sort?: string[]): Promise<Article[]> {
    const variables: any = {filter, limit, offset, sort};
    // Remove undefined values for Directus compatibility
    Object.keys(variables).forEach((k) => variables[k] === undefined && delete variables[k]);
    // console.log(variables)
    const data = await client.request<ArticlesQueryResponse>(ARTICLES_QUERY, variables);
    // console.warn(data.articles)
    return data.articles;
}

async function fetchArticlesForRoutes(filter: any = {}, limit?: number, offset?: number, sort?: string[]): Promise<Article[]> {
    const variables: any = {filter, limit, offset, sort};
    // Remove undefined values for Directus compatibility
    Object.keys(variables).forEach((k) => variables[k] === undefined && delete variables[k]);
    const data = await client.request<ArticlesQueryResponse>(ARTICLES_FOR_ROUTES_QUERY, variables);
    return data.articles;
}

export const articlesHandler = {
    // Get all published, non-draft articles, sorted by date_published desc
    allArticles: async (limit?: number, offset?: number): Promise<Article[]> =>
        await fetchArticles({status: {_eq: "published"}}, limit, offset, ["-date_published"]),
    allArticlesForRoutes: async (): Promise<Article[]> =>
        await fetchArticlesForRoutes({status: {_eq: "published"}}, undefined, undefined, ["-date_published"]),

    // Get main headline (featured article)
    mainHeadline: async (): Promise<Article> => {
        const articles = await fetchArticles({
            is_featured: {_eq: true},
            status: {_eq: "published"}
        }, 1, 0, ["-date_published"]);
        const article = articles[0];
        if (!article) throw new Error('Please ensure there is at least one item to display for the main headline.');
        return article;
    },

    // Get up to 4 sub-headlines (other featured articles)
    subHeadlines: async (): Promise<Article[]> => {
        const articles = await fetchArticles({
            is_featured: {_eq: true},
            status: {_eq: "published"}
        }, 5, 0, ["-date_published"]);
        // Remove the main headline if present
        const mainHeadline = articles[0];
        const subHeadlines = articles.filter((a: Article) => mainHeadline?.id !== a.id).slice(0, 4);
        if (subHeadlines.length === 0) throw new Error('Please ensure there is at least one item to display for the sub headlines.');
        return subHeadlines;
    },

    // Get articles by category name (slug)
    articlesByCategory: async (categoryName: string): Promise<Article[]> =>
        await fetchArticles({
            category: {slug: {_eq: categoryName}},
            status: {_eq: "published"}
        }, undefined, undefined, ["-date_published"]),

    articlesByCategoryId: async (categoryId: string): Promise<Article[]> =>
        await fetchArticles({
            category: {id: {_eq: categoryId}},
            status: {_eq: "published"}
        }, undefined, undefined, ["-date_published"]),

    // Get articles with search
    searchArticles: async (search: string): Promise<Article[]> =>
        await fetchArticles({
            _or: [
                {title: {_contains: search}},
                {excerpt: {_contains: search}},
                {content: {_contains: search}}
            ], status: {_eq: "published"}
        }, undefined, undefined, ["-date_published"]),

    getArticleById: async (id: string): Promise<Article | null> => await fetchArticleById(id),
};
