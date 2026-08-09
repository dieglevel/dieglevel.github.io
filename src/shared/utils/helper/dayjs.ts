import dayjs from 'dayjs'

export class DayjsHelper {
  static formatDate(
    date: string | Date,
    format: string = 'DD/MM/YYYY',
  ): string {
    return dayjs(date).format(format)
  }

  static formatDateTime(
    date: string | Date,
    format: string = 'DD/MM/YYYY HH:mm:ss',
  ): string {
    return dayjs(date).format(format)
  }

  static isBefore(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).isBefore(dayjs(date2))
  }

  static isAfter(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).isAfter(dayjs(date2))
  }

  static isSame(date1: string | Date, date2: string | Date): boolean {
    return dayjs(date1).isSame(dayjs(date2))
  }
}
