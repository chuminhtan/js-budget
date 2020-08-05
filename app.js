// Variable html
var budgetDOM, incomeTotalDOM, expensesTotalDOM, signInputDOM, desInputDOM, valueInputDOM, btnAddDOM, rowDetailDOM, percentDOM, listIncomeDOM, listExpensesDOM, percentDOM;

budgetDOM = document.getElementById('budget');
incomeTotalDOM = document.getElementById('income');
expensesTotalDOM = document.getElementById('expenses');
signInputDOM = document.getElementById('sign');
desInputDOM = document.getElementById('description');
valueInputDOM = document.getElementById('value');
btnAddDOM = document.getElementById('check');
listIncomeDOM = document.getElementById('list-income');
listExpensesDOM = document.getElementById('list-expenses');
percentDOM = document.getElementById('percent');

// Variable app
var budget, signInput, desInput, valueInput;

budget = 0;
signInput = 'plus';
signInputDOM.value = signInput;

// Create Object Budget
function Budget(budget, incomeTotal, expensesTotal, incomeList, expensesList) {
    this.budget = budget;
    this.incomeTotal = incomeTotal;
    this.expensesTotal = expensesTotal;
    this.incomeList = incomeList;
    this.expensesList = expensesList;
}



// Budget prototype : Init
Budget.prototype.init = function(budgetDOM, incomTotalDOM, expensesTotalDOM) {

    budgetDOM.textContent = 0;
    incomeTotalDOM.textContent = 0;
    expensesTotalDOM.textContent = 0;
    signInputDOM.value = 'plus';
}

// Budget prototype : calculate total
Budget.prototype.calculateTotal = function(sign, value) {

    if (sign === 'plus') {
        this.incomeTotal += value;
    } else if (sign === 'minus') {
        this.expensesTotal += value;
    }
    this.budget = this.incomeTotal - this.expensesTotal;

    percentDOM.textContent = Math.round((this.expensesTotal / this.incomeTotal * 100));
}

// Budget prototype : Display list
Budget.prototype.display = function() {

    // 1. display budget - income -expenses
    budgetDOM.textContent = formatNumber(this.budget);
    incomeTotalDOM.textContent = formatNumber(this.incomeTotal);
    expensesTotalDOM.textContent = formatNumber(this.expensesTotal);

    // 2. display
    removeList('income');
    removeList('expenses');
    budget.loop('income', this.incomeList);
    budget.loop('expenses', this.expensesList);
}

// Budget prototype : loop
Budget.prototype.loop = function(type, arr) {

    let size = arr.length;

    for (var i = 0; i < size; i++) {
        addRow(type, arr[i][0], formatNumber(arr[i][1]), i);
    }
}

// Function Format number
function formatNumber(number) {
    return Intl.NumberFormat().format(number);
}

// Function remove list
function removeList(type) {
    var list = document.getElementById('list-' + type);
    while (list.hasChildNodes()) {
        list.removeChild(list.firstChild);
    }
}

// Function add row
function addRow(type, des, value, index) {
    // 1. Create element
    var div_row = document.createElement("div");
    var div_col_7 = document.createElement("div");
    var div_col_4 = document.createElement("div");
    var div_col_1 = document.createElement("div");

    var p_des = document.createElement("p");
    var p_value = document.createElement("p");
    var img = document.createElement("img");
    var node_des = document.createTextNode(des);
    var node_value = document.createTextNode(value);

    // 2. Append element
    div_row.appendChild(div_col_7);
    div_row.appendChild(div_col_4);
    div_row.appendChild(div_col_1);

    div_col_7.appendChild(p_des);
    div_col_4.appendChild(p_value);
    div_col_1.appendChild(img);

    p_des.appendChild(node_des);
    p_value.appendChild(node_value);

    // 3. Add Attr
    div_row.classList.add('row', 'row-detail');
    div_col_7.classList.add('col-7');
    div_col_4.classList.add('col-4');
    div_col_1.classList.add('col-1');

    p_des.classList.add('title');
    p_value.classList.add('value-' + type);

    img.classList.add('trash-can');
    img.src = 'trash.png';
    img.alt = 'trash-can';
    img.id = index;

    // 4. Add to lish
    var element = document.getElementById('list-' + type);
    element.appendChild(div_row);
}

// Creat new object
var budget = new Budget(0, 0, 0, [], []);

budget.init(budgetDOM, incomeTotalDOM, expensesTotalDOM);


// 1. Event change sign
signInputDOM.addEventListener('change', function() {
    signInput = signInputDOM.value;
    console.log(signInput);
})

// 2. Get value input - process
// Event click button add
btnAddDOM.addEventListener('click', function() {

    // 1. Get value
    desInput = desInputDOM.value;
    valueInput = parseInt(valueInputDOM.value);

    // 2. Check sign + or - 
    // if plus push to income list
    // calculate income total

    if (!isNaN(valueInput)) {
        if (signInput === 'plus') {
            budget.incomeList.push([desInput, valueInput]);

            // if minus push to expense list
        } else if (signInput === 'minus') {
            budget.expensesList.push([desInput, valueInput]);
        }
        budget.calculateTotal(signInput, valueInput);
        console.log(budget);
        budget.display();
    }
})

// 3. detele row
listIncomeDOM.addEventListener('click', function(event) {
    element = event.target;

    if (element.tagName === 'IMG') {
        budget.delRow('income', element);
    }
})

listExpensesDOM.addEventListener('click', function(event) {
    element = event.target;

    if (element.tagName === 'IMG') {
        budget.delRow('expenses', element);
    }
})

Budget.prototype.delRow = function(type, element) {

    var id = element.id;

    if (type === 'income') {
        this.incomeTotal -= budget.incomeList[id][1];
        this.incomeList.splice(id, 1);

    } else if (type === 'expenses') {
        this.expensesTotal -= budget.expensesList[id][1];
        this.expensesList.splice(id, 1);
    }
    // calculate percent
    percentDOM.textContent = Math.round((this.expensesTotal / this.incomeTotal * 100));
    this.budget = this.incomeTotal - this.expensesTotal;
    this.display();
}