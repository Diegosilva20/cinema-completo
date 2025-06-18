import { useState, useContext, useEffect } from 'react';
import Navbar from '../common/Navbar';
import CustomSelect from '../common/CustomSelect';
import CustomInput from '../common/CustomInput';
import CustomButton from '../common/CustomButton';
import AlertMessage from '../common/AlertMessage';
import ConfirmationModal from '../common/ConfirmationModal';
import { CinemaContext } from '../../context/CinemaContext';

function CadastroSessoes() {
  const { filmes, salas, sessoes, addSessao, updateSessao, removeSessao, loading, error } = useContext(CinemaContext);
  const [formData, setFormData] = useState({ filmeId: '', salaId: '', horarioInicio: '', precoIngresso: '' });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [editingSessao, setEditingSessao] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessaoToDelete, setSessaoToDelete] = useState(null);

  const filmeOptions = filmes.map((f) => ({ value: String(f.id), label: f.titulo }));
  const salaOptions = salas.map((s) => ({ value: String(s.id), label: `Sala ${s.numero} (${s.tipo})` }));

  useEffect(() => {
    // Se filmes ou salas forem carregados ou alterados, garante que as opções do select ainda são válidas
    if (formData.filmeId && !filmes.some(f => String(f.id) === formData.filmeId)) {
        setFormData(prev => ({ ...prev, filmeId: '' }));
    }
    if (formData.salaId && !salas.some(s => String(s.id) === formData.salaId)) {
        setFormData(prev => ({ ...prev, salaId: '' }));
    }
  }, [filmes, salas, formData.filmeId, formData.salaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = (sessao) => {
    setEditingSessao(sessao);
    setFormData({
      filmeId: String(sessao.filmeId),
      salaId: String(sessao.salaId),
      // horarioInicio precisa ser formatado para 'YYYY-MM-DDTHH:MM' para input type="datetime-local"
      horarioInicio: new Date(sessao.horarioInicio).toISOString().slice(0, 16),
      precoIngresso: String(sessao.precoIngresso),
    });
    setMessage(null);
  };

  const handleCancelEdit = () => {
    setEditingSessao(null);
    setFormData({ filmeId: '', salaId: '', horarioInicio: '', precoIngresso: '' });
    setMessage(null);
  };

  const handleDeleteClick = (sessao) => {
    setSessaoToDelete(sessao);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    if (!sessaoToDelete) return;

    try {
      const result = await removeSessao(sessaoToDelete.id);
      if (result.success) {
        setMessage('Sessão excluída com sucesso!');
        setMessageType('success');
      } else {
        setMessage(result.message || 'Erro ao excluir sessão.');
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Erro geral ao excluir sessão:', error);
      setMessage('Erro inesperado ao excluir sessão.');
      setMessageType('danger');
    } finally {
      setSessaoToDelete(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const preco = parseFloat(formData.precoIngresso);
    if (isNaN(preco) || preco <= 0) {
      setMessage('O preço deve ser um número maior que zero.');
      setMessageType('danger');
      return;
    }

    const horarioInicio = new Date(formData.horarioInicio).toISOString(); // Para enviar ao backend

    const sessaoParaBackend = {
      filmeId: parseInt(formData.filmeId, 10),
      salaId: parseInt(formData.salaId, 10),
      horarioInicio: horarioInicio,
      precoIngresso: preco,
    };

    if (editingSessao) {
      // Lógica de EDIÇÃO
      try {
        const result = await updateSessao(editingSessao.id, sessaoParaBackend);
        if (result.success) {
          setMessage('Sessão atualizada com sucesso!');
          setMessageType('success');
          handleCancelEdit();
        } else {
          setMessage(result.message);
          setMessageType('danger');
        }
      } catch (error) {
        console.error('Erro geral ao atualizar sessão:', error);
        setMessage('Erro inesperado ao atualizar sessão.');
        setMessageType('danger');
      }
    } else {
      // Lógica de CADASTRO
      try {
        const result = await addSessao(sessaoParaBackend);
        if (result.success) {
          setMessage('Sessão cadastrada com sucesso!');
          setMessageType('success');
          setFormData({ filmeId: '', salaId: '', horarioInicio: '', precoIngresso: '' });
        } else {
          setMessage(result.message);
          setMessageType('danger');
        }
      } catch (error) {
        console.error('Erro geral ao cadastrar sessão:', error);
        setMessage('Erro inesperado ao cadastrar sessão.');
        setMessageType('danger');
      }
    }
  };

  if (loading) return <><Navbar /><main className="container mt-5">Carregando sessões...</main></>;
  if (error) return <><Navbar /><main className="container mt-5" style={{ color: 'red' }}>Erro: {error}</main></>;

  return (
    <>
      <Navbar />
      <main className="container mt-5">
        <h1>{editingSessao ? 'Editar Sessão' : 'Cadastro de Sessões'}</h1>
        <AlertMessage message={message} type={messageType} onClose={() => setMessage(null)} />

        <form onSubmit={handleSubmit} className="mt-4">
          <CustomSelect
            id="filmeId" name="filmeId" label="Filme"
            value={formData.filmeId} onChange={handleChange} options={filmeOptions} required
          />
          <CustomSelect
            id="salaId" name="salaId" label="Sala"
            value={formData.salaId} onChange={handleChange} options={salaOptions} required
          />
          <CustomInput
            id="horarioInicio" name="horarioInicio" label="Data e Hora" type="datetime-local"
            value={formData.horarioInicio} onChange={handleChange} required
          />
          <CustomInput
            id="precoIngresso" name="precoIngresso" label="Preço (R$)" type="number"
            step="0.01" min="0" value={formData.precoIngresso} onChange={handleChange} required
          />
          <CustomButton type="submit" label={editingSessao ? "Atualizar Sessão" : "Salvar Sessão"} />
          {editingSessao && (
            <CustomButton type="button" label="Cancelar Edição" onClick={handleCancelEdit} className="btn btn-secondary ms-2" />
          )}
        </form>

        <h2 className="mt-5">Sessões Cadastradas</h2>
        {sessoes.length === 0 ? (
          <p>Nenhuma sessão cadastrada.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-dark table-striped table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Filme</th>
                  <th>Sala</th>
                  <th>Data/Hora</th>
                  <th>Preço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {sessoes.map((sessao) => {
                  const filme = filmes.find((f) => f.id === sessao.filmeId);
                  const sala = salas.find((s) => s.id === sessao.salaId);
                  return (
                    <tr key={sessao.id}>
                      <td>{sessao.id}</td>
                      <td>{filme ? filme.titulo : 'Filme não encontrado'}</td>
                      <td>{sala ? `Sala ${sala.numero}` : 'Sala não encontrada'}</td>
                      <td>{new Date(sessao.horarioInicio).toLocaleString('pt-BR')}</td>
                      <td>R${parseFloat(sessao.precoIngresso).toFixed(2)}</td>
                      <td>
                        <CustomButton
                          label="Editar"
                          onClick={() => handleEditClick(sessao)}
                          className="btn btn-info btn-sm me-2"
                          icon="bi-pencil"
                        />
                        <CustomButton
                          label="Excluir"
                          onClick={() => handleDeleteClick(sessao)}
                          className="btn btn-danger btn-sm"
                          icon="bi-trash"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <ConfirmationModal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir a sessão ${sessaoToDelete ? new Date(sessaoToDelete.horarioInicio).toLocaleString('pt-BR') : ''}? Esta ação é irreversível.`}
        />
      </main>
    </>
  );
}

export default CadastroSessoes;