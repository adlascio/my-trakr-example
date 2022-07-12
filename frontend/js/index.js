$(() => {
  //Start coding here!
  init();
  // account form submit handler
  $('#form-account').on('submit', (e) => {
    e.preventDefault();
    const username = $('#account-input').val();
    const exists = Object.values(accounts).indexOf(
      (account) => account.username === username
    );
    if (!username) {
      addAlert('danger', 'Invalid username!');
      return;
    }
    if (exists !== -1) {
      addAlert('danger', 'Username already exists!');
      return;
    }
    const newAccount = { username, transactions: [] };
    postAccount(newAccount);
  });
  $('.select-transfer').hide();
  $("[name='transaction-type']").on('click', (e) => {
    const val = $('input[name="transaction-type"]:checked').val();
    if (val === 'Transfer') {
      $('.select-transfer').show();
      $('#account').hide();
    } else {
      $('.select-transfer').hide();
      $('#account').show();
    }
  });
  $('.add-new-category').hide();
  $('#select-category').on('change', () => {
    const val = $('#select-category').val();
    if (val === 'add-new') {
      $('.add-new-category').show();
    } else {
      $('.add-new-category').hide();
    }
  });
  $('#form-transaction').on('submit', (e) => {
    e.preventDefault();
    const type = $('input[name="transaction-type"]:checked').val();
    const accountId = $('#select-account').val();
    const accountIdFrom = $('#select-from').val();
    const accountIdTo = $('#select-to').val();
    const category = $('#select-category').val();
    const amount = $('#amount').val();
    const description = $('#input-description').val();
    const transaction = {
      type,
      accountId: Number(accountId),
      accountIdFrom: Number(accountIdFrom),
      accountIdTo: Number(accountIdTo),
      category,
      amount: Number(amount),
      description,
    };
    if (!validateTransaction(transaction)) return;
    postTransaction(transaction);
  });
  $('button.add-new-category').on('click', () => {
    const newCategory = $('input.add-new-category').val();
    postCategory(newCategory);
  });
  $('#select-filter-account').on('change', () => {
    const selectedAccount = $('#select-filter-account').val();
    let transactions;
    if (selectedAccount === 'All') {
      transactions = getAllTransactions();
    } else {
      const account = findAccountById(selectedAccount);
      transactions = account.transactions;
    }
    $('.table-row').detach();
    showAllTransactions(transactions);
  });
});
