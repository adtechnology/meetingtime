let cities = ['New York', 'Berlin', 'Athens', 'Quito', 'Washington'];
let timezones = ['America/New_York', 'Europe/Berlin', 'Europe/Athens', 'America/Guayaquil', 'America/New_York'];
let offsetMinutes = 0;
let use24HourFormat = false;
let darkModeOverride = false;

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
        `;
        cityTimesDiv.appendChild(cityTimeDiv);
    });
}

function saveSettings() {
    localStorage.setItem('offsetMinutes', offsetMinutes);
    localStorage.setItem('use24HourFormat', use24HourFormat);
    localStorage.setItem('darkModeOverride', darkModeOverride);
    localStorage.setItem('extraCity', document.getElementById('extraCity').value);
}

function loadSettings() {
    offsetMinutes = parseInt(localStorage.getItem('offsetMinutes')) || 0;
    use24HourFormat = localStorage.getItem('use24HourFormat') === 'true';
    darkModeOverride = localStorage.getItem('darkModeOverride') === 'true';
    const extraCity = localStorage.getItem('extraCity');

    document.getElementById('timeSlider').value = offsetMinutes;
    document.getElementById('formatToggle').checked = use24HourFormat;
    document.getElementById('darkModeToggle').checked = darkModeOverride;
    document.getElementById('extraCity').value = extraCity || '';

    if (extraCity) {
        addExtraCity(extraCity);
    }

    updateDarkMode();
}

function addExtraCity(timezone) {
    const cityName = timezone.split('/').pop().replace('_', ' ');
    cities.push(cityName);
    timezones.push(timezone);
    updateTimes();
}

function updateDarkMode() {
    if (darkModeOverride) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
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
    } else {
        cities.pop();
        timezones.pop();
    }
    updateTimes();
    saveSettings();
});

loadSettings();
updateTimes();
setInterval(updateTimes, 60000);

// Check for system dark mode preference
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.body.classList.add('dark-mode');
}

// Listen for changes to color scheme preferences
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!darkModeOverride) {
        document.body.classList.toggle('dark-mode', e.matches);
    }
});