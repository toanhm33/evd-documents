import { useState } from 'react'

type FieldErrors<T> = Partial<Record<keyof T, string>>
type ValidateFn<T> = (draft: T) => FieldErrors<T>

interface UseInlineEditOptions<T> {
  initialValues: T
  validate?: ValidateFn<T>
}

export function useInlineEdit<T extends object>({
  initialValues,
  validate,
}: UseInlineEditOptions<T>) {
  const [draft, setDraft] = useState<T>(initialValues)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<T>>({})

  const isDirty = (Object.keys(initialValues as object) as (keyof T)[]).some(
    (key) => draft[key] !== initialValues[key],
  )

  const updateField = <K extends keyof T>(field: K, value: T[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const runValidate = (): boolean => {
    if (!validate) return true
    const errors = validate(draft)
    const hasErrors = Object.values(errors).some(Boolean)
    if (hasErrors) {
      setFieldErrors(errors)
      return false
    }
    return true
  }

  const reset = () => {
    setDraft(initialValues)
    setFieldErrors({})
  }

  return { draft, isDirty, fieldErrors, updateField, runValidate, reset }
}
