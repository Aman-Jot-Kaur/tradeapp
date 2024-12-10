import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import { LineChart } from "react-native-wagmi-charts";
// const api_key = 'ctbf5vhr01qvslqudhcgctbf5vhr01qvslqudhd0'
// const api_key = "3ca5baa293-860bb45d79-so7z4a";
// const dummyMarketData = [
//   {
//     asset: "EUR/USD",
//     bid: "1.0853",
//     last: "1.0855",
//   },
//   {
//     asset: "GBP/USD",
//     bid: "1.2345",
//     last: "1.2348",
//   },
//   {
//     asset: "USD/JPY",
//     bid: "110.32",
//     last: "110.34",
//   },
//   {
//     asset: "AUD/USD",
//     bid: "0.7543",
//     last: "0.7545",
//   },
//   {
//     asset: "USD/CAD",
//     bid: "1.2456",
//     last: "1.2458",
//   },
// ];

const api_key = "ea7327c5630604fb1c518e6e"; // Replace with your currency pair API key
const currencyPairs = ["EUR/USD", "GBP/USD", "USD/JPY", "AUD/USD", "USD/CAD"];

const Market = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("Wishlist");
  const [marketData, setMarketData] = useState([
    // {
    //   id: "1",
    //   symbol: "AAPL",
    //   // change: "-59.2 (-0.47%)",
    //   high: "1.25939",
    //   low: "1.24800",
    //   sell: "1.25297",
    //   buy: "1.25361",
    //   chartData: [
    //     { timestamp: 1, value: 1.25 },
    //     { timestamp: 2, value: 1.252 },
    //     { timestamp: 3, value: 1.243 },
    //     { timestamp: 4, value: 1.254 },
    //     { timestamp: 5, value: 1.255 },
    //   ],
    // },
    // {
    //   id: "2",
    //   symbol: "IBM",
    //   // change: "-57.8 (-0.55%)",
    //   high: "1.04982",
    //   low: "1.03318",
    //   sell: "1.04159",
    //   buy: "1.04221",
    //   chartData: [
    //     { timestamp: 1, value: 1.04 },
    //     { timestamp: 2, value: 1.042 },
    //     { timestamp: 3, value: 1.045 },
    //     { timestamp: 4, value: 1.047 },
    //     { timestamp: 5, value: 1.048 },
    //   ],
    // },
    // {
    //   id: "3",
    //   symbol: "USD",
    //   // change: "-57.8 (-0.55%)",
    //   high: "1.04982",
    //   low: "1.03318",
    //   sell: "1.04159",
    //   buy: "1.04221",
    //   chartData: [
    //     { timestamp: 1, value: 1.04 },
    //     { timestamp: 2, value: 1.042 },
    //     { timestamp: 3, value: 1.045 },
    //     { timestamp: 4, value: 1.047 },
    //     { timestamp: 5, value: 1.048 },
    //   ],
    // },
    // {
    //   id: "4",
    //   symbol: "AAL",
    //   // change: "-57.8 (-0.55%)",
    //   high: "1.04982",
    //   low: "1.03318",
    //   sell: "1.04159",
    //   buy: "1.04221",
    //   chartData: [
    //     { timestamp: 1, value: 1.04 },
    //     { timestamp: 2, value: 1.042 },
    //     { timestamp: 3, value: 1.045 },
    //     { timestamp: 4, value: 1.047 },
    //     { timestamp: 5, value: 1.048 },
    //   ],
    // },
    // {
    //   id: "5",
    //   symbol: "FOX",
    //   // change: "-57.8 (-0.55%)",
    //   high: "1.04982",
    //   low: "1.03318",
    //   sell: "1.04159",
    //   buy: "1.04221",
    //   chartData: [
    //     { timestamp: 1, value: 1.04 },
    //     { timestamp: 2, value: 1.042 },
    //     { timestamp: 3, value: 1.045 },
    //     { timestamp: 4, value: 1.047 },
    //     { timestamp: 5, value: 1.048 },
    //   ],
    // },
    // {
    //   id: "4",
    //   symbol: "NIKE",
    //   // change: "-57.8 (-0.55%)",
    //   high: "1.04982",
    //   low: "1.03318",
    //   sell: "1.04159",
    //   buy: "1.04221",
    //   chartData: [
    //     { timestamp: 1, value: 1.04 },
    //     { timestamp: 2, value: 1.042 },
    //     { timestamp: 3, value: 1.045 },
    //     { timestamp: 4, value: 1.047 },
    //     { timestamp: 5, value: 1.048 },
    //   ],
    // },
  ]);

  const fetchCurrencyPairs = async () => {
    try {
      const updatedMarketData = await Promise.all(
        currencyPairs.map(async (pair) => {
          const [base, quote] = pair.split("/");
          // console.log(quote);

          // Example API URL structure (modify according to the API you choose)
          const response = await axios.get(
            `https://v6.exchangerate-api.com/v6/${api_key}/pair/${base}/${quote}`
          );

          const data = response.data;
          console.log(data);

          if (data) {

            const previousRate = 1.10; // Replace with your logic to get previous conversion rate
          
          const conversionRate = data.conversion_rate;

          // Calculate the absolute change and percentage change
          const absoluteChange = conversionRate - previousRate;
          const percentageChange = ((absoluteChange / previousRate) * 100).toFixed(2);

            return {
              asset: pair,
              conversionRate: conversionRate,
              absoluteChange: absoluteChange.toFixed(2), // Absolute change formatted
              percentageChange: `${percentageChange} %`,
              high: (data.conversion_rate * 1.005).toFixed(2), // Simulating high value
              low: (data.conversion_rate * 0.995).toFixed(2), // Simulating low value
              sell: (data.conversion_rate - 0.001).toFixed(2),
              buy: (data.conversion_rate + 0.001).toFixed(2),
              chartData: [
                { timestamp: 1, value: data.conversion_rate * 0.97 },
                { timestamp: 2, value: data.conversion_rate * 0.99 },
                { timestamp: 3, value: data.conversion_rate },
                { timestamp: 4, value: data.conversion_rate * 1.01 },
                { timestamp: 5, value: data.conversion_rate * 1.02 },
              ],
            };
          }
          return null;
        })
      );
      setMarketData(updatedMarketData); // Remove any null values
    } catch (error) {
      console.error("Error fetching currency pair data:", error);
    }
  };

  // fetchStockWithFinnhub();

  useFocusEffect(
    React.useCallback(() => {
      fetchCurrencyPairs();
      const intervalId = setInterval(fetchCurrencyPairs, 2000);
      return () => clearInterval(intervalId);
    }, [])
  );

  const handleTabClick = (tab) => setActiveTab(tab);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
      >
        {["Wishlist", "Positions", "Orders", "Price Alerts", "History"].map(
          (tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => handleTabClick(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          )
        )}
      </ScrollView>

      <ScrollView contentContainerStyle={styles.content}>
        {activeTab === "Wishlist" &&
          marketData.map((item, index) => (
            <View key={index} style={styles.card}>
              <Pressable
                onPress={() =>
                  navigation.navigate("StockInformationScreen", {
                    stock: item.asset,
                  })
                }
              >
                <View style={styles.card}>
                  <View style={styles.topRow}>
                    <Text style={styles.symbol}>{item.asset}</Text>
                    <Text style={styles.change}>{item.absoluteChange} ({item.percentageChange})</Text>
                  </View>
                  <View
                    style={{
                      justifyContent: "space-between",
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop:10,
                    }}
                  >
                    <LineChart.Provider data={item.chartData}>
                      <LineChart height={50} width={200}>
                        <LineChart.Path color="red" />
                        <LineChart.CursorCrosshair />
                      </LineChart>
                    </LineChart.Provider>
                    <View style={{
                      flexDirection:'row'
                    }}> 
                      <View style={styles.priceInfo}>
                        <Text style={styles.priceText}>H: {item.high}</Text>
                        <TouchableOpacity style={styles.sellButton}>
                          <Text
                            style={{
                              color: "white",
                              fontSize: 10,
                            }}
                          >
                            SELL{" "}
                          </Text>
                          <Text
                            style={{
                              color: "white",
                            }}
                          >
                            {item.sell}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.buttons}>
                        <Text style={styles.priceText}>L: {item.low}</Text>
                        <TouchableOpacity style={styles.buyButton}>
                          <Text
                            style={{
                              color: "white",
                              fontSize: 10,
                            }}
                          >
                            BUY{" "}
                          </Text>
                          <Text
                            style={{
                              color: "white",
                            }}
                          >
                            {item.buy}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </Pressable>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
    padding: 20,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
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
    paddingBottom: 140,
  },
  card: {
    backgroundColor: "#333",
    borderRadius: 10,
    padding: 5,
    marginBottom: 10,
  },
  topRow: {
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  symbol: {
    fontSize: 18,
    color: "white",
  },
  change: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  priceInfo: {
    // marginVertical: 10,
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  priceText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  buttons: {
    // flexDirection: "row",
    // gap: 10,
    // justifyContent: "space-between",
  },
  sellButton: {
    backgroundColor: "#E94560",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 80, // Set the same fixed width as the sell button
    alignItems: "center",
  },
  buyButton: {
    backgroundColor: "#1CB85C",
    paddingVertical: 9,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 80, // Set the same fixed width as the sell button
    alignItems: "center",
  },
});

export default Market;