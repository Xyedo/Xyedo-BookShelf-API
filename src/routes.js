const {
  addNewBookHandler,
  getAllBooksHandler,
  getBookDetailById,
  changesBookDataById,
  deleteBookById,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addNewBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBooksHandler,
  },
  {
    method: "GET",
    path: "/books/{bookId}",
    handler: getBookDetailById,
  },
  {
    method: "PUT",
    path: "/books/{bookId}",
    handler: changesBookDataById,
  },
  {
    method: "DELETE",
    path: "/books/{bookId}",
    handler: deleteBookById,
  },
];

module.exports = routes;
