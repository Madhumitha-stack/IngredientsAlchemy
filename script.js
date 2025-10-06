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

// Spoonacular API Configuration
const SPOONACULAR_API_KEY = 'c989a4744a214323a999204c4ab2326c';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

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
    ingredients = ['chicken', 'tomato', 'cheese', 'garlic', 'onion'];
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

// Find Recipes with Spoonacular API
findRecipesBtn.addEventListener('click', findRecipes);

async function findRecipes() {
    if (ingredients.length === 0) {
        showNotification('Please add at least one ingredient!', 'warning');
        return;
    }
    
    showLoading(true);
    
    try {
        const ingredientsString = ingredients.join(',');
        const apiUrl = `${SPOONACULAR_BASE_URL}/findByIngredients?ingredients=${ingredientsString}&number=12&apiKey=${SPOONACULAR_API_KEY}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        const detailedRecipes = await Promise.all(
            data.map(async (recipe) => {
                const detailUrl = `${SPOONACULAR_BASE_URL}/${recipe.id}/information?apiKey=${SPOONACULAR_API_KEY}`;
                const detailResponse = await fetch(detailUrl);
                return detailResponse.json();
            })
        );
        
        currentRecipes = detailedRecipes.map(recipe => ({
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            time: recipe.readyInMinutes,
            servings: recipe.servings,
            difficulty: getDifficulty(recipe.readyInMinutes),
            ingredients: recipe.extendedIngredients.map(ing => ing.name.toLowerCase()),
            instructions: recipe.instructions || 'No instructions available.',
            summary: recipe.summary,
            sourceUrl: recipe.sourceUrl
        }));
        
        let filteredRecipes = applyAllFilters(currentRecipes);
        
        renderRecipes(filteredRecipes);
        showNotification(`Found ${filteredRecipes.length} recipes!`, 'success');
        
        updateStats();
        
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error fetching recipes:', error);
        showNotification('Failed to fetch recipes. Using demo data instead.', 'error');
        
        currentRecipes = generateMockRecipes(ingredients);
        let filteredRecipes = applyAllFilters(currentRecipes);
        
        renderRecipes(filteredRecipes);
        updateStats();
    } finally {
        showLoading(false);
    }
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

// Helper function to determine difficulty based on cooking time
function getDifficulty(cookingTime) {
    if (cookingTime <= 15) return 'easy';
    if (cookingTime <= 30) return 'medium';
    return 'hard';
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
    
    // Apply filters - FIXED
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

// Demo data fallback
function generateMockRecipes(ingredients) {
    const recipeTemplates = [
        {
            id: 1,
            title: "Hearty Vegetable Stir Fry",
            image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            time: 25,
            servings: 2,
            difficulty: 'easy',
            ingredients: ["broccoli", "carrot", "pepper", "garlic", "onion"],
            instructions: "1. Heat oil in a wok or large skillet over high heat.\n2. Add garlic and onion, stir-fry for 1 minute.\n3. Add remaining vegetables and stir-fry for 5-7 minutes until crisp-tender.\n4. Season with soy sauce and serve hot.",
            tags: ["quick", "vegetarian", "healthy"]
        },
        {
            id: 2,
            title: "Creamy Chicken Pasta",
            image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            time: 35,
            servings: 4,
            difficulty: 'medium',
            ingredients: ["chicken", "garlic", "onion", "cheese"],
            instructions: "1. Cook pasta according to package directions.\n2. Sauté chicken with garlic and onion until cooked through.\n3. Add cream and cheese, simmer until sauce thickens.\n4. Combine with pasta and serve.",
            tags: ["creamy", "comfort food"]
        },
        {
            id: 3,
            title: "Fresh Tomato Bruschetta",
            image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
            time: 15,
            servings: 4,
            difficulty: 'easy',
            ingredients: ["tomato", "garlic", "onion"],
            instructions: "1. Dice tomatoes and combine with minced garlic and onion.\n2. Add olive oil, salt, and basil.\n3. Spoon mixture onto toasted bread slices.\n4. Serve immediately.",
            tags: ["quick", "appetizer", "vegetarian"]
        }
    ];
    
    const matchingRecipes = recipeTemplates.filter(recipe => {
        return ingredients.some(ingredient => 
            recipe.ingredients.includes(ingredient)
        );
    });
    
    if (matchingRecipes.length === 0) {
        return recipeTemplates.slice(0, 3);
    }
    
    return matchingRecipes.slice(0, 6);
}

function renderRecipes(recipes) {
    recipesContainer.innerHTML = '';
    
    if (recipes.length === 0) {
        recipesContainer.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><h3>No recipes found</h3><p>Try adding different ingredients or changing filters!</p></div>';
        document.getElementById('results-count').textContent = '0 recipes found';
        return;
    }
    
    document.getElementById('results-count').textContent = `${recipes.length} recipes found`;
    
    recipes.forEach((recipe, index) => {
        const isSaved = savedRecipes.some(saved => saved.id === recipe.id);
        const matchingIngredients = recipe.ingredients.filter(ing => ingredients.includes(ing));
        
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            ${matchingIngredients.length === recipe.ingredients.length ? '<div class="recipe-badge">All Ingredients Match!</div>' : ''}
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
            <div class="recipe-content">
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-info">
                    <span><i class="far fa-clock"></i> ${recipe.time} min</span>
                    <span><i class="fas fa-user-friends"></i> ${recipe.servings} servings</span>
                    <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                </div>
                <div class="recipe-ingredients">
                    <div class="ingredient-pills">
                        ${recipe.ingredients.slice(0, 5).map(ing => `
                            <span class="ingredient-pill ${ingredients.includes(ing) ? 'matched' : ''}" 
                                  data-ingredient="${ing}">${ing}</span>
                        `).join('')}
                        ${recipe.ingredients.length > 5 ? `<span class="ingredient-pill">+${recipe.ingredients.length - 5} more</span>` : ''}
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
            const ingredient = this.getAttribute('data-ingredient');
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
                <img src="${recipe.image}" alt="${recipe.title}" class="detail-image">
                <div class="detail-info">
                    <h2>${recipe.title}</h2>
                    <div class="detail-meta">
                        <span><i class="far fa-clock"></i> ${recipe.time} minutes</span>
                        <span><i class="fas fa-user-friends"></i> ${recipe.servings} servings</span>
                        <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                    </div>
                    <div class="detail-actions">
                        <button class="btn-primary" id="start-cooking">
                            <i class="fas fa-utensils"></i> Start Cooking
                        </button>
                        <button class="btn-save-large ${isSaved ? 'saved' : ''}" id="modal-save-btn">
                            <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i> 
                            ${isSaved ? 'Saved' : 'Save Recipe'}
                        </button>
                    </div>
                </div>
            </div>
            <div class="detail-content">
                <div class="ingredients-section">
                    <h3>Ingredients</h3>
                    <ul>
                        ${recipe.ingredients.map(ing => `
                            <li class="${ingredients.includes(ing) ? 'available' : ''}">
                                ${ing} ${ingredients.includes(ing) ? '✓' : ''}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="instructions-section">
                    <h3>Instructions</h3>
                    <div class="instructions-steps">
                        ${recipe.instructions.split('\n').map(step => `
                            <div class="instruction-step">
                                <span class="step-number">${step.split('.')[0]}</span>
                                <span class="step-text">${step.split('.').slice(1).join('.')}</span>
                            </div>
                        `).join('')}
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
            <img src="${recipe.image}" alt="${recipe.title}" class="recipe-image">
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