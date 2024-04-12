import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const FormModal = ({ buttonComponent, formComponent }) => {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  return (
    <>
      {React.cloneElement(buttonComponent, { onClick: handleShow })}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Body>
          {React.cloneElement(formComponent, { onClose: handleClose })}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FormModal;
