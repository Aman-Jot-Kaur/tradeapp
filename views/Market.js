import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const Market = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Wishlist'); // Default to 'Wishlist' tab
  const [marketData, setMarketData] = useState([]); // State for market data

  // Fetch market data from API
  const fetchMarketData = async () => {
    try {
      const response = await axios.get('https://api.grandprimeforex.com:3001/fetch-data');
      setMarketData(response.data.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchMarketData(); // Fetch data immediately when focused
      const intervalId = setInterval(fetchMarketData, 120000); // Refresh every 2 minutes
      return () => clearInterval(intervalId); // Cleanup on unmount
    }, [])
  );

  const handleTabClick = (tab) => setActiveTab(tab);

  return (
    <View style={styles.container}>
      {/* Horizontal Scrollable Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
        {['Wishlist', 'Positions', 'Orders', 'Price Alerts', 'History'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabClick(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === 'Wishlist' && (
          marketData.map((item, index) => (
            <View key={index} style={styles.card}>
              <TouchableOpacity onPress={() => navigation.navigate('StockInformationScreen', { stock: item.asset })}>
                <View style={styles.cardHeader}>
                  <Text style={styles.stockSymbol}>{item.asset}</Text>
                 
                  <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Bid:</Text>
                    <Text style={styles.priceValue}>{item.bid}</Text>
                    <Text style={styles.priceLabel}>Last:</Text>
                    <Text style={styles.priceValue}>{item.last}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}
        {activeTab === 'Positions' && <Text style={styles.contentText}>Positions Content</Text>}
      </ScrollView>
    </View>
  );
};

const getFlagCode = (asset) => {
  const [base, quote] = asset.split('/');
  return base === 'USD' ? quote : base; // Mock flag logic based on currency pair
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1D',
    padding: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 15,
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#FFFFFF',
  },
  activeTabText: {
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    paddingBottom: 140,
  },
  card: {
    backgroundColor: '#27323D',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stockSymbol: {
    color: '#1CB85C',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockIcon: {
    width: 32,
    height: 32,
  },
  priceContainer: {
    flexDirection: 'row',
  },
  priceLabel: {
    color: '#888',
    fontSize: 14,
    marginRight: 4,
  },
  priceValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  contentText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default Market;
