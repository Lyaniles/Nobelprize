const API_URL = '/api/prizes';

const form = document.getElementById('filterForm');
const resultsDiv = document.getElementById('results');
const loadingDiv = document.getElementById('loading');

// Load initial data (latest prizes)
document.addEventListener('DOMContentLoaded', () => fetchPrizes());

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
