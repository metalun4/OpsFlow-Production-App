import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { NavigationProp, ParamListBase, useNavigation } from "@react-navigation/native";
import { Colors } from "../../constants/colors";
import { turkishStrings } from "../../constants/strings";
import { Customer, Order, OrderData, Plan, PlanData, Recipe } from "../../constants/types";
import LabeledView from "./LabeledView";
import DateDropdown from "./DateDropdown";
import Dropdown from "./Dropdown";
import PrimaryButton from "./PrimaryButton";
import RecipeDetails from "../recipe/RecipeDetails/RecipeDetails";

type EntityInputFormProps = {
  entityType: "order" | "plan";
  currentEntity: Order | Plan | null;
  submitHandler: (entityData: OrderData | PlanData) => Promise<void>;
  recipes: Recipe[];
  customers: Customer[];
  loadingStates: {
    isLoading: boolean;
    isMutating: boolean;
    isError: boolean;
  };
};

const EntityInputForm = ({
  entityType,
  currentEntity,
  submitHandler,
  recipes,
  customers,
  loadingStates,
}: EntityInputFormProps) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const today = new Date();
  const tomorrow = new Date(+today + 86400000);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  // Order-specific state
  const [orderAmount, setOrderAmount] = useState<string>(
    entityType === "order" ? (currentEntity as Order)?.amount?.toString() || "1" : "1",
  );
  const [shipmentDate, setShipmentDate] = useState<Date>(
    entityType === "order"
      ? new Date((currentEntity as Order)?.shipmentDate || +new Date() + 86400000)
      : tomorrow,
  );

  // Plan-specific state
  const [batchCount, setBatchCount] = useState<string>(
    entityType === "plan" ? (currentEntity as Plan)?.batchCount?.toString() || "1" : "1",
  );
  const [multiplier, setMultiplier] = useState<string>(
    entityType === "plan" ? (currentEntity as Plan)?.multiplier?.toString() || "1.00" : "1.00",
  );

  // Filter recipes based on selected customer
  const filteredRecipes = selectedCustomer
    ? recipes.filter((recipe) => recipe.customerId === selectedCustomer.id)
    : recipes;

  // Effect for entity initialization and dependency tracking
  useEffect(() => {
    if (!currentEntity || recipes.length === 0 || customers.length === 0) {
      return;
    }

    const foundRecipe = recipes.find((r) => r.id === currentEntity.recipeId);
    const foundCustomer = customers.find((c) => c.id === currentEntity.customerId);

    if (foundRecipe && (!selectedRecipe || selectedRecipe.id !== foundRecipe.id)) {
      setSelectedRecipe(foundRecipe);
    }

    if (foundCustomer && (!selectedCustomer || selectedCustomer.id !== foundCustomer.id)) {
      setSelectedCustomer(foundCustomer);
    }
  }, [
    currentEntity?.recipeId,
    currentEntity?.customerId,
    recipes,
    customers,
    selectedRecipe?.id,
    selectedCustomer?.id,
  ]);

  // Reset selected recipe when customer changes
  useEffect(() => {
    if (!selectedCustomer) {
      setSelectedRecipe(null);
    }
    if (selectedRecipe && selectedCustomer && selectedRecipe.customerId !== selectedCustomer.id) {
      setSelectedRecipe(null);
    }
  }, [selectedCustomer, selectedRecipe]);

  // Parse input values
  const parsedAmount = parseInt(orderAmount);
  const parsedBatchCount = parseInt(batchCount);
  const parsedMultiplier = parseFloat(multiplier);

  // Input validation
  const validateInputs = React.useCallback(() => {
    const errors = [];

    if (!selectedCustomer) {
      errors.push("Müşteri seçilmedi");
    }

    if (!selectedRecipe) {
      errors.push("Reçete seçilmedi");
    }

    if (entityType === "order") {
      if (isNaN(parsedAmount) || parsedAmount < 1 || parsedAmount > 99999) {
        errors.push("Miktar 1 ile 99999 ton arasında olmalı");
      }
    } else {
      if (isNaN(parsedBatchCount) || parsedBatchCount < 1 || parsedBatchCount > 99999) {
        errors.push("Batch sayısı 1 ile 99999 arasında olmalı");
      }

      if (
        isNaN(parsedMultiplier) ||
        multiplier.length > 5 ||
        parsedMultiplier <= 0 ||
        parsedMultiplier > 99999.99
      ) {
        errors.push("Çarpan 0'dan büyük veya 99999.9'dan küçük olmalı");
      }
    }

    if (errors.length > 0) {
      Alert.alert(turkishStrings.main.warning, errors.join("\n"), [
        { text: turkishStrings.main.ok, style: "default" },
      ]);
      return false;
    }

    return true;
  }, [
    entityType,
    selectedCustomer,
    selectedRecipe,
    parsedAmount,
    parsedBatchCount,
    parsedMultiplier,
    multiplier,
  ]);

  // Save handler
  const onSave = () => {
    if (!validateInputs()) {
      return;
    }

    let entityData: OrderData | PlanData;

    if (entityType === "order") {
      entityData = {
        amount: parsedAmount,
        shipmentDate: shipmentDate,
        recipeId: selectedRecipe!.id,
        customerId: selectedCustomer!.id,
      } as OrderData;
    } else {
      entityData = {
        batchCount: parsedBatchCount,
        multiplier: parsedMultiplier,
        recipeId: selectedRecipe!.id,
        customerId: selectedCustomer!.id,
      } as PlanData;
    }

    const warningMessage = currentEntity
      ? "Değişiklikleri kaydetmek istediğinize emin misiniz?"
      : "Yeni öğeyi eklemek istediğinize emin misiniz?";

    Alert.alert(
      turkishStrings.main.warning,
      warningMessage,
      [
        {
          text: turkishStrings.main.yes,
          style: "default",
          onPress: () => submitHandler(entityData),
        },
        { text: turkishStrings.main.no, style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  // Cancel handler
  const onCancel = () => {
    Alert.alert(
      turkishStrings.main.warning,
      "Bu işlemi iptal etmek istediğinize emin misiniz?",
      [
        { text: turkishStrings.main.yes, style: "default", onPress: navigation.goBack },
        { text: turkishStrings.main.no, style: "cancel" },
      ],
      { cancelable: true },
    );
  };

  // Render order-specific input fields
  const renderOrderFields = () => (
    <View style={styles.rowContainer}>
      <LabeledView
        label={turkishStrings.orders.amount}
        contentPadding={0}
        centerContent={false}
        accessibilityLabel={`${turkishStrings.orders.amount} input field`}
        testID="order-amount-input"
      >
        <TextInput
          style={styles.numberInput}
          inputMode={"numeric"}
          value={orderAmount}
          placeholder={"1"}
          onChangeText={setOrderAmount}
        />
      </LabeledView>

      <DateDropdown
        title={turkishStrings.orders.shipmentDate}
        selectedDate={shipmentDate}
        handleSelect={setShipmentDate}
        minimumDate={tomorrow}
      />
    </View>
  );

  // Render plan-specific input fields
  const renderPlanFields = () => (
    <View style={styles.numberInputs}>
      <LabeledView
        label={turkishStrings.plans.batchCount}
        contentPadding={0}
        centerContent={false}
        accessibilityLabel={`${turkishStrings.plans.batchCount} input field`}
        testID="plan-batch-count-input"
      >
        <TextInput
          style={styles.numberInput}
          inputMode={"numeric"}
          value={batchCount}
          placeholder={"1"}
          onChangeText={setBatchCount}
        />
      </LabeledView>

      <LabeledView
        label={turkishStrings.plans.multiplier}
        contentPadding={0}
        centerContent={false}
        accessibilityLabel={`${turkishStrings.plans.multiplier} input field`}
        testID="plan-multiplier-input"
      >
        <TextInput
          style={styles.numberInput}
          inputMode={"decimal"}
          value={multiplier}
          placeholder={"1.00"}
          onChangeText={setMultiplier}
        />
      </LabeledView>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Dropdown
          title={turkishStrings.main.customer}
          items={customers}
          selectedItem={selectedCustomer}
          handleSelect={setSelectedCustomer}
          disabled={!!currentEntity || customers.length <= 0}
          buttonText={
            loadingStates.isLoading
              ? turkishStrings.main.loading
              : turkishStrings.main.select + "..."
          }
        />
        <Dropdown
          title={turkishStrings.main.recipe}
          items={filteredRecipes}
          selectedItem={selectedRecipe}
          handleSelect={setSelectedRecipe}
          disabled={!!currentEntity || !selectedCustomer || recipes.length <= 0}
          buttonText={
            loadingStates.isLoading
              ? turkishStrings.main.loading
              : turkishStrings.main.select + "..."
          }
        />
      </View>
      {entityType === "order" ? renderOrderFields() : null}
      {entityType === "plan" ? renderPlanFields() : null}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          onPress={onSave}
          color={Colors.green}
          disabled={loadingStates.isMutating || loadingStates.isLoading}
          style={styles.actionButton}
        >
          {currentEntity ? turkishStrings.main.save : turkishStrings.main.add}
        </PrimaryButton>
        <PrimaryButton
          onPress={onCancel}
          color={Colors.red}
          disabled={loadingStates.isMutating}
          style={styles.actionButton}
        >
          {turkishStrings.main.cancel}
        </PrimaryButton>
      </View>
      {selectedRecipe && (
        <View style={styles.detailsButtonContainer}>
          <PrimaryButton onPress={() => setIsDetailsVisible(true)} style={styles.detailsButton}>
            {turkishStrings.recipes.recipeDetails}
          </PrimaryButton>
        </View>
      )}
      {selectedRecipe && (
        <RecipeDetails
          recipeId={selectedRecipe.id}
          visible={isDetailsVisible}
          onClose={() => setIsDetailsVisible(false)}
        />
      )}
    </View>
  );
};

export default EntityInputForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    width: "100%",
    flexDirection: "row",
  },
  dropdownContainer: {
    height: 180,
  },
  numberInputs: {
    width: "100%",
    flexDirection: "row",
  },
  numberInput: {
    textAlign: "center",
    fontSize: 16,
    padding: 8,
    height: 50, // Consistent height with Dropdown components
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    margin: 4,
  },
  detailsButtonContainer: {
    width: "100%",
    marginTop: 8,
  },
  detailsButton: {
    alignSelf: "stretch",
  },
  recipeContainer: {
    marginBottom: 8,
  },
});
