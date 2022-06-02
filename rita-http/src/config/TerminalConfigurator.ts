import {version} from "../../package.json"
import {configDB} from "../helper/globals";
import {ApiKey} from "./Database";
import {logger} from "../CustomLogger";

const termkit = require('terminal-kit');
const term = termkit.terminal;

/**
 * Helper functions
 */


/**
 * Clears the terminal and sets the heading
 * @param additionalText Text to append to the heading
 */
function clearAndHeading(additionalText?: string) {
    term.clear().bold.underline.cyan(`RITA HTTP v${version + (!!additionalText ? ' - ' + additionalText : '')}\n`);
}

/**
 * Prints message to press any key and continues afterwards
 * @param next Function to execute after any key is pressed
 */
function pressKeyToContinue(next: () => void) {
    term.grabInput(true);
    term.cyan('Press any key to continue...\n');
    term.once('key', () => {
        term.grabInput(false);
        next()
    });
}

/**
 * Sets listener to CTRL-C and exits if pressed
 */
function pressCTRLCToCancel() {
    term.on('key', function (name: string) {
        if (name === 'CTRL_C') {
            process.exit(1);
        }
    });
}

/**
 * Prints an error to the terminal and continues afterwards
 * @param e Error
 * @param next Function to continue with
 */
function catchError(e: Error, next: () => void) {
    term.clear().bold.underline.red("Error\n");
    term.red(e.message + "\n\n");
    pressKeyToContinue(next);
}

/**
 * Returns a string of a boolean value as text with icon
 * @param bool The boolean
 */
function boolToString(bool: boolean): string {
    if (bool) {
        return "^Gtrue";
    } else {
        return "^Rfalse";
    }
}

/**
 * Data needed to generate an API Key
 */
type APIKeyData={
    name: string,
    view: boolean,
    manage: boolean,
    evaluate: boolean
}

/**
 * Get data to generate an API Key from the user
 * @param defaultName Optional default name
 */
async function getAPIKeyData(defaultName?: string):Promise<APIKeyData> {
    function printGranted(bool: boolean) {
        if (bool) {
            term.bold.green(" Granted\n");
        } else {
            term.bold.red(" Denied\n");
        }
    }

    term("\n");

    term('Please enter a name: ');
    const name = await term.inputField({default: defaultName}).promise

    term("\n")

    term('View Permission? [Y|n]');
    const view = await term.yesOrNo({yes: ['y', 'ENTER'], no: ['n']}).promise;
    printGranted(view);

    term('Manage Permission? [Y|n]');
    const manage = await term.yesOrNo({yes: ['y', 'ENTER'], no: ['n']}).promise;
    printGranted(manage);

    term('Evaluate Permission? [Y|n]');
    const evaluate = await term.yesOrNo({yes: ['y', 'ENTER'], no: ['n']}).promise;
    printGranted(evaluate);

    return {name, view, manage, evaluate}
}

/**
 * Let the user select an API Key
 */
async function selectKey(): Promise<ApiKey> {
    const keys = await configDB.getAllApiKeys();

    const options = keys.map(item => `${item.name} (${item.api_key})`);
    options.push("Cancel");
    const selected = await term.singleColumnMenu(options).promise;

    if (selected.selectedIndex === keys.length) {
        return null;
    }

    return keys[selected.selectedIndex];
}


/**
 * Menu functions
 */


/**
 * Show all API Keys
 */
async function viewAPIKeys() {
    clearAndHeading("API Keys")
    const table = [
        ["Name", "Key", "View", "Manage", "Evaluate", "Created"]
    ]

    const keys = await configDB.getAllApiKeys()
    for (const key of keys) {
        table.push([key.name, key.api_key, boolToString(key.view), boolToString(key.manage), boolToString(key.evaluate), key.created.toISOString()])
    }
    term.table(table, {
        hasBorder: true,
        firstRowTextAttr: {bgColor: 'blue'},
        borderChars: 'lightRounded',
        fit: true,
        contentHasMarkup: true
    })

    pressKeyToContinue(apiMenu);

}



/**
 * Add an API Key
 */
async function addApiKey() {
    clearAndHeading("Add API Key");

    const {name, view, manage, evaluate} = await getAPIKeyData();

    const key: ApiKey = await ApiKey.generateApiKey(name, view, manage, evaluate, configDB);
    configDB.setApiKey(key).then(() => {
        term.cyan.bold(`\nYour API Key: ${key.api_key}\n\n`);
        pressKeyToContinue(apiMenu);
    }).catch(e => {
        catchError(e, apiMenu)
    });
}


/**
 * Edit a Key
 */
async function editKey() {
    clearAndHeading("Edit API Key");
    const key = await selectKey();
    if (!key) {
        await apiMenu();
        return;
    }

    const {name, view, manage, evaluate} = await getAPIKeyData(key.name);
    key.name = name;
    key.view = view;
    key.manage = manage;
    key.evaluate = evaluate;

    configDB.setApiKey(key).then(() => {
        term.cyan.bold(`\nChanges saved\n\n`);
        pressKeyToContinue(apiMenu);
    }).catch(e => {
        catchError(e, apiMenu)
    });
}

/**
 * Delete a key
 */
async function deleteKey() {
    clearAndHeading("Delete API Key");

    const key = await selectKey();
    if (!key) {
        await apiMenu();
        return;
    }

    if (key.api_key === "*") {
        term.bold.red("\nCan not delete public access key. You can instead set all its permissions to false.\n\n");
        pressKeyToContinue(apiMenu);
        return;
    }
    configDB.deleteApiKey(key).then(() => {
        term.cyan.red(`\nDeleted\n\n`);
        pressKeyToContinue(apiMenu);
    }).catch(e => {
        catchError(e, apiMenu)
    });
}

/**
 * Main menu for API Key management
 */
async function apiMenu() {
    clearAndHeading('API Key Management');

    const mainMenuItems = [
        "View",
        "Add",
        "Edit",
        "Delete",
        "Back"
    ]
    const selected = await term.singleColumnMenu(mainMenuItems).promise
    switch (selected.selectedIndex) {
        case 0:
            await viewAPIKeys();
            break;
        case 1:
            await addApiKey();
            break;
        case 2:
            await editKey();
            break;
        case 3:
            await deleteKey();
            break;
        case 4:
            await mainMenu();
    }
}

/**
 * Main menu
 */
async function mainMenu() {
    clearAndHeading();

    const mainMenuItems = [
        "API Key Management",
        "Quit"
    ]
    const selected = await term.singleColumnMenu(mainMenuItems).promise
    switch (selected.selectedIndex) {
        case 0:
            await apiMenu();
            break;
        case 1:
            term.processExit(0);
    }
}

/**
 * Function to start the terminal configurator
 */
export async function startConfigurator() {
    logger.enable(false);
    pressCTRLCToCancel();
    await mainMenu();
    return;
}

