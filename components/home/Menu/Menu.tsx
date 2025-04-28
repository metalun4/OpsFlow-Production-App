import React from "react";
import { StyleSheet, View } from "react-native";
import MenuButton from "./MenuButton";
import { turkishStrings } from "../../../constants/strings";

const Menu = () => {
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <MenuButton
          text={turkishStrings.menu.productionPlans}
          goTo={"PlansOverview"}
          icon={"clipboard-list"}
          color={"black"}
        />
        <MenuButton
          text={turkishStrings.menu.recipeList}
          goTo={"RecipesOverview"}
          icon={"file-alt"}
          color={"black"}
        />
      </View>
      <View style={styles.rowContainer}>
        <MenuButton
          text={turkishStrings.menu.orders}
          goTo={"OrdersOverview"}
          icon={"shopping-cart"}
          color={"black"}
        />
      </View>
    </View>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
