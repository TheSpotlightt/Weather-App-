const input = document.querySelector('input');
const btn = document.querySelector('button');
const inputKey = document.getElementById('searcher');
const para = document.querySelector('p');
const ul = document.querySelector('ul')
const btnDelete = document.querySelector('.delete');
const paraIcons = document.querySelector('.para-icons');

// Retrieving para data and storing in an array
let itemsArray = localStorage.getItem('para') ? JSON.parse(localStorage.getItem('para')) : [];
console.log(itemsArray);

localStorage.setItem('para', JSON.stringify(itemsArray));
const data = JSON.parse(localStorage.getItem('para'));

// Fetch API
async function fetchAndDecode(url, type) {
    const response = await fetch(url);
    
    let content;

    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
    } else if (type === 'json') {
        content = await response.json();
    } else if (type === 'text') {
        content = await response.text();
    }

    return content;
};


// Use the enter key to make a submit
inputKey.addEventListener('keyup', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById('btn').click();
    }
});

// Create a list to store the localStorage data
function liMaker(text) {
    const li = document.createElement('li');
    li.textContent = text
    ul.appendChild(li)
}



async function displayWeather() {
    let search = input.value.toLowerCase();

    const weather = fetchAndDecode(`http://api.weatherapi.com/v1/current.json?key=4315ea41a7154405934153414200109&q=${search}`, 'json');
    const weatherConditions = fetchAndDecode(`weather_conditions.json`, 'text');

    const weatherPromise = await Promise.all([weather]);    
    
    const weatherConditionsPromise = await Promise.all([weatherConditions]);
    const weatherConditionsStr = JSON.parse(weatherConditionsPromise);

    
    for(let j = 0; j < weatherConditionsStr.length; j++) {
        const code = weatherConditionsStr[j].code;
        const day = weatherConditionsStr[j].day;
        const night = weatherConditionsStr[j].night;
    
        for(let i = 0; i < weatherPromise.length; i++) {
            const temp = weatherPromise[i].current.temp_c;
            const place = weatherPromise[i].location.name;
            const conditions = weatherPromise[i].current.condition.text
            const conditionsCode = weatherPromise[i].current.condition.code;

            if(place.toLowerCase() === search) {
                para.innerHTML = `${place}, ${temp}°C <br> ${conditions}` 
                input.value = [];
            }
            // Take the code of the conditions and make it 
            // equal to the weather conditions inside the JSON file
            // to retrieve the icons
            if(conditions === night) {
                paraIcons.textContent = night;
            } else if (conditions === day) {
                paraIcons.textContent = day;
            }

        }
    }
        
        // creating the localStorage
        if(typeof(Storage) !== 'undefined') {
        populateStorage()
    }
    
    function populateStorage() {
        itemsArray.push(para.textContent);
        localStorage.setItem('para', JSON.stringify(itemsArray));
    }
    // autocomplete(document.getElementById('searcher'), weatherSearchPromise)

};

// Displaying the stored data in localStorage
data.forEach(element => {
    liMaker(element)
});


btnDelete.addEventListener('click', () => {
    localStorage.clear();
    while(ul.firstChild) {
        ul.removeChild(ul.firstChild)
    }
});


input.focus()
btn.addEventListener('click', displayWeather);