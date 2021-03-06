import {getInput, cwd, getBoolInput} from "azure-pipelines-task-lib/task";
import {punchOut} from "./punchOut";
import {GitImplementation} from "./gitImplementation";
import {GitAutoVersionOptions} from "./types";

const workingDirectory = cwd();
//const workingDirectory = "/Users/munirhusseini/Development/Kundenprojekte/src/CaaS/";
const options: GitAutoVersionOptions = {
    packageName: getInput("packageName", false) as string || "",
    releaseBranch: getInput("releaseBranch", false) || "master",
    developBranch: getInput("developBranch", false) || "develop",
    patchBranch: getInput("patchBranch", false) || ".*fix/",
    betaLabel: getInput("betaLabel", false) || "beta",
    label: getInput("label", false) || ".+",
    outputVariable: getInput("outputVariable", false) || "versionnumber",
    tagSeparator: getInput("tagSeparator", false) || "-",
    tagVersionPrefix: getInput("tagVersionPrefix", false) || "v",
    debug: getBoolInput("debug", false),
};

const git = new GitImplementation(workingDirectory);

punchOut(git, options);