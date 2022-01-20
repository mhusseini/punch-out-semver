# punch-out-semver

Punch Out SemVer is a pipeline task for Azure Devops that makes version incrementing very easy.

## How it works
The main idea is to calculate the version only when the built code gets published and not on each commit. 
For example, add the Punch Out SemVer task into build pipelines that push a NuGet package
or deploy a web application, either as pre-release or as release code. 
Punch Out SemVer then calculates the next version from the current Git branch and from Git tags.

The versions generated adhere to the following pattern:

- **1.0.0** Release version created by builds on the release branch.
- **1.0.1-abcd.0** Pre-release version created by builds on a bugfix branch.
- **1.1.0-abcd.0** Pre-release version created by builds on a feature branch.
- **1.1.0-beta.0** Pre-release version created by builds on the develop branch.

Rules for the version numbers:
1. If the current branch is a patch branch and the previous version a release version, then increment patch.
2. If the current branch is a feature branch and the previous version a release version or a patch, then increment minot version (and set patch to 0).
3. If the current branch is the develop or release branch and the previous version a release version or empty, then increment minor version.
4. In all other cases, increment label increment.

Rules for the version label:
1. If the current branch is the release branch, then remove the label.
2. If the current branch is the develop branch, then use the configurable beta label.
2. In all other cases, get the label from from the branch name using a configurable regular expression, or use the branch name.
