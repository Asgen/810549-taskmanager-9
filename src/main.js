import {render, Position} from '../src/utils.js';
import {tasksList, filtersList} from '../src/data.js';

import FiltersContainer from '../src/components/filters-container.js';
import Menu from '../src/components/menu.js';
import Search from '../src/components/search.js';
import Filter from '../src/components/filters.js';
import Statistic from '../src/components/statistic.js';

import BoardController from '../src/controllers/board-controller.js';

const renderFilter = (filters) => {
  filters.forEach((taskMock) => {
    const filter = new Filter(taskMock);
    render(filtersContainer, filter.getElement(), Position.BEFOREEND);
  });
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);
const menu = new Menu();
render(menuContainer, menu.getElement(), Position.BEFOREEND);
render(mainContainer, new Search().getElement(), Position.BEFOREEND);
render(mainContainer, new FiltersContainer().getElement(), Position.BEFOREEND);

const filtersContainer = mainContainer.querySelector(`.main__filter`);
renderFilter(filtersList);

const boardController = new BoardController(mainContainer);
boardController.show(tasksList);
const statistic = new Statistic();
statistic.getElement().classList.add(`visually-hidden`);
render(mainContainer, statistic.getElement(), Position.BEFOREEND);

menu.getElement().addEventListener(`change`, (evt) => {
  if (evt.target.tagName !== `INPUT`) {
    return;
  }

  switch (evt.target.id) {
    case (`control__task`):
      boardController.show(tasksList);
      statistic.getElement().classList.add(`visually-hidden`);
      break;
    case (`control__statistic`):
      statistic.getElement().classList.remove(`visually-hidden`);
      boardController.hide();
      break;
    case (`control__new-task`):
      boardController.createTask();
      // Вернем выделенный элемент
      menu.getElement().querySelector(`#control__task`).checked = true;
      break;
  }
});


