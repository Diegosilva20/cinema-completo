import { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api'; // Importa a instância do axios

export const CinemaContext = createContext();

export function CinemaProvider({ children }) {
  const [filmes, setFilmes] = useState([]);
  const [salas, setSalas] = useState([]);
  const [sessoes, setSessoes] = useState([]);
  const [vendas, setVendas] = useState([]); // Mudando de 'ingressos' para 'vendas' para alinhar com o backend
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para carregar todos os dados do backend
  const carregarTodosDados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Usamos Promise.all para carregar todos os dados em paralelo
      const [filmesRes, salasRes, sessoesRes, vendasRes] = await Promise.all([
        api.get('/filme'),   // Endpoint de filmes
        api.get('/salas'),   // Endpoint de salas
        api.get('/sessoes'), // Endpoint de sessões
        api.get('/vendas'),  // Endpoint de vendas
      ]);

      setFilmes(filmesRes.data);
      setSalas(salasRes.data);
      setSessoes(sessoesRes.data);
      setVendas(vendasRes.data); // Atualiza o estado de vendas

    } catch (err) {
      console.error('Erro ao carregar dados do backend:', err);
      setError('Não foi possível carregar os dados. Verifique o servidor.');
    } finally {
      setLoading(false);
    }
  }, []); // [] para que a função seja criada apenas uma vez

  // Carrega os dados na montagem inicial do Provider
  useEffect(() => {
    carregarTodosDados();
  }, [carregarTodosDados]);

  // Funções CRUD que chamam a API

  // Filmes
  const addFilme = async (filmeData) => {
    try {
      const response = await api.post('/filme', filmeData);
      setFilmes((prevFilmes) => [...prevFilmes, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao adicionar filme:', err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || 'Erro ao adicionar filme.' };
    }
  };
  // Exemplo de atualização de filme (opcional para o escopo inicial)
  const updateFilme = async (id, filmeData) => {
    try {
      const response = await api.patch(`/filme/${id}`, filmeData);
      setFilmes((prevFilmes) => prevFilmes.map(f => f.id === id ? response.data : f));
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao atualizar filme:', err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || 'Erro ao atualizar filme.' };
    }
  };

  // Salas
  const addSala = async (salaData) => {
    try {
      const response = await api.post('/salas', salaData);
      setSalas((prevSalas) => [...prevSalas, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao adicionar sala:', err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || 'Erro ao adicionar sala.' };
    }
  };

  // Sessões
  const addSessao = async (sessaoData) => {
    try {
      const response = await api.post('/sessoes', sessaoData);
      setSessoes((prevSessoes) => [...prevSessoes, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao adicionar sessão:', err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || 'Erro ao adicionar sessão.' };
    }
  };

  // Vendas (anteriormente Ingressos)
  const addVenda = async (vendaData) => {
    try {
      const response = await api.post('/vendas', vendaData);
      setVendas((prevVendas) => [...prevVendas, response.data]);
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Erro ao adicionar venda:', err.response?.data || err.message);
      return { success: false, message: err.response?.data?.message || 'Erro ao adicionar venda.' };
    }
  };

  // Funções utilitárias removidas: gerarId não é mais necessário, pois o backend gera o ID.
  // getFilmeById, getSalaById, getSessaoById podem ser feitos no componente ou
  // você pode buscar os dados completos no findOne do backend se precisar de detalhes que não estão nos arrays de estado.

  const contextValue = {
    filmes,
    salas,
    sessoes,
    vendas, // Usar 'vendas' em vez de 'ingressos'
    loading,
    error,
    addFilme,
    updateFilme, // Incluído para referência, mas não será usado no cadastro inicial
    addSala,
    addSessao,
    addVenda,
    // Remover setFilmes, setSalas, setSessoes, setIngressos, gerarId do value,
    // pois as modificações agora devem passar pelas funções add/update.
  };

  return (
    <CinemaContext.Provider value={contextValue}>
      {children}
    </CinemaContext.Provider>
  );
}