import { APIkey } from '../config';

export default class Search {
  constructor(query) {
    this.query = query
  }

  searchRecipes() {
    return fetch(`https://www.food2fork.com/api/search?key=${APIkey}&q=${this.query}`)
    // return fetch('https://api.edamam.com/search?q=pasta&app_id=5d0fbeb5&app_key=7bfbaaf4816774fa52ff1e1d29d28263&calories=591-722&health=alcohol-free')
    .then (resData => resData.json())
    .then (data => {
      this.result = data.recipes
    })
    .catch (error => alert(error))
  }
}

