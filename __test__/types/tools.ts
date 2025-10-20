type ExtendsTernary<A, B, P, F> = A extends B ? P : F

export type And<T extends boolean[]> = ExtendsTernary<false, T[number], false, true>

export type AssignableTo<A extends B, B> = ExtendsTernary<A, B, true, false>
export type StrictEquals<A, B extends A> = ExtendsTernary<A, B, ExtendsTernary<B, A, true, false>, false>

export type Expect<T extends true> = T
