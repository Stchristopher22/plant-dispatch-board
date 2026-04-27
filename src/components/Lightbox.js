import React from 'react';

const Lightbox = ({ image, onClose }) => {
    if (!image) return null;

    return (
        <div className="lightbox open" onClick={onClose}>
            <span className="lightbox-close" onClick={onClose}>&times;</span>
            <img src={image} alt="Full size" />
        </div>
    );
};

export default Lightbox;