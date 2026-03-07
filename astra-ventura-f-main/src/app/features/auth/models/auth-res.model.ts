export interface AuthRes {
    id: string;
    email: string;
    name: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
}
