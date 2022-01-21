declare global {
    interface RegExp {
        execAllGen(input: string): Generator<RegExpExecArray, void>;

        execAll(input: string): RegExpExecArray[];
    }
}

export default {
    extend() {
        RegExp.prototype.execAllGen = function* (input: string) {
            for (let match; (match = this.exec(input)) !== null;)
                yield match;
        };

        RegExp.prototype.execAll = function (input: string) {
            return [...this.execAllGen(input)]
        }
    }
};