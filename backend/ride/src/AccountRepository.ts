import pgPromise from "pg-promise";
import { Account } from "./types";

export default class AccountRepository {

    async getAccount(accountId: string): Promise<Account> {
        const connection = pgPromise()("postgres://postgres:root@localhost:5432/postgres");
        try {
            const [account] = await connection.query("select * from cccat13.account where account_id = $1", [accountId]);
            return account;
        } finally {
            connection.$pool.end();
        }
    }
    
    async addAccount(account: Account) {
        const pgp = pgPromise();
        const tableName = new pgp.helpers.TableName({ table: "account", schema: "cccat13" });
        const insertQuery = pgp.helpers.insert(account, null, tableName);
        const connection = pgp("postgres://postgres:root@localhost:5432/postgres");
        try {
            await connection.none(insertQuery);
            return account.account_id;
        } finally {
            connection.$pool.end();
        }
    }
}