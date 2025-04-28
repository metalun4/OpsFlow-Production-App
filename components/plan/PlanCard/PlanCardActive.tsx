import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Customer, Plan, Recipe } from "../../../constants/types";
import PrimaryButton from "../../shared/PrimaryButton";
import LabeledView from "../../shared/LabeledView";
import { turkishStrings } from "../../../constants/strings";
import PlanCardTitle from "./PlanCardTitle";
import Card from "../../shared/Card";
import PlanCardActiveHeader from "./PlanCardActiveHeader";
import { Colors } from "../../../constants/colors";

export type PlanCardActiveProps = {
  plan: Plan;
  recipe: Recipe;
  customer: Customer;
  onPress: () => void;
};

const PlanCardActive = ({ plan, recipe, customer, onPress }: PlanCardActiveProps) => {
  return (
    <Card style={{ padding: 0, borderColor: Colors.green, borderWidth: 8 }}>
      <PlanCardActiveHeader />
      <PlanCardTitle
        batchId={plan.id}
        recipeName={recipe.recipeName}
        batchCount={plan.batchCount}
        revisionNo={recipe.revisionNo}
      />
      <View style={styles.infoContainer}>
        <LabeledView label={turkishStrings.plans.activeBatch}>
          <Text style={styles.infoText}>{plan.currentBatch}</Text>
        </LabeledView>
        <LabeledView label={turkishStrings.plans.multiplier}>
          <Text style={styles.infoText}>{plan.multiplier}</Text>
        </LabeledView>
      </View>
      <LabeledView label={turkishStrings.main.customer}>
        <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.infoText}>
          {customer.customerName}
        </Text>
      </LabeledView>
      <View style={styles.buttonContainer}>
        <PrimaryButton style={styles.fullWidthButton} onPress={onPress}>
          {turkishStrings.main.edit}
        </PrimaryButton>
      </View>
    </Card>
  );
};

export default React.memo(PlanCardActive);

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
    marginVertical: 8,
  },
  fullWidthButton: {
    alignSelf: "stretch",
  },
});
