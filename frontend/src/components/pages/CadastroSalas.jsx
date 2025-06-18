import { useState, useContext, useEffect } from 'react';
import Navbar from '../common/Navbar';
import CustomInput from '../common/CustomInput';
import CustomSelect from '../common/CustomSelect';
import CustomButton from '../common/CustomButton';
import AlertMessage from '../common/AlertMessage';
import ConfirmationModal from '../common/ConfirmationModal';
import { CinemaContext } from '../../context/CinemaContext';

function CadastroSalas() {
  const { salas, addSala, updateSala, removeSala, loading, error } = useContext(CinemaContext);
  const [formData, setFormData] = useState({ numero: '', capacidade: '', tipo: '' });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [editingSala, setEditingSala] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [salaToDelete, setSalaToDelete] = useState(null);

  const tipos = [
    { value: '2D', label: '2D' },
    { value: '3D', label: '3D' },
    { value: 'IMAX', label: 'IMAX' },
    { value: 'VIP', label: 'VIP' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditClick = (sala) => {
    setEditingSala(sala);
    setFormData({
      numero: String(sala.numero), // Converte para string para o input type="number"
      capacidade: String(sala.capacidade),
      tipo: sala.tipo,
    });
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingSala(null);
    setFormData({ numero: '', capacidade: '', tipo: '' });
    setMessage(null);
  };

  const handleDeleteClick = (sala) => {
    setSalaToDelete(sala);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    if (!salaToDelete) return;

    try {
      const result = await removeSala(salaToDelete.id);
      if (result.success) {
        setMessage('Sala excluída com sucesso!');
        setMessageType('success');
      } else {
        setMessage(result.message || 'Erro ao excluir sala.');
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Erro geral ao excluir sala:', error);
      setMessage('Erro inesperado ao excluir sala.');
      setMessageType('danger');
    } finally {
      setSalaToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const numero = parseInt(formData.numero);
    if (isNaN(numero) || numero <= 0) {
      setMessage('Número da sala deve ser um número positivo.');
      setMessageType('danger');
      return;
    }

    const capacidade = parseInt(formData.capacidade);
    if (isNaN(capacidade) || capacidade <= 0 || capacidade > 500) {
      setMessage('Capacidade deve ser um número entre 1 e 500.');
      setMessageType('danger');
      return;
    }

    const salaParaBackend = {
      numero: numero,
      capacidade: capacidade,
      tipo: formData.tipo,
    };

    if (editingSala) {
      // Lógica de EDIÇÃO
      try {
        const result = await updateSala(editingSala.id, salaParaBackend);
        if (result.success) {
          setMessage('Sala atualizada com sucesso!');
          setMessageType('success');
          handleCancelEdit();
        } else {
          setMessage(result.message);
          setMessageType('danger');
        }
      } catch (error) {
        console.error('Erro geral ao atualizar sala:', error);
        setMessage('Erro inesperado ao atualizar sala.');
        setMessageType('danger');
      }
    } else {
      // Lógica de CADASTRO
      try {
        const result = await addSala(salaParaBackend);
        if (result.success) {
          setMessage('Sala cadastrada com sucesso!');
          setMessageType('success');
          setFormData({ numero: '', capacidade: '', tipo: '' });
        } else {
          setMessage(result.message);
          setMessageType('danger');
        }
      } catch (error) {
        console.error('Erro geral ao cadastrar sala:', error);
        setMessage('Erro inesperado ao cadastrar sala.');
        setMessageType('danger');
      }
    }
  };

  if (loading) return <><Navbar /><main className="container mt-5">Carregando salas...</main></>;
  if (error) return <><Navbar /><main className="container mt-5" style={{ color: 'red' }}>Erro: {error}</main></>;

  return (
    <>
      <Navbar />
      <main className="container mt-5">
        <h1>{editingSala ? 'Editar Sala' : 'Cadastro de Salas'}</h1>
        <AlertMessage message={message} type={messageType} onClose={() => setMessage(null)} />

        <form onSubmit={handleSubmit} className="mt-4">
          <CustomInput id="numero" name="numero" label="Número da Sala" type="number" value={formData.numero} onChange={handleChange} required min="1" />
          <CustomInput
            id="capacidade" name="capacidade" label="Capacidade" type="number"
            value={formData.capacidade} onChange={handleChange} required min="1" max="500"
          />
          <CustomSelect
            id="tipo" name="tipo" label="Tipo"
            value={formData.tipo} onChange={handleChange} options={tipos} required
          />
          <CustomButton type="submit" label={editingSala ? "Atualizar Sala" : "Salvar Sala"} />
          {editingSala && (
            <CustomButton type="button" label="Cancelar Edição" onClick={handleCancelEdit} className="btn btn-secondary ms-2" />
          )}
        </form>

        <h2 className="mt-5">Salas Cadastradas</h2>
        {salas.length === 0 ? (
          <p>Nenhuma sala cadastrada.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Número</th>
                  <th>Capacidade</th>
                  <th>Tipo</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {salas.map((sala) => (
                  <tr key={sala.id}>
                    <td>{sala.id}</td>
                    <td>{sala.numero}</td>
                    <td>{sala.capacidade}</td>
                    <td>{sala.tipo}</td>
                    <td>
                      <CustomButton
                        label="Editar"
                        onClick={() => handleEditClick(sala)}
                        className="btn btn-info btn-sm me-2"
                        icon="bi-pencil"
                      />
                      <CustomButton
                        label="Excluir"
                        onClick={() => handleDeleteClick(sala)}
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
          message={`Tem certeza que deseja excluir a sala "${salaToDelete?.numero}"? Esta ação é irreversível.`}
        />
      </main>
    </>
  );
}

export default CadastroSalas;