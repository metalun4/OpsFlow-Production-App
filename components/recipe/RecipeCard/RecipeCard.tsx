import React, { useState } from "react";
import Card from "../../shared/Card";
import { Customer, Recipe } from "../../../constants/types";
import LabeledView from "../../shared/LabeledView";
import { turkishStrings } from "../../../constants/strings";
import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "../../shared/PrimaryButton";
import RecipeDetails from "../RecipeDetails/RecipeDetails";
import RecipeCardTitle from "./RecipeCardTitle";

export type RecipeCardProps = {
  recipe: Recipe;
  customer: Customer | undefined;
};

const RecipeCard = ({ recipe, customer }: RecipeCardProps) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  return (
    <Card>
      <RecipeCardTitle
        revisionNo={recipe.revisionNo}
        recipeName={recipe.recipeName}
        isActive={recipe.isActive}
      />
      <View style={{ flexDirection: "row" }}>
        <LabeledView label={turkishStrings.main.customer}>
          <Text
            style={styles.infoText}
            adjustsFontSizeToFit={customer && customer.customerName.length < 20}
            numberOfLines={1}
          >
            {customer ? customer.customerName : "Müşteri Yok"}
          </Text>
        </LabeledView>
        <LabeledView label={turkishStrings.main.totalWeight}>
          <Text style={styles.infoText}>{recipe.totalWeight.toFixed(2)} kg</Text>
        </LabeledView>
      </View>
      <PrimaryButton onPress={() => setIsDetailsVisible(true)}>
        {turkishStrings.recipes.recipeDetails}
      </PrimaryButton>
      {isDetailsVisible && (
        <RecipeDetails
          recipeId={recipe.id}
          visible={isDetailsVisible}
          onClose={() => setIsDetailsVisible(false)}
        />
      )}
    </Card>
  );
};

export default React.memo(RecipeCard);

const styles = StyleSheet.create({
  infoText: {
    textAlign: "center",
    marginVertical: 8,
  },
});
