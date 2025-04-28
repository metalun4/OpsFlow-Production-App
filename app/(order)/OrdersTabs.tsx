import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "../../constants/colors";
import IconButton from "../../components/shared/IconButton";
import { turkishStrings } from "../../constants/strings";
import { MaterialIcons } from "@expo/vector-icons";
import EntityListScreen from "../(entity)/EntityListScreen";

export type OrderTabsParamList = {
  HomeScreen: undefined;
  OrdersScreen: { approved: number };
  ApprovedOrdersScreen: { approved: number };
  CanceledOrdersScreen: { approved: number };
};

const BottomTabs = createBottomTabNavigator<OrderTabsParamList>();

const OrdersTabs = () => {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: Colors.d4 },
        headerTintColor: "white",
        tabBarStyle: { backgroundColor: Colors.d4 },
        tabBarActiveTintColor: Colors.l2,
        tabBarInactiveTintColor: "white",
        headerLeft: ({ tintColor }) => (
          <IconButton
            onPress={() => navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] })}
            icon={"home"}
            color={tintColor}
            size={24}
          />
        ),
        headerRight: ({ tintColor }) => (
          <IconButton
            onPress={() => navigation.getParent()?.navigate("OrderInputScreen")}
            icon={"add-shopping-cart"}
            color={tintColor}
            size={24}
          />
        ),
      })}
    >
      <BottomTabs.Screen
        name={"OrdersScreen"}
        component={EntityListScreen}
        initialParams={{ approved: 0 }}
        options={{
          title: turkishStrings.menu.orders,
          tabBarLabel: turkishStrings.menu.onHold,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"pause-circle"} color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name={"ApprovedOrdersScreen"}
        component={EntityListScreen}
        initialParams={{ approved: 1 }}
        options={{
          title: turkishStrings.menu.orders,
          tabBarLabel: turkishStrings.menu.approvedOrders,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"check-circle"} color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name={"CanceledOrdersScreen"}
        component={EntityListScreen}
        initialParams={{ approved: -1 }}
        options={{
          title: turkishStrings.menu.orders,
          tabBarLabel: turkishStrings.menu.nonApprovedOrders,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"cancel"} color={color} size={size} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default OrdersTabs;
