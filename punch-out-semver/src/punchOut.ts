import {Git} from "./git";
import {GitAutoVersionOptions} from "./types";
import Version from "./Version";
import {getBranchType, getLabelFromBranch} from "./git-branches";
import {bumpVersion} from "./bumpVersion";
import {setVariable, addBuildTag, setResult, TaskResult} from "azure-pipelines-task-lib/task";
import RegExp from "./RegExp";

RegExp.extend();

export async function punchOut(git: Git, options: GitAutoVersionOptions) {
    const debug = {
        position: 0 as number | undefined,
        error: "",
        branch: "",
        branchType: "",
        version: undefined as Version | undefined,
        tags: "",
    };

    try {
        debug.branch = git.branch;
        const sep = options.packageName ? options.tagSeparator : "";
        const prefix = options.packageName + sep + options.tagVersionPrefix;

        const tags = await git.listTags(prefix + "*");
        debug.tags = tags;
        debug.position = 1;
        const {current: version, all} = Version.parse(prefix, tags);
        debug.version = version;
        debug.position = 2;
        const branchType = getBranchType(git.branch, options);
        debug.branchType = branchType;
        debug.position = 3;
        const label = getLabelFromBranch(git.branch, branchType, options);

        if (!version.next) {
            debug.position = 4;
            await bumpVersion(version, all, label, branchType);
        }

        debug.position = 5;
        version.setLabel(label, all);

        const newVersion = version.toString();
        const tag = prefix + newVersion;

        debug.position = 6;
        await git.addTag(tag);
        await git.pushTags();

        if (options.debug) {
            const p = debug.position;
            delete debug.position;
            console.log(JSON.stringify(debug, null, 4));
            debug.position = p;
        }

        if (version.isRelease()) {
            addBuildTag(tag);
        }

        console.log("New version: " + newVersion);
        setVariable(options.outputVariable, newVersion);
        setResult(TaskResult.Succeeded, "New version: " + newVersion);
    } catch (err: any) {
        debug.error = err.message;
        setResult(TaskResult.Failed, JSON.stringify(debug, null, 4));
    }
}