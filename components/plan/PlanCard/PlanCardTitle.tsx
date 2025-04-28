import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Colors } from "../../../constants/colors";

type PlanCardTitleProps = {
  batchId: number;
  recipeName: string;
  batchCount: number;
  revisionNo: number;
};

const PlanCardTitle = ({ batchId, recipeName, batchCount, revisionNo }: PlanCardTitleProps) => {
  return (
    <View style={styles.titleContainer}>
      <View style={styles.idContainer}>
        <Text style={styles.title}>{batchId}</Text>
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.title} adjustsFontSizeToFit={true} numberOfLines={2}>
          {recipeName + " R:" + revisionNo}
        </Text>
      </View>
      <View style={styles.countContainer}>
        <Text style={styles.title}>{batchCount}</Text>
      </View>
    </View>
  );
};

export default PlanCardTitle;

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    backgroundColor: Colors.primary, //d4
    flexDirection: "row",
    margin: 4,
    borderRadius: 8,
    justifyContent: "center",
    overflow: "hidden",
  },
  idContainer: {
    width: "25%",
    borderRightWidth: 2,
    borderRightColor: "white",
    padding: 16,
    justifyContent: "center",
  },
  nameContainer: {
    width: "50%",
    padding: 4,
    justifyContent: "center",
  },
  countContainer: {
    width: "25%",
    borderLeftWidth: 2,
    borderLeftColor: "white",
    padding: 4,
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
