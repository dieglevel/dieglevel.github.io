export abstract class BaseEnumHelper<T extends string | number> {
  protected abstract readonly DEFAULT_COLOR: string
  protected abstract readonly DEFAULT_LABEL: string
  protected abstract readonly colorMap: Record<T, string>
  protected abstract readonly labelMap: Record<T, string>
  protected abstract readonly enumObject: Record<string, T>

  public getColor(value: T | null | undefined): string {
    if (!value || !this.isValid(value)) {
      return this.DEFAULT_COLOR
    }
    return this.colorMap[value]
  }

  public getLabel(value: T | null | undefined): string {
    if (!value || !this.isValid(value)) {
      return this.DEFAULT_LABEL
    }
    return this.labelMap[value]
  }

  public getOptions(): Array<{ label: string; value: T; color: string }> {
    return Object.values(this.enumObject).map((val) => ({
      label: this.getLabel(val),
      value: val,
      color: this.getColor(val),
    }))
  }

  public isValid(value: any): value is T {
    return Object.values(this.enumObject).includes(value)
  }
}
