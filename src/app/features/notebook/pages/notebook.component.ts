import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotebookApiService } from '../services/notebook-api.service';
import { TopicRes } from '../models/topic-res.model';
import { NoteRes, SearchNoteRes } from '../models/note-res.model';

interface TopicNode extends TopicRes {
    children: TopicNode[];
    expanded: boolean;
    loadingChildren: boolean;
}

@Component({
    standalone: true,
    selector: 'app-notebook',
    imports: [CommonModule, FormsModule],
    templateUrl: './notebook.component.html',
    styleUrls: ['./notebook.component.scss']
})
export class NotebookComponent implements OnInit {

    // ── State ─────────────────────────────────────────
    topics: TopicNode[] = [];
    loadingTopics = false;

    selectedTopic: TopicNode | null = null;
    notes: NoteRes[] = [];
    loadingNotes = false;

    searchTerm = '';
    searchResults: SearchNoteRes[] | null = null;
    searching = false;

    // Create topic
    showCreateTopic = false;
    newTopicName = '';
    creatingTopic = false;

    // Create subtopic
    subtopicParentId: string | null = null;
    newSubtopicName = '';
    creatingSubtopic = false;

    // Create / edit note
    showNoteEditor = false;
    editingNote: NoteRes | null = null;
    noteTitle = '';
    noteContent = '';
    savingNote = false;

    error: string | null = null;

    constructor(private api: NotebookApiService) { }

    ngOnInit() {
        this.loadRootTopics();
    }

    // ── Topics ────────────────────────────────────────

    loadRootTopics() {
        this.loadingTopics = true;
        this.error = null;
        this.api.getTopics().subscribe({
            next: data => {
                this.topics = data.map(t => ({ ...t, children: [], expanded: false, loadingChildren: false }));
                this.loadingTopics = false;
            },
            error: () => {
                this.error = 'Failed to load topics.';
                this.loadingTopics = false;
            }
        });
    }

    toggleTopic(topic: TopicNode) {
        if (topic.expanded) {
            topic.expanded = false;
            return;
        }
        topic.expanded = true;
        if (topic.children.length === 0) {
            topic.loadingChildren = true;
            this.api.getSubtopics(topic.id).subscribe({
                next: data => {
                    topic.children = data.map(t => ({ ...t, children: [], expanded: false, loadingChildren: false }));
                    topic.loadingChildren = false;
                },
                error: () => { topic.loadingChildren = false; }
            });
        }
    }

    selectTopic(topic: TopicNode, event: Event) {
        event.stopPropagation();
        this.selectedTopic = topic;
        this.searchResults = null;
        this.searchTerm = '';
        this.closeNoteEditor();
        this.loadNotes(topic.id);
    }

    createRootTopic() {
        if (!this.newTopicName.trim()) return;
        this.creatingTopic = true;
        this.api.createTopic({ name: this.newTopicName.trim(), parentId: null }).subscribe({
            next: res => {
                this.topics.push({ ...res, children: [], expanded: false, loadingChildren: false });
                this.newTopicName = '';
                this.showCreateTopic = false;
                this.creatingTopic = false;
            },
            error: () => { this.creatingTopic = false; }
        });
    }

    startCreateSubtopic(topicId: string, event: Event) {
        event.stopPropagation();
        this.subtopicParentId = topicId;
        this.newSubtopicName = '';
    }

    createSubtopic(parent: TopicNode) {
        if (!this.newSubtopicName.trim()) return;
        this.creatingSubtopic = true;
        this.api.createTopic({ name: this.newSubtopicName.trim(), parentId: parent.id }).subscribe({
            next: res => {
                parent.children.push({ ...res, children: [], expanded: false, loadingChildren: false });
                parent.expanded = true;
                this.subtopicParentId = null;
                this.newSubtopicName = '';
                this.creatingSubtopic = false;
            },
            error: () => { this.creatingSubtopic = false; }
        });
    }

    cancelCreateSubtopic() {
        this.subtopicParentId = null;
        this.newSubtopicName = '';
    }

    deleteTopic(topic: TopicNode, event: Event) {
        event.stopPropagation();
        if (!confirm(`Delete "${topic.name}" and all its subtopics and notes?`)) return;

        this.api.deleteTopic(topic.id).subscribe({
            next: () => {
                this.removeTopic(this.topics, topic.id);
                if (this.selectedTopic?.id === topic.id) {
                    this.selectedTopic = null;
                    this.notes = [];
                }
            }
        });
    }

    private removeTopic(list: TopicNode[], id: string) {
        const idx = list.findIndex(t => t.id === id);
        if (idx >= 0) { list.splice(idx, 1); return; }
        for (const t of list) { this.removeTopic(t.children, id); }
    }

    // ── Notes ─────────────────────────────────────────

    loadNotes(topicId: string) {
        this.loadingNotes = true;
        this.api.searchNotes({ topicId, searchTerm: '' }).subscribe({
            next: data => {
                this.notes = data.map(d => ({
                    id: d.noteId,
                    title: d.title,
                    content: d.snippet,
                    topicAncestors: d.pathNames
                }));
                this.loadingNotes = false;
            },
            error: () => { this.loadingNotes = false; }
        });
    }

    // ── Search ────────────────────────────────────────

    onSearch() {
        if (!this.selectedTopic || !this.searchTerm.trim()) {
            this.searchResults = null;
            return;
        }
        this.searching = true;
        this.api.searchNotes({ topicId: this.selectedTopic.id, searchTerm: this.searchTerm.trim() }).subscribe({
            next: data => { this.searchResults = data; this.searching = false; },
            error: () => { this.searching = false; }
        });
    }

    clearSearch() {
        this.searchTerm = '';
        this.searchResults = null;
    }

    // ── Note Editor ───────────────────────────────────

    openNewNote() {
        this.editingNote = null;
        this.noteTitle = '';
        this.noteContent = '';
        this.showNoteEditor = true;
    }

    openEditNote(note: NoteRes) {
        this.editingNote = note;
        this.noteTitle = note.title;
        this.noteContent = note.content;
        this.showNoteEditor = true;
    }

    closeNoteEditor() {
        this.showNoteEditor = false;
        this.editingNote = null;
        this.noteTitle = '';
        this.noteContent = '';
    }

    saveNote() {
        if (!this.noteTitle.trim() || !this.selectedTopic) return;
        this.savingNote = true;

        if (this.editingNote) {
            this.api.updateNote(this.editingNote.id, {
                noteId: this.editingNote.id,
                title: this.noteTitle.trim(),
                content: this.noteContent.trim()
            }).subscribe({
                next: () => {
                    this.savingNote = false;
                    this.closeNoteEditor();
                    this.loadNotes(this.selectedTopic!.id);
                },
                error: () => { this.savingNote = false; }
            });
        } else {
            this.api.createNote({
                topicId: this.selectedTopic.id,
                title: this.noteTitle.trim(),
                content: this.noteContent.trim()
            }).subscribe({
                next: () => {
                    this.savingNote = false;
                    this.closeNoteEditor();
                    this.loadNotes(this.selectedTopic!.id);
                },
                error: () => { this.savingNote = false; }
            });
        }
    }
}
