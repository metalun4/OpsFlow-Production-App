import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Colors } from "../../constants/colors";
import { turkishStrings } from "../../constants/strings";

const PlansHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerIdContainer}>
        <Text style={styles.title}>{turkishStrings.plans.headerBatch}</Text>
      </View>
      <View style={styles.headerNameContainer}>
        <Text style={styles.title}>{turkishStrings.plans.headerRecipeName}</Text>
      </View>
      <View style={styles.headerCountContainer}>
        <Text style={styles.title}>{turkishStrings.plans.headerBatchCount}</Text>
      </View>
    </View>
  );
};

export default PlansHeader;

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    overflow: "hidden",
    marginBottom: 0,
    borderRadius: 0,
    backgroundColor: Colors.d4,
    paddingHorizontal: 20,
  },
  headerIdContainer: {
    width: "25%",
    borderRightWidth: 2,
    borderRightColor: "white",
    justifyContent: "center",
  },
  headerNameContainer: {
    width: "50%",
    paddingVertical: 4,
    justifyContent: "center",
  },
  headerCountContainer: {
    width: "25%",
    borderLeftWidth: 2,
    borderLeftColor: "white",
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
