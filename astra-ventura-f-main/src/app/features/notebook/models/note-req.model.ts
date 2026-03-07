export interface CreateNoteReq {
    topicId: string;
    title: string;
    content: string;
}

export interface SearchNotesReq {
    topicId: string;
    searchTerm: string;
}
