import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
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
import { Order, Plan } from "../../constants/types";
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
    data: orders = [],
    isLoading: isOrdersLoading,
    isFetching: isOrdersFetching,
    isError: isOrdersErr,
    refetch: refetchOrders,
  } = useGetOrdersQuery(undefined, { skip: !isOrderScreen });

  const {
    data: plans = [],
    isLoading: isPlansLoading,
    isFetching: isPlansFetching,
    isError: isPlansErr,
    refetch: refetchPlans,
  } = useGetPlansQuery(undefined, { skip: !isPlanScreen });

  const {
    data: recipes = [],
    isLoading: isRecipesLoading,
    isFetching: isRecipesFetching,
    isError: isRecipesErr,
    refetch: refetchRecipes,
  } = useGetRecipesQuery();

  const {
    data: customers = [],
    isLoading: isCustomersLoading,
    isFetching: isCustomersFetching,
    isError: isCustomersErr,
    refetch: refetchCustomers,
  } = useGetCustomersQuery();

  const data: boolean = !!orders && !!plans && !!recipes && !!customers;

  // Calculate overall status
  const entityLoading = entityType === "order" ? isOrdersLoading : isPlansLoading;
  const entityFetching = entityType === "order" ? isOrdersFetching : isPlansFetching;
  const entityError = entityType === "order" ? isOrdersErr : isPlansErr;

  const isLoading = isRecipesLoading || isCustomersLoading || entityLoading;
  const isFetching = isRecipesFetching || isCustomersFetching || entityFetching;
  const isErr = entityError || isCustomersErr || isRecipesErr;

  let content = null;

  if (isLoading && !data) {
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

  if (!isLoading && !isErr && data) {
    // Filter data based on entity type and status
    let data: (Order | Plan)[] = [];

    if (entityType === "order" && orderStatus !== undefined) {
      data = orders.filter((order: Order) => order.isApproved === orderStatus);
    } else if (entityType === "plan" && planStatus !== undefined) {
      data = plans.filter((plan: Plan) => plan.inBuffer === planStatus);
    }

    // Navigate to appropriate input screen with type assertion
    const navigateToInputScreen = (entity: Order | Plan) => {
      if (entityType === "order") {
        const parent = navigation.getParent();
        // Use type assertion to ensure TypeScript knows we're passing correct params
        parent?.navigate("OrderInputScreen" as never, { order: entity as Order } as never);
      } else {
        const parent = navigation.getParent();
        // Use type assertion to ensure TypeScript knows we're passing correct params
        parent?.navigate("PlanInputScreen" as never, { plan: entity as Plan } as never);
      }
    };

    // Render function for list items
    const renderEntityItem = (itemData: { item: Order | Plan }) => {
      const entity = itemData.item;
      const recipe = recipes.find((item) => item.id === entity.recipeId);
      const customer = customers.find((item) => item.id === entity.customerId);

      if (recipe && customer) {
        if (entityType === "order") {
          return (
            <OrderCard
              order={entity as Order}
              recipe={recipe}
              customer={customer}
              onPress={() => navigateToInputScreen(entity)}
            />
          );
        } else {
          const plan = entity as Plan;
          if (plan.currentBatch > 0) {
            return (
              <PlanCardActive
                plan={plan}
                recipe={recipe}
                customer={customer}
                onPress={() => navigateToInputScreen(entity)}
              />
            );
          }
          return (
            <PlanCard
              plan={plan}
              recipe={recipe}
              customer={customer}
              onPress={() => navigateToInputScreen(entity)}
            />
          );
        }
      }

      return <Text>Error with {entity.id}</Text>;
    };

    content = (
      <>
        {entityType === "plan" && <PlansHeader />}
        <FlatList
          data={data}
          style={{ width: "100%" }}
          refreshing={isFetching}
          onRefresh={onRefresh}
          initialNumToRender={15}
          maxToRenderPerBatch={5}
          keyExtractor={(item: Order | Plan) => item.id.toString()}
          renderItem={renderEntityItem}
        />
      </>
    );
  }

  return <View style={styles.container}>{content}</View>;
};

export default EntityListScreen;

const styles = StyleSheet.create({
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
