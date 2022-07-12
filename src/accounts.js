const accounts = [];

export const getAccounts = () => {
  return accounts;
};

export const addAccount = (account) => {
  const newAccount = { ...account, id: accounts.length + 1 };
  accounts.push(newAccount);
  return newAccount;
};

export default { getAccounts, addAccount };
