import simpleGit, {SimpleGit, SimpleGitOptions} from "simple-git";
import {updateGitUser} from "./git-config";
import {getVariable} from "azure-pipelines-task-lib/task";
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
        const sourceBranch = getVariable("Build.SourceBranch") || (await this.git.branch()).current;
        const m = /(?<=refs\/.+?\/).+/.exec(sourceBranch);

        this.branch = m ? m[0] : getVariable("Build.SourceBranchName") as string;
    }
}