import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/colors";
import { turkishStrings } from "../../../constants/strings";

type OrderCardTitleProps = {
  isApproved: number;
};
const OrderCardTitle = ({ isApproved }: OrderCardTitleProps) => {
  let label = turkishStrings.orders.onHold;
  let color = Colors.blue;
  if (isApproved === -1) {
    label = turkishStrings.orders.canceled;
    color = Colors.red;
  } else if (isApproved === 1) {
    label = turkishStrings.orders.approved;
    color = Colors.green;
  }

  return (
    <View style={[styles.titleContainer, { backgroundColor: color }]}>
      <Text style={styles.title}>{label}</Text>
    </View>
  );
};

export default OrderCardTitle;

const styles = StyleSheet.create({
  titleContainer: {
    padding: 8,
    marginBottom: 4,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: "hidden",
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
