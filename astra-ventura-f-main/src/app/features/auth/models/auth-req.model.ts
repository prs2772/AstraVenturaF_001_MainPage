export interface CredentialsReq {
    email: string;
    password: string;
}

export interface RefreshTokenReq {
    refreshToken: string;
}

export interface RegisterNewReq {
    email: string;
    password: string;
    nombre: string;
    apellidoPrincipal: string;
    apellidoSecundario: string;
}
