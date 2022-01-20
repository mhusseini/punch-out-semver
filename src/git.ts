export interface Git {
    branch: string;
    cwd: string;

    listTags(filter: string): Promise<string>;

    addTag(tag: string): Promise<string>;

    pushTags(): Promise<void>;
}

