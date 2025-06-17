import { Modal, Button } from 'react-bootstrap';

function ConfirmationModal({ show, onHide, onConfirm, title, message }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          <i className="bi bi-check-circle me-2"></i> Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;