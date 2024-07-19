let cities = ['New York', 'Berlin', 'Athens', 'Quito', 'Washington'];
let timezones = ['America/New_York', 'Europe/Berlin', 'Europe/Athens', 'America/Guayaquil', 'America/New_York'];
let offsetMinutes = 0;
let use24HourFormat = false;
let darkModeOverride = false;

const cityOptions = [
    { city: 'Wake Island', timezone: 'Pacific/Wake' },
    { city: 'Pago Pago', timezone: 'Pacific/Pago_Pago' },
    { city: 'Alofi', timezone: 'Pacific/Niue' },
    { city: 'Honolulu', timezone: 'Pacific/Honolulu' },
    { city: 'Papeete', timezone: 'Pacific/Tahiti' },
    { city: 'Anchorage', timezone: 'America/Anchorage' },
    { city: 'Gambier Islands', timezone: 'Pacific/Gambier' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { city: 'Vancouver', timezone: 'America/Vancouver' },
    { city: 'Pitcairn Islands', timezone: 'Pacific/Pitcairn' },
    { city: 'Denver', timezone: 'America/Denver' },
    { city: 'Adelaide', timezone: 'Australia/Adelaide' },
    { city: 'Sydney', timezone: 'Australia/Sydney' },
    { city: 'Brisbane', timezone: 'Australia/Brisbane' },
    { city: 'Guam', timezone: 'Pacific/Guam' },
    { city: 'Lord Howe Island', timezone: 'Australia/Lord_Howe' },
    { city: 'Vladivostok', timezone: 'Asia/Vladivostok' },
    { city: 'Noumea', timezone: 'Pacific/Noumea' },
    { city: 'Auckland', timezone: 'Pacific/Auckland' },
    { city: 'Suva', timezone: 'Pacific/Fiji' },
    { city: 'Petropavlovsk-Kamchatsky', timezone: 'Asia/Kamchatka' },
    { city: 'Chatham Islands', timezone: 'Pacific/Chatham' },
    { city: 'Nuku\'alofa', timezone: 'Pacific/Tongatapu' },
    { city: 'Apia', timezone: 'Pacific/Apia' },
    { city: 'Kiritimati', timezone: 'Pacific/Kiritimati' },
    { city: 'New York', timezone: 'America/New_York' },
    { city: 'London', timezone: 'Europe/London' },
    { city: 'Berlin', timezone: 'Europe/Berlin' },
    { city: 'Moscow', timezone: 'Europe/Moscow' },
    { city: 'Tokyo', timezone: 'Asia/Tokyo' },
    { city: 'Sydney', timezone: 'Australia/Sydney' },
    { city: 'Paris', timezone: 'Europe/Paris' },
    { city: 'Rome', timezone: 'Europe/Rome' },
    { city: 'Madrid', timezone: 'Europe/Madrid' },
    { city: 'Vienna', timezone: 'Europe/Vienna' },
    { city: 'Istanbul', timezone: 'Europe/Istanbul' },
    { city: 'Cairo', timezone: 'Africa/Cairo' },
    { city: 'Cape Town', timezone: 'Africa/Johannesburg' },
    { city: 'Beijing', timezone: 'Asia/Shanghai' },
    { city: 'Hong Kong', timezone: 'Asia/Hong_Kong' },
    { city: 'Singapore', timezone: 'Asia/Singapore' },
    { city: 'Bangkok', timezone: 'Asia/Bangkok' },
    { city: 'Dubai', timezone: 'Asia/Dubai' },
    { city: 'Karachi', timezone: 'Asia/Karachi' },
    { city: 'Mumbai', timezone: 'Asia/Kolkata' },
    { city: 'Jakarta', timezone: 'Asia/Jakarta' },
    { city: 'Seoul', timezone: 'Asia/Seoul' },
    { city: 'Los Angeles', timezone: 'America/Los_Angeles' },
    { city: 'Chicago', timezone: 'America/Chicago' },
    { city: 'Denver', timezone: 'America/Denver' },
    { city: 'Mexico City', timezone: 'America/Mexico_City' },
    { city: 'Buenos Aires', timezone: 'America/Argentina/Buenos_Aires' },
    { city: 'Santiago', timezone: 'America/Santiago' },
    { city: 'Sao Paulo', timezone: 'America/Sao_Paulo' }
];

function populateCityOptions() {
    const extraCitySelect = document.getElementById('extraCity');
    cityOptions.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.timezone;
        opt.textContent = option.city;
        extraCitySelect.appendChild(opt);
    });
}

function updateTimes() {
    const cityTimesDiv = document.getElementById('cityTimes');
    cityTimesDiv.innerHTML = '';

    cities.forEach((city, index) => {
        const date = new Date();
        date.setMinutes(date.getMinutes() + offsetMinutes);
        const options = {
            timeZone: timezones[index],
            hour: '2-digit',
            minute: '2-digit',
            hour12: !use24HourFormat
        };
        const timeString = date.toLocaleTimeString('en-US', options);

        const cityTimeDiv = document.createElement('div');
        cityTimeDiv.className = 'city-time';
        cityTimeDiv.innerHTML = `
            <span class="city">${city}</span>
            <span class="time">${timeString}</span>
            <button class="remove-city" data-index="${index}">X</button>
        `;
        cityTimesDiv.appendChild(cityTimeDiv);
    });

    document.querySelectorAll('.remove-city').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cities.splice(index, 1);
            timezones.splice(index, 1);
            updateTimes();
            saveSettings();
        });
    });
}

function saveSettings() {
    localStorage.setItem('cities', JSON.stringify(cities));
    localStorage.setItem('timezones', JSON.stringify(timezones));
    localStorage.setItem('offsetMinutes', offsetMinutes);
    localStorage.setItem('use24HourFormat', use24HourFormat);
    localStorage.setItem('darkModeOverride', darkModeOverride);
}

function loadSettings() {
    const storedCities = JSON.parse(localStorage.getItem('cities'));
    const storedTimezones = JSON.parse(localStorage.getItem('timezones'));
    if (storedCities && storedTimezones) {
        cities = storedCities;
        timezones = storedTimezones;
    }

    offsetMinutes = parseInt(localStorage.getItem('offsetMinutes')) || 0;
    use24HourFormat = localStorage.getItem('use24HourFormat') === 'true';
    darkModeOverride = localStorage.getItem('darkModeOverride') === 'true';

    document.getElementById('timeSlider').value = offsetMinutes;
    document.getElementById('formatToggle').checked = use24HourFormat;
    document.getElementById('darkModeToggle').checked = darkModeOverride;
    updateDarkMode();
    updateTimes();
}

function addExtraCity(timezone) {
    const cityName = cityOptions.find(option => option.timezone === timezone).city;
    cities.push(cityName);
    timezones.push(timezone);
    updateTimes();
}

function updateDarkMode() {
    if (darkModeOverride) {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
    } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
    }
}

function updateLocalTime() {
    const localTimeText = document.getElementById('localTimeText');
    const date = new Date();
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !use24HourFormat
    };
    const timeString = date.toLocaleTimeString('en-US', options);
    localTimeText.textContent = `Local Time: ${timeString}`;
}

const slider = document.getElementById('timeSlider');
slider.addEventListener('input', (e) => {
    offsetMinutes = parseInt(e.target.value);
    updateTimes();
    saveSettings();
});

const resetButton = document.getElementById('resetButton');
resetButton.addEventListener('click', () => {
    offsetMinutes = 0;
    slider.value = 0;
    updateTimes();
    saveSettings();
});

const formatToggle = document.getElementById('formatToggle');
formatToggle.addEventListener('change', (e) => {
    use24HourFormat = e.target.checked;
    updateTimes();
    updateLocalTime();
    saveSettings();
});

const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('change', (e) => {
    darkModeOverride = e.target.checked;
    updateDarkMode();
    saveSettings();
});

const extraCitySelect = document.getElementById('extraCity');
extraCitySelect.addEventListener('change', (e) => {
    const selectedTimezone = e.target.value;
    if (selectedTimezone) {
        addExtraCity(selectedTimezone);
    }
    saveSettings();
});

populateCityOptions();
loadSettings();
updateTimes();
updateLocalTime();
setInterval(updateTimes, 60000);
setInterval(updateLocalTime, 1000);

// Check for system dark mode preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
}

// Listen for changes to color scheme preferences
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!darkModeOverride) {
        document.body.classList.toggle('dark-mode', e.matches);
        document.body.classList.toggle('light-mode', !e.matches);
    }
});
