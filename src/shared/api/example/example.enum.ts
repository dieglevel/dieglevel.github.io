// <Entity>_<Field>_Enum
export enum Example_Status_Enum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

// <Entity>_<Field>_UI
interface EXAMPLE_STATUS_UI_INTERFACE {
  label: string
  color: string
}

export const EXAMPLE_STATUS_UI: Record<
  Example_Status_Enum,
  EXAMPLE_STATUS_UI_INTERFACE
> = {
  [Example_Status_Enum.ACTIVE]: {
    color: 'green',
    label: 'Active',
  },
  [Example_Status_Enum.INACTIVE]: {
    color: 'red',
    label: 'Inactive',
  },
  [Example_Status_Enum.PENDING]: {
    color: 'yellow',
    label: 'Pending',
  },
}
