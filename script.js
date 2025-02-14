import { app } from "./firebase_config.js";

import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";
const db = getFirestore(app);
const collectionName = "recipies";

console.log("db", db);

// Select DOM elements
const recipeForm = document.getElementById("recipe-form");
const recipeNameInput = document.getElementById("recipe-name");
const ingredientsInput = document.getElementById("ingredients");
const instructionsInput = document.getElementById("instructions");
const recipesList = document.getElementById("recipes-list");

// Load saved recipes from localStorage
async function loadRecipes() {
  console.log("Loading recipies");
  const recipiesCollection = collection(db, collectionName);
  const recipiesSnapshot = await getDocs(recipiesCollection);
  const recipiesList = recipiesSnapshot.docs.map((doc) => doc.data());
  console.log("Loaded recipies: ", recipiesList);
  return recipiesList;
}

// Create a new recipe card
function createRecipeCard(recipe) {
  const recipeCard = document.createElement("div");
  recipeCard.classList.add("recipe-card");
  recipeCard.innerHTML = `
    <h3>${recipe.name}</h3>
    <h4>Ingredients:</h4>
    <p>${recipe.ingredients}</p>
    <h4>Instructions:</h4>
    <p>${recipe.instructions}</p>
    <button class="edit-btn">Edit</button>
    <button class="delete-btn">Delete</button>
  `;

  const editButton = recipeCard.querySelector(".edit-btn");
  editButton.addEventListener("click", () => {
    recipeNameInput.value = recipe.name;
    ingredientsInput.value = recipe.ingredients;
    instructionsInput.value = recipe.instructions;
  });

  const deleteButton = recipeCard.querySelector(".delete-btn");
  deleteButton.addEventListener("click", () => deleteRecipe(recipe.name));

  recipesList.appendChild(recipeCard);
}

// Save a new recipe
async function saveRecipe(event) {
  event.preventDefault();

  // Create the recipe object
  let recipeName = recipeNameInput.value;
  const recipe = {
    name: recipeName,
    ingredients: ingredientsInput.value,
    instructions: instructionsInput.value,
  };

  await setDoc(doc(db, collectionName, recipeName), recipe);

  // Clear form fields
  recipeNameInput.value = "";
  ingredientsInput.value = "";
  instructionsInput.value = "";

  // Reload the recipes list
  let recipies = await loadRecipes();
  await renderRecipies(recipies);
}

async function deleteRecipe(recipeName) {
  try {
    await deleteDoc(doc(db, collectionName, recipeName));
    console.log(`Recipe ${recipeName} deleted`);

    // Reload the recipes list after deletion
    let recipies = await loadRecipes();
    await renderRecipies(recipies);
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
}

async function renderRecipies(recipies) {
  recipesList.innerHTML = ""; // Clear current list
  recipies.forEach((recipe) => {
    createRecipeCard(recipe);
  });
}

// Event listener for form submission
recipeForm.addEventListener("submit", saveRecipe);

// Initial load of recipes
let recipies = await loadRecipes();
await renderRecipies(recipies);
