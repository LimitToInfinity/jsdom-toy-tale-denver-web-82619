const addBtn = document.querySelector('#new-toy-btn')
const toyForm = document.querySelector('.container')
const toyCollection = document.querySelector("#toy-collection")
const toyURL = "http://localhost:3000/toys"
let addToy = false
let allToys = null

document.addEventListener("DOMContentLoaded", () =>{
  getToys()
})

function getToys() {
  fetch(toyURL)
  .then(response => response.json())
  .then(showToys)
}

function showToys(toys) {
  allToys = toys
 toys.forEach(toy =>{
   const card = document.createElement('div')
   card.className = 'card'
   card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn">Like <3</button>
   `
   toyCollection.appendChild(card)
 })
 likeButton()
}

addBtn.addEventListener('click', () => {
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
  } else {
    toyForm.style.display = 'none'
  }
})

toyForm.addEventListener('submit', () => {
  event.preventDefault()
  const toyName = document.querySelectorAll(".input-text")[0]["value"]
  const toyImg = document.querySelectorAll(".input-text")[1]["value"]
  fetch(toyURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "name": toyName,
      "image": toyImg,
      "likes": 0
    })
  }).then(response => response.json())
})

function likeButton() {
  const allLikeButtons = document.querySelectorAll(".like-btn")
  for (likeButton of allLikeButtons) {
    likeButton.addEventListener("click", (e) => {
      increaseLikes(e)
    })
  }
}

function increaseLikes(e) {
  const likeElement =e.target.parentNode.querySelector('p')
  const likes = likeElement.innerText
  const likesArray = likes.split(" ")
  const newLikes = parseInt(likesArray[0]) + 1
  likeElement.innerText = `${newLikes} Likes`
  dbIncrease(e, newLikes)
}

function dbIncrease(e, newLikes){
  const toyName = e.target.parentNode.querySelector('h2').innerText
  let toyObj = allToys.filter(toy => toy.name === toyName)
  toyObj = toyObj[0]
  fetch(`${toyURL}/${toyObj.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": newLikes
    })
  })
  .then(response => response.json())
}