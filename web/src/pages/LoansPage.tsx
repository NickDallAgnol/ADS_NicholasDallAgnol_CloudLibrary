import { useState, useEffect } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { api } from "../services/api";

interface Book {
  id: number;
  title: string;
  author: string;
  availableForLoan?: boolean;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Loan {
  id: number;
  book_id: number;
  borrowed_from_id: number;
  lent_by_id: number;
  borrowedDate: string;
  returnDate?: string;
  isReturned: boolean;
  borrowedFrom?: User;
  book?: Book;
}

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Buscar empréstimos
      const loansRes = await api.get("/loans");
      setLoans(loansRes.data.data || loansRes.data || []);

      // Buscar livros
      const booksRes = await api.get("/books");
      setBooks(booksRes.data.data || booksRes.data || []);

      // Buscar usuários
      const usersRes = await api.get("/users");
      setUsers(usersRes.data || []);
    } catch (err: any) {
      alert("Erro ao carregar dados");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBookId || !selectedUserId) {
      alert('❌ Selecione um livro e um usuário');
      return;
    }
    
    try {
      const bookId = parseInt(selectedBookId);
      const userId = parseInt(selectedUserId);
      const book = books.find(b => b.id === bookId);
      const user = users.find(u => u.id === userId);
      
      // Criar empréstimo (backend já marca livro como indisponível)
      await api.post("/loans", {
        book_id: bookId,
        borrowed_from_id: userId,
      });
      
      alert(`✅ Empréstimo criado!\nLivro: "${book?.title}"\nEmprestado para: ${user?.name} (ID: ${userId})`);
      setSelectedBookId("");
      setSelectedUserId("");
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(`❌ Erro ao criar empréstimo: ${err.response?.data?.message || err.message || 'Verifique os dados'}`);
      console.error(err);
    }
  };

  const handleReturn = async (id: number) => {
    try {
      const loan = loans.find(l => l.id === id);
      const book = books.find(b => b.id === loan?.book_id);
      
      // Marcar livro como devolvido (backend já marca como disponível)
      await api.patch(`/loans/${id}/return`);
      
      alert(`✅ Livro "${book?.title}" marcado como devolvido!`);
      fetchData();
    } catch (err: any) {
      alert(`❌ Erro ao devolver livro: ${err.response?.data?.message || err.message || 'Tente novamente'}`);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    const loan = loans.find(l => l.id === id);
    const book = books.find(b => b.id === loan?.book_id);
    if (window.confirm(`Tem certeza que deseja deletar o empréstimo de "${book?.title}"?`)) {
      try {
        await api.delete(`/loans/${id}`);
        alert(`✅ Empréstimo deletado com sucesso!`);
        fetchData();
      } catch (err: any) {
        alert(`❌ Erro ao deletar empréstimo: ${err.response?.data?.message || err.message || 'Tente novamente'}`);
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">📕 Empréstimos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} /> Novo Empréstimo
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p>Carregando empréstimos...</p>
        </div>
      ) : loans.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">Nenhum empréstimo registrado</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold">ID Livro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Emprestado Para (ID)</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Data Empréstimo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => {
                const book = books.find(b => b.id === loan.book_id);
                const borrower = users.find(u => u.id === loan.borrowed_from_id);
                return (
                  <tr key={loan.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-gray-700 font-mono">{loan.book_id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{book?.title || `Livro #${loan.book_id}`}</p>
                        <p className="text-sm text-gray-600">{book?.author || 'Autor desconhecido'}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{borrower?.name || 'Usuário desconhecido'}</p>
                        <p className="text-xs text-gray-500 font-mono">ID: {loan.borrowed_from_id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(loan.borrowedDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      {loan.isReturned ? (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                          ✅ Devolvido
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                          📤 Emprestado
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {!loan.isReturned && (
                        <button
                          onClick={() => handleReturn(loan.id)}
                          className="text-green-600 hover:text-green-800 transition"
                          title="Marcar como devolvido"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(loan.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Deletar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
            <h2 className="text-2xl font-bold mb-4">📕 Novo Empréstimo</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">📚 Selecione o Livro</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="">-- Escolha um livro --</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>
                      ID: {book.id} - {book.title} ({book.author})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Mostrando todos os seus livros disponíveis
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">👤 Emprestado Para</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                >
                  <option value="">-- Escolha um usuário --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} (ID: {user.id}) - {user.email}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  💡 Selecione quem vai pegar o livro emprestado
                </p>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  ✅ Registrar Empréstimo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedBookId("");
                    setSelectedUserId("");
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
