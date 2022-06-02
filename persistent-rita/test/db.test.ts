import PersistentRita, {PersistentRitaLogger} from "../src";
import Ruleset from "../src/Ruleset"
import {Parser} from "@educorvi/rita"
import exampleMath from "./assets/exampleMath.json"
import SQLite from "../src/Database/SQLite";
import {DatabaseConnectionClosedError} from '../src';
import dotenv from "dotenv";
import MySQL from "../src/Database/MySQL";
import Postgres from "../src/Database/Postgres";
import DatabaseInterface from "../src/DatabaseInterface";

dotenv.config();

const env = process.env;

/**
 * Logger for the tests that ignores debug and error messages
 */
class TestLogger extends PersistentRitaLogger {
    // @ts-ignore
    debug(data: any): void {
        return;
    }

    error(data: any): void {
        console.error(data);
    }

    fatal(data: any): void {
        console.error(data);
    }

    // @ts-ignore
    log(data: any): void {
        return;
    }

    warn(data: any): void {
        console.warn(data);
    }

}

const logger = new TestLogger();


type DatabaseList = Array<{
    /** Name of the db */
    name: string,

    /** Function to retrieve the db */
    get: ()=>Promise<DatabaseInterface>
}>
/**
 * The databases to be tested
 */
const dbs: DatabaseList = [
    {
        name: "SQLite",
        get: () => SQLite.getDB("./test.db", logger),
    },
    {
        name: "MySQL",
        get: () => MySQL.getDB({
            database: <string>env.MYSQL_DATABASE,
            host: <string>env.MYSQL_HOST,
            port: parseInt(env.MYSQL_PORT || "3306"),
            username: env.MYSQL_USER,
            password: env.MYSQL_PASSWORD
        }, logger)
    },
    {
        name: "Postgres",
        get: () => Postgres.getDB({
            database: <string>env.PSQL_DATABASE,
            host: <string>env.PSQL_HOST,
            port: parseInt(env.PSQL_PORT || "5432"),
            username: env.PSQL_USER,
            password: env.PSQL_PASSWORD
        }, logger)
    },
];


for (const db of dbs) {
    let rita: PersistentRita;

    describe('test ' + db.name, function () {
        function checkSavedRulesetAmount(expected: number) {
            it("Check that there are " + expected + " rulesets saved", async () => {
                const rulesets = await rita.getAllRulesets();
                expect(rulesets.length).toBe(expected);
            });
        }

        describe('Setup', function () {
            it("Initiate Rita", async () => {
                const edb = await db.get();
                expect(() => rita = new PersistentRita(edb, logger)).not.toThrow();
                expect(rita).toBeDefined();
            });
        });

        describe('Test save and load', function () {
            it("Save empty ruleset1", async () => {
                await rita.saveRuleset(new Ruleset("er", "Empty Ruleset1", []));
            });

            it("Save empty ruleset2", async () => {
                await rita.saveRuleset(new Ruleset("er2", "Empty Ruleset2", []));
            });

            it("Save empty ruleset3", async () => {
                await rita.saveRuleset(new Ruleset("er3", "Empty Ruleset3", []));
            });

            checkSavedRulesetAmount(3);


            it("update empty ruleset", async () => {
                await rita.saveRuleset(new Ruleset("er2", "Empty Ruleset x", [], "description"));
            });

            checkSavedRulesetAmount(3);

            it("check the saved ruleset", async () => {
                const r = await rita.getRuleset("er2");

                expect(r).toBeDefined();
                expect((<Ruleset>r).name).toEqual("Empty Ruleset x");
                expect((<Ruleset>r).description).toEqual("description");

            });

            it("delete empty ruleset1", async () => {
                await rita.deleteRuleset("er")
            });

            it("delete empty ruleset3", async () => {
                await rita.deleteRuleset("er3")
            });

            it("Save exampleMath", async () => {
                await rita.saveRuleset(new Ruleset("math", "Math Ruleset", Parser.parseRuleSet(exampleMath)));
            });

            checkSavedRulesetAmount(2);

            it("delete empty ruleset", async () => {
                await rita.deleteRuleset("er2")
            });

            checkSavedRulesetAmount(1);

            it("deleted ruleset must now be missing", async () => {
                expect(await rita.getRuleset("er")).toBeUndefined();
            });

            it("add 4 rules", async () => {
                for (let i = 0; i < 4; i++) {
                    await rita.saveRuleset(new Ruleset("er" + i, "Empty Ruleset", []));
                }
                expect((await rita.getAllRulesets()).length).toBe(5);
            });

        });

        describe("Cleanup", () => {
            it("clear db", async () => {
                await rita.deleteAllRulesets();
                expect((await rita.getAllRulesets()).length).toBe(0);
            });

            it('close connection', async () => {
                await rita.closeDBConnection();
            });

            it("error when accessing closed connection", async () => {
                expect.assertions(1);
                try {
                    await rita.saveRuleset(new Ruleset("er", "Empty Ruleset", []));
                } catch (e) {
                    expect(e).toBeInstanceOf(DatabaseConnectionClosedError);
                }
            });
        });
    });
}

