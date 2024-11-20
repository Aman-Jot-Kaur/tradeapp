import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import GraphScreen from './views/GraphScreen';  
import TradeScreen from './views/TradeScreen';
import MarketScreen from './views/MarketScreen';
import DepositScreen from './views/DepositScreen';
import WithdrawalScreen from './views/WithdrawalScreen';
import InviteLinkScreen from './views/InviteLinkScreen';
import LedgerScreen from './views/LedgerScreen';
import ManageTradingAccountScreen from './views/ManageTradingAccountScreen';
import ManageProfileScreen from './views/ManageProfileScreen';
import ProfileScreen from './views/ProfileScreen';
import BlotterScreen from './views/BlotterScreen';
import WalletScreen from './views/WalletScreen';
import StockInformationScreen from './views/StockInformationScreen';
import LoginScreen from './views/LoginScreen';
import SignupScreen from './views/SignupScreen';
import CustomHeader from './views/TopBar';
import ContactScreen from './views/ContactScreen';
import Toast from 'react-native-toast-message'; // Import Toast
import Helpchatscreen from './views/Helpchatscreen';

const Drawer = createDrawerNavigator();

export default function App() {
  function CustomDrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <View style={styles.headerContainer}>
          {/* Logo */}
          <Image 
            source={require('./assets/icon.png')} // Replace with your logo path
            style={styles.logo}
          />
          {/* App Name */}
          <Text style={styles.appName}>Your App Name</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }
  return (
    <NavigationContainer>
      <Drawer.Navigator 
        initialRouteName="SignupScreen" 
        drawerContent={(props) => <CustomDrawerContent {...props} />}

        screenOptions={{
          // headerShown: false,¯
          drawerStyle: {
            backgroundColor: 'black', // Background color of the drawer
          },
          
          header: () => <CustomHeader />,
          drawerActiveTintColor: 'white', // Color for the active item
          drawerInactiveTintColor: 'gray', // Color for inactive items
        }}
      >
         <Drawer.Screen  options={{
            headerShown: false, 
            drawerItemStyle: { display: 'none' } // Hide this item
          }}name="Signup" component={SignupScreen} />
          <Drawer.Screen name="Deposit" component={DepositScreen} />
          <Drawer.Screen name="Withdrawal" component={WithdrawalScreen} />
          <Drawer.Screen name="Ledger" component={LedgerScreen} />
          <Drawer.Screen name="Manage Trading Account" component={ManageTradingAccountScreen} />
          <Drawer.Screen name="Manage Profile" component={ManageProfileScreen} />
                    {/* <Drawer.Screen name="setting" component={ContactScreen}/> */}

          {/* <Drawer.Screen name="about Us" component={ContactScreen}/> */}
          <Drawer.Screen name="Invite Link" component={InviteLinkScreen} />
          <Drawer.Screen name="Help Chat" component={Helpchatscreen}/>

          <Drawer.Screen name="Contact Us" component={ContactScreen}/>

        <Drawer.Screen name="Graph"  options={{
            drawerItemStyle: { display: 'none' } // Hide this item
          }} component={GraphScreen} />
        <Drawer.Screen name="Trade"  options={{
            drawerItemStyle: { display: 'none' } // Hide this item
          }} component={TradeScreen} />
        <Drawer.Screen name="Market"  options={{
            drawerItemStyle: { display: 'none' } // Hide this item
          }} component={MarketScreen} />
      
        <Drawer.Screen name="Profile"   options={{
            drawerItemStyle: { display: 'none' } // Hide this item
          }} component={ProfileScreen} />
        <Drawer.Screen  options={{
            drawerItemStyle: { display: 'none' } // Hide this item
          }} name="Blotter" component={BlotterScreen} />
        <Drawer.Screen  options={{
            drawerItemStyle: { display: 'none' } // Hide this item
          }} name="Wallet" component={WalletScreen} />
        <Drawer.Screen   options={{
            drawerItemStyle: { display: 'none' } // Hide this item
          }} name="Stock Information" component={StockInformationScreen} />
        <Drawer.Screen  options={{
             headerShown: false, 
            drawerItemStyle: { display: 'none' } // Hide this item
          }}  name="Login" component={LoginScreen} />
       
      </Drawer.Navigator>

      {/* Global Toast Configuration */}
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    padding: 30,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,

    display:"flex",
    flexDirection:"row",
    gap:20
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 40,
   
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});
