import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, FileText, Save, ChevronRight, Hash, Clock, Tag, MoreVertical, LayoutGrid, List, Check, X } from 'lucide-react';
import { format } from 'date-fns';

const Notes = () => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('lifetrack_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeNoteId, setActiveNoteId] = useState(notes.length > 0 ? notes[0].id : null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'grid' or 'list'

  useEffect(() => {
    localStorage.setItem('lifetrack_notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId) || null;

  const handleCreateNote = () => {
    const newNote = {
      id: Date.now(),
      title: '',
      content: '',
      date: new Date().toISOString(),
      tags: [],
      color: 'indigo'
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateActiveNote = (updates) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, ...updates, date: new Date().toISOString() } : n));
  };

  const deleteNote = (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      const remaining = notes.filter(n => n.id !== id);
      setNotes(remaining);
      if (activeNoteId === id) {
        setActiveNoteId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  const filteredNotes = notes.filter(n => 
    (n.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (n.content?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const colors = [
    { id: 'indigo', bg: 'bg-indigo-500', light: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600' },
    { id: 'rose', bg: 'bg-rose-500', light: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600' },
    { id: 'emerald', bg: 'bg-emerald-500', light: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
    { id: 'amber', bg: 'bg-amber-500', light: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' },
    { id: 'sky', bg: 'bg-sky-500', light: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-600' },
  ];

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-10rem)] flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Creative Notes</h2>
          <p className="text-slate-500 font-medium">Capture your thoughts, ideas, and inspirations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none w-64 transition-all"
            />
          </div>
          <button
            onClick={handleCreateNote}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95"
          >
            <Plus className="w-5 h-5" /> New Note
          </button>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">
        {/* Sidebar */}
        <div className="w-80 flex flex-col gap-4 min-h-0">
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note) => {
                const colorScheme = colors.find(c => c.id === note.color) || colors[0];
                return (
                  <motion.button
                    key={note.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => setActiveNoteId(note.id)}
                    className={`w-full text-left p-4 rounded-[2rem] border transition-all group relative overflow-hidden ${
                      activeNoteId === note.id 
                        ? `${colorScheme.light} ${colorScheme.border} shadow-sm ring-1 ring-inset ${colorScheme.text.replace('text', 'ring')}/20` 
                        : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2 relative z-10">
                      <h4 className={`font-bold text-sm truncate pr-4 ${activeNoteId === note.id ? colorScheme.text : 'text-slate-700'}`}>
                        {note.title || 'Untitled Note'}
                      </h4>
                      <div className={`w-2 h-2 rounded-full ${colorScheme.bg} shadow-sm`} />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-3 relative z-10 font-medium">
                      {note.content || 'Start writing something amazing...'}
                    </p>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-2 text-[10px] text-slate-300 font-black uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {format(new Date(note.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
            {filteredNotes.length === 0 && (
              <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <FileText className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold">No notes match your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 bg-white rounded-[3rem] border border-slate-200 shadow-sm flex flex-col overflow-hidden relative group/editor">
          {activeNote ? (
            <>
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5 p-1 bg-white rounded-xl border border-slate-200">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => updateActiveNote({ color: c.id })}
                        className={`w-6 h-6 rounded-lg transition-all ${c.bg} ${
                          activeNote.color === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110 shadow-sm' : 'opacity-40 hover:opacity-100'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="h-4 w-[1px] bg-slate-200" />
                  <span className="text-xs font-black text-slate-300 uppercase tracking-[0.2em]">
                    Drafting ID: {activeNote.id.toString().slice(-6)}
                  </span>
                </div>
                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                  title="Delete Note"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex flex-col p-10 gap-6 overflow-y-auto custom-scrollbar">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateActiveNote({ title: e.target.value })}
                  placeholder="The Spark of an Idea..."
                  className="w-full text-4xl font-black text-slate-900 border-none focus:ring-0 p-0 placeholder:text-slate-100 tracking-tight"
                />
                
                <div className="h-[2px] w-20 bg-indigo-500/20 rounded-full" />

                <textarea
                  value={activeNote.content}
                  onChange={(e) => updateActiveNote({ content: e.target.value })}
                  placeholder="Unleash your creativity here..."
                  className="flex-1 text-xl text-slate-600 leading-relaxed resize-none focus:ring-0 border-none placeholder:text-slate-100 p-0 font-medium"
                />
              </div>

              <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                  Last updated: {format(new Date(activeNote.date), 'MMMM d, h:mm a')}
                </p>
                <div className="flex gap-2">
                   {activeNote.content.length > 0 && (
                     <div className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                       {activeNote.content.split(/\s+/).filter(Boolean).length} Words
                     </div>
                   )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 bg-slate-50/20">
               <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center space-y-6"
               >
                 <div className="relative inline-block">
                    <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center border border-slate-100">
                      <FileText className="w-10 h-10 text-indigo-400" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                      <Plus className="w-5 h-5" />
                    </div>
                 </div>
                 <div>
                   <h3 className="text-xl font-black text-slate-900">Your Canvas is Empty</h3>
                   <p className="text-slate-400 text-sm mt-2 max-w-[240px] mx-auto leading-relaxed">
                     Select an existing thought or start a fresh journey with a new note.
                   </p>
                   <button 
                    onClick={handleCreateNote}
                    className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-[2rem] font-black text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest"
                   >
                     Create Masterpiece
                   </button>
                 </div>
               </motion.div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default Notes;
