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
  'price_number',
  'rating',
  'reviews',
  'description',
  'featured',
  'duration'
];

const fieldsQueryString = requestedFields
  .map((field, index) => `fields[${index}]=${field}`)
  .join('&');

// FIX: Added interface contract explicitly so parameter fields map successfully
interface FetchArticlesParams {
  page?: number;
  searchQuery?: string;
  subtype?: string | null;
  maxPrice?: number;
  region?: string | null;
  duration?: number;
}

/**
 * Fetches filtered and paginated articles from Strapi
 */
export const fetchArticles = async ({
  page = 1,
  searchQuery = '',
  subtype = null,
  maxPrice = 2000000,
  region = null,
  duration = 30
}: FetchArticlesParams = {}): Promise<Service[]> => {
  try {
    const loadedServices: Service[] = [];

    // Base URL setup with pagination parameters and image inclusion fields
    let url = `${STRAPI_URL}/api/articles?pagination[page]=${page}&pagination[pageSize]=${PAGINATION_LIMIT}&${fieldsQueryString}&populate[image][fields][0]=url`;
    
    // Dynamic Filter 1: Text Search (Properly indexed $or groups for Strapi)
    if (searchQuery.trim() !== '') {
      const cleanQuery = encodeURIComponent(searchQuery.trim());
      // Explicitly adding numerical indices [0] and [1] tells Strapi to evaluate this as a proper logical array
      url += `&filters[$or][0][title][$containsi]=${cleanQuery}&filters[$or][1][location][$containsi]=${cleanQuery}`;
    }
    
    // Dynamic Filter 2: Subtype Selection
    if (subtype) {
      const cleanSubtype = encodeURIComponent(subtype.trim());
      url += `&filters[subtype][$containsi]=${cleanSubtype}`;
    }
    
    // Dynamic Filter 3: Price Ceiling via the true Number column
    if (maxPrice && maxPrice < 2000000) {
      url += `&filters[price_number][$lte]=${maxPrice}`;
    }

    // Dynamic Filter 4: Duration constraint filtering via Strapi standard operators
    if (duration && duration < 30) {
      url += `&filters[duration][$lte]=${duration}`;
    }

    //Dynamic Filter 5: Region Mapping to Strapi 'type' column with Title Case transformation
    if (region) {
      // Pass the clean lowercase 'international' or 'domestic' string directly to match the DB
      url += `&filters[type][$eq]=${region}`; 
    }
    //console.log("DEBUG: Outgoing Strapi Request Target URL string ->", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Strapi API Error (${response.status}):`, errorText);
      return [];
    }
    
    const json = await response.json();
    //console.log(`DEBUG RESPONSE: Found ${json?.data?.length || 0} base data matching items array.`);
    

    const rawData = json?.data || [];

    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i];

      let imageUrl = 'https://picsum.photos'; 

      if (item.image) {
        // If Strapi returns it as an array due to fields[0]=url positioning
        if (Array.isArray(item.image) && item.image[0]?.url) {
          imageUrl = item.image[0].url;
        } 
        // Fallback if it comes as a straight single object mapping block
        else if (item.image.url) {
          imageUrl = item.image.url;
        }
      }

// Prefixes your backend domain cleanly to local upload formats
if (imageUrl && !imageUrl.startsWith('http')) {
  imageUrl = `${STRAPI_URL}${imageUrl}`;
}

      loadedServices.push({
        id: String(item.documentId || item.id),
        type: item.type,
        subtype: item.subtype || '',
        title: item.title,
        location: item.location,

        price: item.price ? String(item.price) : `₹${Number(item.price_number || 0).toLocaleString('en-IN')}`,
        price_number: item.price_number !== undefined && item.price_number !== null 
          ? Number(item.price_number) 
          : (Number(String(item.price).replace(/[^0-9]/g, '')) || 0),
        
        rating: Number(item.rating) || 0,
        reviews: Number(item.reviews) || 0,
        image: imageUrl, 
        host: 'x',
        description: item.description,
        featured: item.featured,
        content: [], 
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
  type: string;
  subtype: string;
  title: string;
  location: string;
  price: string;          // Changed to string to safely contain the text representation
  price_number: number;   // Maintained separately to process math operations internally
  rating: number;
  reviews: number;
  image: string;
  host: string;
  description: string;
  content: StrapiRichTextContentNode[];
  featured?: boolean;
}

