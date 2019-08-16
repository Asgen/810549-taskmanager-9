const getFiltersTemplate = ({title, count}) => {
  return `
    <input type="radio" id="filter__${title}" class="filter__input visually-hidden" name="filter" ${count ? `` : `disabled=""`} checked="">
    <label for="filter__${title}" class="filter__label">
      ${title} <span class="filter__${title}-count">${count}</span>
    </label>`;
};

export {getFiltersTemplate as filters};
