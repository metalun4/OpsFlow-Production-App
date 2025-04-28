import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/colors";

import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";

type MenuButtonProps = {
  text: string;
  goTo: string;
  icon: string;
  color: string;
};

const MenuButton = ({ text, goTo, icon, color }: MenuButtonProps) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) => pressed && styles.pressed}
        onPress={() => navigation.navigate(goTo)}
      >
        <View style={styles.buttonContainer}>
          <FontAwesome5 name={icon} size={64} color={color} />
          <Text style={styles.buttonText}>{text}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default MenuButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    flex: 1,
    backgroundColor: "white",
    margin: 8,
    borderRadius: 4,
    elevation: 4,
    borderColor: "black",
    shadowColor: "black",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 1 },
  },
  buttonContainer: {
    margin: 16,
    marginVertical: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.primary,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 8,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: Colors.l4,
  },
});
