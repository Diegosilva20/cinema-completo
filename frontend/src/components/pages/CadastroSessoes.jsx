import { useState, useContext, useEffect } from 'react';
import Navbar from '../common/Navbar';
import CustomSelect from '../common/CustomSelect';
import CustomInput from '../common/CustomInput';
import CustomButton from '../common/CustomButton';
import AlertMessage from '../common/AlertMessage';
import { CinemaContext } from '../../context/CinemaContext';

function CadastroSessoes() {
  const { filmes, salas, addSessao } = useContext(CinemaContext);
  // >>> MUDANÇA AQUI: Inicialize filmeId e salaId como STRING VAZIA
  const [formData, setFormData] = useState({ filmeId: '', salaId: '', horarioInicio: '', precoIngresso: '' });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  // Mapear filmes e salas para opções do CustomSelect
  // O value deve ser o ID (número) que o backend espera, mas para o select,
  // vamos garantir que seja uma STRING para compatibilidade com e.target.value.
  const filmeOptions = filmes.map((f) => ({ value: String(f.id), label: f.titulo })); // Converte f.id para String
  const salaOptions = salas.map((s) => ({ value: String(s.id), label: `Sala ${s.numero} (${s.tipo})` })); // Converte s.id para String

  // Filtra as opções de sala para garantir que só mostre salas já carregadas
  useEffect(() => {
    if (formData.filmeId && !filmes.some(f => String(f.id) === formData.filmeId)) { // Comparar strings
        setFormData(prev => ({ ...prev, filmeId: '' }));
    }
    if (formData.salaId && !salas.some(s => String(s.id) === formData.salaId)) { // Comparar strings
        setFormData(prev => ({ ...prev, salaId: '' }));
    }
  }, [filmes, salas, formData.filmeId, formData.salaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // O value de um select já é uma string, então apenas atribua
    setFormData({ ...formData, [name]: value });
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

    const horarioInicio = new Date(formData.horarioInicio).toISOString();

    const sessaoParaBackend = {
      // >>> MUDANÇA AQUI: Converta de volta para NUMBER para enviar ao backend
      filmeId: parseInt(formData.filmeId, 10),
      salaId: parseInt(formData.salaId, 10),
      horarioInicio: horarioInicio,
      precoIngresso: preco,
    };

    try {
      const result = await addSessao(sessaoParaBackend);
      if (result.success) {
        setMessage('Sessão cadastrada com sucesso!');
        setMessageType('success');
        // >>> MUDANÇA AQUI: Resetar para STRING VAZIA
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
  };

  return (
    <>
      <Navbar />
      <main className="container mt-5">
        <h1>Cadastro de Sessões</h1>
        <AlertMessage message={message} type={messageType} onClose={() => setMessage(null)} />
        <form onSubmit={handleSubmit} className="mt-4">
          <CustomSelect
            id="filmeId"
            name="filmeId"
            label="Filme"
            value={formData.filmeId} // Agora formData.filmeId é uma string
            onChange={handleChange}
            options={filmeOptions} // options.value é string
            required
          />
          <CustomSelect
            id="salaId"
            name="salaId"
            label="Sala"
            value={formData.salaId} // Agora formData.salaId é uma string
            onChange={handleChange}
            options={salaOptions} // options.value é string
            required
          />
          <CustomInput
            id="horarioInicio"
            name="horarioInicio"
            label="Data e Hora"
            type="datetime-local"
            value={formData.horarioInicio}
            onChange={handleChange}
            required
          />
          <CustomInput
            id="precoIngresso"
            name="precoIngresso"
            label="Preço (R$)"
            type="number"
            step="0.01"
            min="0"
            value={formData.precoIngresso}
            onChange={handleChange}
            required
          />
          <CustomButton type="submit" label="Salvar Sessão" />
        </form>
      </main>
    </>
  );
}

export default CadastroSessoes;