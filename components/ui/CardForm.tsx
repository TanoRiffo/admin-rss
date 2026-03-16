"use client";
import React, { useState } from 'react';
import { CardData, YoutubeCardData, NewsletterCardData } from '../../types/carrusel';

interface CardFormProps {
  initialData?: CardData;
  onSave: (card: CardData) => void;
  onCancel: () => void;
}

const cardFormStyles: Record<string, React.CSSProperties> = {
  formContainer: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.15)',
    marginTop: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '5px',
    fontWeight: 'bold',
    display: 'block',
    fontSize: '0.9em',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1em',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1em',
    boxSizing: 'border-box',
    minHeight: '100px',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1em',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
  },
  button: {
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1em',
    border: 'none',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    color: 'white',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#333',
  },
};

export const CardForm: React.FC<CardFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CardData>(initialData ? initialData : {
    id: crypto.randomUUID(),
    type: 'youtube',
    title: '',
    imageUrl: '',
    link: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div style={cardFormStyles.formContainer}>
      <h3>{initialData ? 'Editar Tarjeta' : 'Agregar Nueva Tarjeta'}</h3>
      <form onSubmit={handleSubmit}>
        <div style={cardFormStyles.formGroup}>
          <label style={cardFormStyles.label}>Tipo de Tarjeta:</label>
          <select name="type" value={formData.type} onChange={handleChange} style={cardFormStyles.select}>
            <option value="youtube">YouTube</option>
            <option value="newsletter">Newsletter</option>
          </select>
        </div>
        <div style={cardFormStyles.formGroup}>
          <label style={cardFormStyles.label}>Título:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} style={cardFormStyles.input} required />
        </div>
        <div style={cardFormStyles.formGroup}>
          <label style={cardFormStyles.label}>URL de la Imagen:</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} style={cardFormStyles.input} required />
        </div>
        
        {formData.type === 'youtube' && (
          <div style={cardFormStyles.formGroup}>
            <label style={cardFormStyles.label}>URL del Video:</label>
            <input type="text" name="link" value={(formData as YoutubeCardData).link || ''} onChange={handleChange} style={cardFormStyles.input} required />
          </div>
        )}

        {formData.type === 'newsletter' && (
          <div style={cardFormStyles.formGroup}>
            <label style={cardFormStyles.label}>Contenido (Markdown):</label>
            <textarea name="content" value={(formData as NewsletterCardData).content || ''} onChange={handleChange} style={cardFormStyles.textarea} required />
          </div>
        )}

        <div style={cardFormStyles.buttonGroup}>
          <button type="submit" style={{ ...cardFormStyles.button, ...cardFormStyles.saveButton }}>Guardar</button>
          <button type="button" onClick={onCancel} style={{ ...cardFormStyles.button, ...cardFormStyles.cancelButton }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};