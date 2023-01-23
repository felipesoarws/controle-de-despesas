const transactionsDOM = document.querySelector("#transactions");
const balanceTotalDOM = document.querySelector("#balance");
const incomesDOM = document.querySelector("#money-plus");
const expensesDOM = document.querySelector("#money-minus");
const formDOM = document.querySelector("#form");

const inputTransactionName = document.querySelector("#text");
const inputTransactionAmount = document.querySelector("#amount");

const warningDOM = document.querySelector(".warning");
const warningBtnDOM = document.querySelector(".warning-btn");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

const removeTransaction = (ID) => {
  transactions = transactions.filter((transaction) => transaction.id !== ID);
  uptadeLocalStorage();
  init();
};

const addTransaction = (transaction) => {
  const operator = transaction.amount < 0 ? "-" : "+";
  const CSSClass = transaction.amount < 0 ? "minus" : "plus";
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement("li");

  li.classList.add(CSSClass);
  li.innerHTML = `
  ${transaction.name} <span>${operator} R$ ${amountWithoutOperator}</span>
  <button  class="delete-btn" onClick="removeTransaction(${transaction.id})">x</button>
  `;

  transactionsDOM.append(li);
};

const uptadeBalanceValues = () => {
  const transactionsAmounts = transactions.map(
    (transactions) => transactions.amount
  );

  const transactionsTotal = transactionsAmounts
    .reduce((acc, num) => acc + num, 0)
    .toFixed(2);

  const transactionsIncomes = transactionsAmounts
    .filter((transactions) => transactions > 0)
    .reduce((acc, num) => acc + num, 0)
    .toFixed(2);

  const transactionsExpenses = transactionsAmounts
    .filter((transactions) => transactions < 0)
    .reduce((acc, num) => acc + num, 0)
    .toFixed(2);

  uptadeBalanceValuesIntoDOM(
    transactionsTotal,
    transactionsIncomes,
    transactionsExpenses
  );
};

const uptadeBalanceValuesIntoDOM = (total, incomes, expenses) => {
  const amountWithoutOperator = Math.abs(expenses).toFixed(2);

  balanceTotalDOM.innerHTML = `R$ ${total}`;
  incomesDOM.innerHTML = `R$ ${incomes}`;
  expensesDOM.innerHTML = `R$ ${amountWithoutOperator}`;
};

const init = () => {
  transactionsDOM.innerHTML = "";
  transactions.forEach(addTransaction);
  uptadeBalanceValues();
};

init();

const uptadeLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

formDOM.addEventListener("submit", (e) => {
  e.preventDefault();

  if (
    inputTransactionAmount.value.trim() === "" ||
    inputTransactionName.value.trim() === ""
  ) {
    warningDOM.classList.add("on");
    return;
  }

  const transaction = {
    id: transactions.length + 1,
    name: inputTransactionName.value,
    amount: Number(inputTransactionAmount.value),
  };

  transactions.push(transaction);
  init();
  uptadeLocalStorage();

  inputTransactionAmount.value = "";
  inputTransactionName.value = "";
});

warningBtnDOM.addEventListener("click", () => {
  warningDOM.classList.remove("on");
});
