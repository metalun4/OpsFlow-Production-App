import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import LabeledView from "../LabeledView";
import { Customer, Recipe } from "../../../constants/types";

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
  const [selectedValue, setSelectedValue] = useState<string | null>(
    selectedItem ? selectedItem.id.toString() : null,
  );

  useEffect(() => {
    if (selectedItem) {
      setSelectedValue(selectedItem.id.toString());
    } else {
      setSelectedValue(null);
    }
  }, [selectedItem]);

  const handleValueChange = (itemValue: string) => {
    if (itemValue === "default") {
      handleSelect(null);
    } else {
      setSelectedValue(itemValue);
      const selectedObject = items.find((item) => item.id.toString() === itemValue);
      if (selectedObject) {
        handleSelect(selectedObject);
      }
    }
  };

  const getDisplayText = (item: Recipe | Customer) => {
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
        {items.length > 0 ? (
          <Picker
            selectedValue={selectedValue || ""}
            onValueChange={handleValueChange}
            enabled={!disabled}
            mode={"dropdown"}
            prompt={title}
            style={[styles.picker, disabled && styles.pickerDisabled]}
            itemStyle={{ color: "black" }}
            dropdownIconColor={disabled ? "#aaa" : "black"}
          >
            <Picker.Item label={buttonText} value={"default"} />
            {items.map((item) => (
              <Picker.Item
                key={item.id.toString()}
                label={getDisplayText(item)}
                value={item.id.toString()}
              />
            ))}
          </Picker>
        ) : (
          <Text style={[styles.noItemsText, disabled && styles.pickerDisabled]}>{buttonText}</Text>
        )}
      </LabeledView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: 50,
    justifyContent: "center",
  },
  picker: {
    color: "black",
  },
  pickerDisabled: {
    color: "#666",
  },
  noItemsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
  },
});

export default React.memo(Dropdown);
