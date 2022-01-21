import simpleGit, {SimpleGit, SimpleGitOptions} from "simple-git";
import {updateGitUser} from "./git-config";
import tl = require("azure-pipelines-task-lib");
import {Git} from "./git";

export class GitImplementation implements Git {
    branch: string = "";
    private readonly git: SimpleGit;

    constructor(public cwd: string) {
        const gitOptions: Partial<SimpleGitOptions> = {
            baseDir: cwd,
            binary: 'git',
            maxConcurrentProcesses: 6,
        };
        this.git = simpleGit(gitOptions);
    }

    async listTags(filter: string): Promise<string> {
        await this.Init();
        return this.git.tag(["-l", filter, "-i"]);
    }

    async addTag(tag: string): Promise<string> {
        await this.Init();
        return this.git.tag([tag]);
    }

    async pushTags(): Promise<void> {
        await this.Init();
        await this.git.pushTags();
    }

    private async Init(): Promise<void> {
        if (this.branch) {
            return;
        }

        await updateGitUser(this.git);
        const sourceBranch = tl.getVariable("Build.SourceBranch") || (await this.git.branch()).current;
        const m = /(?<=refs\/.+?\/).+/.exec(sourceBranch);

        this.branch = m ? m[0] : tl.getVariable("Build.SourceBranchName") as string;
    }
}