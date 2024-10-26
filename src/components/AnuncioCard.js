// src/components/AnuncioCard.js
const AnuncioCard = ({ anuncios }) => {
  if (!Array.isArray(anuncios) || anuncios.length === 0) {
    return <p>Nenhum anúncio disponível.</p>;
  }

  return (
    <div>
      {anuncios.map((anuncio) => (
        <div key={anuncio.id}>
          <h3>{anuncio.titulo}</h3>
          <p>{anuncio.descricao}</p>
        </div>
      ))}
    </div>
  );
};

export default AnuncioCard;
