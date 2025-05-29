import { useState, useEffect } from 'react';
import '../styles/App.css';

const NotesApp = () => {
  const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem('notes')) || []);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const noteData = {
      id: editId || Date.now(),
      title,
      content,
      createdAt: editId ? notes.find(n => n.id === editId).createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes(editId 
      ? notes.map(note => note.id === editId ? noteData : note)
      : [noteData, ...notes]
    );

    setTitle('');
    setContent('');
    setEditId(null);
  };

  const filteredNotes = notes
    .filter(note => 
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  return (
    <div className="notes-app-container">
      <h1 className="notes-app-header">Notes App</h1>

      <div className="notes-app-controls">
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="notes-app-search"
        />
      </div>

      <form onSubmit={handleSubmit} className="notes-app-form">
        <input
          type="text"
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="notes-app-title"
          required
        />
        <textarea
          placeholder="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="notes-app-content"
        />
        
        <div className="notes-app-buttons">
          <button type="submit" className="notes-app-submit">
            {editId ? 'Update Note' : 'Add Note'}
          </button>
          {editId && (
            <button 
              type="button" 
              onClick={() => { setEditId(null); setTitle(''); setContent(''); }}
              className="notes-app-cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="notes-app-list">
        <h2 className="notes-app-list-header">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'Note' : 'Notes'}
        </h2>
        
        {filteredNotes.length === 0 ? (
          <p className="notes-app-empty">No notes found. Create your first note!</p>
        ) : (
          <div className="notes-app-notes">
            {filteredNotes.map(note => (
              <div 
                key={note.id}
                className={`notes-app-note ${editId === note.id ? 'notes-app-note-editing' : ''}`}
              >
                <div>
                  <h3 className="notes-app-note-title">{note.title}</h3>
                  <p className="notes-app-note-content">{note.content}</p>
                  <div className="notes-app-note-dates">
                    <span>Created: {new Date(note.createdAt).toLocaleString()}</span>
                    {note.createdAt !== note.updatedAt && (
                      <span> | Updated: {new Date(note.updatedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="notes-app-note-actions">
                  <button 
                    onClick={() => { setEditId(note.id); setTitle(note.title); setContent(note.content); }}
                    className="notes-app-edit"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                    className="notes-app-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesApp;