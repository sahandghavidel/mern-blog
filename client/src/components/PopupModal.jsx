import React from 'react';
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Button, Modal } from "flowbite-react";


const PopupModal = ({ onConfirm, showModal, onClose, title }) => {
  return (
    <div>
      <Modal show={showModal} onClose={onClose} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="text-5xl text-gray-200 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">{title}</h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={onConfirm}>Yes I'm Sure</Button>
              <Button color="gray" onClick={onClose}>No, Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PopupModal;
