let profiles = [];
let filteredProfiles = [];

function loadProfiles() {
    console.log('Attempting to fetch profiles...');
    fetch('../server/api.php?action=get_profiles')
        .then(response => {
            console.log('Fetch response status:', response.status);
            if (!response.ok) throw new Error('Failed to fetch profiles: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            console.log('Profiles data received:', data);
            profiles = data;
            filteredProfiles = { ...profiles };
            populateProfileTypes('stock');
            populateProfileTypes('cutting');
        })
        .catch(error => console.error('Error loading profiles:', error));
}

function populateProfileTypes(tab) {
    const typeSelect = document.getElementById(`profile-type-${tab}`);
    if (!typeSelect) {
        console.error(`No profile-type-${tab} dropdown found`);
        return;
    }
    typeSelect.innerHTML = '<option value="">Выберите тип</option>';
    Object.keys(profiles).forEach(type => {
        if (profiles[type].length > 0) {
            console.log('Adding type to dropdown:', type);
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            typeSelect.appendChild(option);
        }
    });
    updateDimensions(tab);
}

function updateDimensions(tab) {
    const typeSelect = document.getElementById(`profile-type-${tab}`);
    const dimensionSelect = document.getElementById(`profile-dimension-${tab}`);
    if (!typeSelect || !dimensionSelect) {
        console.error(`Missing elements for tab ${tab}`);
        return;
    }

    const selectedType = typeSelect.value;
    dimensionSelect.innerHTML = '<option value="">Выберите размерность</option>';

    if (selectedType && filteredProfiles[selectedType]) {
        const uniqueDimensions = [...new Set(filteredProfiles[selectedType].map(p => p.dimensions))];
        uniqueDimensions.forEach(dim => {
            const option = document.createElement('option');
            option.value = dim;
            option.textContent = dim;
            dimensionSelect.appendChild(option);
        });
    }
}

function updateProfileImage(tab) {
    const typeSelect = document.getElementById(`profile-type-${tab}`);
    const imageElement = document.getElementById(`profile-image-${tab}`);
    if (!typeSelect || !imageElement) {
        console.error(`Missing image or type select for tab ${tab}`);
        return;
    }

    const selectedType = typeSelect.value;
    if (selectedType) {
        imageElement.src = `views/images/${selectedType}.png`;
        imageElement.style.display = 'block';
    } else {
        imageElement.style.display = 'none';
    }
}

function searchProfileTypes(value, tab = 'stock') {
    const searchInput = document.getElementById(`profile-type-search-${tab}`);
    const resultsContainer = document.getElementById(`autocomplete-type-results-${tab}`);
    if (!searchInput || !resultsContainer) {
        console.error(`Search elements not found for tab ${tab}`);
        return;
    }

    resultsContainer.innerHTML = '';

    if (!value) {
        filteredProfiles = { ...profiles };
        populateProfileTypes(tab);
        return;
    }

    let searchTerm = value.toLowerCase().replace(/\*/g, '[xх]');
    let regex;
    try {
        regex = new RegExp(searchTerm, 'i');
    } catch (e) {
        console.error('Invalid regex:', e);
        return;
    }

    filteredProfiles = {};
    Object.entries(profiles).forEach(([type, items]) => {
        const matchingItems = items.filter(p => regex.test(`${type} ${p.dimensions}`));
        if (matchingItems.length > 0) {
            filteredProfiles[type] = matchingItems;
        }
    });

    Object.entries(filteredProfiles).forEach(([type, items]) => {
        items.forEach(p => {
            const div = document.createElement('div');
            div.textContent = `${type} ${p.dimensions}`;
            div.addEventListener('click', () => {
                searchInput.value = type;
                const typeSelect = document.getElementById(`profile-type-${tab}`);
                typeSelect.value = type;
                updateDimensions(tab);
                updateProfileImage(tab);
                const dimensionSelect = document.getElementById(`profile-dimension-${tab}`);
                dimensionSelect.value = p.dimensions;
                resultsContainer.innerHTML = '';
            });
            resultsContainer.appendChild(div);
        });
    });

    populateProfileTypes(tab);
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('profiles.js loaded');
    loadProfiles();

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete')) {
            document.getElementById('autocomplete-type-results-stock').innerHTML = '';
            document.getElementById('autocomplete-type-results-cutting').innerHTML = '';
        }
    });
});