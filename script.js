// DOM Elements
const themeSwitch = document.getElementById('theme-switch');
const body = document.body;
const navLinks = document.querySelectorAll('.nav-link');
const pages = document.querySelectorAll('.page');
const ingredientInput = document.getElementById('ingredient-input');
const addIngredientBtn = document.getElementById('add-ingredient');
const ingredientsList = document.getElementById('ingredients-list');
const findRecipesBtn = document.getElementById('find-recipes');
const clearIngredientsBtn = document.getElementById('clear-ingredients');
const recipesContainer = document.getElementById('recipes-container');
const savedRecipesContainer = document.getElementById('saved-recipes-container');
const emptySaved = document.getElementById('empty-saved');
const recipeModal = document.getElementById('recipe-modal');
const closeModal = document.querySelector('.close-modal');
const modalContent = document.getElementById('modal-content');
const voiceSearchBtn = document.getElementById('voice-search');
const voiceNavBtn = document.getElementById('voice-search-btn');
const randomRecipeBtn = document.getElementById('random-recipe-btn');
const clearSavedBtn = document.getElementById('clear-saved');
const timerModal = document.getElementById('timer-modal');
const notification = document.getElementById('notification');
const loading = document.getElementById('loading');

// Stats Elements
const recipesCountElement = document.getElementById('recipes-count');
const ingredientsCountElement = document.getElementById('ingredients-count');
const timeSavedElement = document.getElementById('time-saved');
const savedCountElement = document.getElementById('saved-count');

// MULTIPLE API OPTIONS - Try different sources
const API_SOURCES = {
    SPOONACULAR: {
        name: 'Spoonacular',
        keys: [
            'f3da4879180b461090ef428a689a7101',
            'b2c54f72bb2845c4a0c891c76b3e6a7a',
            '9c14c8777c8f4c6a8c45a7a7d3c3b2a5'
        ],
        baseUrl: 'https://api.spoonacular.com/recipes',
        currentKeyIndex: 0
    },
    THEMEALDB: {
        name: 'TheMealDB',
        baseUrl: 'https://www.themealdb.com/api/json/v1/1'
    }
};

// COMPREHENSIVE DEMO RECIPE DATABASE
const DEMO_RECIPES = [
    // Potato Recipes
    {
        id: 1001,
        title: "Crispy Roasted Potatoes",
        image: "https://images.unsplash.com/photo-1572451479130-6d57d90c6c7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 45,
        servings: 4,
        difficulty: 'easy',
        ingredients: ["potatoes", "olive oil", "garlic", "rosemary", "salt", "black pepper", "paprika"],
        instructions: "1. Preheat oven to 425°F (220°C)\n2. Cut potatoes into wedges or cubes\n3. Toss with olive oil, minced garlic, and seasonings\n4. Spread on baking sheet in single layer\n5. Roast for 35-40 minutes until golden and crispy\n6. Toss halfway through cooking\n7. Garnish with fresh rosemary before serving",
        summary: "Perfectly crispy roasted potatoes with garlic and herbs.",
        source: "Demo Recipes",
        tags: ["potato", "side dish", "vegetarian", "easy"]
    },
    {
        id: 1002,
        title: "Creamy Mashed Potatoes",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 30,
        servings: 6,
        difficulty: 'easy',
        ingredients: ["potatoes", "butter", "milk", "garlic", "salt", "pepper", "parmesan cheese"],
        instructions: "1. Peel and quarter potatoes\n2. Boil in salted water until tender (15-20 minutes)\n3. Heat milk and butter in saucepan\n4. Drain potatoes and mash\n5. Gradually add warm milk mixture\n6. Stir in minced garlic and seasonings\n7. Fold in grated parmesan until creamy",
        summary: "Ultra-creamy mashed potatoes perfect for any meal.",
        source: "Demo Recipes",
        tags: ["potato", "comfort food", "vegetarian", "creamy"]
    },
    {
        id: 1003,
        title: "Potato and Leek Soup",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 40,
        servings: 4,
        difficulty: 'easy',
        ingredients: ["potatoes", "leeks", "onion", "garlic", "vegetable broth", "cream", "thyme", "butter"],
        instructions: "1. Sauté chopped leeks and onion in butter\n2. Add minced garlic and cook for 1 minute\n3. Add diced potatoes and vegetable broth\n4. Simmer until potatoes are tender (20 minutes)\n5. Blend soup until smooth\n6. Stir in cream and fresh thyme\n7. Season with salt and pepper to taste",
        summary: "Creamy and comforting potato leek soup.",
        source: "Demo Recipes",
        tags: ["potato", "soup", "vegetarian", "comfort food"]
    },
    {
        id: 1004,
        title: "Spanish Potato Omelette",
        image: "https://images.unsplash.com/photo-1595257842037-ee574c1bd2bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 35,
        servings: 4,
        difficulty: 'medium',
        ingredients: ["potatoes", "eggs", "onion", "olive oil", "salt", "pepper", "parsley"],
        instructions: "1. Thinly slice potatoes and onions\n2. Fry in olive oil until tender but not brown\n3. Beat eggs with salt and pepper\n4. Combine potatoes and onions with eggs\n5. Cook in skillet over medium heat\n6. Flip and cook other side until golden\n7. Garnish with fresh parsley",
        summary: "Classic Spanish tortilla with potatoes and eggs.",
        source: "Demo Recipes",
        tags: ["potato", "spanish", "vegetarian", "breakfast"]
    },

    // Chicken Recipes
    {
        id: 2001,
        title: "Garlic Butter Chicken",
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 25,
        servings: 4,
        difficulty: 'easy',
        ingredients: ["chicken breast", "garlic", "butter", "olive oil", "thyme", "lemon juice", "chicken broth"],
        instructions: "1. Season chicken with salt and pepper\n2. Heat olive oil in a large skillet\n3. Cook chicken for 6-7 minutes per side\n4. Add butter, minced garlic, and thyme\n5. Cook for 2 more minutes, basting chicken\n6. Add lemon juice and chicken broth\n7. Simmer until sauce thickens slightly",
        summary: "Juicy chicken breasts in rich garlic butter sauce.",
        source: "Demo Recipes",
        tags: ["chicken", "quick", "gluten-free", "high-protein"]
    },
    {
        id: 2002,
        title: "Creamy Chicken Pasta",
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 35,
        servings: 4,
        difficulty: 'medium',
        ingredients: ["chicken breast", "pasta", "heavy cream", "parmesan cheese", "garlic", "mushrooms", "butter", "flour"],
        instructions: "1. Cook pasta according to package directions\n2. Dice chicken and cook until golden\n3. Sauté mushrooms and garlic in butter\n4. Sprinkle flour and cook for 1 minute\n5. Gradually add cream and chicken broth\n6. Add grated parmesan and cooked chicken\n7. Combine sauce with pasta and serve",
        summary: "Rich and creamy pasta with tender chicken.",
        source: "Demo Recipes",
        tags: ["chicken", "pasta", "creamy", "comfort food"]
    },

    // Tomato Recipes
    {
        id: 3001,
        title: "Fresh Tomato Bruschetta",
        image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 15,
        servings: 4,
        difficulty: 'easy',
        ingredients: ["tomatoes", "baguette", "garlic", "fresh basil", "olive oil", "balsamic vinegar", "salt"],
        instructions: "1. Dice tomatoes and place in bowl\n2. Chop fresh basil and add to tomatoes\n3. Mix with olive oil and balsamic vinegar\n4. Season with salt and pepper\n5. Toast baguette slices until golden\n6. Rub with garlic clove\n7. Top with tomato mixture and serve",
        summary: "Classic Italian appetizer with fresh tomatoes.",
        source: "Demo Recipes",
        tags: ["tomato", "appetizer", "vegetarian", "quick"]
    },
    {
        id: 3002,
        title: "Tomato Basil Soup",
        image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 30,
        servings: 4,
        difficulty: 'easy',
        ingredients: ["tomatoes", "onion", "garlic", "vegetable broth", "fresh basil", "cream", "olive oil"],
        instructions: "1. Sauté chopped onions and garlic\n2. Add chopped tomatoes and cook\n3. Pour in vegetable broth and simmer\n4. Blend soup with fresh basil\n5. Stir in cream and season\n6. Serve hot with crusty bread",
        summary: "Creamy tomato soup with fresh basil.",
        source: "Demo Recipes",
        tags: ["tomato", "soup", "vegetarian", "comfort food"]
    },

    // Cheese Recipes
    {
        id: 4001,
        title: "Three Cheese Pasta Bake",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 45,
        servings: 6,
        difficulty: 'medium',
        ingredients: ["pasta", "mozzarella", "parmesan", "ricotta", "tomato sauce", "garlic", "basil"],
        instructions: "1. Cook pasta until al dente\n2. Mix ricotta with garlic and basil\n3. Layer pasta, sauce, and cheese mixture\n4. Top with mozzarella and parmesan\n5. Bake until bubbly and golden\n6. Let rest before serving",
        summary: "Hearty pasta bake with three cheeses.",
        source: "Demo Recipes",
        tags: ["cheese", "pasta", "vegetarian", "baked"]
    },
    {
        id: 4002,
        title: "Caprese Salad",
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 10,
        servings: 2,
        difficulty: 'easy',
        ingredients: ["mozzarella cheese", "tomatoes", "fresh basil", "olive oil", "balsamic glaze"],
        instructions: "1. Slice tomatoes and mozzarella\n2. Arrange alternating slices\n3. Add fresh basil leaves\n4. Drizzle with olive oil\n5. Add balsamic glaze\n6. Season with salt and pepper",
        summary: "Simple salad with mozzarella and tomatoes.",
        source: "Demo Recipes",
        tags: ["cheese", "salad", "vegetarian", "quick"]
    },

    // Vegetable Recipes
    {
        id: 5001,
        title: "Roasted Vegetable Medley",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 35,
        servings: 4,
        difficulty: 'easy',
        ingredients: ["potatoes", "carrots", "bell peppers", "zucchini", "onion", "garlic", "olive oil", "herbs"],
        instructions: "1. Preheat oven to 400°F\n2. Chop all vegetables into similar sizes\n3. Toss with olive oil and seasonings\n4. Spread on baking sheet\n5. Roast for 25-30 minutes\n6. Toss halfway through cooking\n7. Serve hot as side dish",
        summary: "Colorful roasted vegetable mixture.",
        source: "Demo Recipes",
        tags: ["vegetable", "side dish", "vegetarian", "healthy"]
    },
    {
        id: 5002,
        title: "Vegetable Stir Fry",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 20,
        servings: 3,
        difficulty: 'easy',
        ingredients: ["broccoli", "carrots", "bell peppers", "snap peas", "garlic", "ginger", "soy sauce"],
        instructions: "1. Prepare all vegetables\n2. Heat oil in wok or large pan\n3. Stir-fry garlic and ginger\n4. Add vegetables and stir-fry\n5. Add soy sauce and cook\n6. Serve over steamed rice",
        summary: "Quick and healthy vegetable stir fry.",
        source: "Demo Recipes",
        tags: ["vegetable", "stir fry", "vegetarian", "asian"]
    },

    // Egg Recipes
    {
        id: 6001,
        title: "Cheesy Vegetable Omelette",
        image: "https://images.unsplash.com/photo-1595257842037-ee574c1bd2bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 10,
        servings: 1,
        difficulty: 'easy',
        ingredients: ["eggs", "cheddar cheese", "tomato", "onion", "bell pepper", "butter", "milk"],
        instructions: "1. Beat eggs with milk\n2. Sauté vegetables in butter\n3. Pour eggs over vegetables\n4. Add cheese and cook\n5. Fold and serve hot",
        summary: "Protein-packed vegetable omelette.",
        source: "Demo Recipes",
        tags: ["egg", "breakfast", "vegetarian", "quick"]
    },

    // Beef Recipes
    {
        id: 7001,
        title: "Classic Beef Tacos",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 30,
        servings: 4,
        difficulty: 'medium',
        ingredients: ["ground beef", "taco shells", "tomato", "onion", "garlic", "cheese", "lettuce"],
        instructions: "1. Brown ground beef with onions\n2. Add taco seasoning\n3. Prepare toppings\n4. Heat taco shells\n5. Assemble tacos\n6. Serve immediately",
        summary: "Family-friendly beef tacos.",
        source: "Demo Recipes",
        tags: ["beef", "mexican", "main course", "family"]
    },

    // Rice Recipes
    {
        id: 8001,
        title: "Vegetable Fried Rice",
        image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        time: 25,
        servings: 4,
        difficulty: 'easy',
        ingredients: ["rice", "eggs", "carrots", "peas", "onion", "garlic", "soy sauce", "sesame oil"],
        instructions: "1. Cook rice and let cool\n2. Scramble eggs and set aside\n3. Stir-fry vegetables\n4. Add rice and soy sauce\n5. Mix in eggs\n6. Drizzle with sesame oil",
        summary: "Classic vegetable fried rice.",
        source: "Demo Recipes",
        tags: ["rice", "vegetarian", "asian", "quick"]
    }
];

// State
let ingredients = [];
let currentRecipes = [];
let savedRecipes = JSON.parse(localStorage.getItem('savedRecipes')) || [];
let currentFilters = {
    time: null,
    difficulty: null
};
let isListening = false;
let recognition = null;

// Advanced filters state
let advancedFilters = {
    time: [],
    difficulty: [],
    maxTime: 60,
    sortBy: 'relevance'
};

// Counting animation function
function animateCount(element, targetValue, duration = 1500, suffix = '') {
    const startValue = parseInt(element.textContent) || 0;
    const startTime = performance.now();
    
    function updateCount(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        
        element.textContent = currentValue + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(updateCount);
        } else {
            element.textContent = targetValue + suffix;
        }
    }
    
    requestAnimationFrame(updateCount);
}

// Enhanced updateStats function with animations
function updateStats() {
    const ingredientsCount = ingredients.length;
    const recipesCount = currentRecipes.length;
    const savedCount = savedRecipes.length;
    const timeSaved = currentRecipes.length * 15;
    
    animateCount(ingredientsCountElement, ingredientsCount, 1000);
    animateCount(recipesCountElement, recipesCount, 1000);
    animateCount(timeSavedElement, timeSaved, 1000);
    animateCount(savedCountElement, savedCount, 1000);
    
    if (ingredientsCount > parseInt(ingredientsCountElement.dataset.lastValue || 0)) {
        ingredientsCountElement.style.transform = 'scale(1.2)';
        setTimeout(() => {
            ingredientsCountElement.style.transform = 'scale(1)';
        }, 300);
    }
    
    if (recipesCount > parseInt(recipesCountElement.dataset.lastValue || 0)) {
        recipesCountElement.style.transform = 'scale(1.2)';
        recipesCountElement.style.color = 'var(--secondary)';
        setTimeout(() => {
            recipesCountElement.style.transform = 'scale(1)';
            recipesCountElement.style.color = 'var(--primary)';
        }, 300);
    }
    
    ingredientsCountElement.dataset.lastValue = ingredientsCount;
    recipesCountElement.dataset.lastValue = recipesCount;
}

// Initialize Speech Recognition
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = function() {
            isListening = true;
            voiceSearchBtn.classList.add('listening');
            voiceNavBtn.classList.add('listening');
            showNotification('Listening... Speak now!', 'info');
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            ingredientInput.value = transcript;
            showNotification(`Heard: "${transcript}"`, 'success');
        };

        recognition.onerror = function(event) {
            showNotification('Voice recognition error. Please try again.', 'error');
        };

        recognition.onend = function() {
            isListening = false;
            voiceSearchBtn.classList.remove('listening');
            voiceNavBtn.classList.remove('listening');
        };
    } else {
        showNotification('Speech recognition not supported in this browser', 'error');
    }
}

// Theme Toggle - Optimized Version
let isThemeTransitioning = false;

themeSwitch.addEventListener('change', function() {
    if (isThemeTransitioning) return;
    
    isThemeTransitioning = true;
    
    // Disable transitions temporarily for performance
    document.documentElement.style.setProperty('--transition', 'none');
    
    if (this.checked) {
        body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        showNotification('Dark mode enabled', 'success');
    } else {
        body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        showNotification('Light mode enabled', 'success');
    }
    
    // Re-enable transitions after a short delay
    setTimeout(() => {
        document.documentElement.style.removeProperty('--transition');
        isThemeTransitioning = false;
    }, 50);
});

// Load saved theme - Optimized
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    themeSwitch.checked = true;
    body.classList.add('dark-theme');
} else {
    // Ensure light theme is properly set
    body.classList.remove('dark-theme');
}

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        const targetPage = this.getAttribute('href').substring(1);
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.id === targetPage) {
                page.classList.add('active');
                
                if (targetPage === 'saved') {
                    renderSavedRecipes();
                }
                if (targetPage === 'filters') {
                    initFiltersPage();
                }
            }
        });
        
        window.scrollTo(0, 0);
    });
});

// Voice Search
voiceSearchBtn.addEventListener('click', toggleVoiceSearch);
voiceNavBtn.addEventListener('click', toggleVoiceSearch);

function toggleVoiceSearch() {
    if (!recognition) {
        initSpeechRecognition();
    }
    
    if (isListening) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

// Random Recipe
randomRecipeBtn.addEventListener('click', function() {
    ingredients = ['chicken', 'tomato', 'cheese', 'garlic', 'onion', 'potato'];
    renderIngredients();
    findRecipes();
    showNotification('Random ingredients added! Finding recipes...', 'success');
});

// Add Ingredient
addIngredientBtn.addEventListener('click', addIngredient);
ingredientInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addIngredient();
    }
});

function addIngredient() {
    const ingredient = ingredientInput.value.trim().toLowerCase();
    
    if (ingredient && !ingredients.includes(ingredient)) {
        ingredients.push(ingredient);
        renderIngredients();
        ingredientInput.value = '';
        ingredientInput.focus();
        updateStats();
        showNotification(`Added: ${ingredient}`, 'success');
    } else if (ingredients.includes(ingredient)) {
        showNotification('Ingredient already added!', 'warning');
    }
}

// Quick Add Tips
document.querySelectorAll('.tip-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const ingredient = this.getAttribute('data-ingredient');
        if (!ingredients.includes(ingredient)) {
            ingredients.push(ingredient);
            renderIngredients();
            updateStats();
            showNotification(`Added: ${ingredient}`, 'success');
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        }
    });
});

// Floating Ingredients Click
document.querySelectorAll('.floating-item').forEach(item => {
    item.addEventListener('click', function() {
        const ingredient = this.getAttribute('data-ingredient');
        if (!ingredients.includes(ingredient)) {
            ingredients.push(ingredient);
            renderIngredients();
            updateStats();
            
            this.style.opacity = '1';
            this.style.transform = 'scale(1.5)';
            setTimeout(() => {
                this.style.opacity = '0.3';
                this.style.transform = 'scale(1)';
            }, 500);
            
            showNotification(`Added: ${ingredient}`, 'success');
        }
    });
});

function renderIngredients() {
    ingredientsList.innerHTML = '';
    
    if (ingredients.length === 0) {
        ingredientsList.innerHTML = '<div class="empty-state">No ingredients added yet</div>';
        return;
    }
    
    ingredients.forEach(ingredient => {
        const tag = document.createElement('div');
        tag.className = 'ingredient-tag';
        tag.innerHTML = `
            <span>${ingredient}</span>
            <span class="remove" data-ingredient="${ingredient}">&times;</span>
        `;
        ingredientsList.appendChild(tag);
    });
    
    document.querySelectorAll('.ingredient-tag .remove').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const ingredientToRemove = this.getAttribute('data-ingredient');
            ingredients = ingredients.filter(ing => ing !== ingredientToRemove);
            renderIngredients();
            updateStats();
            showNotification(`Removed: ${ingredientToRemove}`, 'info');
        });
    });
    
    document.querySelectorAll('.ingredient-tag').forEach(tag => {
        tag.addEventListener('click', function() {
            const ingredient = this.querySelector('span:first-child').textContent;
            ingredientInput.value = ingredient;
            ingredientInput.focus();
        });
    });
}

// Clear Ingredients
clearIngredientsBtn.addEventListener('click', function() {
    if (ingredients.length > 0) {
        ingredients = [];
        renderIngredients();
        updateStats();
        showNotification('All ingredients cleared', 'info');
    }
});

// Find Recipes - IMPROVED WITH COMPREHENSIVE FALLBACK
findRecipesBtn.addEventListener('click', findRecipes);

async function findRecipes() {
    if (ingredients.length === 0) {
        showNotification('Please add at least one ingredient!', 'warning');
        return;
    }
    
    showLoading(true);
    
    try {
        console.log('Starting recipe search with ingredients:', ingredients);
        
        let apiRecipes = [];
        let sourceUsed = '';
        
        // Try Spoonacular first
        try {
            apiRecipes = await fetchSpoonacularRecipes();
            sourceUsed = 'Spoonacular';
        } catch (spoonacularError) {
            console.log('Spoonacular failed, trying TheMealDB...');
            
            // Try TheMealDB as fallback
            try {
                apiRecipes = await fetchTheMealDBRecipes();
                sourceUsed = 'TheMealDB';
            } catch (themealdbError) {
                console.log('TheMealDB failed, using comprehensive demo data...');
                
                // Use comprehensive demo data as final fallback
                apiRecipes = generateEnhancedDemoRecipes(ingredients);
                sourceUsed = 'Demo Recipes';
            }
        }
        
        if (apiRecipes && apiRecipes.length > 0) {
            currentRecipes = apiRecipes;
            showNotification(`Found ${apiRecipes.length} recipes from ${sourceUsed}!`, 'success');
            
            let filteredRecipes = applyAllFilters(currentRecipes);
            renderRecipes(filteredRecipes);
            updateStats();
            
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        } else {
            currentRecipes = [];
            renderRecipes([]);
            updateStats();
            showNotification('No recipes found with these ingredients. Try different ingredients!', 'warning');
        }
        
    } catch (error) {
        console.error('Error in findRecipes:', error);
        showNotification('Failed to fetch recipes. Using comprehensive demo recipes.', 'error');
        
        currentRecipes = generateEnhancedDemoRecipes(ingredients);
        let filteredRecipes = applyAllFilters(currentRecipes);
        renderRecipes(filteredRecipes);
        updateStats();
    } finally {
        showLoading(false);
    }
}

// Spoonacular API function with retry logic
async function fetchSpoonacularRecipes() {
    const maxRetries = API_SOURCES.SPOONACULAR.keys.length;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const currentKey = API_SOURCES.SPOONACULAR.keys[API_SOURCES.SPOONACULAR.currentKeyIndex];
            const ingredientsString = ingredients.join(',');
            
            const searchUrl = `${API_SOURCES.SPOONACULAR.baseUrl}/complexSearch?query=${ingredientsString}&number=8&apiKey=${currentKey}&addRecipeInformation=true&fillIngredients=true&instructionsRequired=true`;
            
            console.log(`Spoonacular attempt ${attempt + 1} with key ${API_SOURCES.SPOONACULAR.currentKeyIndex}`);
            
            const response = await fetch(searchUrl);
            
            if (response.status === 402) {
                throw new Error('API quota exceeded');
            }
            
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.results || data.results.length === 0) {
                return [];
            }
            
            // Transform recipes
            const recipes = data.results.map(recipe => ({
                id: `spoonacular-${recipe.id}`,
                title: recipe.title,
                image: recipe.image,
                time: recipe.readyInMinutes || 30,
                servings: recipe.servings || 4,
                difficulty: getDifficulty(recipe.readyInMinutes || 30),
                ingredients: recipe.extendedIngredients ? recipe.extendedIngredients.map(ing => ing.original) : [],
                instructions: recipe.instructions ? cleanInstructions(recipe.instructions) : 'No instructions available.',
                summary: recipe.summary || `A delicious recipe for ${recipe.title}`,
                sourceUrl: recipe.sourceUrl,
                source: 'Spoonacular'
            }));
            
            return recipes;
            
        } catch (error) {
            console.log(`Spoonacular attempt ${attempt + 1} failed:`, error.message);
            
            if (attempt < maxRetries - 1) {
                // Switch to next API key
                API_SOURCES.SPOONACULAR.currentKeyIndex = (API_SOURCES.SPOONACULAR.currentKeyIndex + 1) % API_SOURCES.SPOONACULAR.keys.length;
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                throw new Error('All Spoonacular keys exhausted');
            }
        }
    }
}

// TheMealDB API (No API key required!)
async function fetchTheMealDBRecipes() {
    try {
        // TheMealDB doesn't have ingredient-based search, so we'll search by first ingredient
        const primaryIngredient = ingredients[0];
        const searchUrl = `${API_SOURCES.THEMEALDB.baseUrl}/filter.php?i=${primaryIngredient}`;
        
        console.log('Trying TheMealDB with ingredient:', primaryIngredient);
        
        const response = await fetch(searchUrl);
        
        if (!response.ok) {
            throw new Error(`TheMealDB request failed with status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.meals || data.meals.length === 0) {
            return [];
        }
        
        // Get details for each meal
        const recipes = [];
        for (const meal of data.meals.slice(0, 6)) {
            try {
                const detailUrl = `${API_SOURCES.THEMEALDB.baseUrl}/lookup.php?i=${meal.idMeal}`;
                const detailResponse = await fetch(detailUrl);
                
                if (detailResponse.ok) {
                    const detailData = await detailResponse.json();
                    const mealDetail = detailData.meals[0];
                    
                    if (mealDetail) {
                        // Extract ingredients from the meal detail
                        const mealIngredients = [];
                        for (let i = 1; i <= 20; i++) {
                            const ingredient = mealDetail[`strIngredient${i}`];
                            const measure = mealDetail[`strMeasure${i}`];
                            if (ingredient && ingredient.trim()) {
                                mealIngredients.push(`${measure ? measure + ' ' : ''}${ingredient}`.trim());
                            }
                        }
                        
                        recipes.push({
                            id: `themealdb-${meal.idMeal}`,
                            title: mealDetail.strMeal,
                            image: mealDetail.strMealThumb,
                            time: 45, // TheMealDB doesn't provide time
                            servings: 4,
                            difficulty: 'medium',
                            ingredients: mealIngredients,
                            instructions: mealDetail.strInstructions || 'No instructions available.',
                            summary: `A delicious ${mealDetail.strCategory} recipe`,
                            sourceUrl: mealDetail.strSource || mealDetail.strYoutube,
                            source: 'TheMealDB'
                        });
                    }
                }
            } catch (error) {
                console.warn('Failed to get meal details:', error);
            }
        }
        
        return recipes;
        
    } catch (error) {
        console.error('Error fetching from TheMealDB:', error);
        throw error;
    }
}

// Enhanced Demo Data with comprehensive recipe matching
function generateEnhancedDemoRecipes(userIngredients) {
    console.log('Generating enhanced demo recipes for:', userIngredients);
    
    // Find recipes that match user ingredients
    const matchingRecipes = DEMO_RECIPES.filter(recipe => {
        const matchingIngredients = recipe.ingredients.filter(recipeIng => 
            userIngredients.some(userIng => 
                recipeIng.toLowerCase().includes(userIng.toLowerCase()) ||
                userIng.toLowerCase().includes(recipeIng.toLowerCase())
            )
        );
        return matchingIngredients.length > 0;
    });
    
    // Sort by number of matching ingredients (most matches first)
    matchingRecipes.sort((a, b) => {
        const aMatches = a.ingredients.filter(ing => 
            userIngredients.some(userIng => ing.toLowerCase().includes(userIng.toLowerCase()))
        ).length;
        const bMatches = b.ingredients.filter(ing => 
            userIngredients.some(userIng => ing.toLowerCase().includes(userIng.toLowerCase()))
        ).length;
        return bMatches - aMatches;
    });
    
    console.log('Matching recipes found:', matchingRecipes.length);
    
    // If no matches found, return some popular recipes
    if (matchingRecipes.length === 0) {
        return DEMO_RECIPES.slice(0, 6);
    }
    
    return matchingRecipes.slice(0, 8);
}

// Helper function to clean HTML instructions
function cleanInstructions(instructions) {
    if (!instructions) return 'No instructions available.';
    const cleanText = instructions.replace(/<[^>]*>/g, '');
    const steps = cleanText.split('.').filter(step => step.trim().length > 0);
    return steps.map((step, index) => `${index + 1}. ${step.trim()}`).join('\n');
}

// Helper function to determine difficulty based on cooking time
function getDifficulty(cookingTime) {
    if (cookingTime <= 15) return 'easy';
    if (cookingTime <= 30) return 'medium';
    return 'hard';
}

// Apply all filters (basic + advanced)
function applyAllFilters(recipes) {
    let filteredRecipes = [...recipes];
    
    // Apply basic filters
    if (currentFilters.time) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.time <= currentFilters.time);
    }
    if (currentFilters.difficulty) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === currentFilters.difficulty);
    }
    
    // Apply advanced filters
    filteredRecipes = applyAdvancedFilters(filteredRecipes);
    
    return filteredRecipes;
}

// Basic Filters
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const time = this.getAttribute('data-time');
        const difficulty = this.getAttribute('data-difficulty');
        
        const parent = this.parentElement;
        parent.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        
        this.classList.toggle('active');
        
        if (time) {
            currentFilters.time = this.classList.contains('active') ? parseInt(time) : null;
        }
        if (difficulty) {
            currentFilters.difficulty = this.classList.contains('active') ? difficulty : null;
        }
        
        if (currentRecipes.length > 0) {
            let filteredRecipes = applyAllFilters(currentRecipes);
            renderRecipes(filteredRecipes);
            showNotification(`Filtered to ${filteredRecipes.length} recipes`, 'info');
        }
    });
});

// Advanced Filters Functionality
function initFiltersPage() {
    console.log('Initializing filters page...');
    
    const calorieRange = document.getElementById('calorie-range');
    const calorieValue = document.getElementById('calorie-value');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const resetFiltersBtn = document.getElementById('reset-filters');
    const globalSort = document.getElementById('global-sort');
    
    if (!calorieRange || !applyFiltersBtn) {
        console.log('Filter elements not found');
        return;
    }
    
    updateCalorieDisplay();
    
    // Load saved filters if any
    const savedFilters = localStorage.getItem('advancedFilters');
    if (savedFilters) {
        advancedFilters = JSON.parse(savedFilters);
        applySavedFilters();
    }
    
    // Calorie range event
    calorieRange.addEventListener('input', function() {
        updateCalorieDisplay();
    });
    
    // Checkbox events
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const type = this.getAttribute('data-time') ? 'time' : 
                        this.getAttribute('data-difficulty') ? 'difficulty' : null;
            
            if (!type) return;
            
            const value = this.getAttribute(`data-${type}`);
            
            if (this.checked) {
                if (!advancedFilters[type].includes(value)) {
                    advancedFilters[type].push(value);
                }
            } else {
                advancedFilters[type] = advancedFilters[type].filter(item => item !== value);
            }
            
            console.log('Updated filters:', advancedFilters);
        });
    });
    
    // Apply filters
    applyFiltersBtn.addEventListener('click', function() {
        console.log('Apply filters clicked');
        
        // Update max time from range slider
        if (calorieRange) {
            advancedFilters.maxTime = parseInt(calorieRange.value);
        }
        
        // Update sort by
        if (globalSort) {
            advancedFilters.sortBy = globalSort.value;
        }
        
        // Save to localStorage
        localStorage.setItem('advancedFilters', JSON.stringify(advancedFilters));
        
        // Switch to home page
        switchToHome();
        
        showNotification('Filters applied successfully!', 'success');
        
        // If we have ingredients, trigger a new search
        if (ingredients.length > 0 && currentRecipes.length > 0) {
            let filteredRecipes = applyAllFilters(currentRecipes);
            renderRecipes(filteredRecipes);
            showNotification(`Applied filters to ${filteredRecipes.length} recipes`, 'success');
        }
    });
    
    // Reset filters
    resetFiltersBtn.addEventListener('click', function() {
        console.log('Reset filters clicked');
        
        document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        if (calorieRange) {
            calorieRange.value = 60;
            updateCalorieDisplay();
        }
        
        if (globalSort) {
            globalSort.value = 'relevance';
        }
        
        advancedFilters = {
            time: [],
            difficulty: [],
            maxTime: 60,
            sortBy: 'relevance'
        };
        
        localStorage.removeItem('advancedFilters');
        showNotification('All filters reset', 'info');
    });
}

function updateCalorieDisplay() {
    const calorieRange = document.getElementById('calorie-range');
    const calorieValue = document.getElementById('calorie-value');
    if (calorieRange && calorieValue) {
        const value = calorieRange.value;
        calorieValue.textContent = `Up to ${value} minutes`;
        advancedFilters.maxTime = parseInt(value);
    }
}

function applyAdvancedFilters(recipes) {
    let filteredRecipes = [...recipes];
    
    console.log('Applying advanced filters:', advancedFilters);
    
    // Time filters
    if (advancedFilters.time.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => {
            return advancedFilters.time.some(timeFilter => {
                const maxTime = parseInt(timeFilter);
                return recipe.time <= maxTime;
            });
        });
    }
    
    // Difficulty filters
    if (advancedFilters.difficulty.length > 0) {
        filteredRecipes = filteredRecipes.filter(recipe => 
            advancedFilters.difficulty.includes(recipe.difficulty)
        );
    }
    
    // Max time filter
    if (advancedFilters.maxTime < 60) {
        filteredRecipes = filteredRecipes.filter(recipe => recipe.time <= advancedFilters.maxTime);
    }
    
    // Apply sorting
    switch(advancedFilters.sortBy) {
        case 'time-asc':
            filteredRecipes.sort((a, b) => a.time - b.time);
            break;
        case 'time-desc':
            filteredRecipes.sort((a, b) => b.time - a.time);
            break;
        case 'difficulty':
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
            filteredRecipes.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
            break;
        case 'relevance':
        default:
            // Keep original order
            break;
    }
    
    console.log('Filtered recipes count:', filteredRecipes.length);
    return filteredRecipes;
}

function applySavedFilters() {
    document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
        const type = checkbox.getAttribute('data-time') ? 'time' : 
                    checkbox.getAttribute('data-difficulty') ? 'difficulty' : null;
        
        if (!type) return;
        
        const value = checkbox.getAttribute(`data-${type}`);
        checkbox.checked = advancedFilters[type].includes(value);
    });
    
    const calorieRange = document.getElementById('calorie-range');
    const globalSort = document.getElementById('global-sort');
    
    if (calorieRange) {
        calorieRange.value = advancedFilters.maxTime;
        updateCalorieDisplay();
    }
    
    if (globalSort) {
        globalSort.value = advancedFilters.sortBy;
    }
}

// Sort Recipes (Home page)
document.getElementById('sort-recipes')?.addEventListener('change', function() {
    const sortBy = this.value;
    let sortedRecipes = [...currentRecipes];
    
    switch(sortBy) {
        case 'time':
            sortedRecipes.sort((a, b) => a.time - b.time);
            break;
        case 'difficulty':
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
            sortedRecipes.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
            break;
        case 'relevance':
        default:
            break;
    }
    
    renderRecipes(sortedRecipes);
});

function renderRecipes(recipes) {
    recipesContainer.innerHTML = '';
    
    if (recipes.length === 0) {
        recipesContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>No recipes found</h3>
                <p>Try adding different ingredients or changing filters!</p>
            </div>
        `;
        document.getElementById('results-count').textContent = '0 recipes found';
        return;
    }
    
    document.getElementById('results-count').textContent = `${recipes.length} recipes found`;
    
    recipes.forEach((recipe, index) => {
        const isSaved = savedRecipes.some(saved => saved.id === recipe.id);
        const matchingIngredients = recipe.ingredients.filter(ing => 
            ingredients.some(userIng => 
                ing.toLowerCase().includes(userIng.toLowerCase()) || 
                userIng.toLowerCase().includes(ing.toLowerCase())
            )
        );
        
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            ${matchingIngredients.length >= 2 ? '<div class="recipe-badge">Great Match!</div>' : ''}
            ${recipe.source ? `<div class="source-badge">${recipe.source}</div>` : ''}
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-info">
                    <span><i class="far fa-clock"></i> ${recipe.time} min</span>
                    <span><i class="fas fa-user-friends"></i> ${recipe.servings} servings</span>
                    <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                </div>
                <div class="recipe-ingredients">
                    <div class="ingredient-pills">
                        ${recipe.ingredients.slice(0, 4).map(ing => `
                            <span class="ingredient-pill ${ingredients.some(userIng => ing.toLowerCase().includes(userIng.toLowerCase())) ? 'matched' : ''}" 
                                  title="${ing}">${ing.length > 20 ? ing.substring(0, 20) + '...' : ing}</span>
                        `).join('')}
                        ${recipe.ingredients.length > 4 ? `<span class="ingredient-pill">+${recipe.ingredients.length - 4} more</span>` : ''}
                    </div>
                </div>
                <div class="recipe-actions">
                    <button class="btn-view" data-index="${index}">
                        <i class="fas fa-utensils"></i> Cook
                    </button>
                    <button class="btn-save ${isSaved ? 'saved' : ''}" data-index="${index}">
                        <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> 
                        ${isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>
        `;
        recipesContainer.appendChild(card);
    });
    
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            showRecipeDetail(recipes[index]);
        });
    });
    
    document.querySelectorAll('.btn-save').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            toggleSaveRecipe(recipes[index], this);
        });
    });
    
    document.querySelectorAll('.ingredient-pill').forEach(pill => {
        pill.addEventListener('click', function(e) {
            e.stopPropagation();
            const ingredient = this.getAttribute('title');
            if (ingredient && !ingredients.includes(ingredient)) {
                ingredients.push(ingredient);
                renderIngredients();
                updateStats();
                showNotification(`Added: ${ingredient}`, 'success');
                
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            }
        });
    });
}

function showRecipeDetail(recipe) {
    const isSaved = savedRecipes.some(saved => saved.id === recipe.id);
    
    modalContent.innerHTML = `
        <div class="recipe-detail">
            <div class="detail-header">
                <img src="${recipe.image}" alt="${recipe.title}" class="detail-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
                <div class="detail-info">
                    <h2>${recipe.title}</h2>
                    <div class="detail-meta">
                        <span><i class="far fa-clock"></i> ${recipe.time} minutes</span>
                        <span><i class="fas fa-user-friends"></i> ${recipe.servings} servings</span>
                        <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                        ${recipe.source ? `<span><i class="fas fa-database"></i> ${recipe.source}</span>` : ''}
                    </div>
                    <div class="detail-actions">
                        <button class="btn-primary" id="start-cooking">
                            <i class="fas fa-utensils"></i> Start Cooking
                        </button>
                        <button class="btn-save-large ${isSaved ? 'saved' : ''}" id="modal-save-btn">
                            <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> 
                            ${isSaved ? 'Saved' : 'Save Recipe'}
                        </button>
                        ${recipe.sourceUrl ? `
                        <a href="${recipe.sourceUrl}" target="_blank" class="btn-secondary">
                            <i class="fas fa-external-link-alt"></i> Original Recipe
                        </a>
                        ` : ''}
                    </div>
                </div>
            </div>
            <div class="detail-content">
                <div class="ingredients-section">
                    <h3>Ingredients</h3>
                    <ul>
                        ${recipe.ingredients.map(ing => `
                            <li class="${ingredients.some(userIng => ing.toLowerCase().includes(userIng.toLowerCase())) ? 'available' : ''}">
                                ${ing} ${ingredients.some(userIng => ing.toLowerCase().includes(userIng.toLowerCase())) ? '✓' : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="instructions-section">
                    <h3>Instructions</h3>
                    <div class="instructions-steps">
                        ${recipe.instructions && recipe.instructions !== 'No instructions available.' ? 
                            recipe.instructions.split('\n').filter(step => step.trim()).map((step, index) => `
                                <div class="instruction-step">
                                    <span class="step-number">${index + 1}</span>
                                    <span class="step-text">${step.trim()}</span>
                                </div>
                            `).join('') : 
                            `<div class="no-instructions">
                                <p>No detailed instructions available from the API.</p>
                                ${recipe.sourceUrl ? `<p>Please visit the <a href="${recipe.sourceUrl}" target="_blank">original recipe website</a> for complete instructions.</p>` : ''}
                            </div>`
                        }
                    </div>
                </div>
            </div>
        </div>
    `;
    
    recipeModal.style.display = 'block';
    
    document.getElementById('modal-save-btn').addEventListener('click', function() {
        toggleSaveRecipe(recipe, this);
    });
    
    document.getElementById('start-cooking').addEventListener('click', function() {
        showTimerModal();
    });
}

function toggleSaveRecipe(recipe, button) {
    const isSaved = savedRecipes.some(saved => saved.id === recipe.id);
    
    if (isSaved) {
        savedRecipes = savedRecipes.filter(saved => saved.id !== recipe.id);
        button.classList.remove('saved');
        button.innerHTML = `<i class="far fa-bookmark"></i> Save Recipe`;
        showNotification('Recipe removed from saved', 'info');
    } else {
        savedRecipes.push(recipe);
        button.classList.add('saved');
        button.innerHTML = `<i class="fas fa-bookmark"></i> Saved`;
        showNotification('Recipe saved!', 'success');
        
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 300);
    }
    
    localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    updateStats();
    
    if (document.getElementById('home').classList.contains('active')) {
        renderRecipes(currentRecipes);
    }
}

// Timer functionality
let timerInterval = null;
let timerSeconds = 0;

function showTimerModal() {
    timerModal.style.display = 'block';
    resetTimer();
}

function startTimer() {
    if (timerInterval) return;
    
    timerInterval = setInterval(() => {
        timerSeconds--;
        updateTimerDisplay();
        
        if (timerSeconds <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            showNotification('Timer finished!', 'success');
            document.getElementById('start-timer').textContent = 'Start';
        }
    }, 1000);
    
    document.getElementById('start-timer').innerHTML = '<i class="fas fa-play"></i> Resume';
}

function pauseTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        document.getElementById('start-timer').innerHTML = '<i class="fas fa-play"></i> Resume';
    }
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
    document.getElementById('start-timer').innerHTML = '<i class="fas fa-play"></i> Start';
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    document.getElementById('timer-minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('timer-seconds').textContent = seconds.toString().padStart(2, '0');
}

// Timer event listeners
document.getElementById('start-timer').addEventListener('click', startTimer);
document.getElementById('pause-timer').addEventListener('click', pauseTimer);
document.getElementById('reset-timer').addEventListener('click', resetTimer);

document.querySelectorAll('.timer-preset').forEach(preset => {
    preset.addEventListener('click', function() {
        timerSeconds = parseInt(this.getAttribute('data-time'));
        updateTimerDisplay();
    });
});

// Clear Saved Recipes
clearSavedBtn.addEventListener('click', function() {
    if (savedRecipes.length > 0) {
        if (confirm('Are you sure you want to clear all saved recipes?')) {
            savedRecipes = [];
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
            renderSavedRecipes();
            updateStats();
            showNotification('All saved recipes cleared', 'info');
        }
    }
});

function renderSavedRecipes() {
    savedRecipesContainer.innerHTML = '';
    
    if (savedRecipes.length === 0) {
        emptySaved.style.display = 'block';
        return;
    }
    
    emptySaved.style.display = 'none';
    
    savedRecipes.forEach((recipe, index) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            ${recipe.source ? `<div class="source-badge">${recipe.source}</div>` : ''}
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'">
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-info">
                    <span><i class="far fa-clock"></i> ${recipe.time} min</span>
                    <span><i class="fas fa-user-friends"></i> ${recipe.servings} servings</span>
                    <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                </div>
                <div class="recipe-actions">
                    <button class="btn-view" data-saved-index="${index}">
                        <i class="fas fa-utensils"></i> Cook
                    </button>
                    <button class="btn-save saved" data-saved-index="${index}">
                        <i class="fas fa-bookmark"></i> Saved
                    </button>
                </div>
            </div>
        `;
        savedRecipesContainer.appendChild(card);
    });
    
    document.querySelectorAll('.btn-view[data-saved-index]').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-saved-index');
            showRecipeDetail(savedRecipes[index]);
        });
    });
    
    document.querySelectorAll('.btn-save[data-saved-index]').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = this.getAttribute('data-saved-index');
            const recipe = savedRecipes[index];
            
            savedRecipes = savedRecipes.filter(saved => saved.id !== recipe.id);
            localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
            
            renderSavedRecipes();
            updateStats();
            
            if (document.getElementById('home').classList.contains('active')) {
                renderRecipes(currentRecipes);
            }
            
            showNotification('Recipe removed from saved', 'info');
        });
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const icon = notification.querySelector('.notification-icon');
    const messageEl = notification.querySelector('.notification-message');
    
    switch(type) {
        case 'success':
            icon.className = 'notification-icon fas fa-check-circle';
            notification.className = 'notification show';
            break;
        case 'error':
            icon.className = 'notification-icon fas fa-exclamation-circle';
            notification.className = 'notification error show';
            break;
        case 'warning':
            icon.className = 'notification-icon fas fa-exclamation-triangle';
            notification.className = 'notification warning show';
            break;
        case 'info':
            icon.className = 'notification-icon fas fa-info-circle';
            notification.className = 'notification show';
            break;
    }
    
    messageEl.textContent = message;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Loading Animation
function showLoading(show) {
    if (show) {
        loading.classList.add('show');
    } else {
        loading.classList.remove('show');
    }
}

// Close Modals
closeModal.addEventListener('click', function() {
    recipeModal.style.display = 'none';
    timerModal.style.display = 'none';
});

window.addEventListener('click', function(e) {
    if (e.target === recipeModal) {
        recipeModal.style.display = 'none';
    }
    if (e.target === timerModal) {
        timerModal.style.display = 'none';
    }
});

// Switch to Home Page
function switchToHome() {
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('.nav-link[href="#home"]').classList.add('active');
    
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === 'home') {
            page.classList.add('active');
        }
    });
}

// Initialize
initSpeechRecognition();
renderSavedRecipes();
updateStats();
renderIngredients();

// Add some initial stats animation on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        animateCount(recipesCountElement, currentRecipes.length, 1500);
        animateCount(ingredientsCountElement, ingredients.length, 1500);
        animateCount(timeSavedElement, currentRecipes.length * 15, 1500);
        animateCount(savedCountElement, savedRecipes.length, 1500);
    }, 500);
});