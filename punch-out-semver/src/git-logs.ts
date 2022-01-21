import {SimpleGit} from "simple-git";
import Version from "./Version";


export async function getNewerAndLowerVersions(git: SimpleGit, prefix: string, version: Version): Promise<Version[]> {
    const log = await git.log({from: version.tag, to: "HEAD"});
    return ([] as Version[]).concat(...log.all
        .map(l => /(?<=tag:\s*)[^,]+/gm.execAll(l.refs))
        .map(matches => matches
            .map((m: RegExpExecArray) => m && m[0] || "")
            .filter((t: string) => t.trim().indexOf(prefix) === 0)
            .map((t: string) => Version.parse(t, prefix).current)
            .filter((v: Version) => version.compareTo(v) > 0)
        ));
}

