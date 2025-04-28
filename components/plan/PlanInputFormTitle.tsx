import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Plan } from "../../constants/types";
import { Colors } from "../../constants/colors";

type PlanInputFormTitleProps = {
  plan: Plan;
};

const PlanInputFormTitle = ({ plan }: PlanInputFormTitleProps) => {
  return (
    <View style={styles.planTitleContainer}>
      <Text style={styles.planTitle}>Parti No: {plan.id}</Text>
    </View>
  );
};

export default PlanInputFormTitle;

const styles = StyleSheet.create({
  planTitleContainer: {
    marginBottom: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 4,
  },
  planTitle: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});
