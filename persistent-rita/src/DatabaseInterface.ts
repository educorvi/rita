import Ruleset from './Ruleset';
export default interface DatabaseInterface {
    /**
     * Returns a list containing all rulesets.
     */
    listRulesets(): Promise<Array<Ruleset>>;

    /**
     * Gets a specific ruleset by it ID. If there is no ruleset with this ID, ``undefined`` will be returned.
     * @param id The ID of the ruleset
     */
    getRuleset(id: string): Promise<Ruleset | undefined>;

    /**
     * Saves a ruleset with the given ID. If it already exists it will be updated, otherwise it will be created.
     * @param id The ID of the ruleset
     * @param data The actual ruleset
     */
    saveRuleset(id: string, data: Ruleset): Promise<void>;

    /**
     * Deletes a ruleset with the given ID.
     * @param id The ID of the ruleset
     */
    deleteRuleset(id: string): Promise<void>;

    /**
     * Deletes all rulesets.
     */
    deleteAllRulesets(): Promise<void>;

    /**
     * Closes the connection to the Database.
     */
    close(): Promise<void>;
}
