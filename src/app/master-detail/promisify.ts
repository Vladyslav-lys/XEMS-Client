import { Observable, isObservable } from 'rxjs';

type UnPromisify<T> = T extends Promise<infer U> ? U : (T extends Observable<infer E> ? E : T);

type UnPromisifiedObject<T> = {
  [k in keyof T]: UnPromisify<T[k]>
};

type ObjectWithPromise<T> = {
  [key: string]: Observable<T> | Promise<T> | T
};

export async function promiseProps<T extends ObjectWithPromise<any>>(obj: T): Promise<UnPromisifiedObject<T>> {
    const keys = Object.keys(obj);

    const awaitables = keys
      .map(key => obj[key])
      .map(value => isObservable(value) ? value.toPromise() : Promise.resolve(value));

    const values = await Promise.all(awaitables);
    const result = {} as any;

    keys.forEach((key, i) => {
        result[key] = values[i];
    });
    return result as UnPromisifiedObject<T>;
}
