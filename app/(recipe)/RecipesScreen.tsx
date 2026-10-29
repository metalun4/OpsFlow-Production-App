import { useCallback, useMemo } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { useGetCustomersQuery, useGetRecipesQuery } from "../../store/slices/apiSlice";
import { Customer, Recipe } from "../../constants/types";
import RecipeCard from "../../components/recipe/RecipeCard/RecipeCard";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RecipeTabsParamList } from "./RecipesTabs";
import { Colors } from "../../constants/colors";
import { turkishStrings } from "../../constants/strings";
import PrimaryButton from "../../components/shared/PrimaryButton";

type RecipesScreenProps = BottomTabScreenProps<
  RecipeTabsParamList,
  "RecipesScreen" | "ActiveRecipesScreen"
>;

const EMPTY_RECIPES: Recipe[] = [];
const EMPTY_CUSTOMERS: Customer[] = [];
const recipeKey = (recipe: Recipe) => recipe.id.toString();

const RecipesScreen = ({ route }: RecipesScreenProps) => {
  const isActive = route.params.active;

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

  const isLoading = isRecipesLoading || isCustomersLoading;
  const isFetching = isRecipesFetching || isCustomersFetching;
  const isErr = isRecipesErr || isCustomersErr;

  let content = null;

  if (isLoading) {
    content = <ActivityIndicator size={"large"} color={Colors.d4} />;
  }

  const onRefresh = () => {
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

  const filteredRecipes = useMemo(
    () => isActive ? recipes.filter((recipe) => recipe.isActive) : recipes,
    [recipes, isActive],
  );
  const customerById = useMemo(
    () => new Map(customers.map((customer) => [customer.id, customer])),
    [customers],
  );

  const renderRecipe = useCallback((itemData: { item: Recipe }) => {
    const recipe = itemData.item;
    const belongsTo = customerById.get(recipe.customerId);

    return <RecipeCard recipe={recipe} customer={belongsTo} />;
  }, [customerById]);

  if (!isLoading && !isErr) {
    content = (
      <FlatList
        data={filteredRecipes}
        style={styles.list}
        refreshing={isFetching}
        onRefresh={onRefresh}
        renderItem={renderRecipe}
        initialNumToRender={15}
        maxToRenderPerBatch={5}
        keyExtractor={recipeKey}
      />
    );
  }

  return <View style={styles.container}>{content}</View>;
};

export default RecipesScreen;

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  container: {
    flex: 1,
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
