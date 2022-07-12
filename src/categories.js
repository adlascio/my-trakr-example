let categories = [];
let categoryCounter = 0;

export const getCategories = () => {
  return categories;
};

export const addCategory = (category) => {
  categoryCounter++;
  const newCategory = {
    id: categoryCounter,
    name: category,
  };
  categories = [...categories, newCategory];
  return newCategory;
};

export default { getCategories, addCategory };
