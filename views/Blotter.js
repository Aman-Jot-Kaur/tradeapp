import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseCon'; // Import your Firebase config

const Blotter = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const q = query(collection(db, 'news'), orderBy('timestamp', 'desc')); // Query to order by timestamp
        const querySnapshot = await getDocs(q);
        
        const fetchedArticles = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        setArticles(fetchedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        {/* <ActivityIndicator size="large" color="#ffffff" /> */}
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {articles.map((article) => (
        <View key={article.id} style={styles.card}>
          <Text style={styles.title}>{article.title}</Text>
          <Image source={{ uri: article.imageUrl }} style={styles.image} resizeMode="cover"/>
          <Text style={styles.description}>{article.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0c0c0c',
    gap:3
  },
  card: {
    backgroundColor: '#1b1b1b',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#b3b3b3',
    marginTop:15,
    marginBottom: 20,

  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0c0c0c',
  },
});

export default Blotter;
