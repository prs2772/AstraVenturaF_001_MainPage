import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apis } from '../../../../environments/apis.environment';

import { CreateVehicleReq, FleetReq } from '../models/vehicle-req.model';
import { CreateVehicleRes, FleetAllocationResultRes } from '../models/vehicle-res.model';

@Injectable({ providedIn: 'root' })
export class VehiculosApiService {

    private base = apis.vehiculosApiUrl;

    constructor(private http: HttpClient) { }

    // Vehicles
    getVehicles() {
        return this.http.get<CreateVehicleRes[]>(`${this.base}/vehicles`);
    }

    createVehicle(req: CreateVehicleReq) {
        return this.http.post<CreateVehicleRes>(`${this.base}/vehicles`, req);
    }

    getExternalModels(make: string) {
        return this.http.get<any[]>(`${this.base}/vehicles/external-models/${make}`);
    }

    // Fleet
    optimizeSimple(req: FleetReq) {
        return this.http.post<FleetAllocationResultRes>(`${this.base}/fleet/simple`, req);
    }

    optimizeAdvanced(req: FleetReq) {
        return this.http.post<FleetAllocationResultRes>(`${this.base}/fleet/optimized`, req);
    }

}
