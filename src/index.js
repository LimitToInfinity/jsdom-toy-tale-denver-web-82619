const toyURL = "http://localhost:3000/toys"

const addBtn = document.querySelector('#new-toy-btn')
const toyFormContainer = document.querySelector('.container')
const toyForm = document.querySelector(".add-toy-form")
const toyCollection = document.querySelector("#toy-collection")

let addToy = false
let allToys = null

getToys()

function getToys() {
  fetch(toyURL)
  .then(parseJSON)
  .then(showToys)
}

addBtn.addEventListener('click', displayToy)
toyFormContainer.addEventListener('submit', newToy)

function displayToy() {
  addToy = !addToy
  if (addToy) {
    toyFormContainer.style.display = 'block'
  } else {
    toyFormContainer.style.display = 'none'
  }
}

function newToy(event) {
  event.preventDefault()

  // const toyName = document.querySelectorAll(".input-text")[0]["value"]
  // const toyImg = document.querySelectorAll(".input-text")[1]["value"]

  const formData = new FormData(toyForm);

  const name = formData.get("name");
  const image = formData.get("image");
  const likes = 0
  
  const toyBody = {
    name,
    image,
    likes
  }

  fetchCall(toyURL, "POST", toyBody)
  .then(parseJSON)
  .then(addToAllToys)
  .then(createToyCard)
}

function addToAllToys(toy) {
  allToys.push(toy)
  
  return toy
}

function showToys(toys) {
  allToys = toys

  toys.forEach(createToyCard)
}

function createToyCard(toy) {

  const card = document.createElement('div')
  card.className = 'card'

  console.log(toy)

  card.innerHTML = `
  <h2>${toy.name}</h2>
  <img src=${toy.image} class="toy-avatar" />
  <p>${toy.likes} Likes</p>
  `  
  const likeButton = document.createElement("button");
  likeButton.classList.add("like-btn")
  likeButton.innerText = "Like <3"

  card.append(likeButton);
  toyCollection.appendChild(card)

  likeButton.addEventListener("click", increaseLikes)
}

function increaseLikes(event) {
  const likeElement = event.target.parentNode.querySelector('p')
  const likes = likeElement.innerText
  const likesArray = likes.split(" ")
  const newLikes = parseInt(likesArray[0]) + 1

  likeElement.innerText = `${newLikes} Likes`
  
  dbIncrease(event, newLikes)
}

function dbIncrease(event, newLikes){
  const toyName = event.target.parentNode.querySelector('h2').innerText
  let toyObj = allToys.filter(toy => toy.name === toyName)
  toyObj = toyObj[0]

  const thisToyURL = `${toyURL}/${toyObj.id}`
  const toyBody = { "likes": newLikes }
  
  fetchCall(thisToyURL, "PATCH", toyBody)
}

function fetchCall(url, method, body) {
  return fetch(url, 
  {
    method,
    headers:
    {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(body)
  })
}

function parseJSON(response) {
  return response.json()
}