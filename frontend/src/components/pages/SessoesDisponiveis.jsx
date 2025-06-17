// src/components/pages/SessoesDisponiveis.jsx

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import { CinemaContext } from '../../context/CinemaContext';

function SessoesDisponiveis() {
  const { filmes, salas, sessoes, loading, error } = useContext(CinemaContext);

  const sessoesFuturas = sessoes
    .filter((s) => new Date(s.horarioInicio) >= new Date())
    .sort((a, b) => new Date(a.horarioInicio).getTime() - new Date(b.horarioInicio).getTime());

  // CORREÇÃO AQUI
  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container mt-5">Carregando sessões...</main>
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
        <h1 className="text-white mb-4">Sessões Disponíveis</h1>
        <div className="table-responsive">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>Filme</th>
                <th>Sala</th>
                <th>Data/Hora</th>
                <th>Preço</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {sessoesFuturas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    Nenhuma sessão disponível.
                  </td>
                </tr>
              ) : (
                sessoesFuturas.map((sessao) => {
                  const filme = filmes.find((f) => f.id === sessao.filmeId);
                  const sala = salas.find((s) => s.id === sessao.salaId);
                  return (
                    <tr key={sessao.id}>
                      <td>{filme ? filme.titulo : 'Filme não encontrado'}</td>
                      <td>{sala ? `Sala ${sala.numero} (${sala.tipo})` : 'Sala não encontrada'}</td>
                      <td>{new Date(sessao.horarioInicio).toLocaleString('pt-BR')}</td>
                      <td>R${parseFloat(sessao.precoIngresso).toFixed(2)}</td>
                      <td>
                        <Link
                          to={`/venda-ingressos?sessao=${sessao.id}`}
                          className="btn btn-danger btn-sm shadow-sm"
                        >
                          <i className="bi bi-ticket-perforated me-1"></i> Comprar
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}

export default SessoesDisponiveis;