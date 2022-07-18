//common functions that can be used in different cases
import { loadAccounts } from './Account.js';
import { loadCategories } from './Category.js';

export const domainUrl = 'https://my-trakr-api.herokuapp.com';

export const addAlert = (status, message) => {
  $('#alert-container').append(`<div class="alert alert-${status}" role="alert">
    ${message}
  </div>`);
  setTimeout(() => {
    $('.alert').fadeOut();
  }, 2000);
};

export const init = () => {
  $('.select-transfer').hide();
  $('.add-new-category').hide();
  $('#noTransactionsMsg').show();
  loadAccounts();
  loadCategories();
};

export default { domainUrl, addAlert, init };
