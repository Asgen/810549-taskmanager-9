import {render, Position} from '../src/utils.js';
import {tasksList, filtersList} from '../src/data.js';

import FiltersContainer from '../src/components/filters-container.js';
import Menu from '../src/components/menu.js';
import Search from '../src/components/search.js';
import Filter from '../src/components/filters.js';

import BoardController from '../src/controllers/board-controller.js';

const renderFilter = (filters) => {
  filters.forEach((taskMock) => {
    const filter = new Filter(taskMock);
    render(filtersContainer, filter.getElement(), Position.BEFOREEND);
  });
};

const mainContainer = document.querySelector(`.main`);
const menuContainer = mainContainer.querySelector(`.main__control`);
render(menuContainer, new Menu().getElement(), Position.BEFOREEND);
render(mainContainer, new Search().getElement(), Position.BEFOREEND);
render(mainContainer, new FiltersContainer().getElement(), Position.BEFOREEND);

const filtersContainer = mainContainer.querySelector(`.main__filter`);
renderFilter(filtersList);

const boardController = new BoardController(tasksList, mainContainer);
boardController.init();
