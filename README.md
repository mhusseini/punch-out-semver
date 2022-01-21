# Punch Out SemVer

Punch Out SemVer is a pipeline task for Azure DevOps that makes version incrementing very easy.

The basic idea is to calculate the version only when the built code gets published and not on each commit. 
For example, add the Punch Out SemVer task into build pipelines that push a NuGet package
or deploy a web application, either as pre-release or as release code. 
Punch Out SemVer then calculates the next version from the current Git branch and from the Git tags.

The versions generated adhere to the following pattern:

- `1.0.0` Release version created by builds on the release branch.
- `1.0.1-xxxx.0` Pre-release version created by builds on a bugfix branch.
- `1.1.0-xxxx.0` Pre-release version created by builds on a feature branch.
- `1.1.0-beta.0` Pre-release version created by builds on the develop branch.

Version are added as tags into Git. The tags may contain configurable 
package names that allow versioning of multiple packages within a single repository.

For example, if the configured package name was 'MyPackage', then the tag would be 'MyPackage-v1.0.0'.
If the package name was empty, then the tag would be 'v1.0.0'.

Punch Out SemVer writes the calculated version to a configuratble pipelin variable
for it to be used in the next tasks (e.g. for packaging).

## How it works

The next section uses the following terminology to refer to the different parts of a version:
```
1.2.3-beta.4
│ │ │  │   └── Label increment
│ │ │  └────── Label
│ │ └───────── Patch
│ └─────────── Minor version
└───────────── Major version
```

Punch Out SemVer detemines the current version by finding the tag with the highest verison number for a specific package name.
If no tag is found, the version defaults to the *empty* value of 0.0.0.
Punch Out SemVer then calculates the next version by using the current version and applying the following rules to it:

### Rules for the version label:
1. If the branch is the release branch, then remove the label.
2. If the branch is the develop branch, then use the configurable beta label.
3. In all other cases, get the label from from the branch name using a configurable regular expression, or use the branch name.

### Rules for the version numbers:
1. If the branch is a patch branch and the version a release version, then increment the patch.
2. If the branch is a feature branch and the version a release version or a patch, then incrementthe  minor version (and set the patch to 0).
3. If the branch is the develop or release branch and the version a release version or *empty*, then increment the minor version.
4. If the label has changed, find the highest label increment for the same version from the Git tags and increment it by 1 or set the label increment to 0. 
5. In all other cases, increment the label increment.

At the end, the new version is added as a tag to Git.

## How to set the next version
To manually set the version for the next build, a tag as above with the additional suffix of `:next`
can be added to Git.
When Punch Out SemVer detects such a tag as the highest available version, it uses it withou modifying
the major version, the minor version or the patch.

Example:

If currently the tag `v0.1.0` exists, then Punch Out SemVer would normally calculate `v0.3.0-beta.0` on the
develop branch next. 
If a tag `v1.0.0:next` was found, then Punch Out SemVer would calculate `v1.0.0-beta.0` on the
develop branch next.

