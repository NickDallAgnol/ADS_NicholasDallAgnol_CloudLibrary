import { useState } from "react";
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook, type Book } from "../hooks/useBooks";
import toast from "react-hot-toast";
import { Plus, Edit2, Trash2, X } from "lucide-react";

export default function BooksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [filters, setFilters] = useState({
    q: "",
    status: "",
    page: 1,
    limit: 10,
  });

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publisher: "",
    genre: "",
    status: "TO_READ",
    progress: 0,
  });

  // Hooks
  const { data, isLoading, error } = useBooks({
    q: filters.q,
    status: (filters.status || undefined) as "TO_READ" | "READING" | "READ" | undefined,
    page: filters.page,
    limit: filters.limit,
  });
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();
  const deleteBook = useDeleteBook();

  // Funções auxiliares
  const openModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        publisher: book.publisher || "",
        genre: book.genre || "",
        status: book.status,
        progress: book.progress,
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: "",
        author: "",
        publisher: "",
        genre: "",
        status: "TO_READ",
        progress: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBook(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author) {
      toast.error("Preencha título e autor!");
      return;
    }

    try {
      if (editingBook) {
        await updateBook.mutateAsync({
          id: editingBook.id,
          payload: formData,
        });
        toast.success("Livro atualizado!");
      } else {
        await createBook.mutateAsync(formData);
        toast.success("Livro criado!");
      }
      closeModal();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar livro");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Tem certeza que deseja deletar este livro?")) {
      try {
        await deleteBook.mutateAsync(id);
        toast.success("Livro deletado!");
      } catch (err: any) {
        toast.error(err.message || "Erro ao deletar livro");
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      TO_READ: { bg: "bg-yellow-100", text: "text-yellow-800", label: "A Ler" },
      READING: { bg: "bg-blue-100", text: "text-blue-800", label: "Lendo" },
      READ: { bg: "bg-green-100", text: "text-green-800", label: "Lido" },
    };

    const s = statusMap[status] || statusMap["TO_READ"];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${s.bg} ${s.text}`}>
        {s.label}
      </span>
    );
  };

  const books = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;
  const currentPage = filters.page;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">📚 Minha Biblioteca</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} /> Novo Livro
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Buscar por título ou autor..."
            value={filters.q}
            onChange={(e) => setFilters({ ...filters, q: e.target.value, page: 1 })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="">Todos os Status</option>
            <option value="TO_READ">A Ler</option>
            <option value="READING">Lendo</option>
            <option value="READ">Lido</option>
          </select>
          <select
            value={filters.limit}
            onChange={(e) => setFilters({ ...filters, limit: parseInt(e.target.value), page: 1 })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value={10}>10 itens</option>
            <option value={20}>20 itens</option>
            <option value={50}>50 itens</option>
          </select>
        </div>
      </div>

      {/* Estado de carregamento */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">⏳</div>
          <p className="text-gray-600 mt-2">Carregando livros...</p>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Erro ao carregar livros: {error.message}
        </div>
      )}

      {/* Tabela de livros */}
      {!isLoading && books.length > 0 && (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Título</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Autor</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Gênero</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Progresso</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book: Book) => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                    <td className="px-6 py-4 text-gray-600">{book.author}</td>
                    <td className="px-6 py-4 text-gray-600">{book.genre || "-"}</td>
                    <td className="px-6 py-4">{getStatusBadge(book.status)}</td>
                    <td className="px-6 py-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${book.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{book.progress}%</span>
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      <button
                        onClick={() => openModal(book)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Informações de paginação */}
          <div className="mt-4 text-center text-gray-600">
            Mostrando {books.length} de {total} livros (Página {currentPage} de {totalPages})
          </div>

          {/* Paginação */}
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setFilters({ ...filters, page: Math.max(1, currentPage - 1) })}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              ← Anterior
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setFilters({ ...filters, page })}
                className={`px-4 py-2 rounded transition ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setFilters({ ...filters, page: Math.min(totalPages, currentPage + 1) })}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              Próxima →
            </button>
          </div>
        </>
      )}

      {/* Sem livros */}
      {!isLoading && books.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📖</div>
          <p className="text-gray-600 text-lg">Nenhum livro encontrado</p>
          <button
            onClick={() => openModal()}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Adicionar primeiro livro
          </button>
        </div>
      )}

      {/* Modal de formulário */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingBook ? "Editar Livro" : "Novo Livro"}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Título *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                placeholder="Autor *"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <input
                type="text"
                placeholder="Editora"
                value={formData.publisher}
                onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <input
                type="text"
                placeholder="Gênero"
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="TO_READ">A Ler</option>
                <option value="READING">Lendo</option>
                <option value="READ">Lido</option>
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progresso: {formData.progress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={createBook.isPending || updateBook.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {createBook.isPending || updateBook.isPending ? "Salvando..." : "Salvar"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
