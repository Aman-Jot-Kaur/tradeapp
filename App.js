import * as React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useRef } from "react";
import { TouchableOpacity } from "react-native";
import GraphScreen from "./views/GraphScreen";
import TradeScreen from "./views/TradeScreen";
import MarketScreen from "./views/MarketScreen";
import DepositScreen from "./views/DepositScreen";
import WithdrawalScreen from "./views/WithdrawalScreen";
import InviteLinkScreen from "./views/InviteLinkScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LedgerScreen from "./views/LedgerScreen";
import ManageTradingAccountScreen from "./views/ManageTradingAccountScreen";
import ManageProfileScreen from "./views/ManageProfileScreen";
import ProfileScreen from "./views/ProfileScreen";
import BlotterScreen from "./views/BlotterScreen";
import WalletScreen from "./views/WalletScreen";
import StockInformationScreen from "./views/StockInformationScreen";
import LoginScreen from "./views/LoginScreen";
import VerificationPending from "./views/Pending";
import SignupScreen from "./views/SignupScreen";
import CustomHeader from "./views/TopBar";
import ContactScreen from "./views/ContactScreen";
import Toast from "react-native-toast-message"; // Import Toast
import Helpchatscreen from "./views/Helpchatscreen";
import PrivacyScreen from "./views/PrivacyScreen";
import { useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore"; // Correct Firestore imports
// import Toast from 'react-native-toast-message';
import { db } from "./firebaseCon";
import { useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import SideBarLogout from "./views/SideBarLogout";

const Drawer = createDrawerNavigator();

const defaultBalances = [
  { label: "Available balance", amount: 0 },
  { label: "Deposit Balance", amount: 0 },
  { label: "P & L Balance", amount: 0 },
  { label: "Withdrawal Balance", amount: 0 },
  { label: "Bonus", amount: 0 },
  { label: "Referral Bonus", amount: 0 },
  { label: "Leverage Balance", amount: 0 },
  { label: "Credit Balance", amount: 0 },
];

export default function App() {
  const [balances, setBalances] = useState(defaultBalances);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWalletData = async () => {
      // setLoading(true);
      try {
        const storedUserId = await AsyncStorage.getItem("userIdSA");
        if (!storedUserId) {
          // Toast.show({ type: "error", text1: "User ID not found" });
          // setLoading(false);
          return;
        }

        const walletRef = doc(db, "wallet", storedUserId);
        const walletDoc = await getDoc(walletRef);

        if (walletDoc.exists()) {
          setBalances(walletDoc.data().balances);
          console.log(walletDoc.data(),"dsdsadsadsa")
        } else {
          await setDoc(walletRef, {
            userId: storedUserId,
            balances: defaultBalances,
          });
          setBalances(defaultBalances);
        }
      } catch (error) {
        console.error("Error fetching or creating wallet data:", error);
        Toast.show({ type: "error", text1: "Error loading wallet data" });
      } finally {
      }
    };

    getWalletData();
  }, []);

  function CustomDrawerContent(props) {
    const scrollViewRef = useRef(null); // Ref for ScrollView

    const [currentScrollX, setCurrentScrollX] = useState(0); // Track current scroll position

    const handleScroll = (direction) => {
      const newScrollX = direction === "left" ? currentScrollX - 180 : currentScrollX + 180;
      setCurrentScrollX(newScrollX); // Update the current scroll position
  
      scrollViewRef.current?.scrollTo({
        x: newScrollX, // Scroll to the calculated position
        animated: true,
      });
    };
  
    return (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          {/* Logo */}
          <Image source={{uri:'https://partners.blackbull.com/wp-content/uploads/2023/09/BlackBull_BlackBull-White-brand-icon-1536x1536.png'}} style={styles.logo}/>
          {/* App Name */}
          <Text style={styles.appName}>Black Bulls</Text>
        </View>

        {/* Drawer Items */}
        <View style={{ flex: 1 }}>
          <DrawerItemList {...props} />
        </View>

        {/* Footer Section */}
        <View style={{ padding: 10 }}>
        <View style={styles.scrollContainer}>
          {/* Left Arrow */}
          <TouchableOpacity onPress={() => handleScroll("left")}>
            <MaterialIcons name="chevron-left" size={40} color="white" />
          </TouchableOpacity>

          {/* Scrollable Content */}
          <ScrollView
            horizontal
            ref={scrollViewRef}
            nestedScrollEnabled={true}
            style={styles.container}
            showsHorizontalScrollIndicator={false}
          >
            {balances.map((balance, index) => (
              <View key={index} style={styles.balanceCard}>
                <Text style={styles.label}>{balance.label}</Text>
                <Text style={styles.amount}>{balance.amount} Rs</Text>
              </View>
            ))}
            {balances.length === 0 && <Text>No balance data yet</Text>}
          </ScrollView>

          {/* Right Arrow */}
          <TouchableOpacity onPress={() => handleScroll("right")}>
            <MaterialIcons name="chevron-right" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      </DrawerContentScrollView>
    );
  }
  return (
    <NavigationContainer style={{ backgroundColor: '#1c72b4' }}>
      <Drawer.Navigator
      nestedScrollEnabled={true} // Ensure this is set
      initialRouteName="SignupScreen"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          // headerShown: false,¯
          drawerStyle: {
            backgroundColor: "black", // Background color of the drawer
          },
          headerShown: true, // Ensure header is shown globally
          header: (props) => <CustomHeader {...props} />,
          header: () => <CustomHeader />,
          drawerActiveTintColor: "white", // Color for the active item
          drawerInactiveTintColor: "gray", 
          swipeEnabled: true, // Allow swipe gestures
          // Color for inactive items
        }}
      >
        <Drawer.Screen
          options={{
            headerShown: false,
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          name="Signup"
          component={SignupScreen}
        />
        <Drawer.Screen
          options={{
            headerShown: false,
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          name="Pending"
          component={VerificationPending}
        />
        <Drawer.Screen
          name="Deposit"
          component={DepositScreen}
          options={{
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="attach-money" // Replace with the desired icon name
                size={size}
                style={{ marginRight: -30 }}
                color={focused ? "#1E90FF" : "#808080"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Withdrawal"
          component={WithdrawalScreen}
          options={{
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="money-off" // Replace with your preferred icon
                size={size}
                style={{ marginRight: -30 }}
                color={focused ? "#1E90FF" : "#808080"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Ledger"
          component={LedgerScreen}
          options={{
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="book" // Replace with your preferred icon
                size={size}
                style={{ marginRight: -30 }}
                color={focused ? "#1E90FF" : "#808080"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Manage Trading Account"
          component={ManageTradingAccountScreen}
          options={{
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="account-balance" // Replace with an icon that fits your context
                size={size}
                style={{ marginRight: -30 }}
                color={focused ? "#1E90FF" : "#808080"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Manage Profile"
          component={ManageProfileScreen}
          options={{
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="person"
                size={size}
                style={{ marginRight: -30 }}
                color={focused ? "#1E90FF" : "#808080"}
              />
            ),
          }}
        />
        {/* <Drawer.Screen name="setting" component={ContactScreen}/> */}

        {/* <Drawer.Screen name="about Us" component={ContactScreen}/> */}
        <Drawer.Screen
          name="Invite Link"
          component={InviteLinkScreen}
          options={{
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="link"
                size={size}
                style={{ marginRight: -30 }}
                color={focused ? "#1E90FF" : "#808080"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="Help Chat"
          component={Helpchatscreen}
          options={{
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="chat"
                size={size}
                style={{ marginRight: -30 }}
                color={focused ? "#1E90FF" : "#808080"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="Contact Us"
          component={ContactScreen}
          options={{
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="contacts"
                size={size}
                style={{ marginRight: -30 }}
                color={focused ? "#1E90FF" : "#808080"}
              />
            ),
          }}
        />
        <Drawer.Screen
  name="Privacy"
  component={PrivacyScreen} // Replace with your actual component
  options={{
    drawerIcon: ({ focused, size }) => (
      <MaterialIcons
        name="shield"
        size={size}
        style={{ marginRight: -30 }}
        color={focused ? "#1E90FF" : "#808080"}
      />
    ),
  }}
/>


        <Drawer.Screen
          name="Logout"
          component={SideBarLogout}
          options={{
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="logout"
                size={size}
                style={{ marginRight: -30 }}
                color={focused ? "#1E90FF" : "#808080"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="Graph"
          options={{
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          component={GraphScreen}
        />
        <Drawer.Screen
          name="Trade"
          options={{
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          component={TradeScreen}
        />
        <Drawer.Screen
          name="Market"
          options={{
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          component={MarketScreen}
        />

        <Drawer.Screen
          name="Profile"
          options={{
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          component={ProfileScreen}
        />
        <Drawer.Screen
          options={{
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          name="Blotter"
          component={BlotterScreen}
        />
        <Drawer.Screen
          options={{
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          name="Wallet"
          component={WalletScreen}
        />
        <Drawer.Screen
          options={{
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          name="Stock Information"
          component={StockInformationScreen}
        />
        <Drawer.Screen
          options={{
            headerShown: false,
            drawerItemStyle: { display: "none" }, // Hide this item
          }}
          name="Login"
          component={LoginScreen}
        />
      </Drawer.Navigator>

      {/* Global Toast Configuration */}
      <Toast />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 10,

    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  container: {
    // flex: 1,
    backgroundColor: "#000",
   
  },
  balanceCard: {
    // flexDirection: 'row',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1b1b1b",
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    padding: 5,
    width:150,
    gap:20,
    marginBottom: 15,
    marginRight: 25,
  },
  label: {
    fontSize: 16,
    color: "#ffffff",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 40,
  },
  appName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  scrollContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
