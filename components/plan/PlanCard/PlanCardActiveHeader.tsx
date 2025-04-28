import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/colors";
import { turkishStrings } from "../../../constants/strings";

const PlanCardActiveHeader = () => {
  return (
    <View style={styles.titleContainer}>
      <View style={styles.nameContainer}>
        <Text style={styles.title}>{turkishStrings.plans.inProd}</Text>
      </View>
    </View>
  );
};

export default PlanCardActiveHeader;

const styles = StyleSheet.create({
  titleContainer: {
    width: "100%",
    backgroundColor: Colors.green, //d4
    flexDirection: "row",
    marginBottom: 4,
    justifyContent: "center",
    overflow: "hidden",
  },
  nameContainer: {
    width: "100%",
    paddingBottom: 4,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: "white",
    alignItems: "center",
    textTransform: "uppercase",
  },
});
