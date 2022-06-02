import axiosImport from "axios";
import 'mocha';
import {expect} from 'chai';
// @ts-ignore
import pjson from "../package.json";
// @ts-ignore
import {step} from "mocha-steps";
// @ts-ignore
import dotenv from "dotenv";

dotenv.config();

import {ApiKey} from "../src/config/Database";
import {configDB, init, rita, logger} from "../src/helper/globals";

const axios = axiosImport.create();
axios.interceptors.response.use((response) => response, (error) => {
    logger.debug(error.response.data.message);
    throw error;
});

const {PORT} = process.env;
const base = `http://localhost:${PORT}/`

const exampleRuleset = {

    "rules": [
        {
            "id": "rule1",
            "rule": {
                "type": "and",
                "arguments": [
                    {
                        "type": "atom",
                        "path": "member"
                    },
                    {
                        "type": "not",
                        "arguments": [
                            {
                                "type": "atom",
                                "path": "employee"
                            }
                        ]
                    }
                ]
            }
        },
        {
            "id": "rule2",
            "rule": {
                "type": "atom",
                "path": "employee"
            }
        }
    ],
    "name": "test1",
    "description": ""
}

describe("Basics", () => {

    it('Startpage', async () => {
        const req = await axios.get(base);
        expect(req.status).to.equal(200);
        expect(req.data.version).to.equal(pjson.version);
    });

    it("Docs", async () => {
        const req = await axios.get(base + "docs")
        expect(req.status).to.equal(200)
    });

});

describe("Manage rulesets", () => {
    let all: ApiKey, nothing: ApiKey;

    before(async () => {
        await init();

        all = await ApiKey.generateApiKey("all", true, true, true, configDB);
        await configDB.setApiKey(all);
        nothing = await ApiKey.generateApiKey("nothing", false, false, false, configDB);
        await configDB.setApiKey(nothing);
    });

    describe("Requests without Api Key and default public access", () => {
        let initial_length: number;
        step("List all rulesets", async () => {
            const res = await axios.get(base + "rulesets");
            expect(res.status).to.equal(200);
            initial_length = res.data.length;
        });

        step("Show one ruleset that does not exist", async () => {
            try {
                await axios.get(base + "rulesets/420");
            } catch (e) {
                expect(e.response.status).to.equal(404)
            }
        });

        step("Create a ruleset", async () => {
            try {
                await axios.post(base + "rulesets/420", exampleRuleset);
            } catch (e) {
                expect(e.response.status).to.equal(401)
            }
        });

        step("Check amount of rulesets", async () => {
            const res = await axios.get(base + "rulesets");
            expect(res.data.length).to.equal(initial_length);
        });

        step("Overwrite a ruleset", async () => {
            try {
                await axios.post(base + "rulesets/420", {...exampleRuleset, name: "test2"});
            } catch (e) {
                expect(e.response.status).to.equal(401)
            }
        });

        step("Check amount of rulesets", async () => {
            const res = await axios.get(base + "rulesets");
            expect(res.data.length).to.equal(initial_length);
        });

        step("Delete a ruleset", async () => {
            try {
                await axios.delete(base + "rulesets/420");
            } catch (e) {
                expect(e.response.status).to.equal(401)
            }
        });

        step("Check amount of rulesets", async () => {
            const res = await axios.get(base + "rulesets");
            expect(res.data.length).to.equal(initial_length);
        });
    });

    describe("Requests with \"nothing\" Api Key", () => {
        before(() => {
            axios.defaults.headers.common["X-API-KEY"] = nothing.api_key;
        });

        step("List all rulesets", async () => {
            try {
                await axios.get(base + "rulesets");
            } catch (e) {
                expect(e.response.status).to.equal(401)
            }
        });

        step("Show one ruleset that does not exist", async () => {
            try {
                await axios.get(base + "rulesets/420");
            } catch (e) {
                expect(e.response.status).to.equal(401)
            }
        });

        step("Create a ruleset", async () => {
            try {
                await axios.post(base + "rulesets/420", exampleRuleset);
            } catch (e) {
                expect(e.response.status).to.equal(401)
            }
        });


        step("Overwrite a ruleset", async () => {
            try {
                await axios.post(base + "rulesets/420", {...exampleRuleset, name: "test2"});
            } catch (e) {
                expect(e.response.status).to.equal(401)
            }
        });


        step("Delete a ruleset", async () => {
            try {
                await axios.delete(base + "rulesets/420");
            } catch (e) {
                expect(e.response.status).to.equal(401)
            }
        });

        after(() => {
            axios.defaults.headers.common["X-API-KEY"] = undefined;
        });
    });

    describe("Requests with \"all\" Api Key", () => {
        before(() => {
            axios.defaults.headers.common["X-API-KEY"] = all.api_key;
        });

        let initial_length: number;
        step("List all rulesets", async () => {
            const res = await axios.get(base + "rulesets");
            expect(res.status).to.equal(200);
            initial_length = res.data.length;
        });

        step("Show one ruleset that does not exist", async () => {
            try {
                await axios.get(base + "rulesets/420");
            } catch (e) {
                expect(e.response.status).to.equal(404)
            }
        });

        step("Create a ruleset", async () => {
            const res = await axios.post(base + "rulesets/420", exampleRuleset);
            expect(res.status).to.equal(201);
        });

        step("Body ID must match url parameter", async () => {
            try {
                await axios.post(base + "rulesets/422", {...exampleRuleset, id: "423"});
            } catch (e){
                expect(e.response.status).to.equal(400);
            }

        });

        step("Check amount of rulesets", async () => {
            const res = await axios.get(base + "rulesets");
            expect(res.data.length).to.equal(initial_length + 1);
        });

        step("Overwrite a ruleset", async () => {
            const res = await axios.post(base + "rulesets/420", {...exampleRuleset, name: "test2"});
            expect(res.status).to.equal(201);
        });

        step("Check amount of rulesets", async () => {
            const res = await axios.get(base + "rulesets");
            expect(res.data.length).to.equal(initial_length + 1);
        });

        step("Read ruleset", async () => {
            const res = await axios.get(base + "rulesets/420");
            expect(res.data.name).to.equal("test2");
        });

        step("Delete a ruleset", async () => {
            const res = await axios.delete(base + "rulesets/420");
            expect(res.status).to.equal(204);
        });

        step("Check amount of rulesets", async () => {
            const res = await axios.get(base + "rulesets");
            expect(res.data.length).to.equal(initial_length);
        });
    });

    after(async () => {
        await rita.deleteRuleset("420");
        // await configDB.deleteApiKey(all);
        // await configDB.deleteApiKey(nothing);
        await configDB.close();
        await rita.closeDBConnection()
    });
})
