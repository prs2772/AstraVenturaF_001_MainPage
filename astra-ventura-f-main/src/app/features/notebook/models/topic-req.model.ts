export interface CreateTopicReq {
    parentId: string;
    title: string;
}

export interface GetTopicsReq {
    parentId: string;
}

export interface DeleteTopicReq {
    id: string;
}
