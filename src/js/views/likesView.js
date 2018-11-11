import { limitTitle } from './searchView';
import { elements } from './base';

export const toggleHeartIcon = (isLiked) => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined'
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`)
}

export const renderLikesList = (like) => {
  const markup = `
    <li>
      <a class="likes__link" href="#${like.id}">
          <figure class="likes__fig">
              <img src="${like.img}" alt="Test">
          </figure>
          <div class="likes__data">
              <h4 class="likes__name">${limitTitle(like.title)}</h4>
              <p class="likes__author">${like.author}</p>
          </div>
      </a>
  </li>
  `
  elements.likesList.insertAdjacentHTML('afterbegin', markup)
}

export const deleteLike = (id) => {
  const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement
  if (el) {
    el.parentElement.removeChild(el)
  }
}
export const toggleLikeMenu = numOfLikes => {
  elements.likesMenu.style.visibility = numOfLikes > 0 ? 'visible' : 'hidden' 
}