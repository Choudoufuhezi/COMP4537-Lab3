//<!-- Note: Use of ChatGPT - Codex: assisted with drafting and revising this Lab 1 assignment. -->
class WriterApp {
    constructor() {
        this.storage = new NoteStorage("notes");
        this.notes = this.storage.loadNotes();
        this.hasUnsavedChanges = false;
        this.noteContainer = document.getElementById("note-container");
        this.addButton = document.getElementById("add-button");
        this.savedTimeElement = document.getElementById("saved-time");
    }

    start() {
        this.addButton.textContent = USER_MESSAGES.add;
        this.addButton.addEventListener("click", () => this.addNote());
        this.displaySavedTime(this.storage.loadSavedTime());
        this.renderNotes();
        setInterval(() => this.saveNotes(), 2000);
        window.addEventListener("beforeunload", () => this.saveNotes());
    }

    addNote() {
        const newNote = new Note();
        this.notes.push(newNote);
        this.hasUnsavedChanges = true;
        this.renderNotes();
        const textarea = this.noteContainer.querySelectorAll("textarea");
        textarea[textarea.length - 1]?.focus();
    }

    updateNote(noteId, newContent) {
        const note = this.notes.find((currentNote) => currentNote.id === noteId);
        if (note !== undefined) {
            note.content = newContent;
            this.hasUnsavedChanges = true;
        }
    }

    removeNote(noteId) {
        this.notes = this.notes.filter((note) => note.id !== noteId);
        this.hasUnsavedChanges = true;
        this.renderNotes();
        this.saveNotes();
    }

    saveNotes() {
        if (!this.hasUnsavedChanges) {
            return;
        }

        const savedTime = this.storage.saveNotes(this.notes);
        this.displaySavedTime(savedTime);
        this.hasUnsavedChanges = false;
    }

    displaySavedTime(savedTime) {
        if (savedTime === null) {
            this.savedTimeElement.textContent = USER_MESSAGES.notSavedYet;
            return;
        }

        this.savedTimeElement.textContent = `${USER_MESSAGES.storedAt}: ${savedTime}`;
    }
    
    createNoteElement(note) {
        const noteElement = document.createElement("div");
        noteElement.classList.add("note-row");

        const textarea = document.createElement("textarea");
        textarea.value = note.content;
        textarea.setAttribute("aria-label", "Note");

        textarea.addEventListener("input", () => {this.updateNote(note.id, textarea.value)});
        
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.classList.add("remove-button");
        removeButton.textContent = USER_MESSAGES.remove;
        removeButton.addEventListener("click", () => {this.removeNote(note.id)});

        noteElement.append(textarea, removeButton);
        return noteElement;
    }

    renderNotes() {
        this.noteContainer.replaceChildren();
        this.notes.forEach((note) => {
            const noteElement = this.createNoteElement(note);
            this.noteContainer.append(noteElement);
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new WriterApp();
    app.start();
});
