export interface Plan {
  id: number;
  batchCount: number;
  multiplier: number;
  recipeId: number;
  customerId: number;
  inBuffer: boolean;
  currentBatch: number;
}

export interface PlanData {
  batchCount: number;
  multiplier: number;
  recipeId: number;
  customerId: number;
}

export interface Order {
  id: number;
  amount: number;
  shipmentDate: Date | null;
  isApproved: number;
  customerId: number;
  recipeId: number;
}

export interface OrderData {
  amount: number;
  shipmentDate: Date | null;
  isApproved?: number;
  customerId: number;
  recipeId: number;
}

export interface Customer {
  id: number;
  customerName: string;
  customerCode: string;
}

export interface RawMaterial {
  id: number;
  materialName: string;
  code: string;
}

export interface Recipe {
  id: number;
  recipeName: string;
  recipeCode: string;
  revisionNo: number;
  customerId: number;
  isActive: boolean;
  totalWeight: number;
  fatCoatingAmount: number;
  molassesAmount: number;
  vinasseAmount: number;

  // Group 1 ingredients
  tn1IdA1: number;
  tn1AmountA1: number;
  tn1IdA2: number;
  tn1AmountA2: number;
  tn1IdA3: number;
  tn1AmountA3: number;
  tn1IdA4: number;
  tn1AmountA4: number;
  tn1IdA5: number;
  tn1AmountA5: number;
  tn1IdA6: number;
  tn1AmountA6: number;
  tn1IdA7: number;
  tn1AmountA7: number;
  tn1IdA8: number;
  tn1AmountA8: number;
  tn1IdA9: number;
  tn1AmountA9: number;
  tn1IdA10: number;
  tn1AmountA10: number;
  tn1IdA11: number;
  tn1AmountA11: number;
  tn1IdA12: number;
  tn1AmountA12: number;
  tn1IdA13: number;
  tn1AmountA13: number;
  tn1IdA14: number;
  tn1AmountA14: number;

  // Group 2 ingredients
  tn2IdA1: number;
  tn2AmountA1: number;
  tn2IdA2: number;
  tn2AmountA2: number;
  tn2IdA3: number;
  tn2AmountA3: number;
  tn2IdA4: number;
  tn2AmountA4: number;
  tn2IdA5: number;
  tn2AmountA5: number;
  tn2IdA6: number;
  tn2AmountA6: number;
  tn2IdA7: number;
  tn2AmountA7: number;
  tn2IdA8: number;
  tn2AmountA8: number;

  // Group 3 ingredients
  tn3IdA1: number;
  tn3AmountA1: number;
  tn3IdA2: number;
  tn3AmountA2: number;
  tn3IdA3: number;
  tn3AmountA3: number;

  // Group 4 ingredients
  tn4IdA1: number;
  tn4AmountA1: number;
  tn4IdA2: number;
  tn4AmountA2: number;
  tn4IdA3: number;
  tn4AmountA3: number;
  tn4IdA4: number;
  tn4AmountA4: number;
  tn4IdA5: number;
  tn4AmountA5: number;
  tn4IdA6: number;
  tn4AmountA6: number;
  tn4IdA7: number;
  tn4AmountA7: number;
  tn4IdA8: number;
  tn4AmountA8: number;
  tn4IdA9: number;
  tn4AmountA9: number;
  tn4IdA10: number;
  tn4AmountA10: number;
  tn4IdA11: number;
  tn4AmountA11: number;
  tn4IdA12: number;
  tn4AmountA12: number;

  // Group 5 ingredients
  tn5IdA1: number;
  tn5AmountA1: number;
  tn5IdA2: number;
  tn5AmountA2: number;
  tn5IdA3: number;
  tn5AmountA3: number;
  tn5IdA4: number;
  tn5AmountA4: number;
  tn5IdA5: number;
  tn5AmountA5: number;
  tn5IdA6: number;
  tn5AmountA6: number;
  tn5IdA7: number;
  tn5AmountA7: number;
  tn5IdA8: number;
  tn5AmountA8: number;
  tn5IdA9: number;
  tn5AmountA9: number;
  tn5IdA10: number;
  tn5AmountA10: number;
  tn5IdA11: number;
  tn5AmountA11: number;
  tn5IdA12: number;
  tn5AmountA12: number;

  // Kilogram ingredients
  kgIdA1: number;
  kgAmountA1: number;
  kgIdA2: number;
  kgAmountA2: number;
  kgIdA3: number;
  kgAmountA3: number;
  kgIdA4: number;
  kgAmountA4: number;
  kgIdA5: number;
  kgAmountA5: number;
  kgIdA6: number;
  kgAmountA6: number;
  kgIdA7: number;
  kgAmountA7: number;
  kgIdA8: number;
  kgAmountA8: number;
  kgIdA9: number;
  kgAmountA9: number;
  kgIdA10: number;
  kgAmountA10: number;

  // Group 10 ingredients
  tn10IdA1: number;
  tn10AmountA1: number;
  tn10IdA2: number;
  tn10AmountA2: number;
  tn10IdA3: number;
  tn10AmountA3: number;
  tn10IdA4: number;
  tn10AmountA4: number;
  tn10IdA5: number;
  tn10AmountA5: number;
  tn10IdA6: number;
  tn10AmountA6: number;
  tn10IdA7: number;
  tn10AmountA7: number;
  tn10IdA8: number;
  tn10AmountA8: number;
  tn10IdA9: number;
  tn10AmountA9: number;
  tn10IdA10: number;
  tn10AmountA10: number;
  tn10IdA11: number;
  tn10AmountA11: number;
  tn10IdA12: number;
  tn10AmountA12: number;
  tn10IdA13: number | null;
  tn10AmountA13: number | null;
  tn10IdA14: number | null;
  tn10AmountA14: number | null;

  // Group 12 ingredients
  tn12IdA1: number;
  tn12AmountA1: number;
  tn12IdA2: number;
  tn12AmountA2: number;
  tn12IdA3: number;
  tn12AmountA3: number;
  tn12IdA4: number;
  tn12AmountA4: number;
  tn12IdA5: number;
  tn12AmountA5: number;
  tn12IdA6: number;
  tn12AmountA6: number;
  tn12IdA7: number;
  tn12AmountA7: number;
  tn12IdA8: number;
  tn12AmountA8: number;
  tn12IdA9: number;
  tn12AmountA9: number;
  tn12IdA10: number;
  tn12AmountA10: number;

  // Additives
  additive1Amount: number;
  additive2Amount: number;
  additive3Amount: number;
  additive4Amount: number;
  additive5Amount: number;

  // Raw materials for ingredients
  tn1RawMaterialA1?: RawMaterial;
  tn1RawMaterialA2?: RawMaterial;
  tn1RawMaterialA3?: RawMaterial;
  tn1RawMaterialA4?: RawMaterial;
  tn1RawMaterialA5?: RawMaterial;
  tn1RawMaterialA6?: RawMaterial;
  tn1RawMaterialA7?: RawMaterial;
  tn1RawMaterialA8?: RawMaterial;
  tn2RawMaterialA1?: RawMaterial;
  tn2RawMaterialA2?: RawMaterial;
  tn2RawMaterialA3?: RawMaterial;
  tn2RawMaterialA4?: RawMaterial;
  tn2RawMaterialA5?: RawMaterial;
  tn3RawMaterialA1?: RawMaterial;
  tn4RawMaterialA1?: RawMaterial;
  tn4RawMaterialA2?: RawMaterial;
  tn5RawMaterialA1?: RawMaterial;
  tn5RawMaterialA2?: RawMaterial;
  tn10RawMaterialA1?: RawMaterial;
  // Add other raw materials as needed
}
