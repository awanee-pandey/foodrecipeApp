
import Search from './models/Search';
import recipe from './models/recipe'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

import {elements,renderLoader,clearLoader} from './views/base';
import Recipe from './models/recipe';

/* Global state of the app
--- Search Object
--- current recipe object
--- shopping list object
--- Liked  recipe  
*/   
const state ={};

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async ()=>{
    // 1. Get query from view 
   const query= searchView.getInput();
  
    if(query){
        //2. New search object and add to state
        state.search =new Search(query);
        //3 prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResult);
        try{
        //4. Search for recipe
        await state.search.getResults();

        //5. render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        }catch(err){
            console.log(err);
            clearLoader();
        }
    }
}

elements.searchForm.addEventListener('submit', e=>{
    e.preventDefault();
    controlSearch();
});  


/*const search =  new Search('pizza');
//console.log(search);
search.getResults();*/

elements.searchResultPages.addEventListener('click',e=>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goTopage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goTopage);
        console.log(goTopage);
    }
}) 

/**
 * RECIPE CONTROLLER
 */

 const controlRecipe = async() =>{
     //get ID from URL
     const id = window.location.hash.replace('#','');
     console.log(id);
     if(id){
         //prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

         //create new recipe object
         state.recipe =new recipe(id);

    
        try{
         //get recipe data
         await state.recipe.getRecipe();
         state.recipe.parseIngredients();
         //calculate servings and time
         state.recipe.calcTime();
         state.recipe.calcServings();

         //Reder recipe
           clearLoader();
           recipeView.renderRecipe(state.recipe);

        }catch(err){
            alert('Error while processing the recipes')
        }

     }
 }

//window.addEventListener('hashchange',controlRecipe);
//window.addEventListener('load',controlRecipe);

['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));
