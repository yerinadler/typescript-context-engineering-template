export type InputOrUndefined<TInput> = TInput extends void ? void | undefined : TInput;

export interface UseCase<TInput = void, TOutput = void> {
  execute(input: InputOrUndefined<TInput>): Promise<TOutput> | TOutput;
}

export abstract class BaseUseCase<TInput = void, TOutput = void> implements UseCase<TInput, TOutput> {
  abstract execute(input: InputOrUndefined<TInput>): Promise<TOutput> | TOutput;
}
