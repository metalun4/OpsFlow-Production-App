import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RecipesScreen from "./RecipesScreen";
import { Colors } from "../../constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import IconButton from "../../components/shared/IconButton";
import { turkishStrings } from "../../constants/strings";

export type RecipeTabsParamList = {
  HomeScreen: undefined;
  RecipesScreen: { active: boolean };
  ActiveRecipesScreen: { active: boolean };
};
const BottomTabs = createBottomTabNavigator<RecipeTabsParamList>();

const RecipesTabs = () => {
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
      })}
    >
      <BottomTabs.Screen
        name={"ActiveRecipesScreen"}
        component={RecipesScreen}
        initialParams={{ active: true }}
        options={{
          title: turkishStrings.menu.activeRecipes,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"list"} color={color} size={size} />
          ),
        }}
      />
      <BottomTabs.Screen
        name={"RecipesScreen"}
        component={RecipesScreen}
        initialParams={{ active: false }}
        options={{
          title: turkishStrings.menu.allRecipes,
          tabBarLabel: turkishStrings.menu.allRecipes,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name={"list-alt"} color={color} size={size} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default RecipesTabs;
