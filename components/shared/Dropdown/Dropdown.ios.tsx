import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import LabeledView from "../LabeledView";
import { Customer, Recipe } from "../../../constants/types";
import AnimatedModal from "../AnimatedModal";

type DropdownProps = {
  title: string;
  items: any[];
  selectedItem: any;
  handleSelect: (item: any) => void;
  disabled: boolean;
  buttonText: string;
};

const Dropdown = ({
  title,
  items,
  selectedItem,
  handleSelect,
  disabled,
  buttonText,
}: DropdownProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [temporarySelected, setTemporarySelected] = useState<string>(
    selectedItem ? selectedItem.id.toString() : items[0].id.toString(),
  );

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
    setTemporarySelected(selectedItem ? selectedItem.id.toString() : null);
    setModalVisible(false);
  };

  const getDisplayText = (item: Recipe | Customer | null) => {
    if (!item) return buttonText;

    if ("revisionNo" in item) {
      return `${item.recipeName} R:${item.revisionNo}`;
    } else {
      return item.customerName;
    }
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
          onPress={() => !disabled && setModalVisible(true)}
          disabled={disabled}
        >
          <Text style={[styles.selectedText, disabled && styles.selectedTextDisabled]}>
            {getDisplayText(selectedItem)}
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

export default React.memo(Dropdown);
