import { useLayoutEffect } from "react";
import { Alert, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Main";
import { turkishStrings } from "../../constants/strings";
import IconButton from "../../components/shared/IconButton";
import {
  useAddOrderMutation,
  useAddPlanMutation,
  useDeleteOrderMutation,
  useDeletePlanMutation,
  useGetCustomersQuery,
  useGetRecipesQuery,
  useUpdateOrderMutation,
  useUpdatePlanMutation,
} from "../../store/slices/apiSlice";
import { Order, OrderData, Plan, PlanData } from "../../constants/types";
import PlanInputFormTitle from "../../components/plan/PlanInputFormTitle";
import EntityInputForm from "../../components/shared/EntityInputForm";

// Create a type that unions the two possible route param types
type EntityInputScreenProps =
  | NativeStackScreenProps<RootStackParamList, "OrderInputScreen">
  | NativeStackScreenProps<RootStackParamList, "PlanInputScreen">;

const EntityInputScreen = ({ route, navigation }: EntityInputScreenProps) => {
  // Determine entity type based on the route name
  const entityType = route.name === "OrderInputScreen" ? "order" : "plan";

  // Safely access the current entity based on the entity type
  const currentEntity =
    entityType === "order"
      ? (route.params as { order?: Order })?.order || null
      : (route.params as { plan?: Plan })?.plan || null;

  useLayoutEffect(() => {
    if (currentEntity) {
      navigation.setOptions({
        title: turkishStrings.main.edit,
        headerRight: () => {
          return <IconButton onPress={onDelete} icon={"delete"} color={"white"} size={28} />;
        },
      });
    } else {
      const title =
        entityType === "order"
          ? turkishStrings.orders.addNewOrder
          : turkishStrings.plans.addNewPlan;

      navigation.setOptions({
        title: title,
      });
    }
  }, [navigation, currentEntity, entityType]);

  const {
    data: recipes = [],
    isLoading: isRecipesLoading,
    isError: isRecipesErr,
  } = useGetRecipesQuery();
  const {
    data: customers = [],
    isLoading: isCustomersLoading,
    isError: isCustomersErr,
  } = useGetCustomersQuery();

  // Order mutations
  const [addOrder, { isLoading: isAddingOrder }] = useAddOrderMutation();
  const [updateOrder, { isLoading: isUpdatingOrder }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeletingOrder }] = useDeleteOrderMutation();

  // Plan mutations
  const [addPlan, { isLoading: isAddingPlan }] = useAddPlanMutation();
  const [updatePlan, { isLoading: isUpdatingPlan }] = useUpdatePlanMutation();
  const [deletePlan, { isLoading: isDeletingPlan }] = useDeletePlanMutation();

  // Calculate overall status
  const loadingStates = {
    isLoading: isRecipesLoading || isCustomersLoading,
    isMutating:
      entityType === "order"
        ? isAddingOrder || isUpdatingOrder || isDeletingOrder
        : isAddingPlan || isUpdatingPlan || isDeletingPlan,
    isError: isCustomersErr || isRecipesErr,
  };

  const displayError = (err: string) => {
    Alert.alert(turkishStrings.main.warning, err, [
      { text: turkishStrings.main.ok, style: "default" },
    ]);
  };

  const onDelete = () => {
    const message = "Bu öğeyi silmek istediğinize emin misiniz?";

    Alert.alert(turkishStrings.main.warning, message, [
      {
        text: turkishStrings.main.yes,
        style: "default",
        onPress: handleDelete,
      },
      { text: turkishStrings.main.no, style: "cancel" },
    ]);
  };

  const handleDelete = async () => {
    if (!currentEntity) return;

    try {
      if (entityType === "order") {
        await deleteOrder((currentEntity as Order).id).unwrap();
      } else {
        await deletePlan((currentEntity as Plan).id).unwrap();
      }
      navigation.goBack();
    } catch (err: any) {
      if (err.data && err.data.message) {
        displayError(`${err.data.message} (${err.data.statusCode || "Bir şey oldu"})`);
      } else {
        displayError("Bir şey oldu");
      }
    }
  };

  const handleSubmit = async (entityData: OrderData | PlanData) => {
    try {
      if (entityType === "order") {
        if (currentEntity) {
          await updateOrder({
            id: (currentEntity as Order).id,
            ...entityData,
          }).unwrap();
        } else {
          await addOrder(entityData as OrderData).unwrap();
        }
      } else {
        if (currentEntity) {
          await updatePlan({
            id: (currentEntity as Plan).id,
            ...entityData,
          }).unwrap();
        } else {
          await addPlan(entityData as PlanData).unwrap();
        }
      }
      navigation.goBack();
    } catch (err: any) {
      if (err.data && err.data.message) {
        displayError(`${err.data.message} (${err.data.statusCode || "Bir şey oldu"})`);
      } else {
        displayError("Bir şey oldu");
      }
    }
  };

  let formTitle = null;
  if (entityType === "plan" && currentEntity) {
    formTitle = <PlanInputFormTitle plan={currentEntity as Plan} />;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        {formTitle}
        <EntityInputForm
          entityType={entityType}
          currentEntity={currentEntity}
          customers={customers}
          recipes={recipes.filter((recipe) => recipe.isActive)}
          submitHandler={handleSubmit}
          loadingStates={loadingStates}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default EntityInputScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
