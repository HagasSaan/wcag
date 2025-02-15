import { db, auth } from "./firebaseConfig.js";
import { user } from "./auth.js";
import {
  collection,
  getDocs,
  setDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore.js";

console.log("db initialized");

const recipeForm = document.getElementById("recipe-form");
const recipeNameInput = document.getElementById("recipe-name");
const ingredientsInput = document.getElementById("ingredients");
const instructionsInput = document.getElementById("instructions");
const recipesList = document.getElementById("recipes-list");

async function loadRecipes() {
  console.log("Loading recipies");
  const recipiesCollection = collection(db, `${user.uid}`);
  const recipiesSnapshot = await getDocs(recipiesCollection);
  const recipiesList = recipiesSnapshot.docs.map((doc) => doc.data());
  console.log("Loaded recipies: ", recipiesList);
  return recipiesList;
}

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
  recipeCard.tabIndex = 0;
  recipesList.appendChild(recipeCard);
}

async function saveRecipe(event) {
  event.preventDefault();

  let recipeName = recipeNameInput.value;
  const recipe = {
    name: recipeName,
    ingredients: ingredientsInput.value,
    instructions: instructionsInput.value,
  };

  await setDoc(doc(db, user.uid, recipeName), recipe);

  recipeNameInput.value = "";
  ingredientsInput.value = "";
  instructionsInput.value = "";

  let recipies = await loadRecipes();
  await renderRecipies(recipies);
}

async function deleteRecipe(recipeName) {
  try {
    await deleteDoc(doc(db, user.uid, recipeName));
    console.log(`Recipe ${recipeName} deleted`);
    let recipies = await loadRecipes();
    await renderRecipies(recipies);
  } catch (error) {
    console.error("Error deleting recipe:", error);
  }
}

async function renderRecipies(recipies) {
  recipesList.innerHTML = ``;
  if (recipies.length != 0) {
    recipesList.innerHTML += `<h2>Saved Recipes</h2>`;
  }

  recipies.forEach((recipe) => {
    createRecipeCard(recipe);
  });
}

recipeForm.addEventListener("submit", saveRecipe);
signOutBttn.addEventListener("click", function (event) {
  localStorage.removeItem("credential");
  window.location.href = "index.html";
});

let recipies = await loadRecipes();
await renderRecipies(recipies);

console.log("recipies.js initialized");
