import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import LabeledView from "../LabeledView";
import AnimatedModal from "../AnimatedModal";
import { DropdownItem, DropdownProps, getDisplayText } from "./types";

const Dropdown = <T extends DropdownItem,>({
  title,
  items,
  selectedItem,
  handleSelect,
  disabled,
  buttonText,
}: DropdownProps<T>) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [temporarySelected, setTemporarySelected] = useState<string>("");

  const onOpen = () => {
    if (disabled || items.length === 0) return;
    setTemporarySelected((selectedItem ?? items[0]).id.toString());
    setModalVisible(true);
  };

  const onConfirm = () => {
    if (temporarySelected) {
      const selectedObject = items.find((item) => item.id.toString() === temporarySelected);
      if (selectedObject) {
        handleSelect(selectedObject);
      }
    }
  };

  const onClose = () => {
    // Reset temporary selection to current selected item
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <LabeledView
        label={title}
        contentPadding={0}
        backgroundColor={disabled ? "#f5f5f5" : "white"}
        contentContainerStyle={styles.contentContainer}
        accessibilityLabel={`${title} dropdown selector`}
        testID={`dropdown-${title}`}
      >
        <Pressable
          style={styles.dropdownButton}
          onPress={onOpen}
          disabled={disabled || items.length === 0}
        >
          <Text style={[styles.selectedText, disabled && styles.selectedTextDisabled]}>
            {selectedItem ? getDisplayText(selectedItem) : buttonText}
          </Text>
          {!disabled && <MaterialIcons name="arrow-drop-down" size={32} color="black" />}
        </Pressable>
      </LabeledView>

      <AnimatedModal
        title={title}
        visible={modalVisible}
        onClose={onClose}
        onConfirm={onConfirm}
        showConfirmButton={true}
      >
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={temporarySelected}
            onValueChange={(itemValue) => setTemporarySelected(itemValue!.toString())}
            style={styles.picker}
            itemStyle={{ color: "black" }}
          >
            {items.map((item) => (
              <Picker.Item
                key={item.id.toString()}
                label={getDisplayText(item)}
                value={item.id.toString()}
              />
            ))}
          </Picker>
        </View>
      </AnimatedModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: 50, // Consistent height with Android
  },
  dropdownButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  selectedText: {
    fontSize: 16,
  },
  selectedTextDisabled: {
    color: "#666",
  },
  pickerContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  picker: {
    width: "100%",
    color: "black",
  },
});

export default React.memo(Dropdown) as typeof Dropdown;
