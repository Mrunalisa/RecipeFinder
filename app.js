const searchBtn=document.querySelector('.searchbtn');
const searchbox=document.querySelector('.searchbox');
const recipecontainer=document.querySelector('.recipe-container');

const recipedetails=document.querySelector('.recipe-details');
const recipedetailscontent=document.querySelector('.recipe-details-content');
const recipeclosebtn=document.querySelector('.recipe-closebtn');

const fetchRecipes = async (query) =>{
    recipecontainer.innerHTML="<h2>Fetching Recipes....</h2>";
    const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
    // const data = await fetch(`https://api.edamam.com/search?q=${query}&app_id=7aa516a5&app_key=dc836a223fb788b11ae390504d9e97ce&from=0&to=10`);
    const response=await data.json();
 console.log(response);
 recipecontainer.innerHTML="";
    response.meals.forEach(meal=>{
        const recipeDiv=document.createElement('div');
        recipeDiv.classList.add('recipe');
        recipeDiv.innerHTML=`
        <img src="${meal.strMealThumb}">
            <h3>${meal.strMeal}</h3>
            <p><span>${meal.strArea}</span> Dish</p>
            <p>Belongs To <span>${meal.strCategory}</span> Category</p>
            `

            const viewrecipebtn=document.createElement('button');
            viewrecipebtn.innerHTML="View Recipe";
            recipeDiv.appendChild(viewrecipebtn);
            
            viewrecipebtn.addEventListener('click',()=>{
                openRecipePopup(meal);
            }); 

            const watchbtn=document.createElement('button');
            watchbtn.innerHTML="Watch Recipe";
            recipeDiv.appendChild(watchbtn);

        recipecontainer.appendChild(recipeDiv);


        watchbtn.addEventListener('click',()=>{
            window.open(meal.strYoutube);
        });

    });

}

const openRecipePopup=(meal)=>{
    recipedetailscontent.innerHTML=`
    <h2>${meal.strMeal}</h2>
    <h3>Ingredents:</h3>
    <ul>${fetchIngreadients(meal)}</ul>
<div>
    <h3></h3>
    <p></p>
</div>

  `  


    recipedetailscontent.parentElement.style.display="block";

}
// Fetching Ingredients for the meal and return it as a list item in html format
const fetchIngreadients=(meal)=>{
    
    let ingreadients="";
    for(let i=1;i<=20;i++){
       const Ingredient=meal[`strIngredient${i}`];
       if(Ingredient){
        const measure=meal[`strMeasure${i}`];
        ingreadients+=`<li>${Ingredient} ${measure}</li>`;
        }
        else{
            break;
        }
       
}
return ingreadients;
}
searchBtn.addEventListener('click',(e)=>{
    e.preventDefault();
    const searchInput=searchbox.value.trim();
    fetchRecipes(searchInput);
});