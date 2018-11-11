import { elements } from './base';

export const getInput = () => elements.searchInput.value

export const limitTitle = (title, limit = 17) => {
    if (title.length > limit) {
			const newTitle = [];

			title.split(' ').reduce((sum, cur) => {
				if ((sum + cur.length) <= limit) {
					newTitle.push(cur)
				}
				return sum + cur.length //In reduce(), value of return will be the new accumulater while doing the loop
			}, 0)
			
			return `${newTitle.join(' ')}...`
    }
		
		return title
}

//Type: prev || next
const createButton = (page, type) => `
	<button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? (page - 1) : (page + 1)}>
			<svg class="search__icon">
					<use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
			</svg>
			<span>Page ${type === 'prev' ? (page - 1) : (page + 1)}</span>
	</button>
	`


const renderButtons = (page, totalResults, resPerPage) => {
	const pages = Math.ceil(totalResults / resPerPage)

	let button;
	if (page === 1 && pages > 1) {
		//Render 1 'next' button
		button = createButton(page, 'next')
	} else if (page === pages && pages > 1) {
		//Render 1 'prev' button
		button = createButton(page, 'prev')
	} else if (1 < page < pages) {
		//Render 2 buttons
		button = `
			${createButton(page, 'prev')}
			${createButton(page, 'next')}
		`
	}

	elements.resultPage.insertAdjacentHTML('afterbegin', button)
}

export const clearButtons = () => {
	elements.resultPage.innerHTML = ''
}

export const renderList = (recipes, page = 1, resPerPage = 10) => {
	const start = (page - 1) * resPerPage;
	const end = page * resPerPage;

  recipes.slice(start, end).forEach(recipe => {
    const item = `
        <li>
          <a class="results__link" href="#${recipe.recipe_id}">
              <figure class="results__fig">
                  <img src="${recipe.image_url}" alt="${recipe.title}">
              </figure>
              <div class="results__data">
                  <h4 class="results__name">${limitTitle(recipe.title)}</h4>
                  <p class="results__author">${recipe.publisher}</p>
              </div>
          </a>
        </li>
    `
    elements.resultList.insertAdjacentHTML('beforeend', item)
	})
	
	renderButtons(page, recipes.length, resPerPage)
}

export const clearInput = () => {
    elements.searchInput.value = ''
}

export const clearResults = () => {
    elements.resultList.innerHTML = ''
}

export const highlightSelected = (id) => {
	Array.from(document.querySelectorAll('.results__link')).forEach(el => el.classList.remove('results__link--active'))

	document.querySelector(`.results__link[href*="#${id}"]`).classList.add('results__link--active')
}