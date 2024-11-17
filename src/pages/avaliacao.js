import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Avaliacao from '../components/usuario/Avaliacao';

const AvaliacaoPage = () => {
  const router = useRouter();
  const { agendadoId, tipoUsuario } = router.query;  // Captura os parâmetros da URL

  const [agendamento, setAgendamento] = useState(null);
  const [avaliacaoFeita, setAvaliacaoFeita] = useState(false);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  // Carregar dados do agendamento
  useEffect(() => {
    console.log('agendadoId:', agendadoId); // Verificar se agendadoId está correto
    console.log('tipoUsuario:', tipoUsuario); // Verificar se tipoUsuario está correto

    // Verifica se o router está pronto e se os parâmetros estão disponíveis
    if (router.isReady && agendadoId && tipoUsuario) {
      const token = localStorage.getItem('token');

      if (!token) {
        setErro('Token não encontrado');
        return;
      }

      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/agendados/${agendadoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      })
        .then(response => {
          if (response.data) {
            setAgendamento(response.data);
            setErro(null);
          } else {
            setErro('Nenhum dado encontrado para o agendamento.');
          }
        })
        .catch(error => {
          console.error("Erro ao buscar o agendamento:", error);
          setErro('Erro ao carregar as informações do agendamento. Tente novamente.');
        });
    }
  }, [router.isReady, agendadoId, tipoUsuario]);  // Dependências ajustadas para esperar o router estar pronto

  // Função para enviar avaliação
  const enviarAvaliacao = async (dadosAvaliacao) => {
    if (!tipoUsuario) {
      alert('Tipo de usuário não especificado');
      return;
    }

    try {
      let url = '';
      if (tipoUsuario === 'Locatario') {
        url = `/agendados/${agendadoId}/avaliar/locatario`;
      } else if (tipoUsuario === 'Locador' || tipoUsuario === 'Prestador') {
        url = `/agendados/${agendadoId}/avaliar/locador-prestador`;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token não encontrado');
        alert('Você precisa estar autenticado para enviar a avaliação.');
        return;
      }

      const response = await axios.post(url, dadosAvaliacao, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        alert('Avaliação enviada com sucesso!');
        setSucesso('Avaliação enviada com sucesso!');
        setAvaliacaoFeita(true);
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
      setSucesso(null); // Caso haja erro, removemos o sucesso.
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-semibold mb-4">Avaliação do Agendamento</h1>

      {erro ? (
        <p style={{ color: 'red' }}>{erro}</p>
      ) : agendamento ? (
        <>
          <h2 className="text-xl font-semibold">Informações do Agendamento</h2>
          <p><strong>Data do Agendamento:</strong> {new Date(agendamento.data).toLocaleString()}</p>
          <p><strong>Locador:</strong> {agendamento.locador}</p>
          <p><strong>Serviço:</strong> {agendamento.servico}</p>

          {!avaliacaoFeita ? (
            <Avaliacao
              tipousu={tipoUsuario} // Passando o tipo de usuário corretamente
              dataAgendamento={agendamento.data}
              onSubmit={enviarAvaliacao} // Passando a função para o componente Avaliacao
            />
          ) : (
            <p>Avaliação já enviada!</p>
          )}
        </>
      ) : (
        <p>Carregando informações...</p>
      )}

      {sucesso && <p className="text-green-500">{sucesso}</p>}
    </div>
  );
};

export default AvaliacaoPage;
