import { JwtInterceptor } from "./core/interceptors/jwt.interceptor";

import { HTTP_INTERCEPTORS } from '@angular/common/http';

providers: [
    {
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
    }
]