import { useState, useEffect } from "react";
import { Plus, Trash2, Check, ArrowUpFromLine, ArrowDownToLine, BookOpen, User, CheckCircle } from "lucide-react";
import { api } from "../services/api";
import toast from "react-hot-toast";
import { ConfirmModal } from "../components/ConfirmModal";
import { SkeletonTable } from "../components/SkeletonLoader";

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
  lentBy?: User;
  book?: Book;
}

export default function LoansPage() {
  const [activeTab, setActiveTab] = useState<'lent' | 'borrowed'>('lent');
  const [loans, setLoans] = useState<Loan[]>([]);
  const [borrowedLoans, setBorrowedLoans] = useState<Loan[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Buscar empréstimos que EU FIZ (meus livros emprestados para outros)
      const loansRes = await api.get("/loans");
      setLoans(loansRes.data.data || loansRes.data || []);

      // Buscar empréstimos que EU PEGUEI (livros que peguei de outros)
      const borrowedRes = await api.get("/loans/borrowed/me");
      setBorrowedLoans(borrowedRes.data.data || borrowedRes.data || []);

      // Buscar livros
      const booksRes = await api.get("/books");
      setBooks(booksRes.data.data || booksRes.data || []);

      // Buscar usuários
      const usersRes = await api.get("/users");
      setUsers(usersRes.data || []);
    } catch (err: any) {
      toast.error("Erro ao carregar dados");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBookId || !selectedUserId) {
      toast.error('Selecione um livro e um usuário');
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
      
      toast.success(`Empréstimo criado!\nLivro: "${book?.title}"\nEmprestado para: ${user?.name}`);
      setSelectedBookId("");
      setSelectedUserId("");
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(`Erro ao criar empréstimo: ${err.response?.data?.message || err.message || 'Verifique os dados'}`);
      console.error(err);
    }
  };

  const handleReturn = async (id: number) => {
    try {
      const loan = loans.find(l => l.id === id);
      const book = books.find(b => b.id === loan?.book_id);
      
      // Marcar livro como devolvido (backend já marca como disponível)
      await api.patch(`/loans/${id}/return`);
      
      toast.success(`Livro "${book?.title}" marcado como devolvido!`);
      fetchData();
    } catch (err: any) {
      toast.error(`Erro ao devolver livro: ${err.response?.data?.message || err.message || 'Tente novamente'}`);
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    const loan = loans.find(l => l.id === id);
    const book = books.find(b => b.id === loan?.book_id);
    
    setConfirmModal({
      isOpen: true,
      title: "Deletar Empréstimo",
      message: `Tem certeza que deseja deletar o empréstimo de "${book?.title}"? Esta ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          await api.delete(`/loans/${id}`);
          toast.success(`Empréstimo deletado com sucesso!`);
          setConfirmModal({ ...confirmModal, isOpen: false });
          fetchData();
        } catch (err: any) {
          toast.error(`Erro ao deletar empréstimo: ${err.response?.data?.message || err.message || 'Tente novamente'}`);
          console.error(err);
        }
      },
    });
  };

  const currentLoans = activeTab === 'lent' ? loans : borrowedLoans;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-red-600" />
            Empréstimos
          </h1>
          {activeTab === 'lent' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              <Plus size={20} /> Novo Empréstimo
            </button>
          )}
        </div>
        
        {/* Abas */}
        <div className="flex gap-4 mb-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('lent')}
            className={`pb-2 px-4 font-semibold transition flex items-center gap-2 ${
              activeTab === 'lent'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <ArrowUpFromLine className="w-4 h-4" />
            Empréstimos ({loans.length})
          </button>
          <button
            onClick={() => setActiveTab('borrowed')}
            className={`pb-2 px-4 font-semibold transition flex items-center gap-2 ${
              activeTab === 'borrowed'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            Mutuários ({borrowedLoans.length})
          </button>
        </div>
        
        <p className="text-gray-600">
          {activeTab === 'lent' 
            ? 'Livros que você emprestou para outras pessoas' 
            : 'Livros que você pegou emprestado de outras pessoas'}
        </p>
      </div>

      {isLoading ? (
        <SkeletonTable />
      ) : currentLoans.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-600 text-lg">
            {activeTab === 'lent' 
              ? 'Nenhum empréstimo registrado' 
              : 'Você não tem livros emprestados'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold">ID Livro</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Título</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  {activeTab === 'lent' ? 'Emprestado Para' : 'Dono do Livro'}
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Data Empréstimo</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Data Devolução</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {currentLoans.map((loan) => {
                // Usar dados que vêm do backend (loan.book) ou buscar no array local
                const book = loan.book || books.find(b => b.id === loan.book_id);
                const otherUser = activeTab === 'lent'
                  ? (loan.borrowedFrom || users.find(u => u.id === loan.borrowed_from_id))
                  : (loan.lentBy || users.find(u => u.id === loan.lent_by_id));
                
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
                        <p className="font-medium">{otherUser?.name || 'Usuário desconhecido'}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          ID: {activeTab === 'lent' ? loan.borrowed_from_id : loan.lent_by_id}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(loan.borrowedDate).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4">
                      {loan.returnDate 
                        ? new Date(loan.returnDate).toLocaleDateString("pt-BR")
                        : <span className="text-gray-400">-</span>
                      }
                    </td>
                    <td className="px-6 py-4">
                      {loan.isReturned ? (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                          <CheckCircle className="w-4 h-4" />
                          Devolvido
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                          {activeTab === 'lent' ? (
                            <><ArrowUpFromLine className="w-4 h-4" /> Emprestado</>
                          ) : (
                            <><ArrowDownToLine className="w-4 h-4" /> Com você</>
                          )}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 flex gap-2">
                      {!loan.isReturned && activeTab === 'lent' && (
                        <button
                          onClick={() => handleReturn(loan.id)}
                          className="text-green-600 hover:text-green-800 transition"
                          title="Marcar como devolvido"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {activeTab === 'lent' && (
                        <button
                          onClick={() => handleDelete(loan.id)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Deletar"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
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
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-blue-600" />
              Novo Empréstimo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Selecione o Livro
                </label>
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Emprestado Para
                </label>
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
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Registrar Empréstimo
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

      {/* Modal de Confirmação */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Sim, deletar"
        cancelText="Cancelar"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        type="danger"
      />
    </div>
  );
}



