// 1. Initialize the Database from LocalStorage (The "Empty" State)
let recipeDatabase = JSON.parse(localStorage.getItem("mySavedRecipes")) || [];

// 2. Grab HTML Elements
const recipeSelect = document.getElementById("recipeSelect");
const generateBtn = document.getElementById("generateBtn");
const outputArea = document.getElementById("outputArea");
const freshListUL = document.getElementById("freshList");
const bulkListUL = document.getElementById("bulkList");

// 3. Function to populate the dropdown menu dynamically
function updateDropdown() {
    // Clear out the dropdown first
    recipeSelect.innerHTML = "";

    // Check if the database is empty
    if (recipeDatabase.length === 0) {
        recipeSelect.innerHTML = `<option value="">-- No recipes saved yet --</option>`;
        generateBtn.disabled = true; // Disable the button
        return;
    }

    // If there are recipes, enable the button and add them
    generateBtn.disabled = false;
    recipeDatabase.forEach(recipe => {
        const option = document.createElement("option");
        option.value = recipe.name;
        option.textContent = recipe.name;
        recipeSelect.appendChild(option);
    });
}

// Run this function immediately when the page loads
updateDropdown();

// 4. Listen for the button click to generate the list
generateBtn.addEventListener("click", function() {
    
    // Clear out any old lists
    freshListUL.innerHTML = "";
    bulkListUL.innerHTML = "";

    // Grab the values the user typed in
    const selectedRecipeName = document.getElementById("recipeSelect").value;
    const targetPeople = parseInt(document.getElementById("peopleCount").value);
    const targetDays = parseInt(document.getElementById("daysCount").value);

    // Find the chosen recipe in our database
    const chosenRecipe = recipeDatabase.find(r => r.name === selectedRecipeName);

    // Safety check: if no recipe is found, stop the function
    if (!chosenRecipe) return;

    // Do the math
    const totalServingsNeeded = targetPeople * targetDays;
    const multiplier = totalServingsNeeded / chosenRecipe.baseServings;

    // Loop through the ingredients and sort them
    chosenRecipe.ingredients.forEach(ingredient => {
        const scaledQty = ingredient.qty * multiplier;
        const itemString = `<li>${scaledQty} ${ingredient.unit} of ${ingredient.name}</li>`;

        if (ingredient.isBulkEligible === true) {
            bulkListUL.innerHTML += itemString;
        } else {
            freshListUL.innerHTML += itemString;
        }
    });

    // Un-hide the output area
    outputArea.style.display = "block";
});
// ==========================================
// ADD RECIPE LOGIC
// ==========================================

// 1. Grab the new HTML elements
const newRecipeName = document.getElementById("newRecipeName");
const newRecipeServings = document.getElementById("newRecipeServings");
const ingName = document.getElementById("ingName");
const ingQty = document.getElementById("ingQty");
const ingUnit = document.getElementById("ingUnit");
const ingBulk = document.getElementById("ingBulk");
const addIngBtn = document.getElementById("addIngBtn");
const saveRecipeBtn = document.getElementById("saveRecipeBtn");
const stagedIngredientsList = document.getElementById("stagedIngredientsList");

// 2. Create a temporary array to hold ingredients while the user builds the recipe
let stagedIngredients = [];

// 3. Listen for the "+ Stage Ingredient" button
addIngBtn.addEventListener("click", function() {
    // Make sure they actually typed a name and quantity
    if (ingName.value === "" || ingQty.value === "") {
        alert("Please enter at least an ingredient name and quantity!");
        return;
    }

    // Package this single ingredient into an object
    const newIngredient = {
        name: ingName.value,
        qty: parseFloat(ingQty.value), // parseFloat ensures decimals like 1.5 cups work
        unit: ingUnit.value,
        isBulkEligible: ingBulk.checked // .checked returns true or false from the checkbox
    };

    // Push it to our temporary list
    stagedIngredients.push(newIngredient);

    // Show it on the screen
    const bulkText = newIngredient.isBulkEligible ? "(Bulk)" : "(Fresh)";
    stagedIngredientsList.innerHTML += `<li>${newIngredient.qty} ${newIngredient.unit} ${newIngredient.name} ${bulkText}</li>`;

    // Clear the input boxes so they can type the next ingredient
    ingName.value = "";
    ingQty.value = "";
    ingUnit.value = "";
    ingBulk.checked = false;
});

// 4. Listen for the "Save Full Recipe" button
saveRecipeBtn.addEventListener("click", function() {
    // Safety checks
    if (newRecipeName.value === "") {
        alert("Please give your recipe a name!");
        return;
    }
    if (stagedIngredients.length === 0) {
        alert("You need to add at least one ingredient!");
        return;
    }

    // Package the final Recipe Object
    const finalRecipe = {
        name: newRecipeName.value,
        baseServings: parseInt(newRecipeServings.value),
        ingredients: stagedIngredients
    };

    // Push the finished recipe into our main database array
    recipeDatabase.push(finalRecipe);

    // SAVE TO BROWSER MEMORY (LocalStorage)
    // We have to convert the JS array into a text string using JSON.stringify
    localStorage.setItem("mySavedRecipes", JSON.stringify(recipeDatabase));

    // Update the dropdown menu on the Planner Card so the new recipe appears instantly
    updateDropdown();

    // Reset the form for the next recipe
    newRecipeName.value = "";
    newRecipeServings.value = 1;
    stagedIngredients = []; // Empty the temporary array
    stagedIngredientsList.innerHTML = ""; // Clear the screen list
    
    alert(`"${finalRecipe.name}" has been saved successfully!`);
});
