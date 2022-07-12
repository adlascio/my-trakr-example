class Transaction {
  constructor(amount, account, category, description = '', id, type) {
    this.amount = amount;
    this.account = account;
    this.category = category;
    this.description = description;
    this.id = id;
    this.type = type;
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
  constructor(
    amount,
    account,
    category,
    description = '',
    type,
    id,
    accountIdFrom,
    accountIdTo
  ) {
    super(amount, account, category, description, type, id);
    this.accountIdFrom = accountIdFrom;
    this.accountIdTo = accountIdTo;
  }
  get value() {
    if (this.account.id == this.accountIdFrom) {
      return -this.amount;
    }
    return this.amount;
  }
}

let allTransactions = [];

const validateTransaction = (transaction) => {
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

const postTransaction = (newTransaction) => {
  $.ajax({
    type: 'post',
    url: 'http://localhost:3000/transaction',
    data: JSON.stringify({ newTransaction }),
    contentType: 'application/json; charset=utf-8',
    traditional: true,
    success: (data) => {
      addAlert('success', 'Transaction successfuly created!');
      data.forEach((transaction) => {
        const accountFound = findAccountById(transaction.accountId);
        if (accountFound) {
          const newTransaction = createTransaction(transaction, accountFound);
          newTransaction.commit();
          addTransactionToList(newTransaction);
          $(`#${newTransaction.account.id} .balance`).text(
            newTransaction.account.balance
          );
        }
      });
    },
  });
};

const addTransactionToList = (transaction) => {
  const {
    type,
    account,
    accountIdTo,
    accountIdFrom,
    category,
    description,
    id,
  } = transaction;
  let senderUsername;
  let receiverUsername;
  if (type === 'Transfer') {
    if (accountIdFrom == account.id) {
      senderUsername = account.username;
      receiverUsername = findAccountById(accountIdTo).username;
    } else {
      senderUsername = findAccountById(accountIdFrom).username;
      receiverUsername = account.username;
    }
  }
  if (type === 'Deposit') {
    senderUsername = account.username;
    receiverUsername = 'n/a';
  }
  if (type === 'Withdraw') {
    receiverUsername = account.username;
    senderUsername = 'n/a';
  }

  $('#transactions-table').append(`
      <tr class="table-row">
        <td>${id}</td>
        <td>${account.username}</td>
        <td>${type}</td>
        <td>${category}</td>
        <td>${description}</td>
        <td>${transaction.value}</td>
        <td>${receiverUsername}</td>
        <td>${senderUsername}</td>
       </tr>
       `);
};

const showAllTransactions = (transactions) => {
  transactions.sort((a, b) => a.id - b.id);
  if (!transactions.length) return;
  $.each(transactions, (i, transaction) => {
    addTransactionToList(transaction);
  });
};

const createTransaction = (transaction, account) => {
  const {
    accountIdFrom,
    accountIdTo,
    amount,
    category,
    description,
    id,
    type,
  } = transaction;
  let newTransaction;
  switch (type) {
    case 'Withdraw':
      newTransaction = new Withdrawal(
        amount,
        account,
        category,
        description,
        id,
        type
      );
      break;
    case 'Deposit':
      newTransaction = new Deposit(
        amount,
        account,
        category,
        description,
        id,
        type
      );
      break;
    case 'Transfer':
      newTransaction = new Transfer(
        amount,
        account,
        category,
        description,
        id,
        type,
        accountIdFrom,
        accountIdTo
      );
      break;
    default:
      break;
  }
  return newTransaction;
};

const saveTransactions = (transactions) => {
  allTransactions = [...transactions];
};

const getAllTransactions = () => {
  return allTransactions;
};
