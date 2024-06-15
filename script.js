// Dropdown Toggle Functionality
document.querySelectorAll('.select-box').forEach(box => {
    box.addEventListener('click', function() {
        const select = this.querySelector('.select');
        const options = this.querySelector('.select-options');
        const isOpen = options.style.display === 'block';
        document.querySelectorAll('.select-options').forEach(opt => opt.style.display = 'none');
        options.style.display = isOpen ? 'none' : 'block';
        select.classList.toggle('opened', !isOpen);
    });
});

// Dropdown Option Selection
document.querySelectorAll('.select-option').forEach(option => {
    option.addEventListener('click', function() {
        const selectBox = this.closest('.select-box');
        const select = selectBox.querySelector('.select');
        const options = selectBox.querySelectorAll('.select-option');
        options.forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        select.textContent = this.textContent;
        select.classList.remove('opened');
        updateTime(document.getElementById('time-slider').value);
    });
});

// Update Time Based on Selected Cities and Slider Value
function updateTime(sliderValue) {
    const city1TimeElement = document.getElementById('city1-time');
    const city2TimeElement = document.getElementById('city2-time');
    
    const city1Select = document.getElementById('city1-select');
    const city2Select = document.getElementById('city2-select');
    
    const city1TimeZone = document.querySelector('.select-box:nth-child(1) .select-option.selected').getAttribute('data-value');
    const city2TimeZone = document.querySelector('.select-box:nth-child(2) .select-option.selected').getAttribute('data-value');
    
    const now = new Date();
    now.setHours(parseInt(sliderValue, 10));
    
    const city1Time = new Date(now.toLocaleString('en-US', { timeZone: city1TimeZone }));
    const city2Time = new Date(now.toLocaleString('en-US', { timeZone: city2TimeZone }));
    
    city1TimeElement.textContent = city1Time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    city2TimeElement.textContent = city2Time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    document.getElementById('city1-name').textContent = city1Select.textContent;
    document.getElementById('city2-name').textContent = city2Select.textContent;
}

// Slider Event Listener
document.getElementById('time-slider').addEventListener('input', function() {
    updateTime(this.value);
});

// Dark Mode Toggle Event Listener
document.getElementById('dark-mode-toggle').addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked);
});

// Reset Button Event Listener
document.getElementById('reset-button').addEventListener('click', function() {
    const now = new Date();
    const currentHour = now.getHours();
    document.getElementById('time-slider').value = currentHour;
    updateTime(currentHour);
});

// Initial Call to Set Default Time
updateTime(12);
