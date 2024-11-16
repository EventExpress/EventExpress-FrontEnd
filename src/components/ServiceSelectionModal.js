import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ptBR from 'date-fns/locale/pt-BR';

// Função para calcular a diferença entre duas datas em dias
const calcularDias = (dataInicio, dataFim) => {
  if (!dataInicio || !dataFim) return 0;
  const diffTime = Math.abs(dataFim - dataInicio);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Adiciona 1 para incluir o dia de início
};

const ServiceSelectionModal = ({
  isOpen,
  onClose,
  servicos,
  onServicosChange,
  isDataIndisponivel,
}) => {
  const [servicosData, setServicosData] = useState(() => {
    const initialData = {};
    if (servicos && servicos.length > 0) {
      servicos.forEach((servico) => {
        initialData[servico.id] = { dataInicio: null, dataFim: null };
      });
    }
    return initialData;
  });

  useEffect(() => {
    // Verificando os serviços recebidos no início
    console.log('Servicos recebidos:', servicos);
  }, [servicos]);

  if (!isOpen) return null;

  const handleDataInicioChange = (servicoId, date) => {
    if (date instanceof Date) {
      setServicosData((prevState) => ({
        ...prevState,
        [servicoId]: {
          ...prevState[servicoId],
          dataInicio: date
        }
      }));
    }
  };

  const handleDataFimChange = (servicoId, date) => {
    if (date instanceof Date) {
      // Garantir que a data de fim não seja anterior à de início
      const { dataInicio } = servicosData[servicoId] || {};
      if (dataInicio && date < dataInicio) {
        alert('A data de fim não pode ser anterior à data de início');
        return;
      }

      setServicosData((prevState) => ({
        ...prevState,
        [servicoId]: {
          ...prevState[servicoId],
          dataFim: date
        }
      }));
    }
  };

  const calcularValor = (servico) => {
    const { dataInicio, dataFim } = servicosData[servico.id] || {};
    const dias = calcularDias(dataInicio, dataFim);
    return servico.valor * dias;
  };

  const handleSalvar = () => {
    const dadosSelecionados = servicos.map((servico) => {
      const { dataInicio, dataFim } = servicosData[servico.id] || {};
      const dias = calcularDias(dataInicio, dataFim);
      return {
        servicoId: servico.id,
        titulo: servico.titulo,
        dataInicio,
        dataFim,
        dias,
        valor: calcularValor(servico),
      };
    });

    console.log('Dados a serem passados para o pai:', dadosSelecionados);

    if (onServicosChange) {
      onServicosChange(dadosSelecionados);
    }

    setTimeout(() => {
      onClose();
    }, 100);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full sm:w-96 md:w-1/2 max-w-full max-h-screen overflow-y-auto">
        <div className="mb-4">
          {servicos && servicos.length > 0 ? (
            servicos.map((servico) => (
              servico && servico.id && (
                <div className="flex items-start mt-2" key={`servico-${servico.id}`}>
                  <div className="flex items-center w-full">
                    <label htmlFor={`servicos-${servico.id}`} className="ml-2 block text-sm text-gray-900 w-full">
                      {servico.titulo} - R$ {servico.valor}
                    </label>
                  </div>

                  <div className="mt-4 w-full">
                    <div className="flex flex-col mb-4">
                      <label className="block text-sm font-medium text-orange-500">Data de Início:</label>
                      <Calendar
                        onChange={(date) => handleDataInicioChange(servico.id, date)}
                        value={servicosData[servico.id]?.dataInicio || null}
                        tileDisabled={({ date }) => isDataIndisponivel(date)}
                        locale={ptBR}
                        className="custom-calendar"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="block text-sm font-medium text-orange-500">Data de Fim:</label>
                      <Calendar
                        onChange={(date) => handleDataFimChange(servico.id, date)}
                        value={servicosData[servico.id]?.dataFim || null}
                        tileDisabled={({ date }) => isDataIndisponivel(date)}
                        locale={ptBR}
                        className="custom-calendar"
                      />
                    </div>

                    <div className="mt-4">
                      {/* Mostrar o valor total apenas se as duas datas forem preenchidas */}
                      {servicosData[servico.id]?.dataInicio && servicosData[servico.id]?.dataFim ? (
                        <p className="text-sm text-gray-500">
                          Total: R$ {calcularValor(servico).toFixed(2)}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-500">Selecione as datas para calcular o valor</p>
                      )}
                    </div>
                  </div>
                </div>
              )
            ))
          ) : (
            <p className="text-gray-500">Nenhum serviço disponível.</p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Fechar
          </button>
          <button
            onClick={handleSalvar}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceSelectionModal;
