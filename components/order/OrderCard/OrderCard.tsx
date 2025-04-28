import React from "react";
import Card from "../../shared/Card";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Customer, Order, OrderData, Recipe } from "../../../constants/types";
import LabeledView from "../../shared/LabeledView";
import { turkishStrings } from "../../../constants/strings";
import { format, formatDistanceToNowStrict } from "date-fns";
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
  const [updateOrder] = useUpdateOrderMutation();
  const orderData: OrderData = {
    amount: order.amount,
    shipmentDate: order.shipmentDate,
    recipeId: order.recipeId,
    customerId: order.customerId,
  };

  const displayConfirmation = (status: "approve" | "reject" | "hold") => {
    Alert.alert(
      turkishStrings.main.warning,
      "Siparişin durumunu değiştirmek istediğinize emin misiniz?",
      [
        {
          text: turkishStrings.main.yes,
          style: "default",
          onPress: () => {
            if (status === "approve") {
              approve();
            } else if (status === "reject") {
              reject();
            } else if (status === "hold") {
              putOnHold();
            }
          },
        },
        { text: turkishStrings.main.no, style: "cancel" },
      ],
    );
  };
  const approve = async () => {
    await updateOrder({
      id: order.id,
      ...orderData,
      isApproved: 1,
    });
  };
  const putOnHold = async () => {
    await updateOrder({
      id: order.id,
      ...orderData,
      isApproved: 0,
    });
  };
  const reject = async () => {
    await updateOrder({
      id: order.id,
      ...orderData,
      isApproved: -1,
    });
  };

  const renderButtons = () => {
    if (order.isApproved === 0) {
      return (
        <>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("approve")}
            color={Colors.green}
          >
            {turkishStrings.main.approve}
          </PrimaryButton>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("reject")}
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
            color={Colors.blue}
          >
            {turkishStrings.orders.putOnHold}
          </PrimaryButton>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("reject")}
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
            color={Colors.blue}
          >
            {turkishStrings.orders.putOnHold}
          </PrimaryButton>
          <PrimaryButton
            style={styles.button}
            onPress={() => displayConfirmation("approve")}
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
          {format(order.shipmentDate!, "dd/MMMM/yyyy", { locale: tr })} (
          {formatDistanceToNowStrict(order.shipmentDate!, {
            unit: "day",
            addSuffix: true,
            locale: tr,
          })}
          )
        </Text>
      </LabeledView>
      <View style={styles.buttonContainer}>
        <PrimaryButton style={styles.button} onPress={onPress}>
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
