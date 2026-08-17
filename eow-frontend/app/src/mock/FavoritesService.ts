const STRAPI_API_URL = 'https://run.app';

// Helper to safely extract headers and tokens in web browsers
const getHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Save a trip selection to a user profile in Strapi
 * @param tripId The unique identifier of the destination/listing
 */
export const saveFavoriteTrip = async (tripId: string | number) => {
  try {
    const userRaw = localStorage.getItem('userData');
    if (!userRaw) throw new Error("User session not found. Please log in.");
    
    const user = JSON.parse(userRaw);

    const response = await fetch(`${STRAPI_API_URL}/api/favorites`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        data: {
          travel_item_id: String(tripId),
          user: user.id, // Links this item directly to the Strapi User ID
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save favorite: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving trip selection:', error);
    throw error;
  }
};

/**
 * Retrieve the current authenticated user's favorites from Strapi
 */
export const fetchMyFavorites = async (): Promise<any[]> => {
  try {
    const userRaw = localStorage.getItem('userData');
    if (!userRaw) return [];
    
    const user = JSON.parse(userRaw);

    // Apply strict filtering so Cloud Run only responds with rows belonging to this user
    const response = await fetch(
      `${STRAPI_API_URL}/api/favorites?filters[user][id][$eq]=${user.id}`,
      {
        method: 'GET',
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch favorites: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Could not fetch saved locations:', error);
    return [];
  }
};
