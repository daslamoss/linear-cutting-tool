document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');
    const contentContainer = document.getElementById('tab-content');

    function loadTabContent(tabName) {
        fetch(`views/${tabName}.php`)
            .then(response => {
                if (!response.ok) throw new Error(`Failed to load ${tabName}.php: ${response.status}`);
                return response.text();
            })
            .then(html => {
                contentContainer.innerHTML = html;
                // Initialize tab-specific scripts
                if (tabName === 'stock') {
                    loadStock();
                } else if (tabName === 'cutting') {
                    loadCutting();
                }
            })
            .catch(error => console.error('Error loading tab content:', error));
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabName = tab.getAttribute('data-tab');
            loadTabContent(tabName);
        });
    });

    // Load the default tab (stock)
    loadTabContent('stock');
});