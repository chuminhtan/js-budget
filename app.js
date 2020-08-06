// BUDGET CONTROLLER
var budgetController = (function() {

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalInc) {

        if (totalInc > 0) {

            this.percentage = Math.round((this.value / totalInc * 100));
        } else {

            this.percentage = -1;
        }
    }

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1
    };


    return {

        addItem: function(type, des, val) {

            var newItem, ID;

            // Create new ID
            if (data.allItems[type].length > 0) {

                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {

                ID = 0;
            }

            // Create new Item
            if (type === 'inc') {

                newItem = new Income(ID, des, val);
            } else if (type === 'exp') {

                newItem = new Expense(ID, des, val);
            }

            // Push it into data
            data.allItems[type].push(newItem);

            // Return new Item
            return newItem;
        },

        calculateBudget: function(type) {

            var sum = 0;

            // Calculate sum Inc or Exp
            data.allItems[type].forEach(function(current) {

                sum += current.value;
            });

            data.totals[type] = sum;

            // Calculate the budget
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate percentage
            if (data.totals.inc > 0) {

                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePerc: function() {

            data.allItems.exp.forEach(function(current) {
                current.calcPercentage(data.totals.inc);
            });
        },

        getPerc: function() {

            var percentages = data.allItems.exp.map(function(current) {
                return current.percentage;
            })

            return percentages;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            };
        },

        deleteItem: function(type, id) {

            var index, IDs;

            // Get list ID
            IDs = data.allItems[type].map(function(current) {
                return current.id;
            })

            // Get index of id argument
            index = IDs.indexOf(id);

            // Delete item
            if (index !== -1) {

                data.allItems[type].splice(index, 1);
            }
        },

        testing: function() {
            console.log(data);
        }
    }

})();



/**
 * UI CONTROLLER
 */

var UIController = (function() {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        expensesContainer: '.expenses__list',
        incomeContainer: '.income__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        timeLabel: '.budget__title--month'
    };


    var nodeListForEach = function(list, callBack) {

        for (var i = 0; i < list.length; i++) {
            callBack(list[i], i);
        }
    };



    return {

        // Display Time
        displayTime: function() {

            var date = new Date();
            var month = date.getMonth();
            var year = date.getFullYear();

            document.querySelector(DOMstrings.timeLabel).textContent = month + ' - ' + year;
        },

        // Get Input
        getInput: function() {

            return {
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        // Get DOM string
        getDOMstrings: function() {
            return DOMstrings;
        },

        // Add List Item
        addListItem: function(obj, type) {

            var html, newHtml, element;

            // Create HTML string with placeholder

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%des%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            // Replace holder text with some actual data

            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%des%', obj.description);
            newHtml = newHtml.replace('%value%', this.formatNumber(obj.value));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        // Clear fields
        clearFields: function() {

            var fields, fieldsArr;

            // Get list fields
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            // Convert list type to array type
            fieldsArr = Array.prototype.slice.call(fields);

            // Clear fields
            fieldsArr.forEach(function(current, index, array) {
                current.value = '';
            });

            // Focus on description field
            fieldsArr[0].focus();
        },

        // Display budget
        displayBudget: function(obj) {

            document.querySelector(DOMstrings.budgetLabel).textContent = this.formatNumber(obj.budget);
            document.querySelector(DOMstrings.incomeLabel).textContent = this.formatNumber(obj.totalInc);
            document.querySelector(DOMstrings.expensesLabel).textContent = this.formatNumber(obj.totalExp);

            if (obj.percentage > 0) {

                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
            } else {

                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
        },

        // Display percentages
        displayPerc: function(percentages) {

            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);



            nodeListForEach(fields, function(current, index) {

                if (percentages[index] !== -1) {

                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            })
        },

        // Delete item
        deleteListItem: function(id) {

            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },

        // Format Number
        formatNumber: function(num) {

            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },

        // Changed Type
        changedType: function() {

            var fields = document.querySelectorAll(
                DOMstrings.inputType + ', ' +
                DOMstrings.inputDescription + ', ' +
                DOMstrings.inputValue
            );

            nodeListForEach(fields, function(current) {

                current.classList.add('red-focus');
            });

            document.querySelector(DOMstrings.inputBtn).classList.add('red');
        }
    };
})();



/**
 * APP CONTROLLER
 */

var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {

            if (event.keyCode === 13 || event.which === 13) {

                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };

    var updateBudget = function() {

        var budget;

        // Calculate budget 
        budgetCtrl.calculateBudget('inc');
        budgetCtrl.calculateBudget('exp');

        // Return budget
        budget = budgetCtrl.getBudget();

        // Display budget into UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function() {

        // Calculate percentage
        budgetCtrl.calculatePerc();

        // Get percentages
        var percentages = budgetCtrl.getPerc();

        // Display Percentages
        UICtrl.displayPerc(percentages);
    }


    var ctrlAddItem = function() {

        var input, newItem;

        // 1. Get the field input data
        input = UICtrl.getInput();


        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to the budget controller
            newItem = budgetController.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);

            // 4. Clear the fields
            UICtrl.clearFields();

            // 5.  Calculate and Update Budget
            updateBudget();

            // 6. Calculate and Update Percentages
            updatePercentages();
        }

    };

    var ctrlDeleteItem = function(event) {

        var element, item, itemType, itemID;

        elementID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (elementID) {

            // Get array string after split
            item = elementID.split("-");
            itemType = item[0];
            itemID = parseInt(item[1]);

            // Delete item from data structure
            budgetCtrl.deleteItem(itemType, itemID);

            // Delete item from UI
            UICtrl.deleteListItem(elementID);

            // Update Budget from data structure
            updateBudget();

            // Calculate and Update Percentages
            updatePercentages();
        }



    };


    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayTime();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();