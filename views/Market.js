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
// import { LineChart } from "react-native-wagmi-charts";
import { AsyncStorage } from "@react-native-async-storage/async-storage";
// const api_key = 'ctbf5vhr01qvslqudhcgctbf5vhr01qvslqudhd0'
// const api_key = "3ca5baa293-860bb45d79-so7z4a";
const api_key = "3ca5baa293-860bb45d79-so7z4a"; // Your API key
const screenWidth = Dimensions.get("window").width;

// const api_key = "ddaa42f257bbb88136c7f8c3"; // Replace with your currency pair API key
const currencyPairs = [
  // USD/Currency pairs
  // "USD/AED",
  // "USD/AFN",
  // "USD/ALL",
  // "USD/AMD",
  // "USD/ANG",
  // "USD/AOA",
  // "USD/ARS",
  // "USD/AUD",
  // "USD/AWG",
  // "USD/AZN",
  // "USD/BAM",
  // "USD/BBD",
  // "USD/BDT",
  // "USD/BGN",
  // "USD/BHD",
  // "USD/BIF",
  // "USD/BMD",
  // "USD/BND",
  // "USD/BOB",
  // "USD/BRL",
  // "USD/BSD",
  // "USD/BTN",
  // "USD/BWP",
  // "USD/BZD",
  // "USD/CAD",
  // "USD/CDF",
  // "USD/CHF",
  // "USD/CLF",
  // "USD/CLP",
  // "USD/CNH",
  // "USD/CNY",
  // "USD/COP",
  // "USD/CUP",
  // "USD/CVE",
  // "USD/CZK",
  // "USD/DJF",
  // "USD/DKK",
  // "USD/DOP",
  // "USD/DZD",
  // "USD/EGP",
  // "USD/ERN",
  // "USD/ETB",
  // "USD/EUR",
  // "USD/FJD",
  // "USD/FKP",
  // "USD/GBP",
  // "USD/GEL",
  // "USD/GHS",
  // "USD/GIP",
  // "USD/GMD",
  // "USD/GNF",
  // "USD/GTQ",
  // "USD/GYD",
  // "USD/HKD",
  // "USD/HNL",
  // "USD/HRK",
  // "USD/HTG",
  // "USD/HUF",
  // "USD/IDR",
  // "USD/ILS",
  // "USD/INR",
  // "USD/IQD",
  // "USD/IRR",
  // "USD/ISK",
  // "USD/JMD",
  // "USD/JOD",
  // "USD/JPY",
  // "USD/KES",
  // "USD/KGS",
  // "USD/KHR",
  // "USD/KMF",
  // "USD/KPW",
  // "USD/KRW",
  // "USD/KWD",
  // "USD/KYD",
  // "USD/KZT",
  // "USD/LAK",
  // "USD/LBP",
  // "USD/LKR",
  // "USD/LRD",
  // "USD/LSL",
  // "USD/LYD",
  // "USD/MAD",
  // "USD/MDL",
  // "USD/MGA",
  // "USD/MKD",
  // "USD/MMK",
  // "USD/MNT",
  // "USD/MOP",
  // "USD/MRU",
  // "USD/MUR",
  // "USD/MVR",
  // "USD/MWK",
  // "USD/MXN",
  // "USD/MYR",
  // "USD/MZN",
  // "USD/NAD",
  // "USD/NGN",
  // "USD/NOK",
  // "USD/NPR",
  // "USD/NZD",
  // "USD/OMR",
  // "USD/PAB",
  // "USD/PEN",
  // "USD/PGK",
  // "USD/PHP",
  // "USD/PKR",
  // "USD/PLN",
  // "USD/PYG",
  // "USD/QAR",
  // "USD/RON",
  // "USD/RSD",
  // "USD/RUB",
  // "USD/RWF",
  // "USD/SAR",
  // "USD/SCR",
  // "USD/SDG",
  // "USD/SEK",
  // "USD/SGD",
  // "USD/SHP",
  // "USD/SLL",
  // "USD/SOS",
  // "USD/SRD",
  // "USD/SYP",
  // "USD/SZL",
  // "USD/THB",
  // "USD/TJS",
  // "USD/TMT",
  // "USD/TND",
  // "USD/TOP",
  // "USD/TRY",
  // "USD/TTD",
  // "USD/TWD",
  // "USD/TZS",
  // "USD/UAH",
  // "USD/UGX",
  // "USD/USD",
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

  // EUR/Currency pairs
  // "EUR/AED", "EUR/AFN", "EUR/ALL", "EUR/AMD", "EUR/ANG", "EUR/AOA", "EUR/ARS", "EUR/AUD", "EUR/AWG", "EUR/AZN",
  // "EUR/BAM", "EUR/BBD", "EUR/BDT", "EUR/BGN", "EUR/BHD", "EUR/BIF", "EUR/BMD", "EUR/BND", "EUR/BOB", "EUR/BRL",
  // "EUR/BSD", "EUR/BTN", "EUR/BWP", "EUR/BZD", "EUR/CAD", "EUR/CDF", "EUR/CHF", "EUR/CLF", "EUR/CLP", "EUR/CNH",
  // "EUR/CNY", "EUR/COP", "EUR/CUP", "EUR/CVE", "EUR/CZK", "EUR/DJF", "EUR/DKK", "EUR/DOP", "EUR/DZD", "EUR/EGP",
  // "EUR/ERN", "EUR/ETB", "EUR/EUR", "EUR/FJD", "EUR/FKP", "EUR/GBP", "EUR/GEL", "EUR/GHS", "EUR/GIP", "EUR/GMD",
  // "EUR/GNF", "EUR/GTQ", "EUR/GYD", "EUR/HKD", "EUR/HNL", "EUR/HRK", "EUR/HTG", "EUR/HUF", "EUR/IDR", "EUR/ILS",
  // "EUR/INR", "EUR/IQD", "EUR/IRR", "EUR/ISK", "EUR/JMD", "EUR/JOD", "EUR/JPY", "EUR/KES", "EUR/KGS", "EUR/KHR",
  // "EUR/KMF", "EUR/KPW", "EUR/KRW", "EUR/KWD", "EUR/KYD", "EUR/KZT", "EUR/LAK", "EUR/LBP", "EUR/LKR", "EUR/LRD",
  // "EUR/LSL", "EUR/LYD", "EUR/MAD", "EUR/MDL", "EUR/MGA", "EUR/MKD", "EUR/MMK", "EUR/MNT", "EUR/MOP", "EUR/MRU",
  // "EUR/MUR", "EUR/MVR", "EUR/MWK", "EUR/MXN", "EUR/MYR", "EUR/MZN", "EUR/NAD", "EUR/NGN", "EUR/NOK", "EUR/NPR",
  // "EUR/NZD", "EUR/OMR", "EUR/PAB", "EUR/PEN", "EUR/PGK", "EUR/PHP", "EUR/PKR", "EUR/PLN", "EUR/PYG", "EUR/QAR",
  // "EUR/RON", "EUR/RSD", "EUR/RUB", "EUR/RWF", "EUR/SAR", "EUR/SCR", "EUR/SDG", "EUR/SEK", "EUR/SGD", "EUR/SHP",
  // "EUR/SLL", "EUR/SOS", "EUR/SRD", "EUR/SYP", "EUR/SZL", "EUR/THB", "EUR/TJS", "EUR/TMT", "EUR/TND", "EUR/TOP",
  // "EUR/TRY", "EUR/TTD", "EUR/TWD", "EUR/TZS", "EUR/UAH", "EUR/UGX", "EUR/USD", "EUR/UYU", "EUR/UZS", "EUR/VND",
  // "EUR/VUV", "EUR/WST", "EUR/XAF", "EUR/XCD", "EUR/XDR", "EUR/XOF", "EUR/XPF", "EUR/YER", "EUR/ZAR", "EUR/ZMW",

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
  // "INR/BAM",
  // "INR/BBD",
  // "INR/BDT",
  // "INR/BGN",
  // "INR/BHD",
  // "INR/BIF",
  // "INR/BMD",
  // "INR/BND",
  // "INR/BOB",
  // "INR/BRL",
  // "INR/BSD",
  // "INR/BTN",
  // "INR/BWP",
  // "INR/BZD",
  // "INR/CAD",
  // "INR/CDF",
  // "INR/CHF",
  // "INR/CLF",
  // "INR/CLP",
  // "INR/CNH",
  // "INR/CNY",
  // "INR/COP",
  // "INR/CUP",
  // "INR/CVE",
  // "INR/CZK",
  // "INR/DJF",
  // "INR/DKK",
  // "INR/DOP",
  // "INR/DZD",
  // "INR/EGP",
  // "INR/ERN",
  // "INR/ETB",
  // "INR/EUR",
  // "INR/FJD",
  // "INR/FKP",
  // "INR/GBP",
  // "INR/GEL",
  // "INR/GHS",
  // "INR/GIP",
  // "INR/GMD",
  // "INR/GNF",
  // "INR/GTQ",
  // "INR/GYD",
  // "INR/HKD",
  // "INR/HNL",
  // "INR/HRK",
  // "INR/HTG",
  // "INR/HUF",
  // "INR/IDR",
  // "INR/ILS",
  // "INR/INR",
  // "INR/IQD",
  // "INR/IRR",
  // "INR/ISK",
  // "INR/JMD",
  // "INR/JOD",
  // "INR/JPY",
  // "INR/KES",
  // "INR/KGS",
  // "INR/KHR",
  // "INR/KMF",
  // "INR/KPW",
  // "INR/KRW",
  // "INR/KWD",
  // "INR/KYD",
  // "INR/KZT",
  // "INR/LAK",
  // "INR/LBP",
  // "INR/LKR",
  // "INR/LRD",
  // "INR/LSL",
  // "INR/LYD",
  // "INR/MAD",
  // "INR/MDL",
  // "INR/MGA",
  // "INR/MKD",
  // "INR/MMK",
  // "INR/MNT",
  // "INR/MOP",
  // "INR/MRU",
  // "INR/MUR",
  // "INR/MVR",
  "INR/MWK",
  "INR/MXN",
  "INR/MYR",
  "INR/MZN",
  "INR/NAD",
  "INR/NGN",
  "INR/NOK",
  "INR/NPR",
  // "INR/NZD",
  // "INR/OMR",
  // "INR/PAB",
  // "INR/PEN",
  // "INR/PGK",
  // "INR/PHP",
  // "INR/PKR",
  // "INR/PLN",
  // "INR/PYG",
  // "INR/QAR",
  // "INR/RON",
  // "INR/RSD",
  // "INR/RUB",
  // "INR/RWF",
  // "INR/SAR",
  // "INR/SCR",
  // "INR/SDG",
  // "INR/SEK",
  // "INR/SGD",
  // "INR/SHP",
  // "INR/SLL",
  // "INR/SOS",
  // "INR/SRD",
  // "INR/SYP",
  // "INR/SZL",
  // "INR/THB",
  // "INR/TJS",
  // "INR/TMT",
  // "INR/TND",
  // "INR/TOP",
  // "INR/TRY",
  // "INR/TTD",
  // "INR/TWD",
  // "INR/TZS",
  // "INR/UAH",
  // "INR/UGX",
  // "INR/USD",
  // "INR/UYU",
  // "INR/UZS",
  // "INR/VND",
  // "INR/VUV",
  // "INR/WST",
  // "INR/XAF",
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
  const [lastUpdatedDate, setLastUpdatedDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [order,setOrder] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // const fetchCurrencyPairs = async () => {
  //   const generateChartData = (baseValue) => {
  //     const chartData = [];
  //     const baseTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

  //     for (let i = 0; i < 10; i++) {
  //       chartData.push({
  //         timestamp: baseTimestamp + i * 3600, // Increment timestamp by 1 hour (3600 seconds)
  //         value: (baseValue + i * 0.11).toFixed(4), // Increment value slightly for each entry
  //       });
  //     }

  //     return chartData;
  //   };

  //   try {
  //     const updatedMarketData = await Promise.all(
  //       currencyPairs.map(async (pair) => {
  //         const [base, quote] = pair.split("/");

  //         // Example API URL structure (modify according to the API you choose)
  //         const response = await axios.get(
  //           `https://v6.exchangerate-api.com/v6/${api_key}/pair/${base}/${quote}`
  //         );

  //         const data = response.data;
  //         console.log(data);

  //         if (data) {
  //           const previousRate = 1.1; // Replace with your logic to get the previous conversion rate

  //           const conversionRate = data.conversion_rate;

  //           // Calculate the absolute change and percentage change
  //           const absoluteChange = conversionRate - previousRate;
  //           const percentageChange = (
  //             (absoluteChange / previousRate) *
  //             100
  //           ).toFixed(2);

  //           // Generate dynamic chart data with conversionRate as baseValue
  //           const chartData = generateChartData(conversionRate);

  //           console.log("Chart Data JSON:", JSON.stringify(chartData, null, 10));

  //           return {
  //             asset: pair,
  //             conversionRate: conversionRate,
  //             absoluteChange: absoluteChange.toFixed(2), // Absolute change formatted
  //             percentageChange: `${percentageChange} %`,
  //             high: (data.conversion_rate * 1.005).toFixed(2), // Simulating high value
  //             low: (data.conversion_rate * 0.995).toFixed(2), // Simulating low value
  //             sell: (data.conversion_rate - 0.001).toFixed(2),
  //             buy: (data.conversion_rate + 0.001).toFixed(2),
  //             chartData: chartData, // Use the dynamically generated chart data
  //           };
  //         }
  //         return null;
  //       })
  //     );
  //     setMarketData(updatedMarketData.filter(Boolean)); // Remove any null values
  //   } catch (error) {
  //     console.error("Error fetching currency pair data:", error);
  //   }
  // };

  // fetchStockWithFinnhub();

  const fetchCurrencyPairs = async () => {
    const generateChartData = (conversionRate) => {
      const chartData = [];

      // Start from the current timestamp
      const baseTimestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds

      for (let i = 0; i < 30; i++) {
        // Simulate some variation around the conversionRate for chart data
        const simulatedValue = conversionRate + Math.random() * 0.05 - 0.025; // Slight variation
        chartData.push(simulatedValue.toFixed(4)); // Only the value is pushed (no labels)
      }

      return chartData;
    };

    // Example list of currency pairs
    // const currencyPairs = ['USD/EUR', 'USD/GBP', 'USD/JPY']; // Replace with your actual list of pairs

    try {
      // setLoading(true);
      const updatedMarketData = await Promise.all(
        currencyPairs.map(async (pair) => {
          const [base, quote] = pair.split("/");

          // Fetch data from FastForex API for the specific pair (USD to EUR, etc.)
          const response = await axios.get(
            `https://api.fastforex.io/fetch-one?from=${base}&to=${quote}&api_key=${api_key}`
          );

          const data = response.data;

          if (data) {
            const previousRate = 1.1; // Replace with your logic to get the previous conversion rate

            // Use the conversion rate from the API response
            const conversionRate = data?.result[quote] || 1; // Use the correct conversion rate for the target currency
            // console.log(conversionRate);
            // Calculate the absolute change and percentage change
            const absoluteChange = conversionRate - previousRate;
            const percentageChange = (
              (absoluteChange / previousRate) *
              100
            ).toFixed(2);

            // Generate dynamic chart data with conversionRate as baseValue
            const chartData = generateChartData(conversionRate);

            console.log(
              "Chart Data JSON:",
              JSON.stringify(chartData, null, 10)
            );

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
    const fetchData = async () => {
      await checkAndResetGraphData();
      const storedData = await AsyncStorage.getItem("marketData");
      console.log(storedData);
      if (storedData) {
        setMarketData(JSON.parse(storedData)); // Use cached data if available
        setPosition(JSON.parse(storedData));
      }
      fetchCurrencyPairs(); // Fetch new data after checking cache
    };

    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchCurrencyPairs();
      const intervalId = setInterval(fetchCurrencyPairs, 3200000000);
      return () => clearInterval(intervalId);
    }, [])
  );


  const handleTabClick = (tab) => setActiveTab(tab);

  const renderTabContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#1E90FF" />;
    }

    switch (activeTab) {
        case "Wishlist":
          return (
            <View>
              {/* TextInput for searching */}
              <View style={{
                paddingHorizontal:16,
              }}>

              <TextInput
                style={styles.searchInput}
                placeholder="Search Currency Pair"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
              />
              </View>
    
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
                        <View style={{ flexDirection: "row", gap: 15 }}>
                          <View style={styles.priceInfo}>
                            <Text style={styles.priceText} numberOfLines={1}>
                              H: {item.high}
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
                            <Text style={styles.priceText} numberOfLines={1}>
                              L: {item.low}
                            </Text>
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
        
        // return marketData.map((item, index) => (
        //   <View key={index} style={styles.card}>
        //     <Pressable
        //       onPress={() =>
        //         navigation.navigate("StockInformationScreen", {
        //           stock: item.asset,
        //         })
        //       }
        //     >
        //       <View
        //         style={{
        //           flexDirection: "row",
        //           justifyContent: "space-between",
        //           alignItems: "center",
        //         }}
        //       >
        //         <View>
        //           <View style={styles.topRow}>
        //             <Text style={styles.symbol}>{item.asset}</Text>
        //             <Text
        //               style={[
        //                 styles.change,
        //                 {
        //                   color:
        //                     item.absoluteChange < 0 ? "#E94560" : "#1CB85C", // Red for negative, green for positive
        //                 },
        //               ]}
        //             >

        //               {item.absoluteChange} ({item.percentageChange})
        //             </Text>
        //           </View>
        //           <View
        //             style={{
        //               justifyContent: "space-between",
        //               flexDirection: "row",
        //               alignItems: "center",
        //               marginTop: 5,
        //             }}
        //           >
        //             <LineChart
        //               data={{
        //                 datasets: [
        //                   {
        //                     data: item.chartData,
        //                   },
        //                 ],
        //               }}
        //               width={screenWidth - 200}
        //               height={60}
        //               withDots={false}
        //               withInnerLines={false}
        //               withOuterLines={false}
        //               withVerticalLabels={false}
        //               withHorizontalLabels={false}
        //               chartConfig={{
        //                 backgroundGradientFrom: "#1A1A1D",
        //                 backgroundGradientTo: "#1A1A1D",
        //                 color: (opacity = 1) =>
        //                   item.chartData[0] < item.chartData[item.chartData.length - 1]
        //                     ? `rgba(28, 184, 92, ${opacity})` // Green for increasing
        //                     : `rgba(233, 69, 96, ${opacity})`, // Red for decreasing
        //                 strokeWidth: 2,
        //               }}
        //               style={{
        //                 marginLeft: -60,
        //               }}
        //             />
        //           </View>
        //         </View>
        //         <View style={{ flexDirection: "row", gap: 15 }}>
        //           <View style={styles.priceInfo}>
        //             <Text style={styles.priceText} numberOfLines={1}>
        //               H: {item.high}
        //             </Text>
        //             <TouchableOpacity style={styles.sellButton}>
        //               <Text style={{ color: "#E94560", fontSize: 14 }}>
        //                 SELL{" "}
        //               </Text>
        //               <Text
        //                 style={{
        //                   color: "#E94560",
        //                   fontSize: 16,
        //                   fontWeight: "bold",
        //                 }}
        //                 numberOfLines={1}
        //               >
        //                 {item.sell}
        //               </Text>
        //             </TouchableOpacity>
        //           </View>
        //           <View style={styles.buttons}>
        //             <Text style={styles.priceText} numberOfLines={1}>
        //               L: {item.low}
        //             </Text>
        //             <TouchableOpacity style={styles.buyButton}>
        //               <Text style={{ color: "#1CB85C", fontSize: 14 }}>
        //                 BUY{" "}
        //               </Text>
        //               <Text
        //                 style={{
        //                   color: "#1CB85C",
        //                   fontSize: 16,
        //                   fontWeight: "bold",
        //                 }}
        //                 numberOfLines={1}
        //               >
        //                 {item.buy}
        //               </Text>
        //             </TouchableOpacity>
        //           </View>
        //         </View>
        //       </View>
        //     </Pressable>
        //   </View>
        // ));
      case "Positions":
        return position.map((item, index) => (
          <View key={index} style={styles.card}>
            <Pressable
            // onPress={() =>
            //   navigation.navigate("StockInformationScreen", {
            //     stock: item.asset,
            //   })
            // }
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
                    {/* <LineChart
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
                        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                        strokeWidth: 2,
                      }}
                      style={{
                        marginLeft: -60,
                      }}
                    /> */}
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 15 }}>
                  <View style={styles.priceInfo}>
                    <Text style={styles.priceText} numberOfLines={1}>
                      H: {item.high}
                    </Text>
                    {/* <TouchableOpacity style={styles.sellButton}>
                      <Text style={{ color: "#E94560", fontSize: 14 }}>
                        SELL{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#E94560",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        {item.sell}
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                  <View style={styles.buttons}>
                    <Text style={styles.priceText} numberOfLines={1}>
                      L: {item.low}
                    </Text>
                    {/* <TouchableOpacity style={styles.buyButton}>
                      <Text style={{ color: "#1CB85C", fontSize: 14 }}>
                        BUY{" "}
                      </Text>
                      <Text
                        style={{
                          color: "#1CB85C",
                          fontSize: 16,
                          fontWeight: "bold",
                        }}
                      >
                        {item.buy}
                      </Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        ));
      case "Orders":
        return order.map((item, index) => (
          <View key={index} style={styles.card}>
            <Pressable
            // onPress={() =>
            //   navigation.navigate("StockInformationScreen", {
            //     stock: item.asset,
            //   })
            // }
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
                    {/* <LineChart
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
                        color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                        strokeWidth: 2,
                      }}
                      style={{
                        marginLeft: -60,
                      }}
                    /> */}
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
            </Pressable>
          </View>
        ));
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

  return (
    <View style={styles.container}>
      {/* <ScrollView
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
      </ScrollView> */}

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
          </TouchableOpacity>
        )}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1D",
    // padding: 15,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 10,
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
    marginBottom: 10,
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
    // justifyContent: "space-between",
  },
  sellButton: {
    // backgroundColor: "#E94560",
    // paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E94560",
    paddingHorizontal: 16,
    borderRadius: 5,
    width: 80, // Set the same fixed width as the sell button
    alignItems: "center",
  },
  buyButton: {
    // backgroundColor: "#1CB85C",
    borderWidth: 1,
    borderColor: "#1CB85C",
    // paddingVertical: 5,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: 80, // Set the same fixed width as the sell button
    alignItems: "center",
  },
});

export default Market;