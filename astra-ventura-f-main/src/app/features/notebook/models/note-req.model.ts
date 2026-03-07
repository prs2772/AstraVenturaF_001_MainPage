export interface CreateNoteReq {
    topicId: string;
    title: string;
    content: string;
}

export interface SearchNotesReq {
    topicId: string;
    searchTerm: string;
}

export interface Notebook {
    id: string;
    titulo: string;
    contenido: string;
    creadoEn: Date;
    usuarioId: string;
}
