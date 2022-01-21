export default class Version {
    private static regex = /(?<major>\d+)(\.(?<minor>\d+)(\.(?<patch>\d+)(-(?<label>[^.]+)(\.(?<increment>\d+))?)?)?)?(?<next>:next)?/;

    constructor(
        public major: number = 0,
        public minor: number = 0,
        public patch: number = 0,
        public label?: string,
        public increment: number = 0,
        public next: boolean = false,
        public tag: string = "") {
    }

    static parse(prefix: string, text: string): { current: Version, all: Version[] } {
        const prefixLength = prefix.length;

        const versions = text.split("\n")
            .map(tag => ({
                tag,
                sub: prefixLength ? tag.substr(prefixLength) : tag,
                groups: {} as { [key: string]: string }
            }))
            .filter(x => {
                const m = Version.regex.exec(x.sub)
                if (m && m.groups) {
                    x.groups = m.groups;
                    return true;
                }
                return false;
            })
            .map(x => x
                ? new Version(
                    Number(x.groups.major) || 0,
                    Number(x.groups.minor) || 0,
                    Number(x.groups.patch) || 0,
                    x.groups.label,
                    Number(x.groups.increment) || 0,
                    !!x.groups.next,
                    x.tag)
                : new Version());

        const sortedVersions = versions.sort((a, b) => -1 * a.compareTo(b));

        return {
            current: sortedVersions[0] || new Version(),
            all: versions
        };
    }

    isRelease(): boolean {
        return !this.label;
    }

    setLabel(label: string, all: Version[]) {
        if (this.label === label) {
            return;
        }

        this.label = label;
        this.incrementIncrement(all);
    }

    incrementMinor() {
        this.minor++;
        this.patch = 0;
        this.increment = 0;
    }

    incrementPatch() {
        this.patch++;
        this.increment = 0;
    }

    incrementIncrement(all: Version[]) {
        const currentIncrement = Math.max(-1, ...all
            .filter(v => v !== this && this.equals(v) && v.label === this.label)
            .map(v => v.increment));

        this.increment = currentIncrement + 1;
    }

    isEmpty(): boolean {
        return this.major === 0
            && this.minor === 0
            && this.patch === 0;
    }

    compareTo(b: Version): number {
        const a = this;
        return a.equals(b)
            ? !a.label && b.label
                ? 1
                : a.label && !b.label
                    ? -1
                    : Version.compare(a.increment, b.increment)
            // : a.label === b.label
            //     ? Version.compare(a.increment, b.increment)
            //     : Version.compare(a.label, b.label)
            : a.isGreaterThan(b)
                ? 1
                : -1;
    }

    toString(): string {
        const version = this;
        const b: (string | number)[] = [];
        const p = b.push.bind(b)

        p(version.major);
        p(".");
        p(version.minor);
        p(".");
        p(version.patch);
        if (version.label) {
            p("-");
            p(version.label);
            p(".");
            p(version.increment);
        }

        return b.join("");
    }

    private isGreaterThan(b: Version): boolean {
        const a = this;
        return a.major > b.major
            ? true
            : a.major < b.major
                ? false
                : a.minor > b.minor
                    ? true
                    : a.minor < b.minor
                        ? false
                        : a.patch > b.patch;
    }

    private equals(b: Version): boolean {
        const a = this;
        return a.major === b.major &&
            a.minor === b.minor &&
            a.patch === b.patch;
    }

    private static compare<T>(a: T, b: T): number {
        return a === b
            ? 0
            : a > b
                ? 1
                : -1;
    }
}