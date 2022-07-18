import { domainUrl } from './Common.js';

const addCategoryToList = (category) => {
  $('#option-add-new').before(
    `<option value='${category}'>${category}</option>`
  );
  $('#select-filter-category').append(
    `<option value='${category}'>${category}</option>`
  );
};

export const loadCategories = () => {
  $.get(`${domainUrl}/categories`, (data) => {
    data.forEach((category) => {
      addCategoryToList(category.name);
    });
  });
};

export const postCategory = (newCategory) => {
  if (!newCategory) return;
  const data = { newCategory };
  $.ajax({
    type: 'post',
    url: `${domainUrl}/categories`,
    data: JSON.stringify(data),
    contentType: 'application/json',
    dataType: 'json',
  }).done((data) => {
    addCategoryToList(data.name);
    $('input.add-new-category').val('');
    $('.add-new-category').hide();
  });
};

export default { loadCategories, postCategory };
