    // Modal.js
import React from 'react';
import './Modal.css'; // Ensure you have the appropriate styles

function Modal({ children, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>
    );
}

export default Modal;
