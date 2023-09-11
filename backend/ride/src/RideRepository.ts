import pgPromise from "pg-promise";
import { AccountType, Ride } from "./types";

export default class RideRepository {

    async getRide(rideId: string): Promise<Ride> {
        const connection = pgPromise()("postgres://postgres:root@localhost:5432/postgres");
        try {
            const [ride] = await connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
            return ride;
        } finally {
            connection.$pool.end();
        }
    }

    async getLastRide(accountId: string, accountType: AccountType): Promise<Ride> {
        const connection = pgPromise()("postgres://postgres:root@localhost:5432/postgres");
        try {
            const [ride] = await connection.query("select * from cccat13.ride where $1:name = $2 order by date desc limit 1", [`${accountType}_id`, accountId]);
            return ride;
        } finally {
            connection.$pool.end();
        };
    }

    async addRide(ride: Ride) {
        const pgp = pgPromise();
        const table = new pgp.helpers.TableName({ table: "ride", schema: "cccat13" });
        const insertQuery = pgp.helpers.insert(ride, null, table);
        const connection = pgp("postgres://postgres:root@localhost:5432/postgres");
        try {
            await connection.none(insertQuery);
            return ride.ride_id;
        } finally {
            connection.$pool.end();
        }
    }

    async updateRide(ride: Ride) {
        const pgp = pgPromise();
        const table = new pgp.helpers.TableName({ table: "ride", schema: "cccat13" });
        const updateQuery = pgp.helpers.update({ driver_id: ride.driver_id, status: ride.status }, null, table);
        const connection = pgp("postgres://postgres:root@localhost:5432/postgres");
        try {
            await connection.none(updateQuery);
            return ride.ride_id;
        } finally {
            connection.$pool.end();
        }
    }
}