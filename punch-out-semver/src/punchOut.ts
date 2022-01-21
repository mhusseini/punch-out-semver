import {Git} from "./git";
import {GitAutoVersionOptions} from "./types";
import Version from "./Version";
import {getBranchType, getLabelFromBranch} from "./git-branches";
import {bumpVersion} from "./bumpVersion";
import {setVariable, addBuildTag, setResult, TaskResult} from "azure-pipelines-task-lib/task";
import RegExp from "./RegExp";

RegExp.extend();

export async function punchOut(git: Git, options: GitAutoVersionOptions) {
    try {
        const sep = options.packageName ? options.tagSeparator : "";
        const prefix = options.packageName + sep + options.tagVersionPrefix;

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
            addBuildTag(tag);
        }

        setVariable(options.outputVariable, newVersion);
        setResult(TaskResult.Succeeded, "New version: " + newVersion);
    } catch (err: any) {
        setResult(TaskResult.Failed, err.message);
    }
}