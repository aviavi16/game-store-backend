// src/utils/timeoutPromise.ts
export function timeoutPromise<T>(promise: Promise<T>, timeoutMs: number, gameName: string): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout importing game "${gameName}" after ${timeoutMs}ms`)),
          timeoutMs
        )
      ),
    ])
  }
  