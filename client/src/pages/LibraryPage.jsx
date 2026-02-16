import React, { useMemo, useRef, useState, useCallback } from "react";
import { AgGridReact } from "ag-grid-react";
import { Box, Card, CardContent, Typography, Button, Stack } from "@mui/material";

const API = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function LibraryPage() {
  const authorsGridRef = useRef(null);
  const booksGridRef = useRef(null);

  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  const authorsColDefs = useMemo(
    () => [
      { field: "full_name", headerName: "Автор", flex: 1, minWidth: 260 },
      { field: "country", headerName: "Страна", width: 160 },
      { field: "rating", headerName: "Рейтинг", width: 120 },
      { field: "birth_date",
        headerName: "Дата рождения",
        width: 160,
        valueFormatter: (p) => (p.value ? String(p.value).slice(0, 10) : ""),
       },
    ],
    []
  );

  const booksColDefs = useMemo(
    () => [
      { field: "title", headerName: "Книга", flex: 1, minWidth: 320 },
      { field: "pages", headerName: "Стр.", width: 110 },
      { field: "price", headerName: "Цена", width: 110 },
      { field: "published_on",
        headerName: "Дата выхода",
        width: 160,
        valueFormatter: (p) => (p.value ? String(p.value).slice(0, 10) : ""),
       },
    ],
    []
  );

  const authorsDatasource = useMemo(() => {
    return {
      getRows: async (params) => {
        const start = params.startRow ?? params.request?.startRow ?? 0;
        const end = params.endRow ?? params.request?.endRow ?? 50;
        const limit = Math.max(1, end - start);

        const url = `${API}/api/authors?limit=${limit}&offset=${start}`;

        try {
          const resp = await fetch(url);
          if (!resp.ok) {
            if (typeof params.failCallback === "function") params.failCallback();
            if (typeof params.fail === "function") params.fail();
            return;
          }

          const data = await resp.json();
          const rows = data.rows || [];
          const total = data.total ?? 0;

          if (typeof params.successCallback === "function") params.successCallback(rows, total);
          if (typeof params.success === "function") params.success({ rowData: rows, rowCount: total });
        } catch {
          if (typeof params.failCallback === "function") params.failCallback();
          if (typeof params.fail === "function") params.fail();
        }
      },
    };
  }, []);

  const onAuthorsGridReady = useCallback(
    (params) => {
      params.api.setGridOption("datasource", authorsDatasource);
      params.api.refreshInfiniteCache();
    },
    [authorsDatasource]
  );

  const onAuthorSelected = useCallback(async (author) => {
    setSelectedAuthor(author);
    setSelectedBook(null);

    if (!author) {
      setBooks([]);
      return;
    }

    const resp = await fetch(`${API}/api/books?authorId=${author.id}`);
    const data = await resp.json();
    setBooks(data.rows || []);
  }, []);

  const onAuthorRowClicked = useCallback(
    async (e) => {
      e.node.setSelected(true);
      const author = e.data || null;
      await onAuthorSelected(author);
    },
    [onAuthorSelected]
  );

  const onBookRowClicked = useCallback((e) => {
    e.node.setSelected(true);
    setSelectedBook(e.data || null);
  }, []);

  async function refreshBooks() {
    if (!selectedAuthor) return;
    const resp = await fetch(`${API}/api/books?authorId=${selectedAuthor.id}`);
    const data = await resp.json();
    setBooks(data.rows || []);
  }

  async function addBook() {
    if (!selectedAuthor) {
      alert("Сначала выбери автора в верхней таблице.");
      return;
    }

    const title = prompt("Название книги:");
    if (!title) return;

    const pagesStr = prompt("Страниц (число):", "100");
    const pages = parseInt(pagesStr || "0", 10);
    if (!pages || pages <= 0) {
      alert("Страниц должно быть больше 0");
      return;
    }

    const priceStr = prompt("Цена:", "9.99");
    const price = parseFloat(priceStr || "0");

    const published_on = prompt("Дата выхода (YYYY-MM-DD), можно пусто:", "2000-01-01") || null;

    await fetch(`${API}/api/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author_id: selectedAuthor.id,
        title,
        pages,
        price: Number.isFinite(price) ? price : 0,
        published_on,
      }),
    });

    await refreshBooks();
  }

  async function editBook() {
    if (!selectedBook) {
      alert("Сначала выбери книгу в нижней таблице.");
      return;
    }

    const title = prompt("Новое название:", selectedBook.title);
    if (!title) return;

    const pagesStr = prompt("Страниц (число):", String(selectedBook.pages ?? 100));
    const pages = parseInt(pagesStr || "0", 10);
    if (!pages || pages <= 0) {
      alert("Страниц должно быть больше 0");
      return;
    }

    const priceStr = prompt("Цена:", String(selectedBook.price ?? 0));
    const price = parseFloat(priceStr || "0");

    const published_on =
      prompt(
        "Дата выхода (YYYY-MM-DD), можно пусто:",
        selectedBook.published_on ? String(selectedBook.published_on).slice(0, 10) : ""
      ) || null;

    await fetch(`${API}/api/books/${selectedBook.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        author_id: selectedAuthor?.id,
        title,
        pages,
        price: Number.isFinite(price) ? price : 0,
        published_on,
      }),
    });

    await refreshBooks();
  }

  async function deleteBook() {
    if (!selectedBook) {
      alert("Сначала выбери книгу в нижней таблице.");
      return;
    }

    const ok = confirm(`Удалить книгу: "${selectedBook.title}"?`);
    if (!ok) return;

    await fetch(`${API}/api/books/${selectedBook.id}`, { method: "DELETE" });
    setSelectedBook(null);
    await refreshBooks();
  }

  return (
    <Box sx={{ display: "grid", gap: 2, width: "100%"}}>
      <Card sx={{ width: "100%", borderRadius: 3, border: "1px solid rgba(0,0,0,0.06)" }}>
        <CardContent>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Авторы
            </Typography>
          </Stack>

          <div className="ag-theme-quartz" style={{ height: 420, width: "100%" }}>
            <AgGridReact
              ref={authorsGridRef}
              columnDefs={authorsColDefs}
              rowModelType="infinite"
              cacheBlockSize={50}
              cacheOverflowSize={2}
              infiniteInitialRowCount={1}
              rowSelection={{ mode: "singleRow", checkboxes: false }}
              onGridReady={onAuthorsGridReady}
              onRowClicked={onAuthorRowClicked}
            />
          </div>
        </CardContent>
      </Card>

      <Card sx={{width: "100%", borderRadius: 3, border: "1px solid rgba(0,0,0,0.06)" }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            justifyContent="space-between"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Книги
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(17,24,39,0.7)" }}>
                Автор: {selectedAuthor ? `"${selectedAuthor.full_name}"` : "не выбран"}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button variant="contained" onClick={addBook} disabled={!selectedAuthor}>
                Добавить
              </Button>
              <Button variant="outlined" onClick={editBook} disabled={!selectedBook}>
                Изменить
              </Button>
              <Button variant="outlined" color="error" onClick={deleteBook} disabled={!selectedBook}>
                Удалить
              </Button>
            </Stack>
          </Stack>

          <div className="ag-theme-quartz" style={{ height: 420, width: "100%" }}>
            <AgGridReact
              ref={booksGridRef}
              rowData={books}
              columnDefs={booksColDefs}
              rowSelection={{ mode: "singleRow", checkboxes: false }}
              onRowClicked={onBookRowClicked}
            />
          </div>
        </CardContent>
      </Card>
    </Box>
  );
}
