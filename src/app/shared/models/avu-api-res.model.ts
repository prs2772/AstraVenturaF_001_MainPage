export interface AvuApiRes<T> {
    data: T;
    message: string;
    success: boolean;
}
