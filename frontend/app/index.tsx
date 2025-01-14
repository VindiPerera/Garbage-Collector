import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Import your screens here
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import HomePage from '../screens/user/HomePage';
import BulkPage from '../screens/user/BulkPage';
import StorePage from '../screens/user/StorePage';
import ComplainPage from '../screens/user/ComplainPage';
import HomeDash from '../screens/admin/HomeDash';
import ComplainDash from '../screens/admin/ComplainDash';
import StoreDash from '../screens/admin/StoreDash';
import Map from '../screens/admin/Map';
import AddBulkPage from '../screens/user/AddBulkPage';
import AddProduct from '../screens/admin/AddProduct';
import PlaceOrder from '../screens/user/PlaceOrder';
import Invoice from '../screens/user/Invoice';
import OrderList from '../screens/admin/OrderList';
import UpdateProduct from '../screens/admin/UpdateProduct';
import AddComplaint from '../screens/user/AddComplaint';
import ComplainRead from '../screens/user/ComplainRead';
import AllComplaints from '../screens/admin/AllComplaints';
import PendingComplaints from '../screens/admin/PendingComplaints';
import BulkSchedules from '../components/Admin/Bulk/BulkSchedules';
import ProfilePage from '../screens/Profile';
import NormalSchedules from '../components/Admin/Bulk/NormalSchedules';
import ComplaintPending from '../screens/admin/ComplaintPending';
import ComplaintResolve from '../screens/admin/ComplaintResolve';
import ComplaintProcessing from '../screens/admin/ComplaintProcessing';
import NumOfSmartDustbin from '@/screens/admin/NumOfSmartDustins';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Custom theme with Inter font
const theme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    regular: { fontFamily: 'Inter_400Regular' },
    medium: { fontFamily: 'Inter_500Medium' },
    light: { fontFamily: 'Inter_400Regular' },
    thin: { fontFamily: 'Inter_400Regular' },
  },
};

interface AnimatedIconProps {
  routeName: string;
  focused: boolean;
  color: string;
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({ routeName, focused, color }) => {
  const scale = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0, { stiffness: 200 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.2]);
    return {
      transform: [{ scale: scaleValue }],
    };
  });

  const renderIcon = (routeName: string) => {
    switch (routeName) {
      case 'HomePage':
      case 'HomeDash':
        return <MaterialCommunityIcons name="home" color={color} size={26} />;
      case 'BulkPage':
        return <MaterialCommunityIcons name="warehouse" color={color} size={26} />;
      case 'ComplainPage':
      case 'ComplainDash':
        return <MaterialCommunityIcons name="alert-circle" color={color} size={26} />;
      case 'StorePage':
      case 'StoreDash':
        return <MaterialCommunityIcons name="store" color={color} size={26} />;
      case 'Map':
        return <MaterialCommunityIcons name="map" color={color} size={26} />;
      default:
        return null;
    }
  };

  return <Animated.View style={animatedStyle}>{renderIcon(routeName)}</Animated.View>;
};

const AdminTabs: React.FC = () => (
  <Tab.Navigator
    initialRouteName="HomeDash"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => <AnimatedIcon routeName={route.name} focused={focused} color={color} />,
      tabBarActiveTintColor: '#3d9c56',
      tabBarInactiveTintColor: '#737373',
      tabBarStyle: {
        height: 80,
        paddingBottom: 10,
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontFamily: 'Inter_400Regular',
      },
    })}
  >
    <Tab.Screen name="HomeDash" component={HomeDash} options={{ title: 'Home' }} />
    <Tab.Screen name="Map" component={Map} options={{ title: 'Map' }} />
    <Tab.Screen name="ComplainDash" component={ComplainDash} options={{ title: 'Complaints' }} />
    <Tab.Screen name="StoreDash" component={StoreDash} options={{ title: 'Store' }} />
  </Tab.Navigator>
);

const UserTabs: React.FC = () => (
  <Tab.Navigator
    initialRouteName="HomePage"
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color }) => <AnimatedIcon routeName={route.name} focused={focused} color={color} />,
      tabBarActiveTintColor: '#3d9c56',
      tabBarInactiveTintColor: '#737373',
      tabBarStyle: {
        height: 80,
        paddingBottom: 10,
        paddingTop: 10,
      },
      tabBarLabelStyle: {
        fontFamily: 'Inter_400Regular',
      },
    })}
  >
    <Tab.Screen name="HomePage" component={HomePage} options={{ title: 'Home' }} />
    <Tab.Screen name="BulkPage" component={BulkPage} options={{ title: 'Bulk' }} />
    <Tab.Screen name="ComplainPage" component={ComplainPage} options={{ title: 'Complaints' }} />
    <Tab.Screen name="StorePage" component={StorePage} options={{ title: 'Store' }} />
  </Tab.Navigator>
);

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (fontsLoaded && !initializing) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initializing]);

  if (!fontsLoaded || initializing) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="AdminTabs" component={AdminTabs} />
              <Stack.Screen name="UserTabs" component={UserTabs} />
            </>
          )}
          <Stack.Screen name="AddBulkPage" component={AddBulkPage} />
          <Stack.Screen name="AddComplaint" component={AddComplaint} />
          <Stack.Screen name="ComplainRead" component={ComplainRead} />
          <Stack.Screen name="AllComplaints" component={AllComplaints} />
          <Stack.Screen name="ComplaintPending" component={ComplaintPending} />
          <Stack.Screen name="ComplaintResolve" component={ComplaintResolve} />
          <Stack.Screen name="ComplaintProcessing" component={ComplaintProcessing} />
          <Stack.Screen name="AddProduct" component={AddProduct} />
          <Stack.Screen name="PlaceOrder" component={PlaceOrder} />
          <Stack.Screen name="UpdateProduct" component={UpdateProduct} />
          <Stack.Screen name="BulkSchedules" component={BulkSchedules} />
          <Stack.Screen name="NormalSchedules" component={NormalSchedules} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} />
          <Stack.Screen name="Invoice" component={Invoice} />
          <Stack.Screen name="OrderList" component={OrderList} />
          <Stack.Screen name="NumOfSmartDustbin" component={NumOfSmartDustbin} />
        </Stack.Navigator>
    </PaperProvider>
  );
};

export default App;