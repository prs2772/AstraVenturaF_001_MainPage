// src/app/shared/utils/auth.mapper.ts
import { AuthRes } from '../../../features/auth/models/auth-res.model';
import { PersonIdentity } from '../../../shared/models/person-identity';

// Mapea de mi respuesta de Auth hacia mi identidad de usuario
export class AuthMapper {
    static toPersonIdentity(authRes: AuthRes): PersonIdentity {
        const nameParts = authRes.name ? authRes.name.trim().split(' ') : [];

        let nombre = '';
        let apellidoPrincipal = '';
        let apellidoSecundario = '';

        if (nameParts.length === 1) {
            nombre = nameParts[0];
        } else if (nameParts.length === 2) {
            nombre = nameParts[0];
            apellidoPrincipal = nameParts[1];
        } else if (nameParts.length >= 3) {
            // Si tiene más de 2 palabras, asume que el primer nombre puede ser compuesto o toma los últimos dos como apellidos
            // Por ahora se quedará así, pero en un futuro, para probar la escalabilidad, lo cambiaré, cuando se requiera, simulando un caso real de cambio de lógica.
            nombre = nameParts.slice(0, nameParts.length - 2).join(' ');
            apellidoPrincipal = nameParts[nameParts.length - 2];
            apellidoSecundario = nameParts[nameParts.length - 1];
        }

        return {
            id: authRes.id,
            email: authRes.email,
            nombre: nombre,
            apellidoPrincipal: apellidoPrincipal,
            apellidoSecundario: apellidoSecundario
        };
    }
}
