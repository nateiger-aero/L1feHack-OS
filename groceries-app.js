// Tab Switching
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Mock Historical Data (Average Prices for presentation)
const priceDatabase = {
    "MILK": { 1: 3.85, 6: 3.60, 12: 3.45, 60: 2.95 },
    "EGGS": { 1: 4.10, 6: 4.60, 12: 3.90, 60: 2.15 },
    "CHICKEN": { 1: 12.50, 6: 11.80, 12: 10.50, 60: 8.90 },
    "RICE": { 1: 1.20, 6: 1.15, 12: 1.10, 60: 0.95 }
};

function addItem() {
    const nameInput = document.getElementById('itemName');
    const name = nameInput.value.trim().toUpperCase();
    const period = document.getElementById('pricePeriod').value;
    const list = document.getElementById('groceryList');
    
    if (!name) return;

    // Remove empty message if it's the first item
    const msg = document.getElementById('empty-msg');
    if (msg) msg.remove();

    // Data Lookup
    const avgPrice = priceDatabase[name] ? `$${priceDatabase[name][period].toFixed(2)}` : "NO_DATA";

    const itemDiv = document.createElement('div');
    itemDiv.className = 'grocery-item';
    const uniqueId = Date.now();

    itemDiv.innerHTML = `
        <div class="item-main">
            <span style="font-weight:bold;">> ${name}</span>
            <div style="display: flex; align-items: center; gap: 15px;">
                <span class="price-chip">HISTORICAL_AVG: ${avgPrice}</span>
                <label style="margin-top: 0; cursor: pointer; display: flex; align-items: center; gap: 5px;">
                    RECURRING <input type="checkbox" onchange="toggleRecurring(${uniqueId}, this)" style="width: auto;">
                </label>
            </div>
        </div>
        <div class="recurring-options" id="rec-${uniqueId}">
            FREQUENCY: 
            <input type="number" value="1" min="1" style="width: 50px; padding: 4px; margin: 0 10px;">
            <select style="padding: 4px; font-size: 0.6rem;">
                <option>DAY(S)</option>
                <option>WEEK(S)</option>
                <option>MONTH(S)</option>
            </select>
        </div>
    `;
    list.appendChild(itemDiv);
    nameInput.value = "";
}

function toggleRecurring(id, cb) {
    const opt = document.getElementById(`rec-${id}`);
    opt.style.display = cb.checked ? 'block' : 'none';
}

function compareDeals() {
    const sP = parseFloat(document.getElementById('storePrice').value);
    const sU = parseFloat(document.getElementById('storeUnits').value);
    const oP = parseFloat(document.getElementById('onlinePrice').value);
    const oU = parseFloat(document.getElementById('onlineUnits').value);

    if (isNaN(sP) || isNaN(sU) || isNaN(oP) || isNaN(oU)) {
        return alert("DATA_ERROR: ALL FIELDS MUST CONTAIN NUMERIC VALUES.");
    }

    const storeUnitCost = sP / sU;
    const onlineUnitCost = oP / oU;

    const resultDiv = document.getElementById('compareResult');
    const winner = storeUnitCost < onlineUnitCost ? "LOCAL_MARKET" : "VIRTUAL_NETWORK";
    const savings = Math.abs(storeUnitCost - onlineUnitCost).toFixed(3);

    resultDiv.innerHTML = `
        <div class="list-box winner" style="border-width: 2px;">
            <div class="best-deal-tag">OPTIMAL_ROUTE_DETERMINED</div>
            <h3 style="margin: 10px 0; letter-spacing: 2px;">${winner} IS MORE EFFICIENT</h3>
            <p style="font-size: 0.8rem; color: var(--text-dim); margin-bottom: 0;">
                SAVINGS: $${savings} PER UNIT DETECTED.
            </p>
        </div>
    `;
}
