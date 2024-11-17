import React, { useState } from 'react';

const Avaliacao = ({ tipousu, dataAgendamento, onSubmit }) => {
  const [notaAnuncio, setNotaAnuncio] = useState(0);
  const [comentarioAnuncio, setComentarioAnuncio] = useState('');
  const [servicos, setServicos] = useState([
    { servico_id: 1, nota: 0, comentario: '' }, // Exemplo de serviço, pode ser ajustado conforme necessário
  ]);

  const handleNotaAnuncioChange = (event) => {
    setNotaAnuncio(event.target.value);
  };

  const handleComentarioAnuncioChange = (event) => {
    setComentarioAnuncio(event.target.value);
  };

  const handleNotaServicoChange = (index, event) => {
    const newServicos = [...servicos];
    newServicos[index].nota = event.target.value;
    setServicos(newServicos);
  };

  const handleComentarioServicoChange = (index, event) => {
    const newServicos = [...servicos];
    newServicos[index].comentario = event.target.value;
    setServicos(newServicos);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const dadosAvaliacao = {
      notaAnuncio,
      comentarioAnuncio,
      servicos,
    };

    onSubmit(dadosAvaliacao); // Enviar dados para a função pai (AvaliacaoPage)
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Avaliar o Anúncio</h3>
      <div>
        <label>Nota do anúncio:</label>
        <input
          type="number"
          value={notaAnuncio}
          onChange={handleNotaAnuncioChange}
          min="1"
          max="5"
        />
      </div>
      <div>
        <label>Comentário do anúncio:</label>
        <textarea
          value={comentarioAnuncio}
          onChange={handleComentarioAnuncioChange}
        />
      </div>

      <h3>Avaliar Serviços</h3>
      {servicos.map((servico, index) => (
        <div key={index}>
          <label>Serviço {index + 1}</label>
          <div>
            <label>Nota:</label>
            <input
              type="number"
              value={servico.nota}
              onChange={(e) => handleNotaServicoChange(index, e)}
              min="1"
              max="5"
            />
          </div>
          <div>
            <label>Comentário:</label>
            <textarea
              value={servico.comentario}
              onChange={(e) => handleComentarioServicoChange(index, e)}
            />
          </div>
        </div>
      ))}
      
      <button type="submit">Enviar Avaliação</button>
    </form>
  );
};

export default Avaliacao;
