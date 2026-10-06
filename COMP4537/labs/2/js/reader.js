//<!-- Note: Use of ChatGPT - Codex: assisted with drafting and revising this Lab 1 assignment. -->
class ReaderApp { 
    constructor() {
        this.storage = new NoteStorage("notes");
        this.noteContainer = document.getElementById("note-container");
        this.updatedTimeElement = document.getElementById("updated-time");
    }

    start() {
        this.retrieveNotes();
        setInterval(() => this.retrieveNotes(), 2000);
    }

    retrieveNotes() {
        const notes = this.storage.loadNotes();
        this.renderNotes(notes);
        this.displayUpdatedTime();
    }

    createNoteElement(note) {
        const noteElement = document.createElement("div");
        noteElement.classList.add("reader-note");
        noteElement.textContent = note.content;
        return noteElement;
    }

    renderNotes(notes) {
        this.noteContainer.replaceChildren();
        notes.forEach((note) => {
            const noteElement = this.createNoteElement(note);
            this.noteContainer.append(noteElement);
        });
    }

    displayUpdatedTime() {
        const currentTime = new Date().toLocaleTimeString();
        this.updatedTimeElement.textContent = `${USER_MESSAGES.updatedAt}: ${currentTime}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const app = new ReaderApp();
    app.start();
});
