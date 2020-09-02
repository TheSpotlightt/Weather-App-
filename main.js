const input = document.querySelector('input');
const btn = document.querySelector('button');
const para = document.querySelector('p');
const inputKey = document.getElementById('searcher');

// Fetch API
async function fetchAndDecode(url, type) {
    const response = await fetch(url);
    
    let content;

    if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
    } else if (type === 'json') {
        content = await response.json();
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


async function displayWeather() {
    let search = input.value.toLowerCase();
    const weather = fetchAndDecode(`http://api.weatherapi.com/v1/forecast.json?key=4315ea41a7154405934153414200109&q=${search}&days=1`, 'json');

    const promise = await Promise.all([weather]);

    for(let i = 0; i < promise.length; i++) {
        const temp = promise[i].current.temp_c;
        const state = promise[i].location.name;
        const conditions = promise[i].current.condition.text

        if(state.toLowerCase() === search) {
            para.innerHTML = `${state}, ${temp}°C <br> ${conditions}` 
            input.value = [];
        }

        // Trying to set a localStorage
        let itemsArray = localStorage.getItem('input') ? JSON.parse(localStorage.getItem('input')) : [];
        console.log(itemsArray);

        localStorage.setItem('input', JSON.stringify(itemsArray));
        const data = JSON.parse(localStorage.getItem('input'));

        function populateStorage() {
            itemsArray.push(input.value);
            localStorage.setItem('input', JSON.stringify(itemsArray));

        }
    }
};

// btn.addEventListener('click', displayWeather)
displayWeather()