import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { LineChart } from "react-native-chart-kit";
import { collection, query, where, getDocs } from 'firebase/firestore'; // Updated Firestore imports
import { db } from '../firebaseCon'; // Firebase config
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
const api_key = "3ca5baa293-860bb45d79-so7z4a"; // Your API key
const screenWidth = Dimensions.get("window").width;
const currencyPairs = [
  
  "USD/UYU",
  "USD/UZS",
  "USD/VND",
  "USD/VUV",
  "USD/WST",
  "USD/XAF",
  "USD/XCD",
  "USD/XDR",
  "USD/XOF",
  "USD/XPF",
  "USD/YER",
  "USD/ZAR",
  "USD/ZMW",


  "INR/AED",
  "INR/AFN",
  "INR/ALL",
  "INR/AMD",
  "INR/ANG",
  "INR/AOA",
  "INR/ARS",
  "INR/AUD",
  "INR/AWG",
  "INR/AZN",
 
  "INR/MWK", 
  "INR/MXN",
  "INR/MYR",
  "INR/MZN",
  "INR/NAD",
  "INR/NGN",
  "INR/NOK",
  "INR/NPR",

  "INR/XCD",
  "INR/XDR",
  "INR/XOF",
  "INR/XPF",
  "INR/YER",
  "INR/ZAR",
  "INR/ZMW",
];

const Market = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Wishlist");
  const [marketData, setMarketData] = useState([]);
  const [position, setPosition] = useState([]);
  const [loading, setLoading] = useState(false);
  const [order,setOrder] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [trades, setTrades] = useState([]);



  const fetchCurrencyPairs = async () => {
    const generateChartData = (conversionRate) => {
      const chartData = [];
      const baseTimestamp = Math.floor(Date.now() / 1000); 

      for (let i = 0; i < 40; i++) {
    
        const simulatedValue = conversionRate + Math.random() * 0.05 - 0.025; // Slight variation
        chartData.push(simulatedValue.toFixed(4)); 
      }

      return chartData;
    };

    
    try {
      // setLoading(true);
      const updatedMarketData = await Promise.all(
        currencyPairs.map(async (pair) => {
          const [base, quote] = pair.split("/");
          const response = await axios.get(
            `https://api.fastforex.io/fetch-one?from=${base}&to=${quote}&api_key=${api_key}`
          );

          const data = response.data;

          if (data) {
            const previousRate = 1.1; // Replace with your logic to get the previous conversion rate
            const conversionRate = data?.result[quote] || 1; // Use the correct conversion rate for the target currency
           
            const absoluteChange = conversionRate - previousRate;
            const percentageChange = (
              (absoluteChange / previousRate) *
              100
            ).toFixed(2);

            const chartData = generateChartData(conversionRate);

            // console.log(
            //   "Chart Data JSON:",
            //   JSON.stringify(chartData, null, 10)
            // );

            return {
              asset: pair,
              conversionRate: conversionRate,
              absoluteChange: absoluteChange.toFixed(2), // Absolute change formatted
              percentageChange: `${percentageChange} %`,
              high: data?.result?.high
                ? data.result.high.toFixed(2)
                : (conversionRate * 1).toFixed(2), // Use high value from API
              low: data?.result?.low
                ? data.result.low.toFixed(2)
                : (conversionRate * 0.995).toFixed(2), // Use low value from API
              sell: (conversionRate - 0.001).toFixed(2),
              buy: (conversionRate + 0.001).toFixed(2),
              chartData: chartData, // Use the dynamically generated chart data
            };
          }
          return null;
        })
      );

      const limitedMarketData = updatedMarketData.filter(Boolean);
      setMarketData(limitedMarketData);
      setPosition(limitedMarketData);
      setOrder(updatedMarketData.filter(Boolean))
      // setLoading(false);
    } catch (error) {
      console.error("Error fetching currency pair data:", error);
    } finally {
      // setLoading(false);
    }
  };

  const checkAndResetGraphData = async () => {
    const today = new Date().toLocaleDateString();
    const storedDate = await AsyncStorage.getItem("lastUpdatedDate");

    if (storedDate !== today) {
      // It's a new day, reset the graph data
      await AsyncStorage.setItem("lastUpdatedDate", today);
      setMarketData([]); // Reset the market data
      setPosition([]);
    }
  };

  useEffect(() => {
    const fetchTrades = async () => {
      setLoading(true);
  
      try {
        const storedUserId = await AsyncStorage.getItem('userEmailSA');
        if (!storedUserId) {
          Toast.show({ type: 'error', text1: 'User ID not found' });
   ;
          return;
        }
  
        const tradesQuery = query(
          collection(db, 'trades'),
          where('email', '==', storedUserId)
        );
  
        const querySnapshot = await getDocs(tradesQuery);
        const fetchedTrades = querySnapshot.docs.map(doc => doc.data());
        // const filteredTrades = fetchedTrades.filter(trade =>
        //   (activeTab === 'Open' ? trade.status === 'Open' : trade.status === 'Close'
        //   && (trade.date === todayDate)) // Filter by email and today's date
  
        // );
  console.log(fetchedTrades,"ffrreesfsdfdsgvdghfc htgrhjtfbjhtrbhntfbhtfyh")
        setTrades(fetchedTrades);
      } catch (error) {
        console.error('Error fetching trades:', error);
        Toast.show({ type: 'error', text1: 'Error loading trades' });
      } finally {
        setLoading(false);
      }}
  
      fetchTrades();
   
    const fetchData = async () => {
      await checkAndResetGraphData();
      const storedData = await AsyncStorage.getItem("marketData");
      if (storedData) {
        setMarketData(JSON.parse(storedData)); // Use cached data if available
        setPosition(JSON.parse(storedData));
      }
      fetchCurrencyPairs(); // Fetch new data after checking cache
    };

    fetchData();
  
    fetchTrades()}
, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCurrencyPairs();
      const intervalId = setInterval(fetchCurrencyPairs, 320000000);
      return () => clearInterval(intervalId);
    }, [])
  );


  const handleTabClick = (tab) => {
    setActiveTab(tab);
  const fetchTrades = async () => {
    setLoading(true);

    try {
      const storedUserId = await AsyncStorage.getItem('userEmailSA');
      if (!storedUserId) {
        Toast.show({ type: 'error', text1: 'User ID not found' });
        setLoading(false);
        return;
      }

      const tradesQuery = query(
        collection(db, 'trades'),
        where('email', '==', storedUserId)
      );

      const querySnapshot = await getDocs(tradesQuery);
      const fetchedTrades = querySnapshot.docs.map(doc => doc.data());
      // const filteredTrades = fetchedTrades.filter(trade =>
      //   (activeTab === 'Open' ? trade.status === 'Open' : trade.status === 'Close'
      //   && (trade.date === todayDate)) // Filter by email and today's date

      // );
console.log(fetchedTrades,"ffrreesfsdfdsgvdghfc htgrhjtfbjhtrbhntfbhtfyh")
      setTrades(fetchedTrades);
    } catch (error) {
      console.error('Error fetching trades:', error);
      Toast.show({ type: 'error', text1: 'Error loading trades' });
    } finally {
      setLoading(false);
    }

    fetchTrades();
  };}
  const renderTabContent = () => {
    if (loading) {
      return ( 
      <View>
       <Text
                              style={[
                                styles.change,
                                {
                                  color:
                                    "white", // Red for negative, green for positive
                                },
                              ]}
                            >
                             Please wait while data loads
                            </Text></View> );
    }

   if(!loading){ switch (activeTab) {
        case "Wishlist":
          return (
            <View>
         
              {/* TextInput for searching */}
           
         { marketData.length > 0 &&    <TextInput
        style={styles.searchInput}
        placeholder="Search Currency Pair"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />}
              {marketData
                .filter((item) =>
                  item.asset.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item, index) => (
                  <View key={index} style={styles.card}>
                    <Pressable
                      onPress={() =>
                        navigation.navigate("StockInformationScreen", {
                          stock: item.asset,
                        })
                      }
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <View>
                          <View style={styles.topRow}>
                            <Text style={styles.symbol}>{item.asset}</Text>
                            <Text
                              style={[
                                styles.change,
                                {
                                  color:
                                    item.absoluteChange < 0
                                      ? "#E94560"
                                      : "#1CB85C", // Red for negative, green for positive
                                },
                              ]}
                            >
                              {item.absoluteChange} ({item.percentageChange})
                            </Text>
                          </View>
                          <View
                            style={{
                              justifyContent: "space-between",
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: 5,
                            }}
                          >
                            <LineChart
                              data={{
                                datasets: [
                                  {
                                    data: item.chartData,
                                  },
                                ],
                              }}
                              width={screenWidth - 200}
                              height={60}
                              withDots={false}
                              withInnerLines={false}
                              withOuterLines={false}
                              withVerticalLabels={false}
                              withHorizontalLabels={false}
                              chartConfig={{
                                backgroundGradientFrom: "#1A1A1D",
                                backgroundGradientTo: "#1A1A1D",
                                color: (opacity = 1) =>
                                  item.chartData[0] < item.chartData[item.chartData.length - 1]
                                    ? `rgba(28, 184, 92, ${opacity})` // Green for increasing
                                    : `rgba(233, 69, 96, ${opacity})`, // Red for decreasing
                                strokeWidth: 2,
                              }}
                              style={{
                                marginLeft: -60,
                              }}
                            />
                          </View>
                        </View>
                        <View style={{ flexDirection: "column", gap: 15 }}>
                          <View style={styles.priceInfo}>
                            <Text style={styles.priceText} numberOfLines={1}>
                              H: {item.high}
                            </Text>
                            <Text style={styles.priceText} numberOfLines={1}>
                              L: {item.low}
                            </Text>
                            <TouchableOpacity style={styles.sellButton}>
                              <Text style={{ color: "#E94560", fontSize: 14 }}>
                                SELL{" "}
                              </Text>
                              <Text
                                style={{
                                  color: "#E94560",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                }}
                                numberOfLines={1}
                              >
                                {item.sell}
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={styles.buttons}>
                            
                            <TouchableOpacity style={styles.buyButton}>
                              <Text style={{ color: "#1CB85C", fontSize: 14 }}>
                                BUY{" "}
                              </Text>
                              <Text
                                style={{
                                  color: "#1CB85C",
                                  fontSize: 16,
                                  fontWeight: "bold",
                                }}
                                numberOfLines={1}
                              >
                                {item.buy}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  </View>
                ))}
            </View>
          );
        
        
      case "Positions":
        return position.map((item, index) => (
          <View key={index} style={styles.card}>
            
            <Pressable
         
            >
              {/* <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              > */}
                {/* <View>
                  <View style={styles.topRow}>
                    <Text style={styles.symbol}>{item.asset}</Text>
                    <Text
                      style={[
                        styles.change1,
                        {
                          backgroundColor:
                            item.absoluteChange < 0 ? "#E94560" : "#1CB85C",
                        },
                      ]}
                    >
                      {item.absoluteChange < 0
                        ? `-${item.percentageChange}`
                        : `+${item.percentageChange}`}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    
                  </View>
                </View> */}
                {/* <View style={{ flexDirection: "row", gap: 15 }}>
                  <View style={styles.priceInfo}>
                    <Text style={styles.priceText} numberOfLines={1}>
                      H: {item.high}
                    </Text>
                    
                  </View>
                  <View style={styles.buttons}>
                    <Text style={styles.priceText} numberOfLines={1}>
                      L: {item.low}
                    </Text>
                  
                  </View>
                </View>
              </View> */}
            </Pressable>
          </View>
        ));
      case "Orders":
        // return order.map((item, index) => (
        //   <View key={index} style={styles.card}>
          
            {/* <Pressable
           
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View>
                  <View style={styles.topRow}>
                    <Text style={styles.symbol}>{item.asset}</Text>
                    <Text
                      style={[
                        styles.change1,
                        {
                          backgroundColor:
                            item.absoluteChange < 0 ? "#E94560" : "#1CB85C",
                        },
                      ]}
                    >
                      {item.absoluteChange < 0
                        ? `-${item.percentageChange}`
                        : `+${item.percentageChange}`}
                    </Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 5,
                    }}
                  >
                    
                  </View>
                </View>
                <View style={{ flexDirection: "column",gap:10, alignItems:'flex-end' }}>
                    <Text style={{
                      color:'white'
                    }}>Date: 12-12-2024</Text>
                    <View style={{
                      flexDirection:'row',
                      justifyContent:'space-between',
                      gap:10,
                    }}>
                      <Text style={{
                        fontSize:18,
                        color:'white'
                      }}>H: {item.high}</Text>
                      <Text style={{
                        fontSize:18,
                        color:'white'
                      }}>L: {item.low}</Text>
                    </View>
                </View>
              </View>
            </Pressable> */}
            return(
             <ScrollView >
        <View style={orderstyles.content}>
          {trades.length === 0 && (
            <Text style={orderstyles.noTradesText}>No trades here</Text>
          )}
          {trades.map((trade, index) => (
            <View key={index} style={orderstyles.card}>
              <View style={orderstyles.cardHeader}>
                <Text style={orderstyles.stockSymbol}>{trade.currency}</Text>
                <View style={orderstyles.stockPairContainer}>
                  <Text style={orderstyles.stockPair}>{trade.currencyPair}</Text>
                  <View style={orderstyles.flagContainer}>
                    <Text style={orderstyles.buyButtonText}>{trade.type}</Text>
                  </View>
                </View>
                <View style={orderstyles.header}>
                  <TouchableOpacity style={orderstyles.buyButton}>
                    <Text style={orderstyles.buyButtonText}>BUY {trade.buy} Rs</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={orderstyles.sellButton}>
                    <Text style={orderstyles.sellButtonText}>SELL {trade.sell} Rs</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={orderstyles.transactionDetails}>
                <Text style={orderstyles.transactionRow}>Quantity: {trade.quantity}</Text>
                <Text style={orderstyles.transactionRow}>Date: {trade.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
        
            )
      case "Price Alerts":
        return (
          <View style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center'
          }}>
            <Text style={{
              color:'white',
              fontSize:16,
            }}>No Price Alert Found</Text>
          </View>
        );
      case "History":
        return (
          <View style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center'
          }}>
            <Text style={{
              color:'white',
              fontSize:16,
            }}>No History Found</Text>
          </View>
        );
      default:
        return null;
    }
  };
  }
  return (
    <View style={styles.container}>
   
     

      <ScrollView contentContainerStyle={styles.content}>
      <FlatList
        data={["Wishlist", "Positions", "Orders", "Price Alerts", "History"]}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.tabContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.tab, activeTab === item && styles.activeTab]}
            onPress={() => handleTabClick(item)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === item && styles.activeTabText,
              ]}
            >
              {item}
            </Text>
            <View style={{
                paddingHorizontal:16,
              }}>

             
              </View>
          </TouchableOpacity>
        )}/>
      
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};
const orderstyles=StyleSheet.create({
  content: {
    paddingBottom: 20, // Add padding to avoid cutting off content
  },
  noTradesText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  card: {
    marginTop: 20,
    backgroundColor: 'rgba(0, 50, 80, 0.5)',
    borderRadius: 10,
    padding: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  stockSymbol: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buyButton: {
    borderColor: '#1cb85c',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buyButtonText: {
    color: '#1cb85c',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sellButton: {
    borderColor: 'red',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 30,
  },
  sellButtonText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDetails: {
    marginTop: 15,
  },
  transactionRow: {
    color: 'white',
    fontSize: 14,
  },
  sellButton: {
  
    borderWidth: 1,
    borderColor: "#E94560",
    paddingHorizontal: 16,
    borderRadius: 5,
    width: 90, // Set the same fixed width as the sell button
    alignItems: "center",
    marginTop:50
  },
  buyButton: {
    borderWidth: 1,
    borderColor: "#1CB85C",
    // paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginTop:30,
    width: 90, // Set the same fixed width as the sell button
    alignItems: "center",
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
    padding: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
    height: 50,
    // paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 15,
  },
  tabText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#FFFFFF",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  content: {
    flexGrow: 1,
    paddingBottom: 130,
  },
  searchInput: {
    height: 40,
    position:'fixed',
    top:30,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  card: {
    // backgroundColor: "#333",
    // borderRadius: 10,
    // flexDirection:'row',
    padding: 5,
    paddingHorizontal: 16,
    borderBottomColor: "#333",
    borderBottomWidth: 1,
    marginTop: 30,
  },
  topRow: {
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  symbol: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  change: {
    fontSize: 16,
    color: "#FFFFFF",
    // fontWeight: "",
  },
  change1: {
    fontSize: 16,
    marginTop: 2,
    color: "#FFFFFF",
    fontWeight: "medium",
    // backgroundColor: "#1CB85C",
    paddingHorizontal: 8, // Add padding for a better appearance
    paddingVertical: 4, // Adjust vertical padding
    borderRadius: 4, // Optional: Add rounded corners
    alignSelf: "flex-start",
  },
  priceInfo: {
    // marginVertical: 10,
    gap: 10,
    flexDirection: "column",
    // justifyContent: "space-between",
  },
  priceText: {
    fontSize: 16,
    maxWidth: 80,
    color: "#FFFFFF",
  },
  buttons: {
    flexDirection: "column",
    gap: 10,
  },
  sellButton: {
  
    borderWidth: 1,
    borderColor: "#E94560",
    paddingHorizontal: 16,
    borderRadius: 5,
    width: 110, // Set the same fixed width as the sell button
    alignItems: "center",
  },
  buyButton: {
    borderWidth: 1,
    borderColor: "#1CB85C",
    // paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: 110, // Set the same fixed width as the sell button
    alignItems: "center",
  },
});

export default Market;