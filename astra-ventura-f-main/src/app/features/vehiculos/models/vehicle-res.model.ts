export interface CreateVehicleRes {
    brand: string;
    model: string;
    price: number;
    kmPerLiter: number;
}

export interface FleetAllocationResultReq {
    isPossible: boolean;
    totalVehiclesNeeded: number;
    vehicleBreakdown: Record<string, number>;
    detailedList: string[];
    averageFleetKmPerLiter: number;
}
