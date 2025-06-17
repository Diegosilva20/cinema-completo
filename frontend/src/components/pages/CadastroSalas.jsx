import { useState, useContext } from 'react';
import Navbar from '../common/Navbar';
import CustomInput from '../common/CustomInput';
import CustomSelect from '../common/CustomSelect';
import CustomButton from '../common/CustomButton';
import AlertMessage from '../common/AlertMessage';
import { CinemaContext } from '../../context/CinemaContext';

function CadastroSalas() {
  const { addSala } = useContext(CinemaContext); // Usar addSala do contexto
  const [formData, setFormData] = useState({ numero: '', capacidade: '', tipo: '' }); // 'nome' mudou para 'numero'
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('success');

  const tipos = [
    { value: '2D', label: '2D' },
    { value: '3D', label: '3D' },
    { value: 'IMAX', label: 'IMAX' },
    { value: 'VIP', label: 'VIP' }, // Adicionado VIP, se o backend aceitar
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { // Tornar assíncrono
    e.preventDefault();
    setMessage(null);

    const numero = parseInt(formData.numero); // 'nome' era string, 'numero' é int
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

    try {
      const result = await addSala(salaParaBackend);
      if (result.success) {
        setMessage('Sala cadastrada com sucesso!');
        setMessageType('success');
        setFormData({ numero: '', capacidade: '', tipo: '' }); // Resetar com 'numero'
      } else {
        setMessage(result.message);
        setMessageType('danger');
      }
    } catch (error) {
      console.error('Erro geral ao cadastrar sala:', error);
      setMessage('Erro inesperado ao cadastrar sala.');
      setMessageType('danger');
    }
  };

  return (
    <>
      <Navbar />
      <main className="container mt-5">
        <h1>Cadastro de Salas</h1>
        <AlertMessage message={message} type={messageType} onClose={() => setMessage(null)} />
        <form onSubmit={handleSubmit} className="mt-4">
          <CustomInput id="numero" name="numero" label="Número da Sala" type="number" value={formData.numero} onChange={handleChange} required min="1" />
          <CustomInput
            id="capacidade"
            name="capacidade"
            label="Capacidade"
            type="number"
            value={formData.capacidade}
            onChange={handleChange}
            required
            min="1"
            max="500"
          />
          <CustomSelect
            id="tipo"
            name="tipo"
            label="Tipo"
            value={formData.tipo}
            onChange={handleChange}
            options={tipos}
            required
          />
          <CustomButton type="submit" label="Salvar Sala" />
        </form>
      </main>
    </>
  );
}

export default CadastroSalas;