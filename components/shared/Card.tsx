import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

type CardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

const Card = ({ children, style }: CardProps) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default Card;

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    padding: 8,
    margin: 8,
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "black",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 1 },
  },
});
