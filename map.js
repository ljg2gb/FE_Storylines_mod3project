// Global Variables
const pointsURL = 'http://localhost:3000/points'
const usersURL = 'http://localhost:3000/users'
const loginURL = 'http://localhost:3000/login'
const storiesURL = 'http://localhost:3000/stories'

const $loginSignup = document.querySelector('#login-signup')
const $createNew = document.querySelector('#create-new-story')
const $interactiveMap = document.querySelector('#interactivemap')
const $createNewPoint = document.querySelector('#create-new-point')
const $displayStories = document.querySelector('#display-stories')
const $newStoryForm = document.querySelector('#create-new-story-form')

const $pointsForm = document.querySelector('#points-form')
const $signUpButton = document.querySelector('#sign-up-button')
const $signUpDiv = document.querySelector('#Signup')
const $loginButton = document.querySelector('#login-button')
const $loginDiv = document.querySelector('#Login')
const $logoutButton = document.querySelector('#logoutbutton')

// SPA DOM displays
isLoggedIn()
renderIntroMap()

hideOrDisplaySection($signUpDiv, 'none')
hideOrDisplaySection($loginDiv, 'none')
// hideOrDisplaySection($createNew, 'none')
// hideOrDisplaySection($interactiveMap, 'none')
hideOrDisplaySection($createNewPoint, 'none')


$signUpButton.addEventListener('click', displaysignUpForm)
$loginButton.addEventListener('click', displayLoginForm)
$logoutButton.addEventListener('click', logout )


// SECTIONS
// intromap
function renderIntroMap() {
    const intromap = L.map('intromap', { scrollWheelZoom: false }).setView([51.505, -0.09], 2);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoibGpnMmdiIiwiYSI6ImNrYW1xeHE4YzFoNncyeWw2NW83c3N4MDUifQ.qSHmG5Ee_suJ1KNUNHmxZQ'
    }).addTo(intromap);
}

// login-signup
function displaysignUpForm() {
    $loginDiv.style.display = 'none'
    $signUpDiv.style.display = 'block'
    $signUpDiv.addEventListener('submit', handleSignUp)
}

function displayLoginForm() {
    $signUpDiv.style.display = 'none'
    $loginDiv.style.display = 'block'
    $loginDiv.addEventListener('submit', handleLogin)
}

function handleLogin(event) {
    event.preventDefault()
    const loginFormData = new FormData(event.target)
    
    const username = loginFormData.get('username')
    const password = loginFormData.get('password')
    const loginBody = { username, password  } 
    
    fetchCall(loginURL, 'POST', loginBody)
    .then(parseJson)
    .then(result => {
        const token = result.token
        const user_id = result.user_id
        localStorage.setItem("token", token)
        localStorage.setItem("user_id", user_id)
    })
    .then(isLoggedIn)
    // .then(displayUserStories)
}

// create-new-story
$newStoryForm.addEventListener('submit', handleNewStoryForm)
$newStoryForm.addEventListener('submit', hideOrDisplaySection($interactiveMap, 'block'))

function handleNewStoryForm(event) {
    console.log('eventListenerWorking')
    event.preventDefault()
    const formData = new FormData(event.target)
    const title = formData.get('title')
    const description = formData.get('description')
    const date = formData.get('date')
    const status = formData.get('status')
    const user_id = localStorage.getItem("user_id")
    const newStoryBody = {title, description, date, status, user_id}

    fetchCall(storiesURL, 'POST', newStoryBody, 'auth')
        .then(parseJson)
        .then(NewStoryData)
    // add a function that sets title,decription,date,etc to the page next to interactive map
    
}
function NewStoryData(data) {
    const story_id = data.id
    const title = data.title
    console.log(story_id)
}



// points
$pointsForm.style.display = 'none'
$pointsForm.addEventListener('submit', (event => handleFormData(event)))


const mymap = L.map('interactivemap').setView([51.505, -0.09], 2);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibGpnMmdiIiwiYSI6ImNrYW1xeHE4YzFoNncyeWw2NW83c3N4MDUifQ.qSHmG5Ee_suJ1KNUNHmxZQ'
}).addTo(mymap);
mymap.on('click', onMapClick);

let points = []
function onMapClick(e) {
    const point = [e.latlng.lat, e.latlng.lng]
    points.push(point)
    displayForm(point)
    points.forEach(displayAllPointsOnMap)
}

function displayAllPointsOnMap(point) {
    L.marker(point).addTo(mymap)
}

function displayForm(point) {
    $createNewPoint.style.display = 'block'
    $pointsForm.style.display = 'block'
    document.getElementById("pre-populate-location-value").value = point
}

function handleFormData(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const name = formData.get('name')
    const post = formData.get('post')
    const latlng = formData.get('latlng')
    const story_id = formData.get('story_id')
    const pointBody = {name, post, latlng, story_id}
    displayFormInput(pointBody)
    fetchPostPoints(pointBody)
}

function displayFormInput(pointBody) {
    const $div = document.createElement('div')
    $div.innerHTML = `
    <h3>${pointBody.name}</h3>
    <p>${pointBody.post}</p>
    <p>${pointBody.latlng}</p>`
    document.body.append($div)
    // console.log(pointBody.name)

}

function fetchPostPoints(pointBody) {
    fetch(pointsURL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // "Authorization": `Bearer ${localStorage.token}`
        },
        body: JSON.stringify (pointBody)
    })
        .then(response => response.json())
        .then(console.log)
}

// helper functions
function isLoggedIn() {
    if (localStorage.getItem('token')){
        $logoutButton.style.display = 'block'
        hideOrDisplaySection($loginSignup, 'none')
        hideOrDisplaySection($createNew, 'block')
        // displayMap(latitude, longitude, zoom)
    } 
    else {
        $logoutButton.style.display = 'none'
        hideOrDisplaySection($loginSignup, 'block')
        hideOrDisplaySection($createNew, 'none')
    }
}

function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user_id")
    isLoggedIn()
}

function hideOrDisplaySection(section, characteristic){
    section.style.display = characteristic
}

function parseJson(response) {
    return response.json()
}

function fetchCall(url, method, data, auth) {
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
    if (auth) {
        headers["Authorization"] = `Bearer ${localStorage.token}`
    }
    const body = JSON.stringify(data)
    return fetch(url, { method, headers, body })
  }

  function handleFetchResponse(response) {
    console.log('we got a response from the backend', response)
    if (!response.ok) {
        console.log("error!")
        // $error.textContent = errorMessages[response.status]
    }
    else {
        parseJson(response)
    }
}