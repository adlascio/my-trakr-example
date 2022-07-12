class Account {
  constructor(id, username, transactions = []) {
    this.id = id;
    this.username = username;
    this.transactions = transactions;
  }

  get balance() {
    return this.transactions.reduce((total, transaction) => {
      return total + transaction.value;
    }, 0);
  }

  checkBalance(amount) {
    if (amount <= this.balance) return true;
  }
}

let accounts = {};
const addAccountToList = (account) => {
  $('.select-account').append(
    `<option value='${account.id}'>${account.username}</option>`
  );
};
const addAccountToSummary = (newAccount) => {
  $('#account-list').append(`
        <li id=${newAccount.id}>${newAccount.username}: <span class='balance'>${newAccount.balance}</span> </li>
        `);
};

const loadAccounts = () => {
  $.get(`${domainUrl}/accounts`, (data, status) => {
    let allTransactions = [];
    data.forEach((account) => {
      const { id, username, transactions } = account;
      const updatedTransactions = transactions.map((transaction) => {
        return createTransaction(transaction, account);
      });
      allTransactions = [...allTransactions, ...updatedTransactions];
      const newAccount = new Account(id, username, updatedTransactions);
      accounts[newAccount.id] = newAccount;
      addAccountToList(newAccount);
      addAccountToSummary(newAccount);
    });
    saveTransactions(allTransactions);
    showAllTransactions(allTransactions);
  });
  return accounts;
};
const getAccounts = async () => {
  const data = await $.get('http://localhost:3000/accounts');
  return data.map((element) => {
    console.log('el', element);
    return new Account(element.username, element.transactions, element.id);
  });
};
const postAccount = (newAccount) => {
  $.ajax({
    type: 'post',
    url: 'http://localhost:3000/accounts',
    data: JSON.stringify({ newAccount }),
    contentType: 'application/json; charset=utf-8',
    traditional: true,
    success: (data) => {
      addAlert('success', 'Account created successfuly!');
      const newAccount = new Account(data.id, data.username, data.transactions);
      accounts[newAccount.id] = newAccount;
      addAccountToList(newAccount);
      addAccountToSummary(newAccount);
      $('#account-input').val('');
    },
    error: (err) => console.log('err', err),
  });
};

const findAccountById = (id) => {
  return accounts.find((account) => {
    return account.id == id;
  });
};
