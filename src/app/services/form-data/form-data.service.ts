import { Injectable } from '@angular/core';
import { FormData } from './form-data.model';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private readonly STORAGE_KEY = 'cvFormData';

  setFormData(data: FormData): void {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getFormData(): FormData | null {
    const data = sessionStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  clearFormData(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

}
