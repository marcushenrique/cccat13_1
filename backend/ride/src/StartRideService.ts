import RideRepository from "./RideRepository";

export default class StartRideService {

    constructor(private readonly rideRepository: RideRepository) {
    }

    async startRide(rideId: string) {
        const ride = await this.rideRepository.getById(rideId);
        if (ride.status !== "accepted") {
            throw new Error("Ride is not accepted");
        }
        ride.status = "in_progress";
        await this.rideRepository.update(ride);
    }
}