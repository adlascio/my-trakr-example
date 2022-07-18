import { domainUrl } from './Common.js';
import {
  saveTransactions,
  showAllTransactions,
  createTransaction,
} from './Transaction.js';
import { addAlert } from './Common.js';

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
  const balance = newAccount.balance;
  $('#account-list').append(`
        <li id=${newAccount.id}>${
    newAccount.username
  }: <span class='balance'>$ ${balance.toFixed(2)}</span> </li>
        `);
};

export const loadAccounts = () => {
  $.get(`${domainUrl}/accounts`, (data) => {
    let allTransactions = [];
    if (data.length > 0) {
      $('#noAccountsMsg').hide();
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
    }
  });
  return accounts;
};
export const getAccounts = async () => {
  const data = await $.get(`${domainUrl}/accounts`);
  return data.map((account) => {
    return new Account(account.username, account.transactions, account.id);
  });
};
export const postAccount = (newAccount) => {
  $.ajax({
    type: 'post',
    url: `${domainUrl}/accounts`,
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

export const findAccountById = (id) => {
  return accounts[id];
};

export default { findAccountById, getAccounts, postAccount, loadAccounts };
