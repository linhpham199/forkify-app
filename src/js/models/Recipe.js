import { APIkey } from '../config';

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  getRecipe() {
    return fetch(`https://www.food2fork.com/api/get?key=${APIkey}&rId=${this.id}`)
    .then (resData => resData.json())
    .then (data => {
      const info = data.recipe

      this.title = info.title
      this.author = info.publisher
      this.img = info.image_url
      this.url = info.f2f_url
      this.ingredients = info.ingredients
      console.log(data)
    })
    .catch (error => alert(error))
  }

  calcTime() {
    // Assuming we need 15 mins for every 3 ingredients
    console.log(this.ingredients)
    const numOfIng = this.ingredients.length
    const periods = Math.ceil(numOfIng / 3)
    this.time =  periods * 15
  }

  calcServings() {
    this.servings = 4
  }

  parseIngredients() {
    const unitsLong = ['tablespoon', 'tablespoons', 'teaspoons', 'teaspoon', 'ounces', 'ounces,', 'ounce', 'cups', 'pounds']
    const unitsShort = ['tbsp', 'tbsp', 'tsp', 'tsp', 'oz', 'oz', 'oz', 'cup', 'pound']
    const units = [...unitsShort, 'kg', 'g']

    const newIngredients = this.ingredients.map(ing => {
      let ingredient = ing.toLowerCase();

      // 1. Remove infomation inside parantheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ")

      // 2.Uniform unit of ingredients
      const arrIng = ingredient.split(' ').map((unit) => {
        if (unitsLong.includes(unit)) {
          unit = units[unitsLong.indexOf(unit)]
        }
        return unit
      })

      ingredient = arrIng.join(' ')

      // 3. Parse ingredients into object {count: '', unit: '', ingredient: ''}
      const unitIndex = arrIng.findIndex(el => units.includes(el))

      let ObjIng;
      if (unitIndex > -1) {
        // There is a unit
        let count
        const arrCount = arrIng.slice(0, unitIndex)

        if (arrCount.length === 1) {
          count = eval(arrCount[0].replace('-', '+'))
        } else {
          count = eval(arrCount.join('+'))
        }

        ObjIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' ')
        }
      } else if (parseInt(arrIng[0])) {
        // There is no unit but there is quantity
        ObjIng = {
          count: parseInt(arrIng[0]),
          unit: '',
          ingredient: arrIng.slice(1).join(' ')
        }
      } else if (unitIndex === -1) {
        // There is no unit and no quantity
        ObjIng = {
          count: 1,
          unit: '',
          ingredient
        }
      }
      return ObjIng
    })
    this.ingredients = newIngredients
  }
  
  updateServings(type) {
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1

    this.ingredients.forEach(ing => ing.count *= newServings /  this.servings)

    this.servings = newServings
  }
}