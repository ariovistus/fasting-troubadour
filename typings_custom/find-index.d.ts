interface Array<T> {
    findIndex(callback: (element: T, index?: number, array?: Array<T>) => boolean, thisArg?: any): number;
}
