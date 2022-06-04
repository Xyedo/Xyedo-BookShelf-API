const { nanoid } = require("nanoid");
const books = require("./books");

const addNewBookHandler = (request, h) => {
  try {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    const id = nanoid(16);

    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const nameIsEmptyError = typeof name === "undefined";
    const readPageError = readPage > pageCount;

    if (nameIsEmptyError) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }
    if (readPageError) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    books.push(newBook);
    const isSucces = books.some((book) => book.id === id);
    if (!isSucces) {
      const response = h.response({
        status: "error",
        message: "Buku gagal ditambahkan",
      });
      response.code(500);
      return response;
    }
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  } catch (e) {
    const response = h.response({
      status: "error",
      message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
  }
};
const getAllBooksHandler = (request, h) => {
  let { name, reading, finished } = request.query;
  let filteredBooks = books;
  if (typeof name === "string") {
    filteredBooks = filteredBooks.filter((book) => {
      const bookNames = book.name.split(" ");
      for (let i = 0; i < bookNames.length; i++) {
        if (
          bookNames[i].localeCompare(name, undefined, {
            sensitivity: "accent",
          }) === 0
        ) {
          return true;
        }
      }
      return false;
    });
  }
  if (typeof reading === "string") {
    reading = Number(reading);
    if (reading === 0) {
      filteredBooks = filteredBooks.filter((book) => book.reading === false);
    } else if (reading === 1) {
      filteredBooks = filteredBooks.filter((book) => book.reading === true);
    }
  }
  if (typeof finished === "string") {
    finished = Number(finished);
    if (finished === 0) {
      filteredBooks = filteredBooks.filter((book) => book.finished === false);
    } else if (finished === 1) {
      filteredBooks = filteredBooks.filter((book) => book.finished === true);
    }
  }
  filteredBooks = filteredBooks.map((book) => {
    return {
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    };
  });
  const response = h.response({
    status: "success",
    data: { books: filteredBooks },
  });
  response.code(200);
  return response;
};

const getBookDetailById = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: "success",
    data: {
      book: books[index],
    },
  });
  response.code(200);
  return response;
};

const changesBookDataById = (request, h) => {
  const { bookId } = request.params;
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const nameIsEmptyError = typeof name === "undefined";
  const readPageError = readPage > pageCount;
  if (nameIsEmptyError) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Mohon isi nama buku",
    });
    response.code(400);
    return response;
  }
  if (readPageError) {
    const response = h.response({
      status: "fail",
      message:
        "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
    });
    response.code(400);
    return response;
  }
  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  const updatedAt = new Date().toISOString();
  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };
  const response = h.response({
    status: "success",
    message: "Buku berhasil diperbarui",
  });
  response.code(200);
  return response;
};
const deleteBookById = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  books.splice(index, 1);
  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};
module.exports = {
  addNewBookHandler,
  getAllBooksHandler,
  getBookDetailById,
  changesBookDataById,
  deleteBookById,
};
