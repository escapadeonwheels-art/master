// Path: ./App.js
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default function App() {
  // replace with Strapi Production URL
  const STRAPI_URL = "https://accuracy-mortician-uncured.ngrok-free.dev";

  // State to store articles
  const [articles, setArticles] = useState([]);

  // fetch articles from Strapi
  const fetchArticles = async () => {
    try {
      // Fetch articles along with their covers
      const response = await fetch(`${STRAPI_URL}/api/articles`, {
        headers: {
          'ngrok-skip-browser-warning': 'true', // This bypasses the warning page
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log(data.data);
      setArticles(data.data);
    } catch (error) {
        console.error("Error fetching articles:", error);
    }
  };

  // Format date
  const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  // Render article card
  const renderArticle = ({ item }) => (
    <View style={styles.card}>

      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.title}>{item.content[0].children[0].text}</Text>
      <Text style={styles.published}>
        Published: {formatDate(item.publishedAt)}
      </Text>
    </View>
  );

  // Fetch articles on component mount
  useEffect(() => {
    fetchArticles();
  }, []);

  return (
    <View style={styles.container}>
      
      <FlatList
        title="Articles"
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderArticle}
        numColumns={2}
        contentContainerStyle={styles.container}
      />
    </View>
  );
}