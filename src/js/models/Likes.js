export default class Likes {
  constructor() {
    this.likes = []
  }

  addLike(id, img, title, author) {
    const like = { id, img, title, author }
    this.likes.push(like)

    //Persist data
    this.persistData()

    return like
  }

  deleteLike(id) {
    const index = this.likes.findIndex(el => el.id === id)

    if (index > -1) {
      this.likes.splice(index, 1)
    }

    //Persist data
    this.persistData()
  }

  isLiked(id) {
    return this.likes.findIndex(el => el.id === id) !== -1
  }

  getTotalLikes() {
    return this.likes.length
  }

  persistData() {
    localStorage.setItem('likes', JSON.stringify(this.likes))
  }

  retrieveData() {
    const storage = JSON.parse(localStorage.getItem('likes'))
    if (storage) this.likes = storage
  }
}