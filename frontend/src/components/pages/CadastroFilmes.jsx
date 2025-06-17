import { useState, useContext } from 'react';
import Navbar from '../common/Navbar';
import CustomInput from '../common/CustomInput';
import CustomSelect from '../common/CustomSelect';
import CustomButton from '../common/CustomButton';
import AlertMessage from '../common/AlertMessage';
import { CinemaContext } from '../../context/CinemaContext'; // Caminho relativo para o Context

function CadastroFilmes() {
  const { addFilme } = useContext(CinemaContext); // Usar addFilme do contexto
  const [formData, setFormData] = useState({
    titulo: '',
    diretor: '', // Corrigido de 'descricao' para 'diretor' conforme o backend
    genero: '',
    duracao: '',
    sinopse: '', // Corrigido de 'classificacao' para 'sinopse' conforme o backend
    urlCartaz: '', // Corrigido de 'estreia' para 'urlCartaz' conforme o backend
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  // Os gêneros e classificações aqui são para o frontend.
  // No backend, o 'genero' é String, 'classificacao' não existe no modelo Filme.
  // Adapte os campos do formulário para o seu modelo de backend de Filme:
  // Filme { titulo, diretor, genero, duracao, sinopse, urlCartaz }
  const generos = [
    { value: 'Ação', label: 'Ação' },
    { value: 'Comédia', label: 'Comédia' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Terror', label: 'Terror' },
    { value: 'Ficção Científica', label: 'Ficção Científica' },
    { value: 'Animação', label: 'Animação' },
    // Adicione mais se necessário
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // Tornar handleSubmit assíncrono
    e.preventDefault();
    setMessage(null); // Limpar mensagem anterior

    const duracao = parseInt(formData.duracao);
    if (isNaN(duracao) || duracao <= 0 || duracao > 300) {
      setMessage('Duração deve ser um número entre 1 e 300 minutos.');
      setMessageType('danger');
      return;
    }

    const filmeParaBackend = {
      titulo: formData.titulo,
      diretor: formData.diretor,
      genero: formData.genero,
      duracao: duracao,
      sinopse: formData.sinopse,
      urlCartaz: formData.urlCartaz || null, // Enviar null se estiver vazio para campo opcional
    };

    try {
      const result = await addFilme(filmeParaBackend);
      if (result.success) {
        setMessage('Filme cadastrado com sucesso!');
        setMessageType('success');
        setFormData({ titulo: '', diretor: '', genero: '', duracao: '', sinopse: '', urlCartaz: '' });
      } else {
        setMessage(result.message);
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Erro geral ao cadastrar filme:', error);
      setMessage('Erro inesperado ao cadastrar filme.');
      setMessageType('danger');
    }
  };

  return (
    <>
      <Navbar />
      <main className="container mt-5">
        <h1>Cadastro de Filmes</h1>
        <AlertMessage message={message} type={messageType} onClose={() => setMessage(null)} />
        <form onSubmit={handleSubmit} className="mt-4">
          <CustomInput id="titulo" name="titulo" label="Título" value={formData.titulo} onChange={handleChange} required />
          <CustomInput id="diretor" name="diretor" label="Diretor" value={formData.diretor} onChange={handleChange} required />
          <CustomSelect
            id="genero"
            name="genero"
            label="Gênero"
            value={formData.genero}
            onChange={handleChange}
            options={generos}
            required
          />
          <CustomInput
            id="duracao"
            name="duracao"
            label="Duração (minutos)"
            type="number"
            value={formData.duracao}
            onChange={handleChange}
            required
            min="1"
            max="300"
          />
          <CustomInput
            id="sinopse" // Este era 'descricao'
            name="sinopse"
            label="Sinopse"
            type="textarea"
            value={formData.sinopse}
            onChange={handleChange}
            required
          />
          <CustomInput
            id="urlCartaz" // Este era 'estreia'
            name="urlCartaz"
            label="URL do Cartaz (Opcional)"
            type="text"
            value={formData.urlCartaz}
            onChange={handleChange}
          />
          <CustomButton type="submit" label="Salvar Filme" />
        </form>
      </main>
    </>
  );
}

export default CadastroFilmes;