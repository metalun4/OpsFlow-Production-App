import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { useGetCustomersQuery, useGetRecipesQuery } from "../../store/slices/apiSlice";
import { Recipe } from "../../constants/types";
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

const RecipesScreen = ({ route }: RecipesScreenProps) => {
  const isActive = route.params.active;

  const {
    data: recipes = [],
    isLoading: isRecipesLoading,
    isFetching: isRecipesFetching,
    isError: isRecipesErr,
    refetch: refetchRecipes,
    error: recipeErr,
  } = useGetRecipesQuery();
  const {
    data: customers = [],
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
    const errorObj = recipeErr as { error: string; status: string };
    Alert.alert("Debug", `${errorObj.error} | Status: ${errorObj.status}`);
    content = (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{turkishStrings.errors.somethingHappened}</Text>
        <PrimaryButton onPress={onRefresh} variant="filled" style={styles.retryButton}>
          {turkishStrings.main.retry}
        </PrimaryButton>
      </View>
    );
  }

  const filteredRecipes = recipes.filter((r) => r.isActive === isActive);

  const renderRecipe = (itemData: { item: Recipe }) => {
    const recipe = itemData.item;
    const belongsTo = customers.find((c) => c.id === recipe.customerId);

    return <RecipeCard recipe={recipe} customer={belongsTo} />;
  };

  if (!isLoading && !isErr) {
    content = (
      <FlatList
        data={isActive ? filteredRecipes : recipes}
        style={{ width: "100%" }}
        refreshing={isFetching}
        onRefresh={onRefresh}
        renderItem={renderRecipe}
        initialNumToRender={15}
        maxToRenderPerBatch={5}
        keyExtractor={(item: Recipe) => item.id.toString()}
      />
    );
  }

  return <View style={styles.container}>{content}</View>;
};

export default RecipesScreen;

const styles = StyleSheet.create({
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
