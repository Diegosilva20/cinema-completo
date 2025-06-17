// src/components/pages/VendaIngressos.jsx

import { useState, useContext, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import CustomSelect from '../common/CustomSelect';
import CustomInput from '../common/CustomInput';
import CustomButton from '../common/CustomButton';
import AlertMessage from '../common/AlertMessage';
import ConfirmationModal from '../common/ConfirmationModal';
import { CinemaContext } from '../../context/CinemaContext';

function VendaIngressos() {
  const { filmes, salas, sessoes, addVenda, loading, error } = useContext(CinemaContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sessaoId: searchParams.get('sessao') || '',
    quantidade: '',
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');
  const [showModal, setShowModal] = useState(false);

  const sessaoOptions = sessoes
    .filter((s) => new Date(s.horarioInicio) >= new Date())
    .map((s) => {
      const filme = filmes.find((f) => f.id === s.filmeId);
      const sala = salas.find((sala) => sala.id === s.salaId);
      return {
        value: s.id,
        label: `${filme ? filme.titulo : 'Filme não encontrado'} - ${
          sala ? `Sala ${sala.numero} (${sala.tipo})` : 'Sala não encontrada'
        } - ${new Date(s.horarioInicio).toLocaleString('pt-BR')}`,
      };
    });

  useEffect(() => {
    if (formData.sessaoId && !sessoes.some(s => s.id === parseInt(formData.sessaoId))) {
        setFormData(prev => ({ ...prev, sessaoId: '' }));
    }
  }, [sessoes, formData.sessaoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    const quantidade = parseInt(formData.quantidade);
    if (isNaN(quantidade) || quantidade <= 0) {
      setMessage('A quantidade de ingressos deve ser um número positivo.');
      setMessageType('danger');
      return;
    }

    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);

    const vendaParaBackend = {
      sessaoId: parseInt(formData.sessaoId),
      quantidade: parseInt(formData.quantidade),
    };

    try {
      const result = await addVenda(vendaParaBackend);
      if (result.success) {
        setMessage('Venda confirmada com sucesso!');
        setMessageType('success');
        setFormData({ sessaoId: '', quantidade: '' });
        setTimeout(() => navigate('/sessoes'), 2000);
      } else {
        setMessage(result.message);
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Erro geral ao confirmar venda:', error);
      setMessage('Erro inesperado ao confirmar venda.');
      setMessageType('danger');
    }
  };

  // CORREÇÃO AQUI
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container mt-5">Carregando dados...</main>
      </>
    );
  }
  // CORREÇÃO AQUI
  if (error) {
    return (
      <>
        <Navbar />
        <main className="container mt-5" style={{ color: 'red' }}>Erro: {error}</main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="container mt-5 p-4 rounded bg-dark">
        <h1 className="text-white mb-4">Venda de Ingressos</h1>
        <AlertMessage message={message} type={messageType} onClose={() => setMessage(null)} />
        <form onSubmit={handleSubmit} className="mt-4">
          <CustomSelect
            id="sessaoId"
            name="sessaoId"
            label="Sessão"
            value={formData.sessaoId}
            onChange={handleChange}
            options={sessaoOptions}
            required
            icon="bi-calendar-event"
          />
          <CustomInput
            id="quantidade"
            name="quantidade"
            label="Quantidade de Ingressos"
            type="number"
            value={formData.quantidade}
            onChange={handleChange}
            required
            min="1"
            icon="bi-ticket"
          />
          <CustomButton type="submit" label="Confirmar Venda" icon="bi-ticket" />
        </form>
        <ConfirmationModal
          show={showModal}
          onHide={() => setShowModal(false)}
          onConfirm={handleConfirm}
          title="Confirmar Venda"
          message="Deseja confirmar a venda do ingresso?"
        />
      </main>
    </>
  );
}

export default VendaIngressos;