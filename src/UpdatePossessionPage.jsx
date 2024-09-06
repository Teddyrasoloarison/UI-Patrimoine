import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UpdatePossessionPage = () => {
  const { libelle: libelleFromParams } = useParams();
  const navigate = useNavigate();
  const [libelle, setLibelle] = useState(libelleFromParams);
  const [currentPossession, setCurrentPossession] = useState(null);
  const [valeur, setValeur] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [error, setError] = useState(null);
  const urlBackend = 'https://examen2-web2-patrimoine.onrender.com';

  useEffect(() => {
    const fetchPossession = async () => {
      try {
        const response = await fetch(`${urlBackend}/api/possession/${libelleFromParams}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCurrentPossession(data);
        setValeur(data.valeur);
        setDateFin(data.dateFin || '');
        setLibelle(data.libelle);
      } catch (error) {
        setError(error.message);
        console.error('Erreur lors de la récupération des données:', error);
      }
    };
    fetchPossession();
  }, [libelleFromParams]);

  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${urlBackend}/api/possession/${libelleFromParams}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nouveauLibelle: libelle, // Envoi du nouveau libellé au backend
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Unknown error');
      }

      const data = await response.json();
      setSuccessMessage('Possession mise à jour avec succès!');
      navigate('/possession'); // Rediriger après la mise à jour
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Update Possession</h1>
      {currentPossession ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdate();
          }}
        >
          <div className="form-group">
            <label htmlFor="libelle">Libellé</label>
            <input
              type="text"
              id="libelle"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </button>
        </form>
      ) : (
        <p>Loading...</p>
      )}

      {successMessage && <p>{successMessage}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default UpdatePossessionPage;
