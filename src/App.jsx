import React, { useState, useMemo, useEffect } from 'react';

// פונקציה שטוענת את הסרטים מהזיכרון או מחזירה את רשימת ברירת המחדל
const getSavedMovies = () => {
  const saved = localStorage.getItem('myMovies');
  if (saved) return JSON.parse(saved);
  return [
    { id: 1, name: "Inception", img: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg", desc: "A thief who steals corporate secrets through the use of dream-sharing technology.", ratings: [5, 4, 5] },
    { id: 2, name: "The Matrix", img: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg", desc: "A computer hacker learns from mysterious rebels about the true nature of his reality.", ratings: [5, 5, 4] },
    { id: 3, name: "Interstellar", img: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg", desc: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.", ratings: [5, 5, 5] }
  ];
};

export default function App() {
  const [movies, setMovies] = useState(getSavedMovies);
  const [page, setPage] = useState('home');
  const [currentId, setCurrentId] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [newMovie, setNewMovie] = useState({ name: '', desc: '', img: '' });
  const [deleteName, setDeleteName] = useState('');

  // בכל פעם שרשימת הסרטים משתנה (הוספה/מחיקה/דירוג), נשמור אותה בזיכרון
  useEffect(() => {
    localStorage.setItem('myMovies', JSON.stringify(movies));
  }, [movies]);

  const getAvg = (r) => r.length ? (r.reduce((a, b) => a + b, 0) / r.length).toFixed(1) : "0.0";
  const toTitleCase = (str) => str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  const topMovies = [...movies].sort((a, b) => getAvg(b.ratings) - getAvg(a.ratings)).slice(0, 3);
  const sortedSideMovies = useMemo(() => [...movies].sort((a, b) => a.name.localeCompare(b.name)), [movies]);
  const currentMovie = movies.find(m => m.id === currentId) || movies[0];

  const handleRating = (val) => {
    setMovies(movies.map(m => m.id === currentId ? { ...m, ratings: [...m.ratings, val] } : m));
  };

  return (
    <div className="min-h-screen bg-gray-400 font-sans text-right" dir="rtl">
      {/* Header */}
      <header className="bg-gray-400 py-6 border-b-2 border-black text-center">
        <h1 className="text-4xl font-bold text-black">Best Movie</h1>
      </header>

      {/* Navigation */}
      <nav className="bg-teal-300 border-b-2 border-black flex justify-center gap-6 py-4">
        {['home', 'delete', 'search', 'add'].map((p) => (
          <button key={p} onClick={() => {setPage(p); setSearchResults([]);}} className="bg-sky-400 hover:bg-sky-500 text-black px-12 py-2 rounded-full font-bold border-2 border-black shadow-md">
            {p === 'home' ? 'בית' : p === 'add' ? 'הוספה' : p === 'delete' ? 'מחיקה' : 'חיפוש'}
          </button>
        ))}
      </nav>

      {/* Top 3 Selection */}
      <div className="flex border-b-2 border-black">
        {topMovies.map((m, i) => (
          <div key={m.id} className="flex-1 h-32 bg-sky-400 flex items-center justify-center border-l border-black last:border-l-0 cursor-pointer font-bold hover:bg-sky-500" onClick={() => {setCurrentId(m.id); setPage('home');}}>
            Movie {i + 1}: {m.name}
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Right Side */}
        <aside className="w-full md:w-1/4 bg-gray-400 border-l-2 border-black p-4 order-last md:order-last">
          <h3 className="font-bold border-b border-black mb-4 text-center">All Movies</h3>
          {sortedSideMovies.map(m => (
            <div key={m.id} className="w-full h-16 bg-sky-400 border-2 border-black mb-2 flex items-center justify-center cursor-pointer font-bold hover:bg-sky-500" onClick={() => {setCurrentId(m.id); setPage('home');}}>
              {m.name}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-400 p-8 min-h-[600px]">
          {page === 'home' && (
            <div className="bg-blue-600 p-10 border-2 border-black text-white shadow-xl">
              <h2 className="text-xl font-bold mb-6">Movie Name: {currentMovie.name}</h2>
              <div className="flex flex-col md:flex-row gap-10">
                <img src={currentMovie.img} className="w-64 h-64 bg-sky-300 border-2 border-black object-cover" alt="movie" />
                <div className="flex-1 flex flex-col justify-between">
                   <p className="text-lg mb-8 italic">Description: {currentMovie.desc}</p>
                   <div className="bg-sky-300 text-black p-3 inline-flex gap-6 border-2 border-black items-center rounded-sm">
                    <div className="flex gap-4 font-bold">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button key={n} onClick={() => handleRating(n)} className="hover:scale-125 border-l border-black pl-4 last:border-0">{n}</button>
                      ))}
                    </div>
                    <span className="font-black text-xl ml-4">{getAvg(currentMovie.ratings)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {page === 'add' && (
            <div className="bg-sky-400 p-12 border-2 border-black text-center max-w-2xl mx-auto shadow-xl">
              <h2 className="text-2xl font-bold mb-8 italic underline">Add a new movie!</h2>
              <div className="flex flex-col items-center gap-4">
                <input className="w-80 p-3 border-2 border-black text-center font-bold" placeholder="Movie Name" onChange={e => setNewMovie({...newMovie, name: e.target.value})} />
                <input className="w-80 p-3 border-2 border-black text-center font-bold" placeholder="Movie picture url" onChange={e => setNewMovie({...newMovie, img: e.target.value})} />
                <div className="relative">
                  <textarea className="w-80 h-32 p-3 border-2 border-black text-center font-bold" placeholder="Description (English only)" maxLength="200" onChange={e => setNewMovie({...newMovie, desc: e.target.value})} />
                  <p className="text-xs text-red-700 font-bold mt-1">* מקסימום 200 תווים באנגלית</p>
                </div>
                <button className="w-40 h-40 rounded-full bg-white border-2 border-black font-bold text-lg shadow-xl hover:bg-gray-100" onClick={() => {
                  if (!/^[a-zA-Z\s.,!?-]+$/.test(newMovie.desc)) return alert("תיאור באנגלית בלבד.");
                  if (!newMovie.name) return alert("חובה להזין שם סרט.");
                  setMovies([...movies, { ...newMovie, name: toTitleCase(newMovie.name), id: Date.now(), ratings: [], img: newMovie.img || 'https://via.placeholder.com/150' }]);
                  alert("נוסף בהצלחה ונשמר בזיכרון!"); setPage('home');
                }}>Add Movie!</button>
              </div>
            </div>
          )}

          {page === 'search' && (
            <div className="flex flex-col md:flex-row gap-10">
              <div className="bg-blue-600 p-8 border-2 border-black flex-1 text-white shadow-lg">
                 <h2 className="font-bold text-xl mb-4 underline text-center">Preview</h2>
                 <h3 className="font-bold mb-2 italic">Movie Name: {currentMovie.name}</h3>
                 <img src={currentMovie.img} className="w-full h-64 bg-sky-300 border-2 border-black my-4 object-cover" alt="movie" />
                 <p className="text-sm italic">Description: {currentMovie.desc}</p>
              </div>
              <div className="w-full md:w-1/3 flex flex-col items-center gap-6 pt-10">
                <input className="w-full p-3 border-2 border-black bg-white text-center font-bold" placeholder="הקלד שם סרט לחיפוש" onChange={e => setSearchQuery(e.target.value)} />
                <button className="w-40 h-40 rounded-full bg-white border-2 border-black font-bold text-xl shadow-xl hover:bg-gray-100" onClick={() => {
                  const res = movies.filter(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
                  if (res.length === 0) alert("לא נמצא.");
                  else if (res.length === 1) { setCurrentId(res[0].id); setPage('home'); }
                  else setSearchResults(res);
                }}>חפש</button>
                {searchResults.length > 1 && (
                  <select className="w-full p-3 border-2 border-black mt-4 bg-white font-bold" onChange={e => { setCurrentId(Number(e.target.value)); setPage('home'); setSearchResults([]); }}>
                    <option>בחר מהתוצאות...</option>
                    {searchResults.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                )}
              </div>
            </div>
          )}

          {page === 'delete' && (
            <div className="bg-sky-400 p-16 border-2 border-black text-center max-w-xl mx-auto shadow-xl">
              <h2 className="text-2xl font-bold mb-10 italic underline">Delete a movie :(</h2>
              <input className="w-72 p-3 border-2 border-black mb-10 text-center font-bold" placeholder="Movie Name" onChange={e => setDeleteName(e.target.value)} />
              <button className="block mx-auto w-40 h-40 rounded-full bg-white border-2 border-black font-bold text-xl shadow-xl hover:bg-red-200" onClick={() => {
                const found = movies.find(m => m.name.toLowerCase() === deleteName.toLowerCase());
                if (found) { setMovies(movies.filter(m => m.id !== found.id)); alert("נמחק מהזיכרון."); setPage('home'); }
                else alert("לא נמצא סרט בשם המדויק.");
              }}>Delete</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}