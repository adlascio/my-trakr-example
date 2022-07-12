const addCategoryToList = (category) => {
  $('#option-add-new').before(
    `<option value='${category}'>${category}</option>`
  );
  $('#select-filter-category').append(
    `<option value='${category}'>${category}</option>`
  );
};

const loadCategories = () => {
  $.get('http://localhost:3000/categories', (data, status) => {
    data.forEach((category) => {
      addCategoryToList(category.name);
    });
  });
};

const postCategory = (newCategory) => {
  if (!newCategory) return;
  const data = { newCategory };
  $.ajax({
    type: 'post',
    url: 'http://localhost:3000/categories',
    data: JSON.stringify(data),
    contentType: 'application/json; charset=utf-8',
    traditional: true,
    success: (data) => {
      addCategoryToList(data.name);
      $('input.add-new-category').val('');
      $('.add-new-category').hide();
    },
  });
};
