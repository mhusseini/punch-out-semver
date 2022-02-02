export interface GitAutoVersionOptions {
    packageName?: string,
    releaseBranch: string,
    developBranch?: string,
    patchBranch: string,
    betaLabel: string,
    label: string,
    outputVariable: string,
    tagSeparator: string,
    tagVersionPrefix: string,
    debug: boolean
}