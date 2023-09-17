import crypto from "crypto";
import FinishRideService from "../src/FinishRideService";
import PositionRepository from "../src/PositionRepository";
import RideRepository from "../src/RideRepository";
import { createTestPosition, createTestRide, getTestCoordinates } from "./TestHelpers";

describe("FinishRideService", () => {

    test("should finish the ride and calculate the fare", async () => {
        // Arrange
        const rideId = crypto.randomUUID();
        const rideRepository = new RideRepository();
        await rideRepository.addRide(createTestRide({ rideId, status: "in_progress" }));
        const positionRepository = new PositionRepository();
        for (const { lat, long } of getTestCoordinates()) {
            await positionRepository.addPosition(createTestPosition({ rideId, lat, long }));
        }
        // Act
        const service = new FinishRideService(rideRepository, positionRepository);
        await service.finishRide(rideId);
        // Assert
        const ride = await rideRepository.getRide(rideId);
        expect(ride.status).toBe("completed");
        expect(ride.distance).toBe(6.8);
        expect(ride.fare).toBe(14.28);
    });

    test("should validate if the ride is in progress", async () => {
        // Arrange
        const rideId = crypto.randomUUID();
        const rideRepository = new RideRepository();
        await rideRepository.addRide(createTestRide({ rideId, status: "completed" }));
        // Act
        const service = new FinishRideService(rideRepository, new PositionRepository());
        await expect(() => service.finishRide(rideId)).rejects.toThrow(new Error("Ride is not in progress"));
    });
});
