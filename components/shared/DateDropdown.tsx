import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import LabeledView from "./LabeledView";
import { tr } from "date-fns/locale";
import AnimatedModal from "./AnimatedModal";

type DateDropdownProps = {
  title: string;
  selectedDate: Date;
  handleSelect: (date: Date) => void;
  disabled?: boolean;
  minimumDate?: Date;
  maximumDate?: Date;
  mode?: "date" | "time" | "datetime";
  dateFormat?: string;
};

// This is a cross-platform implementation that uses platform-specific DatePicker
const DateDropdown = ({
  title,
  selectedDate,
  handleSelect,
  disabled = false,
  minimumDate,
  maximumDate,
  mode = "date",
  dateFormat = "dd/MMM/yyyy",
}: DateDropdownProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [temporarySelected, setTemporarySelected] = useState<Date>(selectedDate);
  const [showPicker, setShowPicker] = useState<boolean>(false);

  const onConfirm = () => {
    handleSelect(temporarySelected);
    setModalVisible(false);
  };

  const onClose = () => {
    // Reset temporary selection to current selected date
    setTemporarySelected(selectedDate);
    setModalVisible(false);
  };

  const formatDate = (date: Date) => {
    return format(date, dateFormat, { locale: tr });
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);

    if (event.type === "set" && selectedDate) {
      handleSelect(selectedDate);
    }
  };

  // Platform-specific rendering
  const isIOS = Platform.OS === "ios";

  return (
    <View style={styles.container}>
      <LabeledView
        label={title}
        contentPadding={0}
        backgroundColor={disabled ? "#f5f5f5" : "white"}
        contentContainerStyle={styles.contentContainer}
        accessibilityLabel={`${title} date picker`}
        testID={`date-dropdown-${title}`}
      >
        <Pressable
          style={styles.dropdownButton}
          onPress={() => {
            if (disabled) return;
            isIOS ? setModalVisible(true) : setShowPicker(true);
          }}
          disabled={disabled}
        >
          <Text style={[styles.selectedText, disabled && styles.selectedTextDisabled]}>
            {formatDate(selectedDate)}
          </Text>
          {!disabled && <MaterialIcons name="arrow-drop-down" size={32} color="black" />}
        </Pressable>
      </LabeledView>

      {/* Android inline date picker */}
      {!isIOS && showPicker && (
        <RNDateTimePicker
          value={selectedDate}
          mode={mode}
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {/* iOS modal date picker */}
      {isIOS && (
        <AnimatedModal
          title={title}
          visible={modalVisible}
          onClose={onClose}
          onConfirm={onConfirm}
          showConfirmButton={true}
        >
          <View style={styles.pickerContainer}>
            <RNDateTimePicker
              value={temporarySelected}
              textColor={"black"}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              mode={mode}
              display="spinner"
              onChange={(_, date) => date && setTemporarySelected(date)}
              style={styles.picker}
            />
          </View>
        </AnimatedModal>
      )}
    </View>
  );
};

import { Platform } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    height: 50,
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
  },
});

export default React.memo(DateDropdown);
