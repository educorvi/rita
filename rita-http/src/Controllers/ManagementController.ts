import {Body, Controller, Get, Path, Post, Route, SuccessResponse, Delete} from "@tsoa/runtime";
import {Ruleset} from "@educorvi/persistent-rita";
import {rita} from "../helper/globals";
import {NotFoundError, UsageError} from "../Errors";
import {Response, Security} from "tsoa";
import {errorResponse} from "./responseTypes";
import {satisfies as satisfiesVersion, major, minor} from "semver"
import {version as ritaVersion, Parser} from "@educorvi/rita";

/**
 * Controller for everything management related
 */

/**
 * Type for the body of a request, that edits rita
 */
type ritaBody = {
    id?: string,
    name?: string,
    "$schema"?: string,
    description?: string,
    version?: string,
    rules: Array<any>
}

@Route("rulesets")
export class RulesetManagementController extends Controller {

    /**
     * Gets all saved rulesets.
     */
    @Get("/")
    @Security("api_key", ["view"])
    @Response<errorResponse>("401", "Unauthorized")
    public async getRulesets(): Promise<Array<Ruleset>> {
        return rita.getAllRulesets();
    }

    /**
     * Gets a ruleset with a specific ID.
     * @param rulesetID The ID to search for.
     */
    @Get("{rulesetID}")
    @Security("api_key", ["view"])
    @Response<errorResponse>("404", "Not Found")
    @Response<errorResponse>("401", "Unauthorized")
    public async getRuleset(
        @Path() rulesetID: string
    ): Promise<Ruleset> {
        const r = await rita.getRuleset(rulesetID);
        if (!r) {
            throw new NotFoundError(`The ruleset with id '${rulesetID}' could not be found!`);
        }
        return r;
    }

    /**
     * Saves a ruleset.
     * @param rulesetID The ID of the ruleset.
     * @param ruleset The ruleset to save. Must fulfill the RITA Schema.
     */
    @SuccessResponse(201)
    @Post("{rulesetID}")
    @Security("api_key", ["manage"])
    @Response<errorResponse>("401", "Unauthorized")
    @Response<errorResponse>("422", "Validation Error: An invalid object has been passed")
    public async saveRuleset(
        @Path() rulesetID: string,
        @Body() ruleset: ritaBody
    ): Promise<void> {
        //@TODO Documentation for function and tests for version check
        //@TODO Force version in body?
        const ritaRange = `${major(ritaVersion)}.0.0 - ${major(ritaVersion)}.${minor(ritaVersion)}.*`;
        if (ruleset.version && !satisfiesVersion(ruleset.version, ritaRange)) throw new UsageError(`Invalid version (${ruleset.version}) of rita! Valid versions are: ${ritaRange}`)

        const v = Parser.getParser().validateRuleSetJSON(ruleset);
        if (!v.valid) {
            throw new UsageError("Invalid Ruleset: " + JSON.stringify(v.errors));
        }

        if (ruleset.id && ruleset.id !== rulesetID) throw new UsageError("If specified, id in the body must match the url parameter")

        let data = ruleset;
        let old = (await rita.getRuleset(rulesetID));
        data.name = data.name || old?.name || rulesetID;
        data.description = data.description || old?.description;
        const r: Ruleset = new Ruleset(rulesetID, data.name, Parser.parseRuleSet(data));
        await rita.saveRuleset(r);
        this.setStatus(201);

        return;
    }

    /**
     * Deletes a ruleset if it exists.
     * @param rulesetID The ID of the ruleset.
     */
    @SuccessResponse(204, "Successfully deleted")
    @Delete("{rulesetID}")
    @Security("api_key", ["manage"])
    @Response<errorResponse>("401", "Unauthorized")
    public async deleteRuleset(
        @Path() rulesetID: string
    ): Promise<void> {
        this.setStatus(204);
        return rita.deleteRuleset(rulesetID);
    }

}
