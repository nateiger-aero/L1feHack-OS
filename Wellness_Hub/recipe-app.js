// ==========================================
// 1. DATA INITIALIZATION
// ==========================================
let recipeDatabase = JSON.parse(localStorage.getItem("mySavedRecipes")) || [];
let pantryDatabase = JSON.parse(localStorage.getItem("myPantry")) || [];

// ==========================================
// 2. TAB SWITCHING LOGIC
// ==========================================
// Added 'event' as a parameter here so it works reliably across all browsers
function switchTab(tabId) {
    // Hide all contents and remove active class from buttons
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    // Show the targeted content and highlight the clicked button
    document.getElementById(tabId).classList.add('active');
    
    // Grab the button that was just clicked and make it active
    if(window.event) {
        window.event.currentTarget.classList.add('active');
    }
}

// ==========================================
// 3. RECIPE PLANNER LOGIC
// ==========================================
const recipeSelect = document.getElementById("recipeSelect");
const generateBtn = document.getElementById("generateBtn");

function updateDropdown() {
    recipeSelect.innerHTML = "";
    if (recipeDatabase.length === 0) {
        recipeSelect.innerHTML = `<option value="">-- No recipes saved yet --</option>`;
        generateBtn.disabled = true;
        return;
    }
    generateBtn.disabled = false;
    recipeDatabase.forEach(recipe => {
        const option = document.createElement("option");
        option.value = recipe.name;
        option.textContent = recipe.name;
        recipeSelect.appendChild(option);
    });
}
updateDropdown();

generateBtn.addEventListener("click", function() {
    // 1. Clear out all three lists
    document.getElementById("freshList").innerHTML = "";
    document.getElementById("bulkList").innerHTML = "";
    document.getElementById("pantryHitList").innerHTML = "";

    // 2. Grab the inputs
    const selectedRecipeName = recipeSelect.value;
    const targetPeople = parseInt(document.getElementById("peopleCount").value);
    const targetDays = parseInt(document.getElementById("daysCount").value);
    
    // 3. Find the recipe
    const chosenRecipe = recipeDatabase.find(r => r.name === selectedRecipeName);
    if (!chosenRecipe) return;

    // 4. Calculate the scaling math
    const multiplier = (targetPeople * targetDays) / chosenRecipe.baseServings;

    // 5. PANTRY PREP: Convert the entire pantry array to lowercase for safe matching
    const lowerCasePantry = pantryDatabase.map(item => item.toLowerCase());

    // 6. Loop through the ingredients and sort them into the 3 categories
    chosenRecipe.ingredients.forEach(ingredient => {
        const scaledQty = ingredient.qty * multiplier;
        const itemString = `<li>${scaledQty} ${ingredient.unit} of ${ingredient.name}</li>`;

        // THE CROSS-REFERENCE LOGIC
        const isNameInPantry = lowerCasePantry.some(pantryItem => 
            ingredient.name.toLowerCase().includes(pantryItem) || 
            pantryItem.includes(ingredient.name.toLowerCase())
        );

        if (isNameInPantry) {
            document.getElementById("pantryHitList").innerHTML += itemString;
        } else if (ingredient.isBulkEligible) {
            document.getElementById("bulkList").innerHTML += itemString;
        } else {
            document.getElementById("freshList").innerHTML += itemString;
        }
    });

    // 7. Show the final lists
    document.getElementById("outputArea").style.display = "block";
}); // <-- The duplicate was removed right here!

// ==========================================
// 4. QUICK ADD RECIPE LOGIC
// ==========================================
let stagedIngredients = [];
document.getElementById("addIngBtn").addEventListener("click", function() {
    const name = document.getElementById("ingName").value;
    const qty = document.getElementById("ingQty").value;
    if (name === "" || qty === "") return alert("Please enter name and quantity!");

    const newIng = {
        name: name,
        qty: parseFloat(qty),
        unit: document.getElementById("ingUnit").value,
        isBulkEligible: document.getElementById("ingBulk").checked
    };
    stagedIngredients.push(newIng);
    document.getElementById("stagedIngredientsList").innerHTML += `<li>${newIng.qty} ${newIng.unit} ${newIng.name}</li>`;
    
    // Clear inputs
    document.getElementById("ingName").value = "";
    document.getElementById("ingQty").value = "";
    document.getElementById("ingUnit").value = "";
});

document.getElementById("saveRecipeBtn").addEventListener("click", function() {
    const name = document.getElementById("newRecipeName").value;
    if (name === "" || stagedIngredients.length === 0) return alert("Add a name and at least one ingredient.");

    recipeDatabase.push({
        name: name,
        baseServings: parseInt(document.getElementById("newRecipeServings").value),
        ingredients: stagedIngredients
    });

    localStorage.setItem("mySavedRecipes", JSON.stringify(recipeDatabase));
    updateDropdown();
    
    // Reset
    document.getElementById("newRecipeName").value = "";
    stagedIngredients = [];
    document.getElementById("stagedIngredientsList").innerHTML = "";
    alert(`Saved ${name}!`);
});

// ==========================================
// 5. MOCK IMPORT LOGIC (For Presentations)
// ==========================================
function mockImport() {
    const url = document.getElementById("importUrl").value;
    if (url === "") return alert("Please enter a URL first.");

    alert("DEVELOPER NOTE:\nDue to browser CORS security, frontend code cannot scrape other websites. \n\nMocking a successful import for presentation...");

    const mockRecipe = {
        name: "Imported Chili (From Web)",
        baseServings: 4,
        ingredients: [
            { name: "Ground Beef", qty: 16, unit: "oz", isBulkEligible: false },
            { name: "Kidney Beans", qty: 2, unit: "cans", isBulkEligible: true },
            { name: "Chili Powder", qty: 3, unit: "tbsp", isBulkEligible: true }
        ]
    };

    recipeDatabase.push(mockRecipe);
    localStorage.setItem("mySavedRecipes", JSON.stringify(recipeDatabase));
    updateDropdown();
    document.getElementById("importUrl").value = "";
    alert("Recipe successfully imported!");
}

// ==========================================
// 6. PANTRY LOGIC
// ==========================================
function renderPantry() {
    const list = document.getElementById("pantryList");
    list.innerHTML = "";
    if (pantryDatabase.length === 0) list.innerHTML = "<li style='color:#7f8c8d;'>Pantry is empty.</li>";
    
    pantryDatabase.forEach((item, index) => {
        list.innerHTML += `<li>${item} <button onclick="removePantryItem(${index})" style="background:none; border:none; color:red; cursor:pointer;">[x]</button></li>`;
    });
}

document.getElementById("addPantryBtn").addEventListener("click", function() {
    const input = document.getElementById("pantryItemInput");
    if (input.value === "") return;
    pantryDatabase.push(input.value);
    localStorage.setItem("myPantry", JSON.stringify(pantryDatabase));
    input.value = "";
    renderPantry();
});

function removePantryItem(index) {
    pantryDatabase.splice(index, 1);
    localStorage.setItem("myPantry", JSON.stringify(pantryDatabase));
    renderPantry();
}

// Initialize Pantry
renderPantry();
