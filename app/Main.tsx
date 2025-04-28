import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./(home)/HomeScreen";
import { ThemeColors } from "../constants/colors";
import { turkishStrings } from "../constants/strings";
import RecipesTabs from "./(recipe)/RecipesTabs";
import PlansTabs from "./(plan)/PlansTabs";
import { Order, Plan } from "../constants/types";
import OrdersTabs from "./(order)/OrdersTabs";
import EntityInputScreen from "./(entity)/EntityInputScreen";

export type RootStackParamList = {
  HomeScreen: undefined;
  PlansOverview: undefined;
  PlanInputScreen: { plan?: Plan } | undefined;
  RecipesOverview: undefined;
  OrdersOverview: undefined;
  OrderInputScreen: { order?: Order } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Main = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={"HomeScreen"}
        screenOptions={{
          headerStyle: { backgroundColor: ThemeColors.header },
          headerTintColor: "white",
        }}
      >
        <Stack.Screen
          name={"HomeScreen"}
          component={HomeScreen}
          options={{
            title: turkishStrings.menu.home,
          }}
        />
        <Stack.Screen
          name={"PlansOverview"}
          component={PlansTabs}
          options={{ headerShown: false, title: turkishStrings.menu.productionPlans }}
        />
        <Stack.Screen name={"PlanInputScreen"} component={EntityInputScreen} />
        <Stack.Screen
          name={"RecipesOverview"}
          component={RecipesTabs}
          options={{ headerShown: false, title: turkishStrings.menu.recipeList }}
        />
        <Stack.Screen
          name={"OrdersOverview"}
          component={OrdersTabs}
          options={{ headerShown: false, title: turkishStrings.menu.orders }}
        />
        <Stack.Screen name={"OrderInputScreen"} component={EntityInputScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
