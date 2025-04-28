import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "../../constants/colors";

type ListSectionProps = {
  title: string;
  list: { id?: any; name: any; amount: any }[];
};

const ListSection = ({ title, list }: ListSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {list.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemAmount}>{item.amount + "kg"}</Text>
        </View>
      ))}
    </View>
  );
};

export default ListSection;

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#efefef",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
    color: Colors.primary,
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  itemName: {
    fontSize: 14,
    flex: 3,
  },
  itemAmount: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
});
