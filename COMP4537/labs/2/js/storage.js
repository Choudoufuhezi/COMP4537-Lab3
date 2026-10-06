//<!-- Note: Use of ChatGPT - Codex: assisted with drafting and revising this Lab 1 assignment. -->
class Note {
    constructor(content = "", id = null) {
        this.id = id ?? `${Date.now()}-${Math.random()}`;
        this.content = content;
    }
}

class NoteStorage {
    constructor(key) {
        this.key = key;
        this.savedTimeKey = `${key}-saved-time`;
    }

    loadNotes() {
        const storedData = localStorage.getItem(this.key);

        if (storedData === null) {
            return [];
        }

        try {
            const parsedData = JSON.parse(storedData);

            if (!Array.isArray(parsedData)) {
                return [];
            }

            return parsedData.map((note) => new Note(note.content, note.id));
        } catch (error) {
            console.error("Error parsing stored data:", error);
            return [];
        }
    }

    saveNotes(notes) {
        const jsonData = JSON.stringify(notes);
        localStorage.setItem(this.key, jsonData);
        
        const savedTime = new Date().toLocaleString();
        localStorage.setItem(this.savedTimeKey, savedTime);

        return savedTime;
    }

    loadSavedTime() {
        return localStorage.getItem(this.savedTimeKey);
    }
}
