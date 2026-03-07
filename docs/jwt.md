# Jwt Funcionamiento

## Interceptor

El interceptor se encarga de interceptar las peticiones HTTP y agregar el token de acceso al header de la peticion.

Petición HTTP saliente
        │
        ▼
¿Tiene accessToken y NO es /auth?
        │
       SÍ → agrega header Authorization: Bearer <token>
        │
        ▼
¿Respuesta es 401?
        │
       SÍ → handle401Error()
              │
              ├── ¿Ya está refreshing?
              │       SÍ → espera en refreshTokenSubject hasta que llegue el nuevo token
              │            y reintenta la petición original
              │
              └── NO → llama refreshToken()
                            │
                            ├── OK  → guarda nuevo token, reintenta petición original
                            └── ERR → logout() y lanza error

### BehaviorSubject

Por ejemplo, si 5 peticiones fallan al mismo tiempo, solo s ehace 1 llamada al endpoint de /auth/refresh y las otras 4 esperan en cola.

## Guard

El guard se encarga de proteger las rutas y evitar que los usuarios accedan a ellas sin estar autenticados.

Obtiene las dependencias con inject(), verifica si está autenticado, si no lo está redirige al login.

## Service

El service se encarga de manejar la lógica de autenticación y autorización.

auth.service.ts maneja los endpoints de autenticación para registro, creación y refresco de tokens.
