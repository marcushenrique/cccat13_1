import crypto from "crypto";
import PositionRepository from "../src/PositionRepository";
import RideRepository from "../src/RideRepository";
import UpdatePositionService from "../src/UpdatePositionService";
import { createTestRide } from "./TestHelpers";

describe("UpdatePositionService", () => {

    test("should update position", async () => {
        // Arrange
        const input = { rideId: crypto.randomUUID(), lat: -23.5228307, long: -46.6972663 };
        const rideRepository = new RideRepository();
        await rideRepository.addRide(createTestRide({ rideId: input.rideId, status: "in_progress" }))
        const positionRepository = new PositionRepository();
        // Act
        const service = new UpdatePositionService(rideRepository, positionRepository);
        const positionId = await service.updatePosition(input);
        // Assert
        const position = await positionRepository.getById(positionId);
        expect(position.positionId).toBeDefined();
        expect(position.rideId).toBe(input.rideId);
        expect(position.lat).toBe(input.lat);
        expect(position.long).toBe(input.long);
        expect(position.date).toBeDefined();
    });

    test("should validate if ride is not in progress", async () => {
        // Arrange
        const input = { rideId: crypto.randomUUID(), lat: -23.5228307, long: -46.6972663 };
        const rideRepository = new RideRepository()
        await rideRepository.addRide(createTestRide({ rideId: input.rideId, status: "accepted" }))
        // Act
        const service = new UpdatePositionService(rideRepository, new PositionRepository());
        await expect(() => service.updatePosition(input)).rejects.toThrow(new Error("Ride is not in progress"));
    });
})