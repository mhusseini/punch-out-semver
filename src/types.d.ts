export interface GitAutoVersionOptions {
    packageName?: string,
    releaseBranch: string,
    betaBranch?: string,
    patchBranch: string,
    betaLabel: string,
    label: string,
    outputVariable: string
}