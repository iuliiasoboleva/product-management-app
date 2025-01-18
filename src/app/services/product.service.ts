import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://rest-items.research.cloudonix.io/items';

  constructor(private http: HttpClient) {}

  private createHeaders(headers: { Authorization: string }): HttpHeaders {
    return new HttpHeaders(headers);
  }

  getProducts(headers: { Authorization: string }): Observable<Product[]> {
    const httpHeaders = this.createHeaders(headers);
    return this.http.get<Product[]>(this.apiUrl, { headers: httpHeaders });
  }

  getProductById(id: number, token: string): Observable<Product> {
    const httpHeaders = this.createHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get<Product>(`${this.apiUrl}/${id}`, { headers: httpHeaders });
  }

  getProduct(id: string, headers: { Authorization: string }): Observable<Product> {
    const httpHeaders = this.createHeaders(headers);
    return this.http.get<Product>(`${this.apiUrl}/${id}`, { headers: httpHeaders });
  }

  updateProduct(
    id: number,
    product: Product,
    headers: { Authorization: string }
  ): Observable<Product> {
    const httpHeaders = this.createHeaders(headers);
    return this.http.patch<Product>(`${this.apiUrl}/${id}`, product, { headers: httpHeaders });
  }

  createProduct(
    product: Product,
    headers: { Authorization: string }
  ): Observable<Product> {
    const httpHeaders = this.createHeaders(headers);
    return this.http.post<Product>(this.apiUrl, product, { headers: httpHeaders });
  }

  deleteProduct(id: number, headers: { Authorization: string }): Observable<void> {
    const httpHeaders = this.createHeaders(headers);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: httpHeaders });
  }
}
