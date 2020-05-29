// Global Variables
const pointsURL = 'http://localhost:3000/points'
const usersURL = 'http://localhost:3000/users'
const loginURL = 'http://localhost:3000/login'
const storiesURL = 'http://localhost:3000/stories'

const $loginSignup = document.querySelector('#login-signup')
const $createNew = document.querySelector('#create-new-story')
const $newStoryInfo = document.querySelector('#new-story-info')
const $newPointsCard = document.querySelector('#new-point-card')
const $newStoryCard = document.querySelector('#new-story-card')

const $interactiveMap = document.querySelector('#interactivemap')
const $createNewPoint = document.querySelector('#create-new-point')
const $displayStories = document.querySelector('#display-stories')
const $newStoryForm = document.querySelector('#create-new-story-form')

const $pointsForm = document.querySelector('#points-form')
const $storyDisplayDiv = document.querySelector('#story')
// const $pointDisplayDiv = document.querySelector('#point')
const $signUpButton = document.querySelector('#sign-up-button')
const $signUpDiv = document.querySelector('#Signup')
const $loginButton = document.querySelector('#login-button')
const $loginDiv = document.querySelector('#Login')
const $logoutButton = document.querySelector('#logoutbutton')

// SPA DOM displays
isLoggedIn()
// renderIntroMap()

hideOrDisplaySection($signUpDiv, 'none')
hideOrDisplaySection($loginDiv, 'none')
// hideOrDisplaySection($createNew, 'none')
// hideOrDisplaySection($interactiveMap, 'none')
hideOrDisplaySection($createNewPoint, 'none')


$signUpButton.addEventListener('click', displaysignUpForm)
$loginButton.addEventListener('click', displayLoginForm)
$logoutButton.addEventListener('click', logout )


// SECTIONS
// interactivemap
function makeMapClickable() {
    if (interactiveMap != undefined) { interactiveMap.remove()}
    // document.getElementById('interactivemap').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
    interactiveMap = L.map('interactivemap').setView([51.505, -0.09], 2)
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibGpnMmdiIiwiYSI6ImNrYW1xeHE4YzFoNncyeWw2NW83c3N4MDUifQ.qSHmG5Ee_suJ1KNUNHmxZQ'
}).addTo(interactiveMap);
    interactiveMap.on('click', onMapClick);
}

$pointsForm.style.display = 'none'
$pointsForm.addEventListener('submit', (event => handleFormData(event)))

document.getElementById('interactivemap').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
let interactiveMap = L.map('interactivemap', { scrollWheelZoom: false }).setView([51.505, -0.09], 2);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoibGpnMmdiIiwiYSI6ImNrYW1xeHE4YzFoNncyeWw2NW83c3N4MDUifQ.qSHmG5Ee_suJ1KNUNHmxZQ'
}).addTo(interactiveMap);

let points = []
function onMapClick(e) {
    hideOrDisplaySection($createNew, 'none')
    const point = [e.latlng.lat, e.latlng.lng]
    points.push(point)
    displayForm(point)
    points.forEach(displayAllPointsOnMap)
}

function displayAllPointsOnMap(point) {
    L.marker(point).addTo(interactiveMap)
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
    $loginDiv.addEventListener('submit', hideOrDisplaySection($createNew, 'block'))
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
$newStoryForm.addEventListener('submit', makeMapClickable)
$newStoryForm.addEventListener('submit', hideOrDisplaySection($createNew, 'none'))

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
    const $div = document.createElement('div')
    $div.className = "card"
    $div.id = "story"
    const story_id = data.id
    localStorage.setItem("story_id", story_id)
    const title = document.createElement('h3')
    title.textContent = data.title
    const description = document.createElement('p')
    description.textContent = data.description
    const date = document.createElement('p')
    date.textContent = data.date
    $div.append(title, description, date)
    $newStoryInfo.append($div)
}




function displayForm(point) {
    $createNewPoint.style.display = 'block'
    $pointsForm.style.display = 'block'
    document.querySelector("#pre-populate-story_id-value").value = localStorage.getItem("story_id")
    document.querySelector("#pre-populate-location-value").value = point
}

function handleFormData(event) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const name = formData.get('name')
    const post = formData.get('post')
    const latlng = formData.get('latlng')
    const story_id = formData.get('story_id')
    const pointBody = {name, post, latlng, story_id}
    displayPointsFormInput(pointBody)
    fetchPostPoints(pointBody)
}

function displayPointsFormInput(pointBody) {
    const $div = document.createElement('div')
    $div.className = "card"
    $div.id = "point"
    $div.innerHTML = `
    <h3>${pointBody.name}</h3>
    <p>${pointBody.post}</p>
    <p>${pointBody.latlng}</p>`
    $newStoryInfo.append($div)
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
        hideOrDisplaySection($logoutButton, 'block')
        hideOrDisplaySection($signUpButton, 'none')
        hideOrDisplaySection($loginButton, 'none')
        hideOrDisplaySection($loginSignup, 'none')
        // hideOrDisplaySection($createNew, 'block')
        // hideOrDisplaySection($newStoryForm, 'block')
    } 
    else {
        hideOrDisplaySection($logoutButton, 'none')
        hideOrDisplaySection($signUpButton, 'block')
        hideOrDisplaySection($loginButton, 'block')
        hideOrDisplaySection($loginSignup, 'block')
        hideOrDisplaySection($createNew, 'none')
        // hideOrDisplaySection($newStoryCard, 'none')
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