import React, { useState, useEffect } from 'react';

// Função para gerar as estrelas interativas
const Estrela = ({ index, rating, setRating }) => {
  return (
    <span
      style={{
        fontSize: '30px',
        cursor: 'pointer',
        color: rating >= index ? '#FFD700' : '#ccc',
      }}
      onClick={() => setRating(index)}
    >
      ★
    </span>
  );
};

const Avaliacao = ({ tipousu, dataAgendamento }) => {
  const [dataAtual, setDataAtual] = useState(new Date());
  const [avaliacaoLocador, setAvaliacaoLocador] = useState('');
  const [avaliacaoPrestador, setAvaliacaoPrestador] = useState('');
  const [avaliacaoLocatario, setAvaliacaoLocatario] = useState('');

  // Estado para as estrelas de avaliação
  const [notaLocador, setNotaLocador] = useState(0);
  const [notaPrestador, setNotaPrestador] = useState(0);
  const [notaLocatario, setNotaLocatario] = useState(0);

  useEffect(() => {
    // Verifica se a data de agendamento já passou
    if (new Date(dataAgendamento) < dataAtual) {
      // Lógica para exibir avaliação caso a data já tenha passado
    }
  }, [dataAgendamento, dataAtual]);

  const handleEnviarAvaliacao = () => {
    const avaliacaoData = {
      tipousu,
      avaliacaoLocador,
      avaliacaoPrestador,
      avaliacaoLocatario,
      notaLocador,
      notaPrestador,
      notaLocatario,
    };

    // Enviar para a API (substitua com sua lógica de API)
    console.log('Enviando avaliação:', avaliacaoData);
    alert('Avaliação enviada com sucesso!');
  };

  // Renderiza os campos de avaliação com base no tipo de usuário
  const renderAvaliacao = () => {
    switch (tipousu) {
      case 'Locatario':
        return (
          <div style={styles.container}>
            <h2 style={styles.header}>Avalie o Locador e o Prestador</h2>
            <div style={styles.avaliacaoContainer}>
              <h3>Avaliação do Locador:</h3>
              <div style={styles.estrelas}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Estrela
                    key={index}
                    index={index}
                    rating={notaLocador}
                    setRating={setNotaLocador}
                  />
                ))}
              </div>
              <textarea
                style={styles.textarea}
                value={avaliacaoLocador}
                onChange={(e) => setAvaliacaoLocador(e.target.value)}
                placeholder="Comentários sobre o Locador"
              />
            </div>
            <div style={styles.avaliacaoContainer}>
              <h3>Avaliação do Prestador:</h3>
              <div style={styles.estrelas}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Estrela
                    key={index}
                    index={index}
                    rating={notaPrestador}
                    setRating={setNotaPrestador}
                  />
                ))}
              </div>
              <textarea
                style={styles.textarea}
                value={avaliacaoPrestador}
                onChange={(e) => setAvaliacaoPrestador(e.target.value)}
                placeholder="Comentários sobre o Prestador"
              />
            </div>
          </div>
        );
      case 'Locador':
        return (
          <div style={styles.container}>
            <h2 style={styles.header}>Avalie o Locatário</h2>
            <div style={styles.avaliacaoContainer}>
              <h3>Avaliação do Locatário:</h3>
              <div style={styles.estrelas}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Estrela
                    key={index}
                    index={index}
                    rating={notaLocatario}
                    setRating={setNotaLocatario}
                  />
                ))}
              </div>
              <textarea
                style={styles.textarea}
                value={avaliacaoLocatario}
                onChange={(e) => setAvaliacaoLocatario(e.target.value)}
                placeholder="Comentários sobre o Locatário"
              />
            </div>
          </div>
        );
      case 'Prestador':
        return (
          <div style={styles.container}>
            <h2 style={styles.header}>Avalie o Locatário</h2>
            <div style={styles.avaliacaoContainer}>
              <h3>Avaliação do Locatário:</h3>
              <div style={styles.estrelas}>
                {[1, 2, 3, 4, 5].map((index) => (
                  <Estrela
                    key={index}
                    index={index}
                    rating={notaLocatario}
                    setRating={setNotaLocatario}
                  />
                ))}
              </div>
              <textarea
                style={styles.textarea}
                value={avaliacaoLocatario}
                onChange={(e) => setAvaliacaoLocatario(e.target.value)}
                placeholder="Comentários sobre o Locatário"
              />
            </div>
          </div>
        );
      default:
        return <div><h2>Avaliação não disponível</h2></div>;
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Componente Avaliação</h1>
      <p style={styles.paragraph}>Tipo de Usuário: {tipousu}</p>
      <p style={styles.paragraph}>Data de Agendamento: {dataAgendamento}</p>

      {renderAvaliacao()}

      <button onClick={handleEnviarAvaliacao} style={styles.button}>Enviar Avaliação</button>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '800px',
    margin: '20px auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  header: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  paragraph: {
    fontSize: '16px',
    marginBottom: '15px',
  },
  avaliacaoContainer: {
    marginBottom: '20px',
  },
  estrelas: {
    marginBottom: '10px',
  },
  textarea: {
    width: '100%',
    height: '100px',
    marginBottom: '15px',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px 20px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
};

export default Avaliacao;
