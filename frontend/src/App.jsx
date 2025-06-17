import { Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import CadastroFilmes from './components/pages/CadastroFilmes';
import CadastroSalas from './components/pages/CadastroSalas';
import CadastroSessoes from './components/pages/CadastroSessoes';
import VendaIngressos from './components/pages/VendaIngressos';
import SessoesDisponiveis from './components/pages/SessoesDisponiveis';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro-filmes" element={<CadastroFilmes />} />
      <Route path="/cadastro-salas" element={<CadastroSalas />} />
      <Route path="/cadastro-sessoes" element={<CadastroSessoes />} />
      <Route path="/venda-ingressos" element={<VendaIngressos />} />
      <Route path="/sessoes" element={<SessoesDisponiveis />} />
    </Routes>
  );
}

export default App;