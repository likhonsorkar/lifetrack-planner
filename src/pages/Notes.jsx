import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, FileText, Save, ChevronRight, Hash, Clock } from 'lucide-react';
import { format } from 'date-fns';

const Notes = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('lifetrack_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNoteId, setActiveNoteId] = useState(notes.length > 0 ? notes[0].id : null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('lifetrack_notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled Note',
      content: '',
      date: new Date().toISOString(),
      color: 'bg-white'
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateActiveNote = (updates) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, ...updates, date: new Date().toISOString() } : n));
  };

  const deleteNote = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this note?')) {
      const remaining = notes.filter(n => n.id !== id);
      setNotes(remaining);
      if (activeNoteId === id) {
        setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-12rem)] bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
      {/* Sidebar - Note List */}
      <div className="w-full lg:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-200 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              My Notes
            </h3>
            <button
              onClick={handleCreateNote}
              className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border-none rounded-xl text-xs focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.map((note) => (
            <button
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`w-full text-left p-3 rounded-2xl transition-all group relative ${
                activeNoteId === note.id 
                  ? 'bg-white shadow-md border border-slate-100 ring-1 ring-indigo-500/5' 
                  : 'hover:bg-slate-100 border border-transparent'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <p className={`font-bold text-sm truncate pr-4 ${activeNoteId === note.id ? 'text-indigo-600' : 'text-slate-700'}`}>
                  {note.title || 'Untitled'}
                </p>
                <button 
                  onClick={(e) => deleteNote(note.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded-md transition-opacity"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1 mb-2">{note.content || 'No content...'}</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-300 font-bold uppercase">
                <Clock className="w-3 h-3" />
                {format(new Date(note.date), 'MMM d')}
              </div>
              {activeNoteId === note.id && (
                <motion.div layoutId="active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
              )}
            </button>
          ))}
          {filteredNotes.length === 0 && (
             <div className="text-center py-8 px-4">
               <p className="text-xs text-slate-400">No notes found.</p>
             </div>
          )}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 flex flex-col bg-white">
        {activeNote ? (
          <>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
               <div className="flex-1">
                 <input
                   type="text"
                   value={activeNote.title}
                   onChange={(e) => updateActiveNote({ title: e.target.value })}
                   placeholder="Note Title"
                   className="w-full text-2xl font-black text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-200"
                 />
                 <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Hash className="w-3.5 h-3.5" /> ID: {activeNote.id.toString().slice(-6)}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                      <Clock className="w-3.5 h-3.5" /> {format(new Date(activeNote.date), 'MMMM d, h:mm a')}
                    </span>
                 </div>
               </div>
            </div>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateActiveNote({ content: e.target.value })}
              placeholder="Start writing..."
              className="flex-1 p-8 text-slate-700 leading-relaxed resize-none focus:ring-0 border-none placeholder:text-slate-200 text-lg"
            />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300 space-y-4">
             <div className="p-6 bg-slate-50 rounded-full">
               <FileText className="w-12 h-12" />
             </div>
             <div className="text-center">
               <p className="text-lg font-bold text-slate-400">No Note Selected</p>
               <p className="text-sm">Select a note from the list or create a new one.</p>
               <button 
                onClick={handleCreateNote}
                className="mt-6 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
               >
                 Create New Note
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
