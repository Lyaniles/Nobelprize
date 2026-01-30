const API_URL = '/api/prizes';
const STATS_URL = '/api/stats';

const form = document.getElementById('filterForm');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');
const downloadCsvBtn = document.getElementById('downloadCsvBtn');

// State
let categoryChart = null;
let currentPrizes = [];

// Load initial data (latest prizes)
document.addEventListener('DOMContentLoaded', () => {
    fetchPrizes();
    
    // Tab event listener
    const triggerTabList = [].slice.call(document.querySelectorAll('#viewTabs button'));
    triggerTabList.forEach(function (triggerEl) {
        triggerEl.addEventListener('shown.bs.tab', function (event) {
            if (event.target.id === 'stats-tab') {
                fetchStats();
            }
        });
    });

    if (downloadCsvBtn) {
        downloadCsvBtn.addEventListener('click', downloadCSV);
    }
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const year = document.getElementById('year').value;
    const category = document.getElementById('category').value;
    fetchPrizes(year, category);
});

async function fetchPrizes(year, category) {
    showLoading(true);
    resultsDiv.innerHTML = '';

    try {
        const params = new URLSearchParams();
        if (year) params.append('nobelPrizeYear', year);
        if (category) params.append('nobelPrizeCategory', category);
        // Limit to 20 to keep it snappy
        params.append('limit', 20);

        const res = await fetch(`${API_URL}?${params.toString()}`);
        const data = await res.json();
        
        currentPrizes = data; // Store for export

        if (data.length === 0) {
            resultsDiv.innerHTML = '<div class="col-12 text-center text-muted">No prizes found for this criteria.</div>';
        } else {
            renderPrizes(data);
        }
    } catch (error) {
        console.error('Error:', error);
        resultsDiv.innerHTML = '<div class="col-12 text-center text-danger">Failed to load data. API might be down.</div>';
    } finally {
        showLoading(false);
    }
}

function downloadCSV() {
    if (!currentPrizes || currentPrizes.length === 0) {
        alert('No data to export!');
        return;
    }

    const headers = ['Year', 'Category', 'Date Awarded', 'Prize Amount', 'Winners'];
    const rows = currentPrizes.map(p => {
        const winnersList = p.winners.map(w => w.name).join('; ');
        const winnersEscaped = winnersList.replace(/"/g, '""');
        return `${p.year},${p.category},${p.dateAwarded},${p.prizeAmount},"${winnersEscaped}"`;
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'nobel_prizes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function fetchStats() {
    // Only fetch if we haven't already (or add a refresh button later)
    if (categoryChart) return; 

    showLoading(true);
    try {
        const res = await fetch(STATS_URL);
        const data = await res.json();
        renderStats(data);
    } catch (error) {
        console.error('Error fetching stats:', error);
    } finally {
        showLoading(false);
    }
}

function renderStats(stats) {
    document.getElementById('stat-total-prizes').innerText = stats.totalPrizes;
    document.getElementById('stat-total-laureates').innerText = stats.totalLaureates;
    document.getElementById('stat-avg-amount').innerText = stats.averagePrizeAmount.toLocaleString() + ' SEK';

    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    // Destroy old chart if exists (though we check null above)
    if (categoryChart) categoryChart.destroy();

    categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(stats.prizesByCategory),
            datasets: [{
                label: 'Prizes Awarded',
                data: Object.values(stats.prizesByCategory),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}

function renderPrizes(prizes) {
    prizes.forEach(prize => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        
        let winnersHtml = prize.winners.map(w => `
            <div class="mb-2">
                <div class="laureate-name">🏆 ${w.name}</div>
                <div class="motivation">"${w.motivation}"</div>
            </div>
        `).join('');

        if (prize.winners.length === 0) {
            winnersHtml = '<div class="text-muted fst-italic">Prize not awarded or info unavailable.</div>';
        }

        col.innerHTML = `
            <div class="card h-100 prize-card shadow-sm">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="badge category-badge p-2">${prize.category}</span>
                        <h2 class="h4 mb-0 font-serif text-end">${prize.year}</h2>
                    </div>
                    <hr>
                    <div class="winners-list">
                        ${winnersHtml}
                    </div>
                </div>
                <div class="card-footer bg-white border-0 text-end">
                    <small class="text-muted">Prize: ${prize.prizeAmount.toLocaleString()} SEK</small>
                </div>
            </div>
        `;
        resultsDiv.appendChild(col);
    });
}

function showLoading(show) {
    if (show) {
        loadingDiv.classList.remove('d-none');
    } else {
        loadingDiv.classList.add('d-none');
    }
}
