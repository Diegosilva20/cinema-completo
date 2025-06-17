import { NavLink } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        <NavLink className="navbar-brand" to="/">
          <i className="bi bi-camera-reels me-2"></i>Cinema
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                <i className="bi bi-house me-1"></i>Início
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cadastro-filmes">
                <i className="bi bi-film me-1"></i>Filmes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cadastro-salas">
                <i className="bi bi-door-open me-1"></i>Salas
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/cadastro-sessoes">
                <i className="bi bi-clock me-1"></i>Sessões
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/venda-ingressos">
                <i className="bi bi-ticket-perforated me-1"></i>Ingressos
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sessoes">
                <i className="bi bi-calendar-event me-1"></i>Sessões Disponíveis
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;