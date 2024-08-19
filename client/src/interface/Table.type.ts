export interface Payment{
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
}

export interface Option {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
    withCount?: boolean
  }

  export interface DataTableFilterField<TData> {
    label: string
    value: keyof TData
    placeholder?: string
    options?: Option[]
  }