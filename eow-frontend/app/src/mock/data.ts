
const STRAPI_URL = 'https://cms-strapi-1005820341677.us-central1.run.app';

export const mockServices: Service[] = [];

const fetchArticles = async () => {
  try {
    let page = 1;
    let hasMorePages = true;

    while (hasMorePages) {
      const response = await fetch(
        `${STRAPI_URL}/api/articles?pagination[page]=${page}&pagination[pageSize]=10&populate=*`
      );
      
      console.log(`Loading page ${page} from Strapi`);
      const data = await response.json();

      if (!data?.data || data.data.length === 0) {
        break;
      }

      for (let i = 0; i < data.data.length; i++) {
        mockServices.push({
          id: String(data.data[i].id),
          type: data.data[i].type,
          subtype: data.data[i].subtype,
          title: data.data[i].title,
          location: data.data[i].location,
          price: data.data[i].price,
          rating: data.data[i].rating,
          reviews: data.data[i].reviews,
          image: data.data[i].image?.[0]?.url || 'https://placeholder.com', 
          host: 'x',
          description: data.data[i].description,
          featured: data.data[i].featured,
          content: data.data[i].content || [], // ✅ Maps your rich text node structure safely
        });
      }

      // Check pagination limits
      if (page < data.meta.pagination.pageCount) {
        page++;
      } else {
        hasMorePages = false;
      }
    }
    console.log("Completed total data load from Strapi. Count: " + mockServices.length);
  } catch (error) {
    console.error("Strapi Load Error: ", error);
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

fetchArticles();

/*
export const mockServices: Service[] = [
  {
    id: '1',
    type: 'delivery',
    title: 'Fresh Groceries Delivery',
    location: 'Downtown, 2.5 km',
    price: 15,
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    host: 'QuickMart',
    description: 'Fast grocery delivery within 30 minutes',
    featured: true,
  },
  {
    id: '2',
    type: 'travel',
    title: 'Beachfront Villa',
    location: 'Bali, Indonesia',
    price: 120,
    rating: 4.9,
    reviews: 456,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2',
    host: 'Sarah',
    description: 'Stunning ocean views with private pool',
    featured: true,
  },
  {
    id: '3',
    type: 'delivery',
    title: 'Restaurant Food Delivery',
    location: 'Midtown, 1.2 km',
    price: 25,
    rating: 4.7,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    host: 'Tasty Bites',
    description: 'Hot meals delivered to your door',
  },
  {
    id: '4',
    type: 'travel',
    title: 'Mountain Cabin Retreat',
    location: 'Aspen, Colorado',
    price: 200,
    rating: 5.0,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    host: 'Michael',
    description: 'Cozy cabin with mountain views',
  },
  {
    id: '5',
    type: 'delivery',
    title: 'Pharmacy Essentials',
    location: 'Uptown, 3.1 km',
    price: 10,
    rating: 4.6,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de',
    host: 'HealthPlus',
    description: 'Medicine and health products delivery',
  },
  {
    id: '6',
    type: 'travel',
    title: 'City Loft Apartment',
    location: 'New York, USA',
    price: 180,
    rating: 4.8,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    host: 'Emma',
    description: 'Modern loft in the heart of Manhattan',
  },
];
*/

export const categories = [
  { id: '1', name: 'All', icon: 'grid-outline' },
  { id: '2', name: 'Beaches', icon: 'restaurant-outline' },
  { id: '3', name: 'Mountains', icon: 'cart-outline' },
  { id: '4', name: 'Cruises', icon: 'water-outline' },
  { id: '5', name: 'Trekking', icon: 'mountain-outline' },
  { id: '6', name: 'Wildlife', icon: 'business-outline' },
];
