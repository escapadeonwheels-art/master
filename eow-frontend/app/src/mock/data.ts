
export const STRAPI_URL = 'https://cms-strapi-1005820341677.us-central1.run.app';

//export let mockServices: Service[] = [];

export const fetchArticles = async (): Promise<Service[]> => {
  try {
    let page = 1;
    let hasMorePages = true;
    const loadedServices: Service[] = []; // Local scoped array

    while (hasMorePages) {
      const response = await fetch(
        `${STRAPI_URL}/api/articles?pagination[page]=${page}&pagination[pageSize]=10&populate=*`
      );
      const data = await response.json();

      if (!data?.data || data.data.length === 0) break;

      for (let i = 0; i < data.data.length; i++) {
        const item = data.data[i];
        loadedServices.push({
          id: String(item.id),
          type: item.type,
          subtype: item.subtype || '',
          title: item.title,
          location: item.location,
          price: item.price,
          rating: Number(item.rating) || 0,
          reviews: Number(item.reviews) || 0,
          image: item.image?.[0]?.url || 'https://placeholder.com', 
          host: 'x',
          description: item.description,
          featured: item.featured,
          content: item.content || [],
        });
      }
      
      if (page < data.meta.pagination.pageCount) {
        page++;
      } else {
        hasMorePages = false;
      }
    }
    return loadedServices; // Always return the freshly loaded array
  } catch (error) {
    console.error("Strapi Load Error: ", error);
    return []; // Return safe empty fallback array
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



export const categories = [
  { id: '1', name: 'All', icon: 'grid-outline' },
  { id: '2', name: 'Beaches', icon: 'restaurant-outline' },
  { id: '3', name: 'Mountains', icon: 'cart-outline' },
  { id: '4', name: 'Cruises', icon: 'water-outline' },
  { id: '5', name: 'Trekking', icon: 'mountain-outline' },
  { id: '6', name: 'Wildlife', icon: 'business-outline' },
];
