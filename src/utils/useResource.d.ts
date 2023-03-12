/// <reference types="react" />
export declare type ResourceState<T> = {
    data?: T | never;
    isLoading: boolean;
    error?: string | never;
} | {
    data: T;
    isLoading: false;
    error: never;
} | {
    isLoading: false;
    error: string;
    data?: never;
};
export declare function useResource<T = any>(initialState?: ResourceState<T>): [ResourceState<T>, import("react").Dispatch<import("react").SetStateAction<ResourceState<T>>>];
