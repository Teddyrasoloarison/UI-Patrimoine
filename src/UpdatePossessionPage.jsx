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
        console.log('Fetching possession for libelle:', libelle);
        const response = await fetch(`${urlBackend}/api/possession/${libelle}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched possession data:', data);
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
  }, [libelle]);

  /*const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      console.log('Mise à jour avec les données :', {
        valeur,
        dateFin
      });

      const response = await fetch(`http://localhost:3001/api/possession/${libelle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valeur,
          dateFin
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log('Update response:', data);
      setSuccessMessage('Possession mise à jour avec succès!');
      navigate('/possession'); // Redirect to the list of possessions
    } catch (error) {
      setError(error.message);
      console.error('Erreur dans handleUpdate:', error); // Affiche l'erreur
    } finally {
      setLoading(false);
    }
  };*/
  const handleUpdate = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
  
    try {
      const formattedDateFin = new Date(dateFin).toISOString(); // Formatage de la date
  
      const response = await fetch(`${urlBackend}/api/possession/${libelle}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          libelle,
          valeur,
          dateFin: formattedDateFin, 
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Network response was not ok: ${errorData.message || 'Unknown error'}`);
      }
  
      const data = await response.json();
      setSuccessMessage('Possession mise à jour avec succès!');
      navigate('/possession'); // Redirect to the list of possessions
    } catch (error) {
      setError(error.message);
      console.error('Erreur dans handleUpdate:', error);
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
        {/*<div className="form-group">
          <label htmlFor="valeur">Valeur</label>
          <input
            type="number"
            id="valeur"
            value={valeur}
            disabled
          />
        </div>*/}
        {/*<div className="form-group">
          <label htmlFor="dateFin">Date Fin</label>
          <input
            type="date"
            id="dateFin"
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
          />
        </div>*/}
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
