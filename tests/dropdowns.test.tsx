import React from "react";
import { act, create, ReactTestRenderer } from "react-test-renderer";
import { Pressable } from "react-native";
import { Picker } from "@react-native-picker/picker";
import IOSDropdown from "../components/shared/Dropdown/Dropdown.ios";
import AndroidDropdown from "../components/shared/Dropdown/Dropdown.android";
import AnimatedModal from "../components/shared/AnimatedModal";
import DateDropdown from "../components/shared/DateDropdown";
import { Customer } from "../constants/types";

jest.mock("@expo/vector-icons/MaterialIcons", () => "MaterialIcons");
jest.mock("../components/shared/AnimatedModal", () => "AnimatedModal");

const customer = { id: 1, customerName: "Customer", customerCode: "C1" };
const otherCustomer = { id: 2, customerName: "Other", customerCode: "C2" };
const props = {
  title: "Customer", items: [] as Customer[], selectedItem: null,
  handleSelect: jest.fn(), disabled: false, buttonText: "Select",
};

let renderer: ReactTestRenderer;
afterEach(() => { act(() => renderer?.unmount()); });

test("iOS dropdown tolerates empty data and initializes after asynchronous loading", () => {
  act(() => { renderer = create(<IOSDropdown {...props} />); });
  expect(renderer.root.findByType(Pressable).props.disabled).toBe(true);
  act(() => { renderer.update(<IOSDropdown {...props} items={[customer]} />); });
  act(() => { renderer.root.findByType(Pressable).props.onPress(); });
  expect(renderer.root.findByType(Picker).props.selectedValue).toBe("1");
  act(() => { renderer.root.findByType(AnimatedModal).props.onConfirm(); });
  expect(props.handleSelect).toHaveBeenCalledWith(customer);
});

test("iOS dropdown resets its draft from the latest selection each time it opens", () => {
  act(() => {
    renderer = create(<IOSDropdown {...props} items={[customer, otherCustomer]} selectedItem={customer} />);
  });
  act(() => { renderer.root.findByType(Pressable).props.onPress(); });
  act(() => { renderer.root.findByType(Picker).props.onValueChange("2"); });
  act(() => { renderer.root.findByType(AnimatedModal).props.onClose(); });
  act(() => { renderer.root.findByType(Pressable).props.onPress(); });
  expect(renderer.root.findByType(Picker).props.selectedValue).toBe("1");
});

test("Android dropdown uses the placeholder after its selection is cleared", () => {
  act(() => { renderer = create(<AndroidDropdown {...props} items={[customer]} selectedItem={customer} />); });
  act(() => { renderer.update(<AndroidDropdown {...props} items={[customer]} />); });
  expect(renderer.root.findByType(Picker).props.selectedValue).toBe("default");
  act(() => { renderer.root.findByType(Picker).props.onValueChange("default"); });
  expect(props.handleSelect).toHaveBeenCalledWith(null);
});

test("iOS date picker opens with the latest date instead of an old draft", () => {
  const first = new Date("2026-10-30T12:00:00Z");
  const latest = new Date("2026-11-02T12:00:00Z");
  const handleSelect = jest.fn();
  act(() => { renderer = create(<DateDropdown title="Date" selectedDate={first} handleSelect={handleSelect} />); });
  act(() => { renderer.update(<DateDropdown title="Date" selectedDate={latest} handleSelect={handleSelect} />); });
  act(() => { renderer.root.findByType(Pressable).props.onPress(); });
  act(() => { renderer.root.findByType(AnimatedModal).props.onConfirm(); });
  expect(handleSelect).toHaveBeenCalledWith(latest);
});
