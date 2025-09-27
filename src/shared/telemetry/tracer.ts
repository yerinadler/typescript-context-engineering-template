import { context, Span, SpanStatusCode, trace, Tracer } from '@opentelemetry/api';

export const getTracer = (name: string, version?: string): Tracer => trace.getTracer(name, version);

export const withSpan = async <T>(
  tracer: Tracer,
  spanName: string,
  handler: (span: Span) => Promise<T>,
  attributes?: Record<string, string | number | boolean>,
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const execute = async (span: Span): Promise<void> => {
      try {
        const result = await handler(span);
        resolve(result);
      } catch (error) {
        span.recordException(error as Error);
        if (error instanceof Error && error.message) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        } else {
          span.setStatus({ code: SpanStatusCode.ERROR });
        }
        reject(error);
      } finally {
        span.end();
      }
    };

    if (attributes) {
      tracer.startActiveSpan(spanName, { attributes }, execute);
    } else {
      tracer.startActiveSpan(spanName, execute);
    }
  });
};

export const withSpanSync = <T>(
  tracer: Tracer,
  spanName: string,
  handler: (span: Span) => T,
  attributes?: Record<string, string | number | boolean>,
): T => {
  const execute = (span: Span): T => {
    try {
      const result = handler(span);
      span.end();
      return result;
    } catch (error) {
      span.recordException(error as Error);
      if (error instanceof Error && error.message) {
        span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      } else {
        span.setStatus({ code: SpanStatusCode.ERROR });
      }
      span.end();
      throw error;
    }
  };

  if (attributes) {
    return tracer.startActiveSpan(spanName, { attributes }, execute);
  }

  return tracer.startActiveSpan(spanName, execute);
};

export const getActiveSpan = (): Span | undefined => trace.getSpan(context.active()) ?? undefined;
