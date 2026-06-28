export interface Note {
    id: number;
    text: string;
}

const store = new Map<number, Note[]>();
let nextId = 1;

export function getNotes(userId: number): Note[] {
    return store.get(userId) ?? [];
}

export function addNote(userId: number, text: string): Note {
    const note: Note = { id: nextId++, text };
    const notes = getNotes(userId);
    notes.push(note);
    store.set(userId, notes);
    return note;
}

export function deleteNote(userId: number, id: number): void {
    const notes = getNotes(userId);
    const filteredNotes = notes.filter(n => n.id !== id);
    store.set(userId, filteredNotes);
}