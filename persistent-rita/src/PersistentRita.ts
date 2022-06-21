import {
    DefaultConsoleLogger,
    PersistentRitaLogger,
} from './Helper/PersistentRitaLogger';
import DatabaseInterface from './DatabaseInterface';
import { Parser, PluginClass, setLogger } from '@educorvi/rita';
import Ruleset from './Ruleset';

/**
 * Persistent Rita
 */
export class PersistentRita {
    private static plugins: Array<PluginClass> = [];
    public static parser: Parser = new Parser();

    public static setPlugins(plugins: Array<PluginClass>) {
        this.plugins = plugins;
        this.parser = new Parser(this.plugins);
    }

    getLogger(): PersistentRitaLogger {
        return this.logger;
    }
    private db: DatabaseInterface;
    private readonly logger: PersistentRitaLogger;

    constructor(
        db: DatabaseInterface,
        customLogger: PersistentRitaLogger = new DefaultConsoleLogger()
    ) {
        this.db = db;
        this.logger = customLogger;
        setLogger(customLogger);
    }

    /**
     * Saves a ruleset.
     * @param ruleset The ruleset
     */
    saveRuleset(ruleset: Ruleset): Promise<void> {
        this.logger.debug('Save ruleset ' + ruleset.id);
        return this.db.saveRuleset(ruleset.id, ruleset);
    }

    /**
     * Deletes a ruleset.
     * @param id The ID of the ruleset
     */
    deleteRuleset(id: string): Promise<void> {
        this.logger.debug('Delete ruleset ' + id);
        return this.db.deleteRuleset(id);
    }

    /**
     * Gets the ruleset with the given ID
     * @param id The ID
     */
    getRuleset(id: string): Promise<Ruleset | undefined> {
        this.logger.debug('Get ruleset ' + id);
        return this.db.getRuleset(id);
    }

    /**
     * Gets all rulesets
     */
    getAllRulesets(): Promise<Array<Ruleset>> {
        this.logger.debug('Get all rulesets');
        return this.db.listRulesets();
    }

    /**
     * Deletes all rulesets
     */
    deleteAllRulesets(): Promise<void> {
        this.logger.debug('Delete all rulesets');
        return this.db.deleteAllRulesets();
    }

    /**
     * Close the connection to the database.
     */
    closeDBConnection(): Promise<void> {
        this.logger.debug('Close database connection');
        return this.db.close();
    }
}
