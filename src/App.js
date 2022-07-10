import { useState, useEffect } from 'react';
import axios from 'axios';
import Note from './components/Note';
import noteService from './services/note';

const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(true);

  const hook = () => {
    noteService.getAll()
      .then(response => {
        setNotes(response.data);
      });
  };
  useEffect(hook, []);

  const addNote = (event) => {
    event.preventDefault();
    const newNoteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() < 0.5,
      id: notes.length + 1
    };

    noteService.create({ newNoteObject })
      .then(response => {
        setNotes(notes.concat(response.data));
        setNewNote('');
      });
  };

  const handleNoteChange = (event) => {
    setNewNote(event.target.value);
  };

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id);
    const changedNote = { ...note, important: !note.important};

    noteService.update({ id, changedNote })
      .then(response => {
        setNotes(notes.map(note => note.id !== id ? note : response.data));
      });
  };

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important);

  return (
    <div>
      <h2>Notes App</h2>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          placeholder="a new note..."
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
