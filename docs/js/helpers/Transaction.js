import { findAccountById } from './Account.js';
import { addAlert, domainUrl } from './Common.js';

class Transaction {
  constructor(transaction) {
    this.amount = transaction.amount;
    this.accountId = transaction.accountId;
    this.category = transaction.category;
    this.description = transaction.description;
    this.id = transaction.id;
    this.type = transaction.type;
    this.accountId = transaction.accountId;
    this.accountIdFrom = transaction.accountIdFrom;
    this.accountIdTo = transaction.accountIdTo;
  }

  get class() {
    if (this.value > 0) {
      return 'success';
    } else {
      return 'danger';
    }
  }

  append(username, receiver, sender) {
    $('#transactions-table').append(`
      <tr class="table-row row-${this.class}">
        <td>${this.id}</td>
        <td>${username}</td>
        <td>${this.type}</td>
        <td>${this.category}</td>
        <td>${this.description}</td>
        <td class="amount-${this.class}">${this.value}</td>
        <td>${receiver}</td>
        <td>${sender}</td>
       </tr>
       `);
  }
}

class Withdrawal extends Transaction {
  get value() {
    return -this.amount;
  }
}

class Deposit extends Transaction {
  get value() {
    return this.amount;
  }
}

class Transfer extends Transaction {
  get value() {
    if (this.accountId == this.accountIdFrom) {
      return -this.amount;
    }
    return this.amount;
  }
}

let allTransactions = [];

export const validateTransaction = (transaction) => {
  if (!transaction.type) {
    addAlert('danger', 'Please, select one type of transaction!');
    return false;
  }
  if (transaction.type === 'Transfer') {
    if (!transaction.accountIdFrom || !transaction.accountIdTo) {
      addAlert('danger', 'Please, select the sender and receiver account!');
      return false;
    } else if (transaction.accountIdFrom === transaction.accountIdTo) {
      addAlert('danger', 'The sender and receiver account cannot be equal!');
      return false;
    }
  } else {
    if (!transaction.accountId) {
      addAlert('danger', 'Please, select the account!');
      return false;
    }
  }
  if (!transaction.category) {
    addAlert('danger', 'Please, select the category!');
    return false;
  }
  if (!transaction.amount || transaction.amount <= 0) {
    addAlert('danger', 'Invalid amount!');
    return false;
  }
  const account = findAccountById(
    transaction.accountId || transaction.accountIdFrom
  );
  if (
    transaction.type !== 'Deposit' &&
    account &&
    !account.checkBalance(transaction.amount)
  ) {
    addAlert('danger', 'Not enough balance!');
    return false;
  }
  return true;
};

export const postTransaction = (newTransaction) => {
  $.ajax({
    type: 'post',
    url: `${domainUrl}/transaction`,
    data: JSON.stringify({ newTransaction }),
    contentType: 'application/json',
    dataType: 'json',
  }).done((data) => {
    addAlert('success', 'Transaction successfuly created!');
    data.forEach((transaction) => {
      const accountFound = findAccountById(transaction.accountId);
      if (accountFound) {
        const newTransaction = createTransaction(transaction, accountFound);
        accountFound.transactions.push(newTransaction);
        addTransactionToList(newTransaction);
        $(`#${newTransaction.accountId} .balance`).text(accountFound.balance);
      }
    });
  });
};

const addTransactionToList = (transaction) => {
  const { type, accountId, accountIdTo, accountIdFrom } = transaction;
  const account = findAccountById(accountId);
  let senderUsername = 'n/a';
  let receiverUsername = 'n/a';
  if (type === 'Transfer') {
    if (accountIdFrom == account.id) {
      senderUsername = account.username;
      receiverUsername = findAccountById(accountIdTo).username;
    } else {
      senderUsername = findAccountById(accountIdFrom).username;
      receiverUsername = account.username;
    }
  }

  transaction.append(account.username, senderUsername, receiverUsername);
};

export const showAllTransactions = (transactions) => {
  if (!transactions.length) {
    $('#noTransactionsMsg').show();
    return;
  }
  $('#noTransactionsMsg').hide();
  transactions.sort((a, b) => a.id - b.id);
  $.each(transactions, (i, transaction) => {
    addTransactionToList(transaction);
  });
};

export const createTransaction = (transaction) => {
  if (transaction.type === 'Withdraw') return new Withdrawal(transaction);
  if (transaction.type === 'Deposit') return new Deposit(transaction);
  if (transaction.type === 'Transfer') return new Transfer(transaction);
};

export const saveTransactions = (transactions) => {
  allTransactions = [...transactions];
};

export const getAllTransactions = () => {
  return allTransactions;
};

export default { saveTransactions, getAllTransactions, showAllTransactions };
