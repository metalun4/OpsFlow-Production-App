import React, { useEffect, useRef } from "react";
import { Animated, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../../constants/colors";
import { turkishStrings } from "../../../constants/strings";
import { useGetRecipeByIdQuery } from "../../../store/slices/apiSlice";
import IngredientSection from "./IngredientSection";
import ListSection from "../../shared/ListSection";
import PrimaryButton from "../../shared/PrimaryButton";

type RecipeDetailsProps = {
  recipeId: number;
  visible: boolean;
  onClose: () => void;
};

const RecipeDetails = ({ recipeId, visible, onClose }: RecipeDetailsProps) => {
  const { data: recipe } = useGetRecipeByIdQuery(recipeId, {
    // Only fetch when modal is visible
    skip: !visible,
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Start animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values if modal is reopened
      fadeAnim.setValue(0);
      slideAnim.setValue(300);

      // Start fade animation for background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Start slide animation for modal content
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, slideAnim]);

  // Handle closing with animation
  const handleClose = () => {
    // Fade out background
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    // Slide out modal
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  if (!recipe) return null;

  const sectionList = [
    { prefix: "tn1", title: "Tartım Noktası 1" },
    { prefix: "tn2", title: "Tartım Noktası 2" },
    { prefix: "tn3", title: "Tartım Noktası 3" },
    { prefix: "tn4", title: "Tartım Noktası 4" },
    { prefix: "tn5", title: "Tartım Noktası 5" },
    { prefix: "tn10", title: "Tartım Noktası 10" },
    { prefix: "tn12", title: "Tartım Noktası 12" },
    { prefix: "kg", title: "Kullanıcı Girdisi" },
  ];

  const additionalIngredients = [
    { name: turkishStrings.recipes.fatCoating, amount: recipe.fatCoatingAmount },
    { name: turkishStrings.recipes.molasses, amount: recipe.molassesAmount },
    { name: turkishStrings.recipes.vinasse, amount: recipe.vinasseAmount },
    { name: turkishStrings.recipes.additive + " 1", amount: recipe.additive1Amount },
    { name: turkishStrings.recipes.additive + " 2", amount: recipe.additive2Amount },
    { name: turkishStrings.recipes.additive + " 3", amount: recipe.additive3Amount },
    { name: turkishStrings.recipes.additive + " 4", amount: recipe.additive4Amount },
    { name: turkishStrings.recipes.additive + " 5", amount: recipe.additive5Amount },
  ];

  return (
    <Modal animationType="none" transparent={true} visible={visible} onRequestClose={handleClose}>
      <Animated.View
        style={[
          styles.centeredView,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.modalView,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.modalTitle}>
            {recipe.recipeName} ({recipe.recipeCode})
          </Text>

          <ScrollView style={styles.scrollView}>
            <View style={styles.detailsContainer}>
              <View style={styles.basicInfo}>
                <Text style={styles.infoText}>
                  {turkishStrings.main.recipe} ID: {recipe.id}
                </Text>
                <Text style={styles.infoText}>
                  {turkishStrings.recipes.revisionNo}: {recipe.revisionNo}
                </Text>
                <Text style={styles.infoText}>
                  {turkishStrings.main.totalWeight}: {recipe.totalWeight.toFixed(2)}
                </Text>
                <Text style={styles.infoText}>
                  {turkishStrings.main.status}: {recipe.isActive ? "Aktif" : "İnaktif"}
                </Text>
              </View>
              {sectionList.map((section, index) => (
                <IngredientSection
                  key={index}
                  prefix={section.prefix}
                  title={section.title}
                  recipe={recipe}
                />
              ))}
              <ListSection
                title={turkishStrings.recipes.additionalInfo}
                list={additionalIngredients}
              />
            </View>
          </ScrollView>

          <PrimaryButton onPress={handleClose} style={{ marginTop: 16 }}>
            {turkishStrings.main.close}
          </PrimaryButton>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default React.memo(RecipeDetails);

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  detailsContainer: {
    paddingBottom: 16,
  },
  basicInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: Colors.l4,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
  },
});
