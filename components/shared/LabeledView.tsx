import React, { ReactNode } from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import { Colors } from "../../constants/colors";

type LabeledViewProps = {
  children: ReactNode;
  label: string;
  // Style customization
  containerStyle?: ViewStyle | ViewStyle[];
  labelStyle?: TextStyle | TextStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
  // Color customization
  borderColor?: string;
  backgroundColor?: string;
  labelBackgroundColor?: string;
  labelTextColor?: string;
  // Layout options
  flex?: number | boolean;
  contentPadding?: number;
  centerContent?: boolean;
  // Accessibility
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
};

const LabeledView = ({
  children,
  label,
  // Style customization
  containerStyle,
  labelStyle,
  contentContainerStyle,
  // Color customization
  borderColor = Colors.primary,
  backgroundColor = "white",
  labelBackgroundColor = Colors.primary,
  labelTextColor = "white",
  // Layout options
  flex = 1,
  contentPadding,
  centerContent = false,
  // Accessibility
  testID,
  accessible,
  accessibilityLabel,
}: LabeledViewProps) => {
  // Convert boolean flex to number
  const flexValue = typeof flex === "boolean" ? (flex ? 1 : 0) : flex;

  return (
    <View
      style={[
        styles.container,
        {
          borderColor,
          backgroundColor,
          flex: flexValue,
        },
        containerStyle,
      ]}
      testID={testID || `labeled-view-${label}`}
      accessible={accessible}
      accessibilityLabel={accessibilityLabel || label}
    >
      <Text
        style={[
          styles.label,
          { backgroundColor: labelBackgroundColor, color: labelTextColor },
          labelStyle,
        ]}
      >
        {label}
      </Text>
      <View
        style={[
          styles.contentContainer,
          contentPadding !== undefined && { padding: contentPadding },
          centerContent && styles.centerContent,
          contentContainerStyle,
        ]}
      >
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 8,
    margin: 4,
    overflow: "hidden",
    minHeight: 50,
  },
  label: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    padding: 4,
  },
  contentContainer: {
    minHeight: 40,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LabeledView;
