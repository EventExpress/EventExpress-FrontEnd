const AnuncioCard = ({ anuncio }) => {
  return (
    <div className="border rounded-lg shadow-md p-4">
      <h2 className="font-bold text-xl">{anuncio.title}</h2>
      <p>{anuncio.description}</p>
      <p className="text-orange-500">Preço: {anuncio.price}</p>
      <img src={anuncio.imageUrl} alt={anuncio.title} className="w-full h-32 object-cover" />
    </div>
  );
};

export default AnuncioCard;
