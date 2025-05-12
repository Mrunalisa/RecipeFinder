document.addEventListener('DOMContentLoaded', () => {
    fetchRandomRecipes(18);
});

const searchBtn = document.querySelector('.searchbtn');
const searchbox = document.querySelector('.searchbox');
const recipecontainer = document.querySelector('.recipe-container');
const recipedetailscontent = document.querySelector('.recipe-details-content');
const recipeclosebtn = document.querySelector('.recipe-closebtn');
const favMealsContainer = document.querySelector('.fav-meals-container');

const fetchRandomRecipes = async (count) => {
    try {
        recipecontainer.innerHTML = `<h2 class="cnd-msg">Fetching Random Recipes....</h2>`;
        const promises = Array.from({ length: count }, () =>
            fetch('https://www.themealdb.com/api/json/v1/1/random.php').then(response => response.json())
        );

        const responses = await Promise.all(promises);
        console.log(responses);
        recipecontainer.innerHTML = "";

        responses.forEach(response => {
            response.meals.forEach(meal => {
                const recipeDiv = createRecipeDiv(meal);
                recipecontainer.appendChild(recipeDiv);
            });
        });
    } catch (error) {
        recipecontainer.innerHTML = `<h2 class="cnd-msg">Error While Fetching Random Recipes. Sorry!</h2>`;
    }
};

const createRecipeDiv = (meal) => {
    const recipeDiv = document.createElement('div');
    recipeDiv.classList.add('recipe');
    recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <h3>${meal.strMeal}</h3>
        <p><span>${meal.strArea}</span> Dish</p>
        <p>Belongs To <span>${meal.strCategory}</span> Category</p>
        <button class="view-recipe-btn">View Recipe</button>
        <button class="watch-recipe-btn">Watch Recipe</button>
        <button class="add-to-fav-btn">Add to Favorites</button>
    `;

    const viewRecipeBtn = recipeDiv.querySelector('.view-recipe-btn');
    viewRecipeBtn.addEventListener('click', () => openRecipePopup(meal));

    const watchRecipeBtn = recipeDiv.querySelector('.watch-recipe-btn');
    watchRecipeBtn.addEventListener('click', () => window.open(meal.strYoutube));

    const addToFavBtn = recipeDiv.querySelector('.add-to-fav-btn');
    addToFavBtn.addEventListener('click', () => addToFavorites(meal));

    return recipeDiv;
};

const addToFavorites = (meal) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(meal);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavoriteMeals();
};

const displayFavoriteMeals = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favMealsContainer.innerHTML = "";

    if (favorites.length === 0) {
        favMealsContainer.innerHTML = "<p>No favorite meals yet.</p>";
    } else {
        favorites.forEach(meal => {
            const favMealDiv = createFavoriteMealDiv(meal);
            favMealsContainer.appendChild(favMealDiv);
        });
    }
};

const createFavoriteMealDiv = (meal) => {
    const favMealDiv = document.createElement('div');
    favMealDiv.classList.add('fav-meal');
    favMealDiv.innerHTML = `
    <div clas="fav-img">
    <img src="${meal.strMealThumb}">
    </div>
    <div clas="fav-info">
    <h3>${meal.strMeal}</h3>
    <p><span>${meal.strArea}</span> Dish</p>
    <p>Belongs To <span>${meal.strCategory}</span> Category</p>
    <button class="view-recipe-btn">View Recipe</button>
    <button class="watch-recipe-btn">Watch Recipe</button>
    <button class="remove-from-fav-btn">Remove from Favorites</button>
    </div>
    `;

    const viewRecipeBtn = favMealDiv.querySelector('.view-recipe-btn');
    viewRecipeBtn.addEventListener('click', () => openRecipePopup(meal));

    const watchRecipeBtn = favMealDiv.querySelector('.watch-recipe-btn');
    watchRecipeBtn.addEventListener('click', () => window.open(meal.strYoutube));

    const removeFromFavBtn = favMealDiv.querySelector('.remove-from-fav-btn');
    removeFromFavBtn.addEventListener('click', () => removeFromFavorites(meal.idMeal));

    return favMealDiv;
};

const removeFromFavorites = (mealId) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(meal => meal.idMeal !== mealId);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayFavoriteMeals();
};

const openRecipePopup = (meal) => {
    recipedetailscontent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="IngredientList">${fetchIngredients(meal)}</ul>
        <div>
        <h3>Instructions:</h3>
        <p class="recipeInstructions">${meal.strInstructions}</p>
    </div>
`;
recipedetailscontent.parentElement.style.display = "block";
};

const fetchIngredients = (meal) => {
let ingredients = "";
for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
        const measure = meal[`strMeasure${i}`];
        ingredients += `<li>${ingredient} ${measure}</li>`;
    } else {
        break;
    }
}
return ingredients;
};

searchBtn.addEventListener('click', (e) => {
e.preventDefault();
const searchInput = searchbox.value.trim();
if (!searchInput) {
    recipecontainer.innerHTML = `<h2 class="cnd-msg">Type the meal in the search box.</h2>`;
    return;
}
fetchRecipes(searchInput);
});

recipeclosebtn.addEventListener('click', () => {
recipedetailscontent.parentElement.style.display = "none";
});

const fetchRecipes = async (query) => {
try {
    recipecontainer.innerHTML = `<h2 class="cnd-msg">Fetching Recipes....</h2>`;
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    const response = await data.json();
    console.log(response);
    recipecontainer.innerHTML = "";
    
    response.meals.forEach(meal => {
        const recipeDiv = createRecipeDiv(meal);
        recipecontainer.appendChild(recipeDiv);
    });
} catch (error) {
    recipecontainer.innerHTML = `<h2 class="cnd-msg">Error While Fetching Recipes/ May be Recipe is not found<br>Sorry</h2>`;
}
};

displayFavoriteMeals();

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en', 
        includedLanguages: 'en,es,fr,ab,de,it,pt,nl,ru,zh,ja,ko,ar,hi,bn,ur,gu,mr', 
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
}

function changeLanguage(selectedLanguage) {
    google.translate.element.langPair.value = `${selectedLanguage}|en`;
    google.translate.element.updatePageLanguage(selectedLanguage);
}
