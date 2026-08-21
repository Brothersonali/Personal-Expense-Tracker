// ========================================
// PERSONAL EXPENSE TRACKER
// ========================================

// Get form and transaction section
const form = document.querySelector("form");
const transactionsSection = document.querySelector(".transactions");

// Get saved transactions
let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];


// ========================================
// ADD TRANSACTION
// ========================================
// ========================================
// ADD TRANSACTION
// ========================================

form.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get form fields directly by their position
    const title = form.elements[0].value.trim();
    const amount = Number(form.elements[1].value);
    const type = form.elements[2].value;
    const date = form.elements[3].value;
    const category = form.elements[4].value;

    // Validation
    if (title === "") {
        alert("Please enter transaction title");
        return;
    }

    if (amount <= 0 || isNaN(amount)) {
        alert("Please enter a valid amount");
        return;
    }

    if (type === "") {
        alert("Please select transaction type");
        return;
    }

    if (date === "") {
        alert("Please select date");
        return;
    }

    if (category === "") {
        alert("Please select category");
        return;
    }

    // Create transaction
    const transaction = {
        title: title,
        amount: amount,
        type: type,
        date: date,
        category: category
    };

    // Add transaction
    transactions.push(transaction);

    // Save
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

    // Update page
    displayTransactions();
    updateSummary();
    updateExpenseOverview();
    updateSavingsGoal();

    // Clear form
    form.reset();

    alert("Transaction added successfully! ✅");

});




// ========================================
// DISPLAY TRANSACTIONS
// ========================================

function displayTransactions() {

    if (!transactionsSection) {
        return;
    }


    transactionsSection.innerHTML = `

        <h2>Recent Transactions</h2>

        <input
            type="text"
            id="searchInput"
            placeholder="Search transaction..."
        >

        <select id="filterType">

            <option value="all">
                All Transactions
            </option>

            <option value="income">
                Income
            </option>

            <option value="expense">
                Expense
            </option>

        </select>

        <div id="transactionList"></div>

    `;


    const searchInput =
        document.getElementById("searchInput");

    const filterType =
        document.getElementById("filterType");

    const transactionList =
        document.getElementById("transactionList");


    function renderTransactions() {

        const search =
            searchInput.value.toLowerCase().trim();

        const filter =
            filterType.value;


        transactionList.innerHTML = "";


        if (transactions.length === 0) {

            transactionList.innerHTML = `

                <div class="empty-state">

                    <div class="empty-icon">
                        📊
                    </div>

                    <h3>
                        No transactions yet
                    </h3>

                    <p>
                        Start tracking your money by adding
                        your first income or expense.
                    </p>

                </div>

            `;

            return;
        }


        let found = false;


        transactions.forEach(function (
            transaction,
            index
        ) {

            const matchesSearch =

                transaction.title
                    .toLowerCase()
                    .includes(search)

                ||

                transaction.category
                    .toLowerCase()
                    .includes(search);


            const matchesFilter =

                filter === "all"

                ||

                transaction.type === filter;


            if (
                matchesSearch &&
                matchesFilter
            ) {

                found = true;


                const div =
                    document.createElement("div");


                div.innerHTML = `

                    <p>
                        <strong>
                            ${transaction.title}
                        </strong>
                    </p>

                    <p>

                        <span class="transaction-badge ${transaction.type}">

                            ${
                                transaction.type === "income"
                                ? "🟢 Income"
                                : "🔴 Expense"
                            }

                        </span>

                        ₹${transaction.amount}

                    </p>

                    <p>
                        Category:
                        ${transaction.category}
                    </p>

                    <p>
                        Date:
                        ${transaction.date}
                    </p>

                    <button
                        onclick="editTransaction(${index})">
                        Edit
                    </button>

                    <button
                        onclick="deleteTransaction(${index})">
                        Delete
                    </button>

                    <hr>

                `;


                transactionList.appendChild(div);

            }

        });


        if (!found) {

            transactionList.innerHTML = `

                <p>
                    No matching transactions found.
                </p>

            `;

        }

    }


    // Search
    searchInput.addEventListener(
        "input",
        renderTransactions
    );


    // Filter
    filterType.addEventListener(
        "change",
        renderTransactions
    );


    renderTransactions();

}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {

    let income = 0;
    let expense = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            income += Number(transaction.amount);

        }

        if (transaction.type === "expense") {

            expense += Number(transaction.amount);

        }

    });


    const balance =
        income - expense;


    const totalIncome =
        document.getElementById("totalIncome");

    const totalExpense =
        document.getElementById("totalExpense");

    const balanceElement =
        document.getElementById("balance");


    if (totalIncome) {

        totalIncome.innerText =
            "₹" + income;

    }


    if (totalExpense) {

        totalExpense.innerText =
            "₹" + expense;

    }


    if (balanceElement) {

        balanceElement.innerText =
            "₹" + balance;

    }

}


// ========================================
// DELETE TRANSACTION
// ========================================

function deleteTransaction(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this transaction?"
        );


    if (!confirmDelete) {
        return;
    }


    transactions.splice(index, 1);


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    displayTransactions();
    updateSummary();
    updateExpenseOverview();
    updateSavingsGoal();

}


// ========================================
// EDIT TRANSACTION
// ========================================

function editTransaction(index) {

    const transaction =
        transactions[index];


    const newTitle =
        prompt(
            "Enter new title:",
            transaction.title
        );


    if (newTitle === null) {
        return;
    }


    const newAmount =
        prompt(
            "Enter new amount:",
            transaction.amount
        );


    if (newAmount === null) {
        return;
    }


    if (
        newTitle.trim() === "" ||
        Number(newAmount) <= 0
    ) {

        alert("Invalid details");
        return;

    }


    transaction.title =
        newTitle.trim();


    transaction.amount =
        Number(newAmount);


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    displayTransactions();
    updateSummary();
    updateExpenseOverview();
    updateSavingsGoal();

}


// ========================================
// EXPENSE OVERVIEW
// ========================================

function updateExpenseOverview() {

    let food = 0;
    let travel = 0;
    let shopping = 0;
    let bills = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type !== "expense") {
            return;
        }


        const category =
            transaction.category.toLowerCase();


        if (category === "food") {

            food += Number(transaction.amount);

        }


        if (category === "travel") {

            travel += Number(transaction.amount);

        }


        if (category === "shopping") {

            shopping += Number(transaction.amount);

        }


        if (category === "bills") {

            bills += Number(transaction.amount);

        }

    });


    const foodAmount =
        document.getElementById("foodAmount");

    const travelAmount =
        document.getElementById("travelAmount");

    const shoppingAmount =
        document.getElementById("shoppingAmount");

    const billsAmount =
        document.getElementById("billsAmount");


    if (foodAmount) {

        foodAmount.innerText =
            "₹" + food;

    }


    if (travelAmount) {

        travelAmount.innerText =
            "₹" + travel;

    }


    if (shoppingAmount) {

        shoppingAmount.innerText =
            "₹" + shopping;

    }


    if (billsAmount) {

        billsAmount.innerText =
            "₹" + bills;

    }

}


// ========================================
// SAVINGS GOAL
// ========================================

function setSavingsGoal() {

    const titleElement =
        document.getElementById("goalTitle");

    const amountElement =
        document.getElementById("goalAmount");


    if (!titleElement || !amountElement) {
        return;
    }


    const goalTitle =
        titleElement.value.trim();


    const goalAmount =
        Number(amountElement.value);


    if (
        goalTitle === "" ||
        goalAmount <= 0
    ) {

        alert(
            "Please enter a valid goal title and amount"
        );

        return;

    }


    localStorage.setItem(
        "savingsGoalTitle",
        goalTitle
    );


    localStorage.setItem(
        "savingsGoalAmount",
        goalAmount
    );


    updateSavingsGoal();


    alert(
        "Savings goal set successfully! 🎯"
    );

}


// ========================================
// UPDATE SAVINGS GOAL
// ========================================

function updateSavingsGoal() {

    const result =
        document.getElementById(
            "savingsResult"
        );


    if (!result) {
        return;
    }


    const goalTitle =
        localStorage.getItem(
            "savingsGoalTitle"
        );


    const goalAmount =
        Number(
            localStorage.getItem(
                "savingsGoalAmount"
            )
        );


    let savings = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            savings += Number(
                transaction.amount
            );

        }

        else if (
            transaction.type === "expense"
        ) {

            savings -= Number(
                transaction.amount
            );

        }

    });


    if (
        !goalTitle ||
        !goalAmount
    ) {

        result.innerHTML = `

            <p>
                Set a savings goal to start tracking your progress.
            </p>

        `;

        return;

    }


    let progress =
        (savings / goalAmount) * 100;


    if (progress < 0) {
        progress = 0;
    }


    if (progress > 100) {
        progress = 100;
    }


    const remaining =
        Math.max(
            goalAmount - savings,
            0
        );


    result.innerHTML = `

        <div class="goal-info">

            <h3>
                🎯 ${goalTitle}
            </h3>

            <p>
                Saved: ₹${savings}
            </p>

            <p>
                Goal: ₹${goalAmount}
            </p>

        </div>


        <div class="progress-bar">

            <div
                class="progress-fill"
                style="width: ${progress}%"
            ></div>

        </div>


        <p class="progress-text">
            ${Math.round(progress)}% completed
        </p>


        ${
            remaining > 0

            ?

            `<p class="remaining">
                ₹${remaining} more to reach your goal 🎯
            </p>`

            :

            `<p class="completed">
                🎉 Congratulations! Goal completed!
            </p>`
        }

    `;

}


// ========================================
// PAGE LOAD
// ========================================

displayTransactions();

updateSummary();

updateExpenseOverview();

updateSavingsGoal();