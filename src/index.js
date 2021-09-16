let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

document.querySelector('form.add-toy-form').addEventListener('submit', e => {
  e.preventDefault()
  addNewToy(e);
})

//fetch request for toys
function getToys() {
  fetch('http://localhost:3000/toys')
  .then(res => res.json())
  .then(data => {
    renderToyCard(data);
  })
}

//make cards for each toy
function renderToyCard(data) {
  //console.log(data)
  for (let toy in data) {
    //console.log(data[toy].name)
    const newToy = document.createElement('div')
    newToy.className = 'card'
    document.querySelector('#toy-collection').appendChild(newToy)
    const h2 = document.createElement('h2')
    h2.innerText = data[toy].name
    newToy.appendChild(h2)
    const img = document.createElement('img')
    img.src = data[toy].image
    img.className = 'toy-avatar'
    newToy.appendChild(img)
    const p = document.createElement('p')
    p.innerText = `${data[toy].likes} Likes`
    newToy.appendChild(p)
    const button = document.createElement('button')
    button.className = 'like-btn'
    button.id = data[toy].id
    button.innerText = 'Like'
    newToy.appendChild(button)
    //add event listener on like button
    button.addEventListener('click', () => increaseLike(p.innerText.split(' ')[0], button))
  }
}

//increaseLike function with patch request
function increaseLike(currentLikes, button) {
  const toyID = button.id
  const updatedLikes = ++currentLikes
  fetch(`http://localhost:3000/toys/${toyID}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        "likes": updatedLikes
      })
    })
    .then(res => res.json())
    .then(() => {
      const div = button.parentNode
      div.querySelector('p').innerText = `${updatedLikes} Likes`
    })
}

//adding new toy with post request
function addNewToy (e) {
    fetch('http://localhost:3000/toys', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        "name": e.target.name.value,
        "image": e.target.image.value,
        "likes": 0
      })
    })
    .then(res => res.json())
    .then((data) => {
    //console.log(data.likes)
    const newToy = document.createElement('div')
      newToy.className = 'card'
      document.querySelector('#toy-collection').appendChild(newToy)
      const h2 = document.createElement('h2')
      h2.innerText = e.target.name.value
      newToy.appendChild(h2)
      const img = document.createElement('img')
      img.src = e.target.image.value
      img.className = 'toy-avatar'
      newToy.appendChild(img)
      const p = document.createElement('p')
      p.innerText = `0 Likes`
      newToy.appendChild(p)
      const button = document.createElement('button')
      button.className = 'like-btn'
      button.id = data.id
      button.innerText = 'Like'
      newToy.appendChild(button)
      //add event listener for like button
      button.addEventListener('click', () => increaseLike(p.innerText.split(' ')[0], button))
      })
}

getToys();