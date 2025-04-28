import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "../../constants/colors";
import IconButton from "../../components/shared/IconButton";
import { turkishStrings } from "../../constants/strings";
import { MaterialIcons } from "@expo/vector-icons";
import EntityListScreen from "../(entity)/EntityListScreen";

export type PlanTabsParamList = {
  HomeScreen: undefined;
  PlansScreen: { active: boolean };
  ActivePlansScreen: { active: boolean };
};
const BottomTabs = createBottomTabNavigator<PlanTabsParamList>();

const PlansTabs = () => {
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
            onPress={() => navigation.getParent()?.navigate("PlanInputScreen")}
            icon={"assignment-add"}
            color={tintColor}
            size={24}
          />
        ),
      })}
    >
      <BottomTabs.Screen
        name={"ActivePlansScreen"}
        component={EntityListScreen}
        initialParams={{ active: true }}
        options={{
          title: turkishStrings.menu.productionPlans,
          tabBarLabel: turkishStrings.menu.activePlans,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"play-circle"} color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name={"PlansScreen"}
        component={EntityListScreen}
        initialParams={{ active: false }}
        options={{
          title: turkishStrings.menu.productionPlans,
          tabBarLabel: turkishStrings.menu.onHold,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"pause-circle"} color={color} size={size} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default PlansTabs;
