"use client"
import React, { useState, useEffect } from 'react';
import { CarouselData, CarouselSaveData, CardData, NewsletterCardData } from '../../types/carrusel';
import { CardForm } from './CardForm';

interface CarouselFormProps {
  initialData?: CarouselData;
  onSave: (carousel: CarouselSaveData) => void;
  onCancel: () => void;
}

const carouselFormStyles: Record<string, React.CSSProperties> = {
  formContainer: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    marginBottom: '30px',
    maxWidth: '800px',
    margin: '20px auto',
    fontFamily: 'Arial, sans-serif'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
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
  cardList: {
    border: '1px dashed #eee',
    padding: '10px',
    borderRadius: '4px',
    minHeight: '80px',
    backgroundColor: '#fff',
    marginBottom: '15px',
  },
  cardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 10px',
    borderBottom: '1px solid #eee',
    fontSize: '0.95em',
  },
  cardButton: {
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85em',
    marginLeft: '8px',
    border: 'none',
  },
  editButton: {
    backgroundColor: '#2196F3',
    color: 'white',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
  },
  addButton: {
    padding: '10px 15px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1em',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    alignSelf: 'flex-start',
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

export const CarouselForm: React.FC<CarouselFormProps> = ({ initialData, onSave, onCancel }) => {
  const [id, setId] = useState(initialData?.id || '');
  const [title, setTitle] = useState(initialData?.title || '');
  const [cards, setCards] = useState<CardData[]>(initialData?.cards || []);
  const [editingCard, setEditingCard] = useState<CardData | null>(null);
  const [showCardForm, setShowCardForm] = useState(false);

  useEffect(() => {
    if (initialData) {
      setId(initialData.id);
      setTitle(initialData.title);
      setCards(initialData.cards);
    } else {
      setId('');
      setTitle('');
      setCards([]);
    }
  }, [initialData]);

  const handleAddCard = () => {
    // Al agregar una nueva tarjeta, el editingCard es null
    setEditingCard(null);
    setShowCardForm(true);
  };

  const handleEditCard = (cardToEdit: CardData) => {
    setEditingCard(cardToEdit);
    setShowCardForm(true);
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarjeta?')) {
      setCards(prevCards => prevCards.filter(card => card.id !== cardId));
    }
  };

  const handleCardSave = (savedCard: CardData) => {
    // Verificamos si la tarjeta ya existe en el array de cards
    const cardExists = cards.some(card => card.id === savedCard.id);

    if (cardExists) {
      // Si existe, la actualizamos
      setCards(prevCards => prevCards.map(card =>
        card.id === savedCard.id ? savedCard : card
      ));
    } else {
      // Si no existe, es una nueva tarjeta, la agregamos
      setCards(prevCards => [...prevCards, savedCard]);
    }

    setShowCardForm(false);
    setEditingCard(null);
  };

  const handleCardCancel = () => {
    setShowCardForm(false);
    setEditingCard(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      alert("El Título del carrusel es obligatorio.");
      return;
    }

    const carouselToSave: CarouselSaveData = {
      title: title || '',
      cards: cards.map(card => {
        if (card.type === 'newsletter') {
          return {
            ...card,
            content: (card as NewsletterCardData).content || '',
          };
        }
        return card;
      })
    };
    
    if (id) {
      carouselToSave.id = id;
    }

    onSave(carouselToSave);
  };

  console.log("CARDS:", cards)

  return (
    <div style={carouselFormStyles.formContainer}>
      <h2>{initialData ? 'Editar Carrusel' : 'Agregar Nuevo Carrusel'}</h2>
      
      <form onSubmit={handleSubmit} style={carouselFormStyles.form}>
        {initialData && (
          <div style={carouselFormStyles.formGroup}>
            <label style={carouselFormStyles.label}>ID del Carrusel:</label>
            <input type="text" value={id} style={carouselFormStyles.input} disabled />
          </div>
        )}
        <div style={carouselFormStyles.formGroup}>
          <label style={carouselFormStyles.label}>Título del Carrusel:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={carouselFormStyles.input}
            required
          />
        </div>

        <h3 style={{ marginTop: '25px', marginBottom: '15px' }}>Tarjetas del Carrusel</h3>
        <div style={carouselFormStyles.cardList}>
          {cards.length === 0 ? (
            <p>No hay tarjetas en este carrusel.</p>
          ) : (
            cards.map((card) => (
              <div key={card.id} style={carouselFormStyles.cardItem}>
                <span>{card.title} ({card.type})</span>
                <div>
                  <button type="button" onClick={() => handleEditCard(card)} style={{...carouselFormStyles.cardButton, ...carouselFormStyles.editButton}}>Editar</button>
                  <button type="button" onClick={() => handleDeleteCard(card.id)} style={{...carouselFormStyles.cardButton, ...carouselFormStyles.deleteButton}}>Eliminar</button>
                </div>
              </div>
            ))
          )}
        </div>
        <button type="button" onClick={handleAddCard} style={{...carouselFormStyles.addButton, marginBottom: '20px'}}>+ Agregar Nueva Tarjeta</button>

        <div style={carouselFormStyles.buttonGroup}>
          <button type="submit" style={{ ...carouselFormStyles.button, ...carouselFormStyles.saveButton }}>Guardar Carrusel</button>
          <button type="button" onClick={onCancel} style={{ ...carouselFormStyles.button, ...carouselFormStyles.cancelButton }}>Cancelar</button>
        </div>
      </form>

      {showCardForm && (
        <CardForm
          initialData={editingCard || undefined}
          onSave={handleCardSave}
          onCancel={handleCardCancel}
        />
      )}
    </div>
  );
};