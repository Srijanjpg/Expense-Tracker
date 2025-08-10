const expenseForm = document.getElementById('expense-form');
const amountInput = document.getElementById('amount-input');
const descInput = document.getElementById('desc-input');
const dateInput = document.getElementById('date-input');
const breakdownList = document.getElementById('breakdown-list');
const totalAmountDisplay = document.getElementById('total-amount-display');
const profileName = document.getElementById('profile-name');
const greeting = document.getElementById('greeting');

const loginOverlay = document.getElementById('login-overlay');
const loginForm = document.getElementById('login-form');
const loginUsername = document.getElementById('login-username');
const mainBg = document.querySelector('.main-bg');

let expenses = [];
let userName = "";

// Helper: Get emoji for category
function getCategoryIcon(category) {
    switch (category) {
        case "Food/Beverage": return "🍽️";
        case "Travel/Commute": return "🚗";
        case "Shopping": return "🛍️";
        default: return "💸";
    }
}

// Helper: Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    if (isNaN(date)) return "";
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
}

// Render expenses
function renderExpenses() {
    breakdownList.innerHTML = "";
    let total = 0;
    expenses.forEach((exp, idx) => {
        total += exp.amount;
        const li = document.createElement('li');

        li.innerHTML = `
            <div class="icon-box"><span>${getCategoryIcon(exp.category)}</span></div>
            <div class="expense-details">
                <div class="expense-title">${exp.description}</div>
                <div class="expense-meta">${exp.category} • ${formatDate(exp.date)}</div>
            </div>
            <div class="expense-amount">~ ₹ ${exp.amount.toFixed(2)}</div>
            <button class="delete-btn" title="Delete" data-idx="${idx}">&times;</button>
        `;
        breakdownList.appendChild(li);
    });
    totalAmountDisplay.textContent = `₹ ${total.toFixed(2)}`;
}

// Add expense
if (expenseForm) {
    expenseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const amount = parseFloat(amountInput.value);
        const description = descInput.value.trim();
        const date = dateInput.value;
        const category = expenseForm.category.value;

        if (!amount || !description || !date) return;

        expenses.unshift({ amount, description, date, category });
        renderExpenses();
        expenseForm.reset();
        // Set default radio after reset
        expenseForm.category[0].checked = true;
    });
}

// Delete expense
if (breakdownList) {
    breakdownList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const idx = e.target.getAttribute('data-idx');
            expenses.splice(idx, 1);
            renderExpenses();
        }
    });
}

// Login logic
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    userName = loginUsername.value.trim() || "User";
    profileName.textContent = userName;
    greeting.textContent = `Hello, ${userName}`;
    loginOverlay.style.display = "none";
    mainBg.style.display = "flex";
    renderExpenses();
});

// Optionally, allow pressing Enter to submit login
loginUsername.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        loginForm.dispatchEvent(new Event('submit'));
    }
});

// On load, show login overlay and hide main app
window.addEventListener('DOMContentLoaded', () => {
    // Show login overlay and hide main app
    loginOverlay.style.display = "flex";
    mainBg.style.display = "none";

    // Limit date input to today
    const dateInput = document.getElementById('date-input');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.max = today;
    }
});