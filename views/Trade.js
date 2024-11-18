import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Updated Firestore imports
import { db } from '../firebaseCon'; // Firebase config
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const Trade = () => {
  const [activeTab, setActiveTab] = useState('Open'); // Default to 'Open' tab
  const [loading, setLoading] = useState(false);
  const [trades, setTrades] = useState([]);

  // Fetch trades from Firestore whenever the active tab changes
  useFocusEffect(
    React.useCallback(() => {
      const fetchTrades = async () => {
        setLoading(true); // Show loader

        try {
          // Get stored user ID from AsyncStorage
          const storedUserId = await AsyncStorage.getItem('userEmailSA');
          if (!storedUserId) {
            Toast.show({ type: 'error', text1: 'User ID not found' });
            setLoading(false);
            return;
          }

          // Query to fetch trades for the specific user
          const tradesQuery = query(
            collection(db, 'trades'),
            where('email', '==', storedUserId)
          );

          const querySnapshot = await getDocs(tradesQuery);
          const fetchedTrades = querySnapshot.docs.map(doc => doc.data());
          // Filter trades based on the active tab (Open or Closed)
          const filteredTrades = fetchedTrades.filter(trade =>
            activeTab === 'Open' ? trade.status === 'Open' : trade.status === 'Close'
          );

          setTrades(filteredTrades); // Store filtered trades in state

        } catch (error) {
          console.error('Error fetching trades:', error);
          Toast.show({ type: 'error', text1: 'Error loading trades' });
        } finally {
          setLoading(false); // Stop loader
        }
      };

      fetchTrades(); // Trigger fetch on focus or tab change
    }, [activeTab])
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3c42ca" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Open and Closed tabs */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Open' && styles.activeTab]}
          onPress={() => setActiveTab('Open')}
        >
          <Text style={[styles.tabText, activeTab === 'Open' && styles.activeTabText]}>
            Open
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'Closed' && styles.activeTab]}
          onPress={() => setActiveTab('Closed')}
        >
          <Text style={[styles.tabText, activeTab === 'Closed' && styles.activeTabText]}>
            Closed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditionally Render Open or Closed Section */}
     
        <View style={styles.content}>
          {trades.length==0 &&                     <Text style={styles.sellButtonText}>No trades here</Text>
        }
          {trades.length > 0 ? (
            trades.map((trade, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.stockSymbol}>{trade.currency}</Text>
                  <View style={styles.stockPairContainer}>
                    <Text style={styles.stockPair}>{trade.currencyPair}</Text>
                    <View style={styles.flagContainer}>
                    <Text style={styles.buyButtonText}>{trade.type}</Text>

                    </View>
                  </View>
                  <View style={styles.header}>
                <TouchableOpacity style={styles.buyButton}>
                    <Text style={styles.buyButtonText}>BUY {trade.buy} Rs</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sellButton}>
                    <Text style={styles.sellButtonText}>SELL {trade.sell} Rs</Text>
                  </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.transactionDetails}>
                <Text style={styles.transactionRow}>Quantity: {trade.quantity}</Text>

                  <Text style={styles.transactionRow}>Date: {trade.date}</Text>
                </View>
              </View>
            ))
          ) : (
            <View>
              <Text >No trades available</Text>
            </View>
            
          )}
        </View>
      
    </View>
  );


};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Dark background
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
    gap:30
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    color: 'white',
    fontSize: 20,
  },
  activeTab: {
    borderBottomWidth: 4, // Bold underline for active tab
    borderBottomColor: 'white', // White underline
  },
  activeTabText: {
    fontWeight: 'bold', // Bold text for active tab
  },
  content: {
    flex: 1,
  },
  card: {
    marginTop: 20,
    backgroundColor: 'rgba(0, 50, 80, 0.5)', // Updated to blue shade
    borderRadius: 10,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap:20,
    flexWrap: 'wrap',
  },
  stockSymbol: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stockPairContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stockPair: {
    color: 'white',
    fontSize: 20,
  },
  flagContainer: {
    flexDirection: 'row',
    marginLeft: 0,
  },
  flag: {
    fontSize: 20,
    marginHorizontal: 2,
  },
  buyButton: {
    borderColor: '#1cb85c', // Green border color
    borderWidth: 2, // Add a border
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center', // Center text
    marginRight: -5
  },
  buyButtonText: {
    color: '#1cb85c', // Green text color
    fontSize: 18,
    fontWeight: 'bold',

  },
  sellButton: {
    borderColor: 'red', // Green border color
    borderWidth: 2, // Add a border
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center', // Center text
    marginRight: -5
  },
  sellButtonText: {
    color: 'red', // Green text color
    fontSize: 16,
    fontWeight: 'bold',
marginTop:2
  },
  companyName: {
    color: '#888',
    marginBottom: 10,
  },
  transactionDetails: {
    marginBottom: 15,
  },
  transactionRow: {
    color: 'white',
    fontSize: 14,
    marginTop: 5
  },
  price: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'right',
    marginTop: -35
  },
  closedText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
  },
})

export default Trade;
