import crypto from "crypto";
import AcceptRideService from "../src/AcceptRideService";
import AccountRepository from "../src/AccountRepository";
import RideRepository from "../src/RideRepository";
import { createTestAccount, createTestRide } from "./TestHelpers";

describe("AcceptRideService", () => {

    test("should accept the ride", async () => {
        // Arrange
        const input = { rideId: crypto.randomUUID(), driverId: crypto.randomUUID() };
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount(createTestAccount({ accountId: input.driverId, isDriver: true }));
        const rideRepository = new RideRepository();
        await rideRepository.addRide(createTestRide({ rideId: input.rideId, driverId: input.driverId, status: "requested" }));
        // Act
        const acceptRideService = new AcceptRideService(accountRepository, rideRepository);
        await acceptRideService.acceptRide(input);
        // Assert
        const ride = await rideRepository.getRide(input.rideId);
        expect(ride).toBeDefined();
        expect(ride.driverId).toBe(input.driverId);
        expect(ride.status).toBe("accepted");
    });

    test("should validate if ride exists", async () => {
        const input = { rideId: crypto.randomUUID(), driverId: crypto.randomUUID() };
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount(createTestAccount({ accountId: input.driverId, isDriver: true }));
        // Act
        const acceptRideService = new AcceptRideService(accountRepository, new RideRepository());
        await expect(() => acceptRideService.acceptRide(input)).rejects.toThrow(new Error("No Ride found"));
    });

    test("should validate if accepting account is a driver", async () => {
        // Arrange
        const input = { rideId: crypto.randomUUID(), driverId: crypto.randomUUID() };
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount(createTestAccount({ accountId: input.driverId, isDriver: false }));
        // Act
        const acceptRideService = new AcceptRideService(accountRepository, new RideRepository());
        await expect(() => acceptRideService.acceptRide(input)).rejects.toThrow(new Error("Invalid driver"));
    });

    test("should validate if ride is not in requested status", async () => {
        // Arrange
        const input = { rideId: crypto.randomUUID(), driverId: crypto.randomUUID() };
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount(createTestAccount({ accountId: input.driverId, isDriver: true }));
        const rideRepository = new RideRepository();
        await rideRepository.addRide(createTestRide({ rideId: input.rideId, status: "completed" }));
        // Act
        const acceptRideService = new AcceptRideService(accountRepository, rideRepository);
        await expect(() => acceptRideService.acceptRide(input)).rejects.toThrow(new Error("Ride is not in requested status"));
    });

    test.each(["in_progress", "accepted"])("should validate if driver does not have another ride in %s status", async (status: string) => {
        // Arrange
        const input = { rideId: crypto.randomUUID(), driverId: crypto.randomUUID() };
        const accountRepository = new AccountRepository();
        await accountRepository.addAccount(createTestAccount({ accountId: input.driverId, isDriver: true }));
        const rideRepository = new RideRepository();
        await rideRepository.addRide(createTestRide({ rideId: input.rideId, status: "requested" }));
        await rideRepository.addRide(createTestRide({ rideId: crypto.randomUUID(), status, driverId: input.driverId }));
        // Act
        const acceptRideService = new AcceptRideService(accountRepository, rideRepository);
        await expect(() => acceptRideService.acceptRide(input)).rejects.toThrow(new Error("Driver has another active ride"));
    });
});
