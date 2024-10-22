// src/components/AnuncioCard.js
const AnuncioCard = ({ anuncio }) => {
  return (
    <div className="anuncio-card">
      <h2>{anuncio.titulo}</h2>
      <p>{anuncio.descricao}</p>
      <p>Valor: {anuncio.valor}</p>
      <div className="imagens-anuncio">
        {anuncio.imagens && anuncio.imagens.map((imagem) => (
          <img
            key={imagem.id} // Cada imagem precisa de uma chave única
            src={imagem.image_path} // Use o caminho da imagem
            alt={`Imagem do anúncio ${anuncio.titulo}`}
            className="imagem-anuncio"
          />
        ))}
      </div>
    </div>
  );
};

export default AnuncioCard;
