import Constants from 'expo-constants';
export const STRAPI_URL = process.env.EXPO_PUBLIC_STRAPI_URL || Constants.expoConfig?.extra?.strapiUrl  //'https://cms-strapi-1005820341677.us-central1.run.app';
//CENTRAL CONFIGURATION: Control your app's chunk sizes in one location
export const PAGINATION_LIMIT = Number(process.env.EXPO_PUBLIC_PAGINATION_LIMIT || Constants.expoConfig?.extra?.paginationLimit || 10); 

// Explicitly request all required root fields to exclude 'content'
const requestedFields = [
  'documentId',
  'type',
  'subtype',
  'title',
  'location',
  'price',
  'rating',
  'reviews',
  'description',
  'featured'
];

const fieldsQueryString = requestedFields
  .map((field, index) => `fields[${index}]=${field}`)
  .join('&');

/**
 * Fetches only the first page of articles, excluding the heavy 'content' attribute.
 * Pass a specific page number later when loading more from the explore page.
 */
export const fetchArticles = async (page: number = 1): Promise<Service[]> => {
  try {
    const loadedServices: Service[] = [];

    //Fetch data from Strapi (only requested fields )
    const url = `${STRAPI_URL}/api/articles?pagination[page]=${page}&pagination[pageSize]=${PAGINATION_LIMIT}&${fieldsQueryString}&populate[image][fields][0]=url`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Strapi API Error (${response.status}):`, errorText);
      return [];
    }
    const data = await response.json();

    if (!data?.data || data.data.length === 0) return [];

    for (let i = 0; i < data.data.length; i++) {
      const item = data.data[i];

      //Strapi v5 media fields returns an object directly or via arrays
      let imageUrl = 'https://picsum.photos'; // ✅ High-availability fast placeholder link
      if (item.image) {
        if (Array.isArray(item.image) && item.image[0]?.url) {
          imageUrl = item.image[0].url;
        } else if (item.image.url) {
          imageUrl = item.image.url;
        }
      }

      loadedServices.push({
        id: String(item.documentId || item.id),
        type: item.type,
        subtype: item.subtype || '',
        title: item.title,
        location: item.location,
        price: item.price,
        rating: Number(item.rating) || 0,
        reviews: Number(item.reviews) || 0,
        image: imageUrl, 
        host: 'x',
        description: item.description,
        featured: item.featured,
        content: [], // Safe empty array placeholder for the app startup lifecycle
      });
    }
    
    return loadedServices;
  } catch (error) {
    console.error("Strapi Load Error: ", error);
    return []; 
  }
};

/**
 * Fetches only the 'content' attribute for a specific article ID.
 * This ensures we never load heavy rich text data on app startup.
 */
export const fetchArticleContent = async (documentId: string): Promise<StrapiRichTextContentNode[]> => {
  try {
    // Strapi v5 handles single lookups via: /api/articles/:documentId
    const response = await fetch(`${STRAPI_URL}/api/articles/${documentId}?fields=content`);
    
    if (!response.ok) {
      console.error(`Fetch content failed with status: ${response.status}`);
      return [];
    }
    
    const json = await response.json();
    // Strapi v5 single responses wrap properties under a root .data object block
    return json?.data?.content || [];
  } catch (error) {
    console.error(`Failed loading content for article ${documentId}:`, error);
    return [];
  }
};

// 1. The baseline text leaf node found inside a "children" layout array
interface StrapiTextChild {
  text: string;
  type: 'text';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

// 2. Individual structural block specifications
interface StrapiHeadingBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: StrapiTextChild[];
}

interface StrapiParagraphBlock {
  type: 'paragraph';
  children: StrapiTextChild[];
}

interface StrapiListItemBlock {
  type: 'list-item';
  children: StrapiTextChild[];
}

interface StrapiListBlock {
  type: 'list';
  format: 'unordered' | 'ordered';
  children: StrapiListItemBlock[]; // Lists hold nested item blocks rather than flat text
}

// 3. Consolidated Union Type for the content array mapping layer
type StrapiRichTextContentNode = 
  | StrapiHeadingBlock 
  | StrapiParagraphBlock 
  | StrapiListBlock;

export interface Service {
  id: string;
  type: 'delivery' | 'travel';
  subtype: '';
  title: string;
  location: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  host: string;
  description: string;
  content: StrapiRichTextContentNode[];
  featured?: boolean;
}

