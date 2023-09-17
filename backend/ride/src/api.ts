import express from "express";
import AcceptRideService from "./AcceptRideService";
import AccountRepository from "./AccountRepository";
import AccountService from "./AccountService";
import FinishRideService from "./FinishRideService";
import PositionRepository from "./PositionRepository";
import RequestRideService from "./RequestRideService";
import RideRepository from "./RideRepository";
import StartRideService from "./StartRideService";
import UpdatePositionService from "./UpdatePositionService";

const app = express();
const accountRepository = new AccountRepository();
const rideRepository = new RideRepository();
const positionRepository = new PositionRepository();

const accountService = new AccountService();
const requestRideService = new RequestRideService(accountRepository, rideRepository);
const acceptRideService = new AcceptRideService(accountRepository, rideRepository);
const startRideService = new StartRideService(rideRepository);
const updatePositionService = new UpdatePositionService(rideRepository, positionRepository);
const finishRideService = new FinishRideService(rideRepository, positionRepository);

app.use(express.json());

app.post("/signup", async function (req, res) {
    const input = req.body;
    const output = await accountService.signup(input);
    res.json(output);
});

app.post("/request-ride", async (req, res) => {
    const input = req.body;
    const output = await requestRideService.requestRide(input);
    res.json({ rideId: output });
});

app.post("/accept-ride", async (req, res) => {
    const input = req.body;
    acceptRideService.acceptRide(input);
    res.send();
});

app.post("/start-ride", async (req, res) => {
    const input = req.body;
    await startRideService.startRide(input.rideId);
    res.send();
});

app.post("/update-position", async (req, res) => {
    const input = req.body;
    await updatePositionService.updatePosition(input);
    res.send();
});

app.post("/finish-ride", async (req, res) => {
    const input = req.body;
    await finishRideService.finishRide(input.rideId);
    res.send();
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
