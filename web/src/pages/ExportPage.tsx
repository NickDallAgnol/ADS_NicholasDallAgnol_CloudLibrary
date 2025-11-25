import { useState } from "react";
import { Download, FileText, Upload, CheckCircle } from "lucide-react";
import { api } from "../services/api";
import toast from "react-hot-toast";

export default function ExportPage() {
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isLoadingCsv, setIsLoadingCsv] = useState(false);

  const handleExportPdf = async () => {
    setIsLoadingPdf(true);
    try {
      const response = await api.get("/books/export/pdf", {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `livros_${new Date().getTime()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast.success("PDF exportado com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao exportar PDF. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoadingPdf(false);
    }
  };

  const handleExportCsv = async () => {
    setIsLoadingCsv(true);
    try {
      const response = await api.get("/books/export/csv", {
        responseType: "blob",
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `livros_${new Date().getTime()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      toast.success("CSV exportado com sucesso!");
    } catch (err: any) {
      toast.error("Erro ao exportar CSV. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoadingCsv(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
        <Upload className="w-10 h-10 text-blue-600" />
        Exportação de Dados
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exportar PDF */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-red-100 rounded-lg">
              <FileText size={32} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Exportar como PDF</h2>
              <p className="text-gray-600">Gerar relatório em PDF</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Exporte todos os seus livros e estatísticas de leitura em um arquivo PDF formatado e pronto para impressão.
          </p>

          <div className="bg-gray-50 rounded p-4 mb-6">
            <h3 className="font-semibold mb-2">O que será incluído:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Lista completa de livros</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Status de cada livro</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Progresso de leitura</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Estatísticas gerais</li>
              <li>✓ Data da exportação</li>
            </ul>
          </div>

          <button
            onClick={handleExportPdf}
            disabled={isLoadingPdf}
            className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold"
          >
            <Download size={20} />
            {isLoadingPdf ? "Gerando PDF..." : "Baixar PDF"}
          </button>
        </div>

        {/* Exportar CSV */}
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-green-100 rounded-lg">
              <FileText size={32} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Exportar como CSV</h2>
              <p className="text-gray-600">Exportar dados em planilha</p>
            </div>
          </div>

          <p className="text-gray-700 mb-6">
            Exporte seus livros em formato CSV para usar em programas como Excel ou Google Sheets para análise personalizada.
          </p>

          <div className="bg-gray-50 rounded p-4 mb-6">
            <h3 className="font-semibold mb-2">O que será incluído:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Título do livro</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Autor</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Editora</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Gênero</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /> Status e progresso</li>
            </ul>
          </div>

          <button
            onClick={handleExportCsv}
            disabled={isLoadingCsv}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold"
          >
            <Download size={20} />
            {isLoadingCsv ? "Gerando CSV..." : "Baixar CSV"}
          </button>
        </div>
      </div>

      {/* Informações adicionais */}
      <div className="bg-blue-50 border border-b rounded-lg p-6 mt-8">
        <h3 className="font-bold text-blue-900 mb-2">💡 Dicas úteis:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use PDF para compartilhar com outros usuários ou imprimir</li>
          <li>• Use CSV para fazer backup ou análises avançadas em planilhas</li>
          <li>• Todos os dados são exportados diretamente do seu acervo</li>
          <li>• Os arquivos são gerados com a data e hora da exportação</li>
        </ul>
      </div>
    </div>
  );
}



