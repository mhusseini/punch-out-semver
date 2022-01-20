import {GitAutoVersionOptions} from "./types";
import slugify from "slugify";

export function getLabelFromBranch(branch: string, branchType: string, options: GitAutoVersionOptions): string {
    const m = /(?<=[^\/]+\/).+|^[^\/]+$/.exec(branch);
    const branchName = m ? m[0] : branch;
    switch (branchType) {
        case "alpha": {
            const label = branchName ? new RegExp(options.label).exec(branchName) || [branchName] : [branchName];
            return slugify(label[0]);
        }
        case "beta": {
            return slugify(options.betaLabel);
        }
        case "patch": {
            const label = branchName ? new RegExp(options.label).exec(branchName) || [branchName] : [branchName];
            return slugify(label[0]);
        }
        case "release":
        default:
            return "";
    }
}

export function getBranchType(branch: string, options: GitAutoVersionOptions) {
    return new RegExp(options.releaseBranch).test(branch)
        ? "release"
        : new RegExp(options.patchBranch).test(branch)
            ? "patch"
            : options.betaBranch && new RegExp(options.betaBranch).test(branch)
                ? "beta"
                : "alpha";
}