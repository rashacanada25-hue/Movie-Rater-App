import React, { useState, useEffect } from 'react';

export default function App() {
  const [movies, setMovies] = useState([
    { id: 1, name: "Inception", img: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg", desc: "A dream within a dream.", ratings: [5, 4] },
    { id: 2, name: "The Matrix", img: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg", desc: "Reality is a simulation.", ratings: [5, 5] },
    { id: 3, name: "Avatar", img: "https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNTA3N2FlYTlhXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg", desc: "Pandora adventure.", ratings: [3, 4] },
    { id: 4, name: "Interstellar", img: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg", desc: "Space exploration.", ratings: [5] },
    { id: 5, name: "The Godfather", img: "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg", desc: "Mafia family drama.", ratings: [4] }
  ]);

  const [page, setPage] = useState('home');
  const [currentId, setCurrentId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [deleteInput, setDeleteInput] = useState('');
  const [newMovie, setNewMovie] = useState({ name: '', desc: '', img: '' });
  const [randomMovies, setRandomMovies] = useState([]);

  const calculateAvg = (r) => r.length ? (r.reduce((a, b) => a + b, 0) / r.length).toFixed(1) : "0.0";
  const toTitleCase = (str) => str.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Top 3 rated for the header boxes
  const top3 = [...movies].sort((a, b) => calculateAvg(b.ratings) - calculateAvg(a.ratings)).slice(0, 3);
  
  // Sidebar: 5 random movies sorted A-Z
  useEffect(() => {
    const shuffled = [...movies].sort(() => 0.5 - Math.random()).slice(0, 5);
    const sorted = shuffled.sort((a, b) => a.name.localeCompare(b.name));
    setRandomMovies(sorted);
  }, [movies.length, page]);

  const handleSearch = () => {
    const matches = movies.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    if (matches.length === 0) return alert("אין סרט כזה!");
    if (matches.length === 1) {
      setCurrentId(matches[0].id);
      setPage('home');
      setSearchResults([]);
    } else {
      setSearchResults(matches);
    }
  };

  const styles = {
    container: { backgroundColor: '#C0C0C0', minHeight: '100vh', fontFamily: 'Arial' },
    nav: { backgroundColor: '#7FFFD4', padding: '15px', display: 'flex', justifyContent: 'center', gap: '20px', borderTop: '2px solid black', borderBottom: '2px solid black' },
    navBtn: { backgroundColor: '#87CEEB', padding: '8px 30px', borderRadius: '20px', border: '1px solid gray', cursor: 'pointer', fontWeight: 'bold' },
    topDisplay: { display: 'flex', justifyContent: 'center', gap: '25px', padding: '20px' },
    movieBox: { width: '150px', height: '110px', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', border: '2px solid black', cursor: 'pointer', textShadow: '2px 2px 4px black', textAlign: 'center' },
    mainWrapper: { display: 'flex', maxWidth: '1200px', margin: '0 auto', border: '2px solid black', minHeight: '550px' },
    content: { flex: 3, backgroundColor: '#6A5ACD', padding: '40px', color: 'white' },
    sidebar: { flex: 1, backgroundColor: '#C0C0C0', borderLeft: '2px solid black', padding: '15px' },
    circleBtn: { width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'white', border: '2px solid black', cursor: 'pointer', fontWeight: 'bold', fontSize: '18px', color: 'black' },
    input: { padding: '10px', width: '280px', marginBottom: '10px', color: 'black', textAlign: 'right', border: '1px solid black' }
  };

  const currentMovie = movies.find(m => m.id === currentId) || movies[0];

  return (
    <div style={styles.container}>
      <h1 style={{ textAlign: 'center', margin: '20px', fontSize: '40px' }}>Best Movie</h1>
      
      <nav style={styles.nav}>
        {['בית', 'מחיקה', 'חיפוש', 'הוספה'].reverse().map((item, i) => (
          <button key={i} style={styles.navBtn} onClick={() => setPage(['add', 'search', 'delete', 'home'][i])}>{item}</button>
        ))}
      </nav>

      {/* Top 3 rated display boxes */}
      <div style={styles.topDisplay}>
        {top3.map((m, idx) => (
          <div key={m.id} style={{ ...styles.movieBox, backgroundImage: `url(${m.img})` }} onClick={() => {setCurrentId(m.id); setPage('home');}}>
            Movie {idx + 1}
          </div>
        ))}
      </div>

      <div style={styles.mainWrapper}>
        <main style={styles.content}>
          
          {/* Home Page */}
          {page === 'home' && (
            <div dir="ltr">
              <h2>Movie Name: {currentMovie.name}</h2>
              <div style={{ display: 'flex', gap: '30px', marginTop: '20px' }}>
                <img src={currentMovie.img} style={{ width: '220px', height: '320px', border: '2px solid white' }} alt="movie" />
                <div>
                  <p style={{ fontSize: '18px' }}>{currentMovie.desc}</p>
                  <div style={{ marginTop: '50px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <strong>Rating: </strong>
                    {[1, 2, 3, 4, 5].map(num => (
                      <button key={num} onClick={() => {
                        setMovies(movies.map(m => m.id === currentId ? { ...m, ratings: [...m.ratings, num] } : m));
                      }} style={{ padding: '5px 10px', cursor: 'pointer' }}>{num}</button>
                    ))}
                    <span style={{ backgroundColor: '#87CEEB', padding: '5px 15px', color: 'black', fontWeight: 'bold' }}>
                      {calculateAvg(currentMovie.ratings)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search Page - Fixed Alignment */}
          {page === 'search' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }} dir="rtl">
              <label style={{ marginBottom: '5px' }}>שם הסרט...</label>
              <input style={styles.input} placeholder="הקלד כאן..." onChange={e => setSearchQuery(e.target.value)} />
              <button style={styles.circleBtn} onClick={handleSearch}>חפש</button>
              
              {searchResults.length > 1 && (
                <div style={{ marginTop: '30px', textAlign: 'right', width: '100%' }}>
                  <p>נמצאו מספר תוצאות, בחר אחת:</p>
                  <select style={{...styles.input, width: '300px'}} onChange={e => { setCurrentId(Number(e.target.value)); setPage('home'); setSearchResults([]); }}>
                    <option value="">-- בחר סרט מהרשימה --</option>
                    {searchResults.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Delete Page - Based on Sketch */}
          {page === 'delete' && (
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }} dir="rtl">
              <div style={{ backgroundColor: '#87CEEB', padding: '50px', borderRadius: '10px', border: '2px solid black', textAlign: 'center', width: '80%' }}>
                <h2 style={{ color: 'black', marginBottom: '20px' }}>Delete a movie :(</h2>
                <input style={{ ...styles.input, margin: '10px auto', display: 'block', textAlign: 'center' }} placeholder="Movie Name" value={deleteInput} onChange={e => setDeleteInput(e.target.value)} />
                <button style={styles.circleBtn} onClick={() => {
                  const found = movies.find(m => m.name.toLowerCase() === deleteInput.trim().toLowerCase());
                  if (found) {
                    setMovies(movies.filter(m => m.id !== found.id));
                    alert("הסרט נמחק בהצלחה!");
                    setDeleteInput('');
                    setPage('home');
                  } else alert("לא נמצא סרט כזה! (יש להזין שם מלא)");
                }}>Delete</button>
              </div>
            </div>
          )}

          {/* Add Page - English & 200 chars logic */}
          {page === 'add' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
              <button style={styles.circleBtn} onClick={() => {
                const engRegex = /^[a-zA-Z0-9\s.,!?-]+$/;
                if (!engRegex.test(newMovie.name) || !engRegex.test(newMovie.desc)) {
                  return alert("חובה להשתמש באנגלית בלבד!");
                }
                if (newMovie.desc.length > 200) {
                  return alert("התיאור מוגבל ל-200 תווים!");
                }
                if (!newMovie.name || !newMovie.img) return alert("אנא מלא את כל השדות");

                setMovies([...movies, { ...newMovie, name: toTitleCase(newMovie.name), id: Date.now(), ratings: [] }]);
                alert("הסרט נוסף!");
                setPage('home');
              }}>Add Movie!</button>
              
              <div style={{ textAlign: 'left' }}>
                <h3 style={{ marginBottom: '15px' }}>Add New Movie</h3>
                <input style={styles.input} placeholder="Movie Name" onChange={e => setNewMovie({ ...newMovie, name: e.target.value })} />
                <input style={styles.input} placeholder="Image URL" onChange={e => setNewMovie({ ...newMovie, img: e.target.value })} />
                <textarea 
                  style={{ ...styles.input, height: '120px' }} 
                  placeholder="Description (English, max 200 chars)" 
                  onChange={e => setNewMovie({ ...newMovie, desc: e.target.value })} 
                />
              </div>
            </div>
          )}

        </main>

        {/* Sidebar */}
        <aside style={styles.sidebar}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#444' }}>Random Movies</h3>
          {randomMovies.map(m => (
            <div key={m.id} style={{ ...styles.movieBox, width: '100%', marginBottom: '15px', backgroundImage: `url(${m.img})` }} onClick={() => {setCurrentId(m.id); setPage('home');}}>
              {m.name}
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
