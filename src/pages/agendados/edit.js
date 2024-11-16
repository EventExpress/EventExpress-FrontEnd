import { useState, useEffect } from "react";
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { ptBR } from "date-fns/locale";
import PaymentModal from '../../components/PaymentModal';

const AgendadoEdit = ({ anuncio, locador, servicos }) => {
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("08:00");
  const [servicosIds, setServicosIds] = useState([]);
  const [servicosData, setServicosData] = useState({});
  const [formapagamento, setFormaPagamento] = useState("select");
  const [valorTotal, setValorTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const timeOptionsInicio = ["08:00", "09:00", "10:00", "11:00"];
  const timeOptionsFim = ["09:00", "10:00", "11:00", "12:00"];

  const isDataIndisponivel = (date) => {
    // Implementar lógica para verificar se a data está indisponível
    return false; // Por enquanto, retorna sempre falso
  };

  const handleDataInicioGeneralChange = (date) => {
    setDataInicio(date);
  };

  const handleDataFimGeneralChange = (date) => {
    setDataFim(date);
  };

  const handleHoraInicioChange = (e) => {
    setHoraInicio(e.target.value);
  };

  const handleServicosChange = (servicoId) => {
    setServicosIds((prev) => {
      if (prev.includes(servicoId)) {
        return prev.filter((id) => id !== servicoId);
      } else {
        return [...prev, servicoId];
      }
    });
  };

  const handleDataInicioChange = (servicoId, date) => {
    setServicosData((prev) => ({
      ...prev,
      [servicoId]: {
        ...prev[servicoId],
        dataInicio: date,
      },
    }));
  };

  const handleDataFimChange = (servicoId, date) => {
    setServicosData((prev) => ({
      ...prev,
      [servicoId]: {
        ...prev[servicoId],
        dataFim: date,
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Aqui, enviar os dados para a API ou backend
    setTimeout(() => {
      setLoading(false);
      alert("Reserva confirmada com sucesso!");
    }, 2000);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    // Lógica para calcular o valor total
    const total = servicosIds.reduce((sum, servicoId) => {
      const servico = servicos.find((s) => s.id === servicoId);
      return sum + (servico ? servico.valor : 0);
    }, 0);
    setValorTotal(total);
  }, [servicosIds]);

  return (
    <div>
      <NavBar />
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 bg-white border-b border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold mb-2">
                  {anuncio ? anuncio.titulo : 'Título não disponível'}
                </h3>
                {locador ? (
                  <h3 className="mb-2">
                    Local disponibilizado por {locador.user?.nome || 'Locador não disponível'}
                  </h3>
                ) : (
                  <p className="text-right text-sm text-gray-600">Locador não encontrado</p>
                )}
              </div>

              {errorMessage && <p className="text-red-500">{errorMessage}</p>}

              {loading ? (
                <p>Carregando informações do anúncio...</p>
              ) : anuncio ? (
                <div className="mt-4 flex items-start border-2 border-orange-500 bg-orange-50 p-6 rounded-lg shadow-md mb-6">
                  {anuncio.imagens && anuncio.imagens.length > 0 && (
                    <img
                      src={anuncio.imagens[0].image_path}
                      alt={anuncio.titulo}
                      className="w-2/5 h-auto rounded-lg mb-4"
                    />
                  )}
                  <div className="ml-6 flex-1">
                    <p className="mb-40">{anuncio.descricao}</p>
                    <p><strong>Capacidade:</strong> {anuncio.capacidade} Pessoas</p>
                    <p><strong>R$:</strong> {anuncio.valor}</p>
                  </div>
                </div>
              ) : (
                <p>Não foi possível carregar os detalhes do anúncio.</p>
              )}

              <form onSubmit={handleSubmit}>
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-50">
                    <label className="block text-sm font-medium text-black-500 mb-2">Data de Início do Anúncio:</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Calendar
                          onChange={handleDataInicioGeneralChange}
                          value={dataInicio}
                          tileDisabled={({ date }) => isDataIndisponivel(date)}
                          locale={ptBR}
                          className="custom-calendar"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-sm font-medium text-black-500 mb-2">Hora de Início:</label>
                        <select
                          value={horaInicio}
                          onChange={handleHoraInicioChange}
                          className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg focus:ring-2 focus:ring-orange-500 border-1 border-orange-500"
                        >
                          {timeOptionsInicio.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 bg-gray-200 p-4 rounded-lg shadow-lg border-2 border-orange-500 bg-orange-50">
                    <label className="block text-sm font-medium text-black-500 mb-2">Data de Fim do Anúncio:</label>
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-1">
                        <Calendar
                          onChange={handleDataFimGeneralChange}
                          value={dataFim}
                          tileDisabled={({ date }) => isDataIndisponivel(date)}
                          locale={ptBR}
                          className="custom-calendar"
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-sm font-medium text-black-500 mb-2">Hora de Fim:</label>
                        <select
                          value={horaFim}
                          onChange={(e) => setHoraFim(e.target.value)}
                          className="w-full p-3 border rounded-lg bg-white shadow-sm text-lg focus:ring-2 focus:ring-orange-500 border-1 border-orange-500"
                        >
                          {timeOptionsFim.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="my-6">
                  <h3 className="font-semibold text-xl mb-2">Escolha os Serviços</h3>
                  {(servicos && Array.isArray(servicos) ? servicos : []).map((servico) => (
  <div key={servico.id} className="flex justify-between mb-4">
    <label className="flex items-center">
      <input
        type="checkbox"
        checked={servicosIds.includes(servico.id)}
        onChange={() => handleServicosChange(servico.id)}
        className="mr-2"
      />
      {servico.nome} - R${servico.valor}
    </label>
    <div>
      <label className="block text-sm">Data de Início:</label>
      <input
        type="date"
        value={servicosData[servico.id]?.dataInicio || ""}
        onChange={(e) => handleDataInicioChange(servico.id, e.target.value)}
        className="mb-2"
      />
      <label className="block text-sm">Data de Fim:</label>
      <input
        type="date"
        value={servicosData[servico.id]?.dataFim || ""}
        onChange={(e) => handleDataFimChange(servico.id, e.target.value)}
        className="mb-2"
      />
    </div>
  </div>
))}

                </div>

                <div className="my-6 flex items-center justify-between">
                  <span>Total: R${valorTotal}</span>
                  <button
                    type="button"
                    onClick={openModal}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg shadow-md focus:outline-none"
                  >
                    Confirmar Reserva
                  </button>
                </div>

                <PaymentModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  formaPagamento={formapagamento}
                  setFormaPagamento={setFormaPagamento}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AgendadoEdit;
