import Constants from 'expo-constants';
export const STRAPI_URL = process.env.EXPO_PUBLIC_STRAPI_URL || Constants.expoConfig?.extra?.strapiUrl;
export const PAGINATION_LIMIT = Number(process.env.EXPO_PUBLIC_PAGINATION_LIMIT || Constants.expoConfig?.extra?.paginationLimit || 10); 

const requestedFields = [
  'documentId',
  'type',
  'subtype',
  'title',
  'slug',
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
    let url = `${STRAPI_URL}/api/articles?pagination[page]=${page}&pagination[pageSize]=${PAGINATION_LIMIT}&${fieldsQueryString}&populate[image][fields][0]=url`;
    
    if (searchQuery.trim() !== '') {
      const cleanQuery = encodeURIComponent(searchQuery.trim());
      url += `&filters[$or][0][title][$containsi]=${cleanQuery}&filters[$or][1][location][$containsi]=${cleanQuery}`;
    }
    
    if (subtype) {
      const cleanSubtype = encodeURIComponent(subtype.trim());
      url += `&filters[subtype][$containsi]=${cleanSubtype}`;
    }
    
    if (maxPrice && maxPrice < 2000000) {
      url += `&filters[price_number][$lte]=${maxPrice}`;
    }

    if (duration && duration < 30) {
      url += `&filters[duration][$lte]=${duration}`;
    }

    if (region) {
      url += `&filters[type][$eq]=${region}`; 
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Strapi API Error (${response.status}):`, errorText);
      return [];
    }
    
    const json = await response.json();
    const rawData = json?.data || [];

    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i];

      let imageUrl = 'https://picsum.photos'; 
      if (item.image) {
        if (Array.isArray(item.image) && item.image[0]?.url) {
          imageUrl = item.image[0].url;
        } else if (item.image.url) {
          imageUrl = item.image.url;
        }
      }

      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `${STRAPI_URL}${imageUrl}`;
      }

      // 🛠️ FALLBACK UTILITY: Create a clean slug from the title if Strapi returns it missing
      const slugifyFallback = (text: string) => {
        console.log("slug-creation-from-title is used for title:"+string);
        return text
          ? text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
          : 'tour';
      };

      // Extract the slug wherever it might be hiding depending on the Strapi version nesting rules
      const backendSlug = item.slug || item.attributes?.slug || item.slug_name;
      const verifiedSlug = backendSlug ? String(backendSlug).trim() : slugifyFallback(item.title);
      
      loadedServices.push({
        id: String(item.documentId || item.id),
        type: item.type,
        subtype: item.subtype || '',
        title: item.title,
        slug: verifiedSlug, // 👈 Assigned the verified/fallback slug here
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

export const fetchArticleContent = async (documentId: string): Promise<StrapiRichTextContentNode[]> => {
  try {
    const response = await fetch(`${STRAPI_URL}/api/articles/${documentId}?fields=content`);
    if (!response.ok) {
      console.error(`Fetch content failed with status: ${response.status}`);
      return [];
    }
    const json = await response.json();
    return json?.data?.content || [];
  } catch (error) {
    console.error(`Failed loading content for article ${documentId}:`, error);
    return [];
  }
};

interface StrapiTextChild {
  text: string;
  type: 'text';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

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
  children: StrapiListItemBlock[];
}

type StrapiRichTextContentNode = 
  | StrapiHeadingBlock 
  | StrapiParagraphBlock 
  | StrapiListBlock;

export interface Service {
  id: string;
  type: string;
  subtype: string;
  title: string;
  slug: string; // 👈 Extended interface parameter definition profile contract
  location: string;
  price: string;          
  price_number: number;   
  rating: number;
  reviews: number;
  image: string;
  host: string;
  description: string;
  content: StrapiRichTextContentNode[];
  featured?: boolean;
}
