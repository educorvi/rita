import express from "express";
import {UnauthorizedError} from "../Errors";
import {configDB} from "./globals";

/**
 * Function to check users permissions
 * @param request the request
 * @param securityName type of security (currently only api_key)
 * @param scopes Requested scopes
 */
export function expressAuthentication(
    request: express.Request,
    securityName: string,
    scopes?: string[]
): Promise<any> {
    return new Promise(async (resolve, reject) => {
        if (securityName === "api_key") {
            let key = await configDB.getApiKey(request.header("X-API-KEY") || "*");
            if (!key) {
                key = await configDB.getApiKey("*");
            }
            for (const scope of scopes) {
                switch (scope) {
                    case "view":
                        if (!key.view) reject(new UnauthorizedError());
                        break;
                    case "manage":
                        if (!key.manage) reject(new UnauthorizedError());
                        break;
                    case "evaluate":
                        if (!key.evaluate) reject(new UnauthorizedError());
                        break;
                }
            }
        }


        resolve(null);
    });
}
