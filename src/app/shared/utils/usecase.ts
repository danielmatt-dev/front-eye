import { Either } from 'fp-ts/Either';

export interface UseCase<T, Params> {
    call(params: Params): Promise<Either<Error, T>>;
}

export class NoParams {}
