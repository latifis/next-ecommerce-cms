export interface FetchParams {
    page?: number;
    limit?: number;
    search?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
    mediaType?: string;
}