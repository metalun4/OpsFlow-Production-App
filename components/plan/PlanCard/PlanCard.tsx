import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Customer, Plan, Recipe } from "../../../constants/types";
import PrimaryButton from "../../shared/PrimaryButton";
import LabeledView from "../../shared/LabeledView";
import { turkishStrings } from "../../../constants/strings";
import PlanCardTitle from "./PlanCardTitle";
import Card from "../../shared/Card";

export type PlanCardProps = {
  plan: Plan;
  recipe: Recipe;
  customer: Customer;
  onPress: () => void;
};

const PlanCard = ({ plan, recipe, customer, onPress }: PlanCardProps) => {
  return (
    <Card>
      <PlanCardTitle
        batchId={plan.id}
        recipeName={recipe.recipeName}
        batchCount={plan.batchCount}
        revisionNo={recipe.revisionNo}
      />
      <View style={styles.infoContainer}>
        <LabeledView label={turkishStrings.main.customer}>
          <Text
            adjustsFontSizeToFit={customer.customerName.length < 20}
            numberOfLines={1}
            style={styles.infoText}
          >
            {customer.customerName}
          </Text>
        </LabeledView>
        <LabeledView label={turkishStrings.plans.multiplier}>
          <Text style={styles.infoText}>{plan.multiplier}</Text>
        </LabeledView>
      </View>
      <View style={styles.buttonContainer}>
        <PrimaryButton style={styles.fullWidthButton} onPress={onPress}>
          {turkishStrings.main.edit}
        </PrimaryButton>
      </View>
    </Card>
  );
};

export default React.memo(PlanCard);

const styles = StyleSheet.create({
  infoContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    width: "100%",
  },
  infoText: {
    textAlign: "center",
    fontSize: 16,
    margin: 8,
  },
  fullWidthButton: {
    alignSelf: "stretch",
  },
});
