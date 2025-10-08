'use client';
// A simple toast service using alert() for demonstration purposes.
// we will replace it with a proper toast implementation later.

export enum ToastType {
  SUCCESS = 'success',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
}

class ToastService {
  private formatMessage(type: ToastType, message: string): string {
    return `${type.toUpperCase()}: ${message}`;
  }

  show(message: string, type: ToastType = ToastType.INFO): void {
    alert(this.formatMessage(type, message));
  }

  success(message: string): void {
    this.show(message, ToastType.SUCCESS);
  }

  error(message: string): void {
    this.show(message, ToastType.ERROR);
  }

  warning(message: string): void {
    this.show(message, ToastType.WARNING);
  }

  info(message: string): void {
    this.show(message, ToastType.INFO);
  }

  clear(): void {
    // No-op for now since we're just using alert()
  }
}

export const toastService = new ToastService();
