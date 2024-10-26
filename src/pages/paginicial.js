// src/pages/paginicial.js
import { useAuth } from '../app/context/AuthContext';
import AnuncioCard from '../components/AnuncioCard';


const AnunciosPage = () => {
  const { anuncios, loading } = useAuth();

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>Anúncios Disponíveis</h1>
      <AnuncioCard anuncios={anuncios} /> {/* Passando todos os anúncios aqui */}
    </div>
  );
};

export default AnunciosPage;
