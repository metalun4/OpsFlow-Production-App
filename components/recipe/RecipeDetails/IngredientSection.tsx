import React from "react";
import { Recipe } from "../../../constants/types";
import ListSection from "../../shared/ListSection";

type IngredientSectionProps = {
  prefix: string;
  title: string;
  recipe: Recipe;
};

const IngredientSection = ({ prefix, title, recipe }: IngredientSectionProps) => {
  const ingredients = [];

  for (let i = 1; i <= 14; i++) {
    const idKey = `${prefix}IdA${i}` as keyof Recipe;
    const amountKey = `${prefix}AmountA${i}` as keyof Recipe;
    const rawMaterialKey = `${prefix}RawMaterialA${i}` as keyof Recipe;

    if (
      recipe[idKey] &&
      Number(recipe[idKey]) > 0 &&
      recipe[amountKey] &&
      Number(recipe[amountKey]) > 0
    ) {
      const rawMaterial = recipe[rawMaterialKey] as any;

      ingredients.push({
        id: recipe[idKey],
        amount: recipe[amountKey],
        name: rawMaterial?.materialName || `Material ${recipe[idKey]}`,
      });
    }
  }

  if (ingredients.length === 0) return null;
  return <ListSection title={title} list={ingredients} />;
};

export default IngredientSection;
