import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  token: string = ''; // Поле для хранения токена

  onInputChange(event: Event) {
    // Получаем значение из input
    const inputElement = event.target as HTMLInputElement;
    this.token = inputElement.value;
  }

  login() {
    if (!this.token.trim()) {
      alert('Please enter a valid token (it cannot be empty or just spaces).');
      return;
    }
  
    console.log('Token:', this.token);
  
    // Сохранение токена в localStorage
    localStorage.setItem('authToken', this.token);
  
    // Навигация на страницу с продуктами
    alert('Login successful! Redirecting to product list...');
    window.location.href = '/products'; // Переход на список продуктов
  }  
}
