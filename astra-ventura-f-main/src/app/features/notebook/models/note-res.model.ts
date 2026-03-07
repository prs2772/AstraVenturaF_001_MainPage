export interface NoteRes {
    id: string;
    title: string;
    content: string;
    topicAncestors: string[];
}

export interface SearchNoteRes {
    noteId: string;
    title: string;
    snippet: string;
    pathNames: string[];
}

