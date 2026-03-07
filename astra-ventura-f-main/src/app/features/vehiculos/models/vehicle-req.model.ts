export interface CreateVehicleReq {
    vin: string;
    brand: string;
    model: string;
    year: number;
    price: number;
    passengerCapacity: number;
    kmPerLiter: number;
}

export interface FleetReq {
    totalPassengers: number;
}
