export interface UseCase<TInput = unknown, TOutput = unknown> {
  execute(input: TInput): TOutput | Promise<TOutput>;
}
