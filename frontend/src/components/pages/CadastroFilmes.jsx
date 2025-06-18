import { useState, useContext, useEffect } from 'react';
import Navbar from '../common/Navbar';
import CustomInput from '../common/CustomInput';
import CustomSelect from '../common/CustomSelect';
import CustomButton from '../common/CustomButton';
import AlertMessage from '../common/AlertMessage';
import ConfirmationModal from '../common/ConfirmationModal'; // Para exclusão
import { CinemaContext } from '../../context/CinemaContext';

function CadastroFilmes() {
  const { filmes, addFilme, updateFilme, removeFilme, loading, error } = useContext(CinemaContext);
  const [formData, setFormData] = useState({
    titulo: '',
    diretor: '',
    genero: '',
    duracao: '',
    sinopse: '',
    urlCartaz: '',
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [editingFilme, setEditingFilme] = useState(null); // Estado para o filme sendo editado
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [filmeToDelete, setFilmeToDelete] = useState(null);

  const generos = [
    { value: 'Ação', label: 'Ação' },
    { value: 'Comédia', label: 'Comédia' },
    { value: 'Drama', label: 'Drama' },
    { value: 'Terror', label: 'Terror' },
    { value: 'Ficção Científica', label: 'Ficção Científica' },
    { value: 'Animação', label: 'Animação' },
    { value: 'Crime', label: 'Crime' }, // Adicionado para bater com seus exemplos
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (filme) => {
    setEditingFilme(filme);
    setFormData({
      titulo: filme.titulo,
      diretor: filme.diretor,
      genero: filme.genero,
      duracao: filme.duracao,
      sinopse: filme.sinopse,
      urlCartaz: filme.urlCartaz || '',
    });
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingFilme(null);
    setFormData({ titulo: '', diretor: '', genero: '', duracao: '', sinopse: '', urlCartaz: '' });
    setMessage(null);
  };

  const handleDeleteClick = (filme) => {
    setFilmeToDelete(filme);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    if (!filmeToDelete) return;

    try {
      const result = await removeFilme(filmeToDelete.id);
      if (result.success) {
        setMessage('Filme excluído com sucesso!');
        setMessageType('success');
      } else {
        setMessage(result.message || 'Erro ao excluir filme.');
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Erro geral ao excluir filme:', error);
      setMessage('Erro inesperado ao excluir filme.');
      setMessageType('danger');
    } finally {
      setFilmeToDelete(null);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

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
      urlCartaz: formData.urlCartaz || null,
    };

    if (editingFilme) {
      // Lógica de EDIÇÃO
      try {
        const result = await updateFilme(editingFilme.id, filmeParaBackend);
        if (result.success) {
          setMessage('Filme atualizado com sucesso!');
          setMessageType('success');
          handleCancelEdit(); // Volta ao modo de cadastro
        } else {
          setMessage(result.message);
          setMessageType('danger');
        }
      } catch (error) {
        console.error('Erro geral ao atualizar filme:', error);
        setMessage('Erro inesperado ao atualizar filme.');
        setMessageType('danger');
      }
    } else {
      // Lógica de CADASTRO
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
    }
  };

  if (loading) return <><Navbar /><main className="container mt-5">Carregando filmes...</main></>;
  if (error) return <><Navbar /><main className="container mt-5" style={{ color: 'red' }}>Erro: {error}</main></>;

  return (
    <>
      <Navbar />
      <main className="container mt-5">
        <h1>{editingFilme ? 'Editar Filme' : 'Cadastro de Filmes'}</h1>
        <AlertMessage message={message} type={messageType} onClose={() => setMessage(null)} />

        <form onSubmit={handleSubmit} className="mt-4">
          {/* CAMPOS DO FORMULÁRIO (ID's e names ajustados) */}
          <CustomInput id="titulo" name="titulo" label="Título" value={formData.titulo} onChange={handleChange} required />
          <CustomInput id="diretor" name="diretor" label="Diretor" value={formData.diretor} onChange={handleChange} required />
          <CustomSelect
            id="genero" name="genero" label="Gênero"
            value={formData.genero} onChange={handleChange} options={generos} required
          />
          <CustomInput
            id="duracao" name="duracao" label="Duração (minutos)" type="number"
            value={formData.duracao} onChange={handleChange} required min="1" max="300"
          />
          <CustomInput
            id="sinopse" name="sinopse" label="Sinopse" type="textarea"
            value={formData.sinopse} onChange={handleChange} required
          />
          <CustomInput
            id="urlCartaz" name="urlCartaz" label="URL do Cartaz (Opcional)" type="text"
            value={formData.urlCartaz} onChange={handleChange}
          />
          <CustomButton type="submit" label={editingFilme ? "Atualizar Filme" : "Salvar Filme"} />
          {editingFilme && (
            <CustomButton type="button" label="Cancelar Edição" onClick={handleCancelEdit} className="btn btn-secondary ms-2" />
          )}
        </form>

        <h2 className="mt-5">Filmes Cadastrados</h2>
        {filmes.length === 0 ? (
          <p>Nenhum filme cadastrado.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Diretor</th>
                  <th>Gênero</th>
                  <th>Duração</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filmes.map((filme) => (
                  <tr key={filme.id}>
                    <td>{filme.id}</td>
                    <td>{filme.titulo}</td>
                    <td>{filme.diretor}</td>
                    <td>{filme.genero}</td>
                    <td>{filme.duracao} min</td>
                    <td>
                      <CustomButton
                        label="Editar"
                        onClick={() => handleEditClick(filme)}
                        className="btn btn-info btn-sm me-2"
                        icon="bi-pencil"
                      />
                      <CustomButton
                        label="Excluir"
                        onClick={() => handleDeleteClick(filme)}
                        className="btn btn-danger btn-sm"
                        icon="bi-trash"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o filme "${filmeToDelete?.titulo}"? Esta ação é irreversível.`}
        />
      </main>
    </>
  );
}

export default CadastroFilmes;