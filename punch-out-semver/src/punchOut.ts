import {Git} from "./git";
import {GitAutoVersionOptions} from "./types";
import Version from "./Version";
import {getBranchType, getLabelFromBranch} from "./git-branches";
import {bumpVersion} from "./bumpVersion";
import tl = require("azure-pipelines-task-lib");
import RegExp from "./RegExp";

RegExp.extend();

export async function punchOut(git: Git, options: GitAutoVersionOptions) {
    try {
        const sep = options.packageName ? "-" : "";
        const prefix = options.packageName + sep + "v";

        const tags = await git.listTags(prefix + "*");

        const {current: version, all} = Version.parse(prefix, tags);
        const branchType = getBranchType(git.branch, options);
        const label = getLabelFromBranch(git.branch, branchType, options);

        if (!version.next) {
            await bumpVersion(version, all, label, branchType);
        }

        version.setLabel(label, all);

        const newVersion = version.toString();
        const tag = prefix + newVersion;

        await git.addTag(tag);
        await git.pushTags();

        if (version.isRelease()) {
            tl.addBuildTag(tag);
        }

        tl.setVariable(options.outputVariable, newVersion);
        tl.setResult(tl.TaskResult.Succeeded, "New version: " + newVersion);
    } catch (err: any) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}