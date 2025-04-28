import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import { Colors } from "../../constants/colors";

type ButtonVariant = "outlined" | "filled";

type PrimaryButtonProps = {
  children: ReactNode;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  variant?: ButtonVariant;
};

const PrimaryButton = ({
  children,
  onPress,
  color = Colors.primary,
  disabled = false,
  style,
  textStyle,
  variant = "outlined",
}: PrimaryButtonProps) => {
  const getContainerStyles = () => {
    const variantStyles =
      variant === "filled"
        ? { backgroundColor: color, borderColor: color }
        : { borderColor: color, backgroundColor: "transparent" };

    return [styles.buttonOuterContainer, variantStyles, disabled && styles.disabled, style];
  };

  const getTextStyles = () => {
    const variantTextColor = variant === "filled" ? "white" : color;

    return [
      styles.buttonText,
      { color: variantTextColor },
      disabled && styles.disabledText,
      textStyle,
    ];
  };

  return (
    <View style={getContainerStyles()}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [styles.buttonContainer, pressed && styles.pressed]}
      >
        <Text style={getTextStyles()}>{children}</Text>
      </Pressable>
    </View>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderWidth: 2,
    margin: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  buttonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: Colors.l4,
  },
  disabled: {
    borderColor: "#ccc",
    backgroundColor: "#f5f5f5",
  },
  disabledText: {
    color: "#666",
  },
});
