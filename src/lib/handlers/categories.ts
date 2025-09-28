import { GraphQLClient, gql } from 'graphql-request';

const DIRECTUS_GRAPHQL_ENDPOINT = process.env.DIRECTUS_GRAPHQL_ENDPOINT || 'http://localhost:8055/graphql';
const client = new GraphQLClient(DIRECTUS_GRAPHQL_ENDPOINT);

const CATEGORIES_QUERY = gql`
    query getCategories {
        categories {
            id
            name
            slug
            description
        }
    }
`;

const CATEGORY_BY_ID_QUERY = gql`
    query getCategoryById($id: String!) {
        categories(filter: { id: { _eq: $id } }) {
            id
            name
            slug
            description
        }
    }
`;

const CATEGORY_BY_SLUG_QUERY = gql`
    query getCategoryBySlug($slug: String!) {
        categories(filter: { slug: { _eq: $slug } }) {
            id
            name
            slug
            description
        }
    }
`;

async function fetchCategories() {
    const data = await client.request<{ categories: any[] }>(CATEGORIES_QUERY);
    return data.categories;
}

async function fetchCategoryById(id: string) {
    const data = await client.request<{ categories: any[] }>(CATEGORY_BY_ID_QUERY, { id });
    return data.categories[0] || null;
}

async function fetchCategoryBySlug(slug: string) {
    const data = await client.request<{ categories: any[] }>(CATEGORY_BY_SLUG_QUERY, { slug });
    return data.categories[0] || null;
}

export const categoriesHandler = {
    allCategories: async () => await fetchCategories(),
    oneCategory: async (categoryId: string) => await fetchCategoryById(categoryId),
    oneCategoryBySlug: async (categorySlug: string) => await fetchCategoryBySlug(categorySlug),
    // allCategoriesWithLatestArticles can be implemented if needed, but requires articlesHandler to be async-aware
};