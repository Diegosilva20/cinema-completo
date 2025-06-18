import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Importa a instância do axios

export const CinemaContext = createContext();

export function CinemaProvider({ children }) {
  const [filmes, setFilmes] = useState([]);
  const [salas, setSalas] = useState([]);
  const [sessoes, setSessoes] = useState([]);
  const [vendas, setVendas] = useState([]); // Usamos 'vendas' para alinhar com o backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para carregar todos os dados do backend
  const carregarTodosDados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [filmesRes, salasRes, sessoesRes, vendasRes] = await Promise.all([
        api.get('/filme'),
        api.get('/salas'),
        api.get('/sessoes'),
        api.get('/vendas'),
      ]);

      setFilmes(filmesRes.data);
      setSalas(salasRes.data);
      setSessoes(sessoesRes.data);
      setVendas(vendasRes.data);

    } catch (err) {
      console.error('Erro ao carregar dados do backend:', err.response?.data || err.message);
      setError('Não foi possível carregar os dados. Verifique o servidor.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTodosDados();
  }, [carregarTodosDados]);

  // --- Funções CRUD para Filmes ---
  const addFilme = async (filmeData) => {
    try {
      const response = await api.post('/filme', filmeData);
      setFilmes((prevFilmes) => [...prevFilmes, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao adicionar filme.';
      console.error('Erro ao adicionar filme:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  const updateFilme = async (id, filmeData) => {
    try {
      const response = await api.patch(`/filme/${id}`, filmeData);
      setFilmes((prevFilmes) => prevFilmes.map((f) => (f.id === id ? response.data : f)));
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao atualizar filme.';
      console.error('Erro ao atualizar filme:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  const removeFilme = async (id) => {
    try {
      await api.delete(`/filme/${id}`);
      setFilmes((prevFilmes) => prevFilmes.filter((f) => f.id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao remover filme.';
      console.error('Erro ao remover filme:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  // --- Funções CRUD para Salas ---
  const addSala = async (salaData) => {
    try {
      const response = await api.post('/salas', salaData);
      setSalas((prevSalas) => [...prevSalas, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao adicionar sala.';
      console.error('Erro ao adicionar sala:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  const updateSala = async (id, salaData) => {
    try {
      const response = await api.patch(`/salas/${id}`, salaData);
      setSalas((prevSalas) => prevSalas.map((s) => (s.id === id ? response.data : s)));
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao atualizar sala.';
      console.error('Erro ao atualizar sala:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  const removeSala = async (id) => {
    try {
      await api.delete(`/salas/${id}`);
      setSalas((prevSalas) => prevSalas.filter((s) => s.id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao remover sala.';
      console.error('Erro ao remover sala:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  // --- Funções CRUD para Sessões ---
  const addSessao = async (sessaoData) => {
    try {
      const response = await api.post('/sessoes', sessaoData);
      setSessoes((prevSessoes) => [...prevSessoes, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao adicionar sessão.';
      console.error('Erro ao adicionar sessão:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  const updateSessao = async (id, sessaoData) => {
    try {
      const response = await api.patch(`/sessoes/${id}`, sessaoData);
      setSessoes((prevSessoes) => prevSessoes.map((s) => (s.id === id ? response.data : s)));
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao atualizar sessão.';
      console.error('Erro ao atualizar sessão:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  const removeSessao = async (id) => {
    try {
      await api.delete(`/sessoes/${id}`);
      setSessoes((prevSessoes) => prevSessoes.filter((s) => s.id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao remover sessão.';
      console.error('Erro ao remover sessão:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  // --- Funções CRUD para Vendas ---
  const addVenda = async (vendaData) => {
    try {
      const response = await api.post('/vendas', vendaData);
      setVendas((prevVendas) => [...prevVendas, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao adicionar venda.';
      console.error('Erro ao adicionar venda:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  const updateVenda = async (id, vendaData) => {
    try {
      const response = await api.patch(`/vendas/${id}`, vendaData);
      setVendas((prevVendas) => prevVendas.map((v) => (v.id === id ? response.data : v)));
      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao atualizar venda.';
      console.error('Erro ao atualizar venda:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  const removeVenda = async (id) => {
    try {
      await api.delete(`/vendas/${id}`);
      setVendas((prevVendas) => prevVendas.filter((v) => v.id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao remover venda.';
      console.error('Erro ao remover venda:', message);
      return { success: false, message: Array.isArray(message) ? message.join(', ') : message };
    }
  };

  // Context value com todas as funções e estados
  const contextValue = {
    filmes,
    salas,
    sessoes,
    vendas,
    loading,
    error,
    addFilme,
    updateFilme,
    removeFilme,
    addSala,
    updateSala,
    removeSala,
    addSessao,
    updateSessao,
    removeSessao,
    addVenda,
    updateVenda,
    removeVenda,
    // Note: gerarId não é mais necessário, IDs são do backend
    // setFilmes, setSalas, setSessoes, setVendas não são expostos
    // para forçar o uso das funções CRUD que interagem com a API
  };

  return (
    <CinemaContext.Provider value={contextValue}>
      {children}
    </CinemaContext.Provider>
  );
}