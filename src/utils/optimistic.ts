type OptimisticParams<T> = {
  applyOptimistic: () => (() => void) | void
  request: () => Promise<T>
  onSuccess?: (result: T) => void | Promise<void>
  onError?: (error: unknown) => void | Promise<void>
  onFinally?: () => void | Promise<void>
}

export async function withOptimisticUpdate<T>({
  applyOptimistic,
  request,
  onSuccess,
  onError,
  onFinally,
}: OptimisticParams<T>) {
  const rollback = applyOptimistic() || (() => {})
  try {
    const result = await request()
    await onSuccess?.(result)
    return result
  } catch (error) {
    rollback()
    await onError?.(error)
    throw error
  } finally {
    await onFinally?.()
  }
}
