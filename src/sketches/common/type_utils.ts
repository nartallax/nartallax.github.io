/* Получить union-тип с именами таких полей E, которые имеют тип T
Да, это выражение нужно писать именно так
Первое условие позволяет задействовать union distribution, что как бы итерируется по кускам K
Второе условие на самом деле проверяет, нужно ли включать этот элемент K в результат
https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
https://www.typescriptlang.org/docs/handbook/advanced-types.html */
export type FieldsOfObjectWithType<E, T, K extends keyof E = keyof E> = K extends keyof(E)? E[K] extends T? K: never: never

// source: https://stackoverflow.com/a/52473108/6830444
type IfEquals<X, Y, A, B> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;

export type WritableKeysOf<T> = {
    [P in keyof T]: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P, never>
}[keyof T];