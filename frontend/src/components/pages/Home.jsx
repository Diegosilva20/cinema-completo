import Navbar from '../common/Navbar';
import CustomButton from '../common/CustomButton';

function Home() {
  return (
    <>
      <Navbar />
      <main
        className="container-fluid p-0"
        style={{
          backgroundImage: 'url("https://source.unsplash.com/1600x400/?cinema")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '30px',
            borderRadius: '10px',
          }}
        >
          <h1 className="text-white mb-3">Bem-vindo ao Sistema de Cinema</h1>
          <p className="text-white mb-4">Gerencie filmes, salas, sessões e ingressos com estilo!</p>
          <CustomButton
            label="Ver Sessões Disponíveis"
            onClick={() => window.location.href = '/sessoes'}
            icon="bi-calendar-event"
            className="btn btn-danger btn-lg shadow"
          />
        </div>
      </main>
    </>
  );
}

export default Home;