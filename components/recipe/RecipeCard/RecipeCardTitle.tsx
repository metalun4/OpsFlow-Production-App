import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Colors } from "../../../constants/colors";
import { FontAwesome5 } from "@expo/vector-icons";

type RecipeCardTitleProps = {
  revisionNo: number;
  recipeName: string;
  isActive: boolean;
};

const RecipeCardTitle = ({ recipeName, revisionNo, isActive }: RecipeCardTitleProps) => {
  return (
    <View style={styles.titleContainer}>
      <View
        style={[
          styles.statusContainer,
          isActive ? { backgroundColor: Colors.green } : { backgroundColor: Colors.gray },
        ]}
      >
        <FontAwesome5 name={isActive ? "dot-circle" : "circle"} size={24} color={"white"} />
      </View>
      <View style={styles.nameContainer}>
        <Text style={styles.title} adjustsFontSizeToFit={true} numberOfLines={2}>
          {recipeName + " R:" + revisionNo}
        </Text>
      </View>
    </View>
  );
};

export default RecipeCardTitle;

const styles = StyleSheet.create({
  titleContainer: {
    backgroundColor: Colors.primary, //d4
    flexDirection: "row",
    marginBottom: 4,
    marginHorizontal: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  statusContainer: {
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  nameContainer: {
    width: "100%",
    padding: 4,
    marginVertical: 8,
    marginLeft: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "left",
    color: "white",
    alignItems: "center",
    textTransform: "uppercase",
  },
});
