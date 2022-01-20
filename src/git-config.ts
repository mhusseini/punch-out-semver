import {SimpleGit} from "simple-git";
import {DefaultLogFields} from "simple-git/src/lib/tasks/log";

export async function updateGitUser(git: SimpleGit) {
    const logs = await git.log(["-1"]);
    const latestLog = logs.latest as DefaultLogFields;
    git.addConfig("user.name", latestLog.author_name);
    git.addConfig("user.email", latestLog.author_email);
}