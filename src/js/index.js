// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import List from './models/List';
import Likes from './models/Likes';

const state = {}

// SEARCH CONTROLLER
const ctrlSearch = async() => {

  //1. Get query from view
  const query = searchView.getInput()

  if (query) {
    //2. New search object and add to state
    state.search = new Search(query)
    
    try {
      //3. Clear the UI, prepare for what happens next
      searchView.clearInput()
      searchView.clearResults()
      searchView.clearButtons()
      renderLoader(elements.resultList)
  
      //4. Search for recipes
      await state.search.searchRecipes()
  
      //5.Render results in UI
      console.log(state.search.result)
      clearLoader();
      searchView.renderList(state.search.result)

    } catch(erro) {
      alert('Error!')
    }
   
  }
}

elements.searchForm.addEventListener('submit', e => {
  e.preventDefault();
  ctrlSearch();
})

elements.resultPage.addEventListener('click', e => {
  const btn = e.target.closest('.btn-inline')
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto)
    searchView.clearResults()
    searchView.clearButtons()
    searchView.renderList(state.search.result, goToPage)
  }
})

//RECIPE CONTROLLER
const ctrlRecipe = async () => {
  //1. Get id from link
  const id = window.location.hash.replace('#','')

  // Prepare UI
  recipeView.clearRecipe();

  if (id) {
    renderLoader(elements.recipe);
    if (state.search) searchView.highlightSelected(id)

    //2. New recipe object and add to state
    state.recipe = new Recipe(id)

    try {
      //3. Get recipe
      await state.recipe.getRecipe();
      state.recipe.calcServings();
      state.recipe.calcTime();
      state.recipe.parseIngredients();

      //4. Render recipe UI
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))

    } catch(error) {
      alert('Error rendering recipe!')
      console.log(error)
    }
    
  }
}

['hashchange', 'load'].forEach(action =>  window.addEventListener(action, ctrlRecipe))

//SHOPPING LIST CONTROLLER
const ctrlList = () => {
  //New list object
  if (!state.list) {
    state.list = new List()
  }

  //Add ingredients to list
  state.recipe.ingredients.map(item => state.list.addItem(item.count, item.unit, item.ingredient))

  //Render list UI
  state.list.items.map(item => listView.renderItem(item))
}

//LIKES CONTROLLER
const ctrlLikes = () => {
  if (!state.likes) {
    state.likes = new Likes()
  }

  const id = state.recipe.id

  if (!state.likes.isLiked(id)) {
    //Add like to data
    const newLike = state.likes.addLike(id, state.recipe.img, state.recipe.title, state.recipe.author)

    //Toggle heart icon
    likesView.toggleHeartIcon(true)

    //Add to list
    likesView.renderLikesList(newLike)
  } else {
    //Remove like in data
    state.likes.deleteLike(id)

    //Toggle heart icon
    likesView.toggleHeartIcon(false)

    //Remove from list
    likesView.deleteLike(id)
  }
  likesView.toggleLikeMenu(state.likes.getTotalLikes())
}

window.addEventListener('load', () => {
  state.likes = new Likes()

  //Get likes in the storage
  state.likes.retrieveData()

  //Toggle like menu
  likesView.toggleLikeMenu(state.likes.getTotalLikes())

  //Render each of the like in the list
  console.log(state.likes.likes)
    state.likes.likes.forEach(like => likesView.renderLikesList(like))
  
})

elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease * ')) {
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec')
      recipeView.updateServingsIngredients(state.recipe)
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    state.recipe.updateServings('inc')
    recipeView.updateServingsIngredients(state.recipe)    
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
    ctrlList()
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    ctrlLikes()
  }
})

elements.list.addEventListener('click', e => {
  const id = e.target.closest('.shopping__item').dataset.itemid

  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
    listView.deleteItem(id)
    state.list.deleteItem(id)
  } else if (e.target.matches('.shopping__count--value')) {
    const value = e.target.value 
    state.list.updateCount(id, value)
    console.log(state.list)
  }
})
