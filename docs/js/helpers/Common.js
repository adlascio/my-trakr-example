//common functions that can be used in different cases

export const domainUrl = 'https://my-trakr-api.herokuapp.com';

const addAlert = (status, message) => {
  $('#alert-container').append(`<div class="alert alert-${status}" role="alert">
    ${message}
  </div>`);
  setTimeout(() => {
    $('.alert').fadeOut();
  }, 2000);
};

const init = () => {
  loadAccounts();
  loadCategories();
};

export default { domainUrl };
