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
  const { filmes, salas, sessoes, addVenda, loading, error } = useContext(CinemaContext); // Removi 'ingressos', 'setIngressos'
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sessaoId: searchParams.get('sessao') || '',
    quantidade: '',
    // nomeCliente, cpf, assento, pagamento foram removidos do DTO de Venda no backend
    // Se esses campos são importantes para o negócio, você pode:
    // 1. Adicionar esses campos como opcionais no seu DTO de Venda (e no modelo Prisma)
    // 2. Ou tratar esses dados apenas no frontend (não ideal para persistência)
    // 3. Ou criar um novo modelo (ex: 'IngressoCliente') no backend com esses detalhes
    // Por enquanto, o foco é o que o backend Venda espera: sessaoId, quantidade.
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
        value: String(s.id), // Garante que é string para o select
        label: `${filme ? filme.titulo : 'Filme não encontrado'} - ${
          sala ? `Sala ${sala.numero} (${sala.tipo})` : 'Sala não encontrada'
        } - ${new Date(s.horarioInicio).toLocaleString('pt-BR')}`,
      };
    });

  useEffect(() => {
    // Se a sessão na URL não estiver mais disponível, limpa o campo
    if (formData.sessaoId && !sessoes.some(s => String(s.id) === formData.sessaoId)) {
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

    if (!formData.sessaoId) {
        setMessage('Por favor, selecione uma sessão.');
        setMessageType('danger');
        return;
    }

    setShowModal(true);
  };

  const handleConfirm = async () => {
    setShowModal(false);

    const vendaParaBackend = {
      sessaoId: parseInt(formData.sessaoId, 10),
      quantidade: parseInt(formData.quantidade, 10),
      // valorTotal será calculado no backend
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

  if (loading) return <><Navbar /><main className="container mt-5">Carregando dados para venda...</main></>;
  if (error) return <><Navbar /><main className="container mt-5" style={{ color: 'red' }}>Erro: {error}</main></>;

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