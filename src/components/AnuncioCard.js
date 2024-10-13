const AnuncioCard = ({ anuncio }) => {
    return (
      <div className="anuncio-card">
        <h2>{anuncio.titulo}</h2>
        <p>{anuncio.descricao}</p>
        <p>Valor: {anuncio.valor}</p>
        <div className="imagens-anuncio">
          {anuncio.imagens && anuncio.imagens.map((imagem) => (
            <img
              key={imagem.id}
              src={imagem.image_path} // Use a string Base64 diretamente
              alt={`Imagem do anúncio ${anuncio.titulo}`}
              className="imagem-anuncio"
            />
          ))}
        </div>
      </div>
    );
  };
  
  export default AnuncioCard;
  