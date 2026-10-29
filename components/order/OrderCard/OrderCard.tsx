import React, { useRef } from "react";
import Card from "../../shared/Card";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Customer, Order, Recipe } from "../../../constants/types";
import LabeledView from "../../shared/LabeledView";
import { turkishStrings } from "../../../constants/strings";
import { format, formatDistanceToNowStrict, isValid } from "date-fns";
import { tr } from "date-fns/locale";
import PrimaryButton from "../../shared/PrimaryButton";
import OrderCardTitle from "./OrderCardTitle";
import { Colors } from "../../../constants/colors";
import { useUpdateOrderMutation } from "../../../store/slices/apiSlice";

export type OrderCardProps = {
  order: Order;
  recipe: Recipe;
  customer: Customer;
  onPress: () => void;
};
const OrderCard = ({ order, recipe, customer, onPress }: OrderCardProps) => {
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();
  const mutationPending = useRef(false);
  const shipmentDate = order.shipmentDate ? new Date(order.shipmentDate) : null;

  const changeStatus = async (isApproved: number) => {
    if (mutationPending.current) return;
    mutationPending.current = true;
    try {
      await updateOrder({
        id: order.id, amount: order.amount, shipmentDate: order.shipmentDate, isApproved,
      }).unwrap();
    } catch {
      Alert.alert(turkishStrings.main.warning, turkishStrings.errors.somethingHappened);
    } finally {
      mutationPending.current = false;
    }
  };

  const displayConfirmation = (status: "approve" | "reject" | "hold") => {
    if (mutationPending.current) return;
    Alert.alert(
      turkishStrings.main.warning,
      "Siparişin durumunu değiştirmek istediğinize emin misiniz?",
      [
        {
          text: turkishStrings.main.yes,
          style: "default",
          onPress: () => changeStatus(status === "approve" ? 1 : status === "reject" ? -1 : 0),
        },
        { text: turkishStrings.main.no, style: "cancel" },
      ],
    );
  };

  const renderButtons = () => {
    if (order.isApproved === 0) {
      return (
        <>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("approve")}
            disabled={isLoading}
            color={Colors.green}
          >
            {turkishStrings.main.approve}
          </PrimaryButton>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("reject")}
            disabled={isLoading}
            color={Colors.red}
          >
            {turkishStrings.main.cancel}
          </PrimaryButton>
        </>
      );
    } else if (order.isApproved === 1) {
      return (
        <>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("hold")}
            disabled={isLoading}
            color={Colors.blue}
          >
            {turkishStrings.orders.putOnHold}
          </PrimaryButton>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("reject")}
            disabled={isLoading}
            color={Colors.red}
          >
            {turkishStrings.main.cancel}
          </PrimaryButton>
        </>
      );
    } else {
      return (
        <>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("hold")}
            disabled={isLoading}
            color={Colors.blue}
          >
            {turkishStrings.orders.putOnHold}
          </PrimaryButton>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("approve")}
            disabled={isLoading}
            color={Colors.green}
          >
            {turkishStrings.main.approve}
          </PrimaryButton>
        </>
      );
    }
  };
  return (
    <Card>
      <OrderCardTitle isApproved={order.isApproved} />
      <View style={styles.infoContainer}>
        <LabeledView label={turkishStrings.plans.headerRecipeName}>
          <Text
            style={styles.infoText}
            adjustsFontSizeToFit={recipe.recipeName.length < 20}
            numberOfLines={1}
          >
            {recipe.recipeName} R:{recipe.revisionNo}
          </Text>
        </LabeledView>
        <LabeledView label={turkishStrings.orders.amount}>
          <Text style={styles.infoText}>{order.amount + " Ton"}</Text>
        </LabeledView>
      </View>
      <LabeledView label={turkishStrings.main.customer}>
        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.infoText}>
          {customer.customerName}
        </Text>
      </LabeledView>
      <LabeledView label={turkishStrings.orders.shipmentDate}>
        <Text style={styles.infoText}>
          {shipmentDate && isValid(shipmentDate)
            ? `${format(shipmentDate, "dd/MMMM/yyyy", { locale: tr })} (${formatDistanceToNowStrict(shipmentDate, {
                unit: "day", addSuffix: true, locale: tr,
              })})`
            : "Tarih belirtilmedi"}
        </Text>
      </LabeledView>
      <View style={styles.buttonContainer}>
        <PrimaryButton style={styles.button} onPress={onPress} disabled={isLoading}>
          {turkishStrings.main.edit}
        </PrimaryButton>
        {renderButtons()}
      </View>
    </Card>
  );
};

export default React.memo(OrderCard);

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    margin: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
  },
});
