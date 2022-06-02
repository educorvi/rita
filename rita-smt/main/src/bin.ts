#!/usr/bin/env node

import SmtSolver from "./SmtSolver";
import * as fs from "fs";
import {Parser} from "@educorvi/rita";
import {program} from "commander";
import {version} from "../package.json"
import commandExists from "command-exists";
import {simplify} from "./index";

program
    .version(version);
program
    .argument("filepath", "path to the file that contains the Rita ruleset")
    .option("--verbose", "output more information, e.g. the generated smt and the output of the sat solver");

program
    .command("checksat <filepath>")
    .description("check satisfiability of a ruleset")
    .action(filepath => {
        commandExists("cvc5").then(() => {
            let r;
            try {
                r = JSON.parse(fs.readFileSync(filepath, "utf-8"));
            } catch (e) {
                console.error("Can't open file: " + filepath);
                process.exit(-1)
            }
            const rp = Parser.parseRuleSet(r);
            const s = new SmtSolver(true);
            for (const rule of rp) {
                s.assertRule(rule);
            }
            if (program.opts().verbose) {
                console.log("Generated SMT:");
                s.solver.dump();
                console.log("\n");
            }

            s.solver.checkSat().then((res) => {
                if (program.opts().verbose) {
                    console.log("Output of CVC5:");
                    s.solver.output.forEach(value => console.log(value));
                    console.log("\n");
                }

                console.log("Result:", res);
            });
        }).catch(() => {
            console.error("You need to have cvc5 installed");
            process.exit(-1)
        });
    });

program
    .command("simplify <filepath>")
    .description("simplify ruleset")
    .action(filepath => {
        commandExists("cvc5").then(() => {
            let r;
            try {
                r = JSON.parse(fs.readFileSync(filepath, "utf-8"));
            } catch (e) {
                console.error("Can't open file: " + filepath);
                process.exit(-1)
            }
            const rp = Parser.parseRuleSet(r);
            simplify(rp.map(r => r.rule))
                .then(console.log)
                .catch(console.error);

        }).catch(() => {
            console.error("You need to have cvc5 installed");
            process.exit(-1)
        });
    });


program.parse();
