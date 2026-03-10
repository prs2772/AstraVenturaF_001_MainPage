import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { apis } from '../../../../environments/apis.environment';

import { TopicRes } from '../models/topic-res.model';
import { CreateTopicReq } from '../models/topic-req.model';
import { NoteRes, SearchNoteRes } from '../models/note-res.model';
import { CreateNoteReq, UpdateNoteReq, SearchNotesReq } from '../models/note-req.model';

@Injectable({ providedIn: 'root' })
export class NotebookApiService {

    private base = apis.notebookApiUrl;

    constructor(private http: HttpClient) { }

    // ── Topics ──────────────────────────────────────────

    /** Root topics (parentId = null) */
    getTopics() {
        return this.http.get<TopicRes[]>(`${this.base}/topics`);
    }

    /** Subtopics of a given parent */
    getSubtopics(parentId: string) {
        const params = new HttpParams().set('parentId', parentId);
        return this.http.get<TopicRes[]>(`${this.base}/topics`, { params });
    }

    createTopic(req: CreateTopicReq) {
        return this.http.post<TopicRes>(`${this.base}/topics`, req);
    }

    deleteTopic(id: string) {
        return this.http.delete<void>(`${this.base}/topics/${id}`);
    }

    // ── Notes ───────────────────────────────────────────

    createNote(req: CreateNoteReq) {
        return this.http.post<NoteRes>(`${this.base}/notes`, req);
    }

    updateNote(id: string, req: UpdateNoteReq) {
        return this.http.put<NoteRes>(`${this.base}/notes/${id}`, req);
    }

    searchNotes(req: SearchNotesReq) {
        const params = new HttpParams()
            .set('topicId', req.topicId)
            .set('searchTerm', req.searchTerm);

        return this.http.get<SearchNoteRes[]>(`${this.base}/notes/search`, { params });
    }

}
