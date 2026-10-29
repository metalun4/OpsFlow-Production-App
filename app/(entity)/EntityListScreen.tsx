import { memo, useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Main";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  useGetCustomersQuery,
  useGetOrdersQuery,
  useGetPlansQuery,
  useGetRecipesQuery,
} from "../../store/slices/apiSlice";
import { turkishStrings } from "../../constants/strings";
import PrimaryButton from "../../components/shared/PrimaryButton";
import { Colors } from "../../constants/colors";
import { Customer, Order, Plan, Recipe } from "../../constants/types";
import OrderCard from "../../components/order/OrderCard/OrderCard";
import PlanCard from "../../components/plan/PlanCard/PlanCard";
import PlansHeader from "../../components/plan/PlansHeader";
import { OrderTabsParamList } from "../(order)/OrdersTabs";
import { PlanTabsParamList } from "../(plan)/PlansTabs";
import PlanCardActive from "../../components/plan/PlanCard/PlanCardActive";

// Use a type that can represent either type of screen props
type EntityListScreenProps =
  | BottomTabScreenProps<
      OrderTabsParamList,
      "OrdersScreen" | "ApprovedOrdersScreen" | "CanceledOrdersScreen"
    >
  | BottomTabScreenProps<PlanTabsParamList, "PlansScreen" | "ActivePlansScreen">;

const EMPTY_ORDERS: Order[] = [];
const EMPTY_PLANS: Plan[] = [];
const EMPTY_RECIPES: Recipe[] = [];
const EMPTY_CUSTOMERS: Customer[] = [];
const entityKey = (entity: Order | Plan) => entity.id.toString();

const EntityListItem = memo(function EntityListItem({
  entity,
  recipe,
  customer,
  entityType,
  onEdit,
}: {
  entity: Order | Plan;
  recipe: Recipe | undefined;
  customer: Customer | undefined;
  entityType: "order" | "plan";
  onEdit: (entity: Order | Plan) => void;
}) {
  const onPress = useCallback(() => onEdit(entity), [onEdit, entity]);
  if (!recipe || !customer) return <Text>Error with {entity.id}</Text>;
  if (entityType === "order") {
    return <OrderCard order={entity as Order} recipe={recipe} customer={customer} onPress={onPress} />;
  }
  const plan = entity as Plan;
  return plan.currentBatch > 0 ? (
    <PlanCardActive plan={plan} recipe={recipe} customer={customer} onPress={onPress} />
  ) : (
    <PlanCard plan={plan} recipe={recipe} customer={customer} onPress={onPress} />
  );
});

const EntityListScreen = ({ navigation, route }: EntityListScreenProps) => {
  // Safely check route.params - use optional chaining and type assertions
  const params = route.params || {};

  // Determine entity type based on route params
  const isOrderScreen = params && "approved" in params;
  const isPlanScreen = params && "active" in params;

  const entityType = isOrderScreen ? "order" : "plan";

  // Get status params with type assertions
  const orderStatus = isOrderScreen ? (params as { approved: number }).approved : undefined;
  const planStatus = isPlanScreen ? (params as { active: boolean }).active : undefined;

  // Query data based on entity type
  const {
    data: orders = EMPTY_ORDERS,
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
    isError: isOrdersErr,
    refetch: refetchOrders,
  } = useGetOrdersQuery(undefined, { skip: !isOrderScreen });

  const {
    data: plans = EMPTY_PLANS,
    isLoading: isPlansLoading,
    isFetching: isPlansFetching,
    isError: isPlansErr,
    refetch: refetchPlans,
  } = useGetPlansQuery(undefined, { skip: !isPlanScreen });

  const {
    data: recipes = EMPTY_RECIPES,
    isLoading: isRecipesLoading,
    isFetching: isRecipesFetching,
    isError: isRecipesErr,
    refetch: refetchRecipes,
  } = useGetRecipesQuery();

  const {
    data: customers = EMPTY_CUSTOMERS,
    isLoading: isCustomersLoading,
    isFetching: isCustomersFetching,
    isError: isCustomersErr,
    refetch: refetchCustomers,
  } = useGetCustomersQuery();

  const recipeById = useMemo(() => new Map(recipes.map((recipe) => [recipe.id, recipe])), [recipes]);
  const customerById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers],
  );
  const filteredEntities = useMemo<(Order | Plan)[]>(
    () => entityType === "order"
      ? orders.filter((order) => order.isApproved === orderStatus)
      : plans.filter((plan) => plan.inBuffer === planStatus),
    [entityType, orders, plans, orderStatus, planStatus],
  );
  const navigateToInputScreen = useCallback(
    (entity: Order | Plan) => {
      const parent = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
      if (entityType === "order") {
        parent?.navigate("OrderInputScreen", { order: entity as Order });
      } else {
        parent?.navigate("PlanInputScreen", { plan: entity as Plan });
      }
    },
    [navigation, entityType],
  );
  const renderEntityItem = useCallback(({ item }: { item: Order | Plan }) => (
    <EntityListItem
      entity={item}
      entityType={entityType}
      recipe={recipeById.get(item.recipeId)}
      customer={customerById.get(item.customerId)}
      onEdit={navigateToInputScreen}
    />
  ), [entityType, recipeById, customerById, navigateToInputScreen]);

  // Calculate overall status
  const entityLoading = entityType === "order" ? isOrdersLoading : isPlansLoading;
  const entityFetching = entityType === "order" ? isOrdersFetching : isPlansFetching;
  const entityError = entityType === "order" ? isOrdersErr : isPlansErr;

  const isLoading = isRecipesLoading || isCustomersLoading || entityLoading;
  const isFetching = isRecipesFetching || isCustomersFetching || entityFetching;
  const isErr = entityError || isCustomersErr || isRecipesErr;

  let content = null;

  if (isLoading) {
    content = <ActivityIndicator size={"large"} color={Colors.d4} />;
  }

  const onRefresh = () => {
    if (isOrderScreen) {
      refetchOrders();
    } else {
      refetchPlans();
    }
    refetchRecipes();
    refetchCustomers();
  };

  if (isErr) {
    content = (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{turkishStrings.errors.somethingHappened}</Text>
        <PrimaryButton onPress={onRefresh} variant="filled" style={styles.retryButton}>
          {turkishStrings.main.retry}
        </PrimaryButton>
      </View>
    );
  }

  if (!isLoading && !isErr) {
    content = (
      <>
        {entityType === "plan" && <PlansHeader />}
        <FlatList
          data={filteredEntities}
          style={styles.list}
          refreshing={isFetching}
          onRefresh={onRefresh}
          initialNumToRender={15}
          maxToRenderPerBatch={5}
          keyExtractor={entityKey}
          renderItem={renderEntityItem}
        />
      </>
    );
  }

  return <View style={styles.container}>{content}</View>;
};

export default EntityListScreen;

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    padding: 16,
    alignItems: "center",
  },
  errorText: {
    marginBottom: 16,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  retryButton: {
    minWidth: 120,
  },
});
