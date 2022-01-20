import Version from "./Version";

export async function bumpVersion(version: Version, all: Version[], label: string, branchType: string) {
    let handled = false;

    switch (branchType) {
        case "patch": {
            if (version.isRelease()) {
                version.incrementPatch();
                handled = true;
            }
            break;
        }
        case "alpha": {
            if (version.isRelease() || version.patch) {
                version.incrementMinor();
                handled = true;
            }
            break;
        }
        case "beta":
        case "release": {
            if (version.isRelease() || version.isEmpty()) {
                version.incrementMinor();
                handled = true;
            }
            break;
        }
    }

    if (!handled) {
        version.incrementIncrement(all);
    }
}