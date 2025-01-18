import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { UtilsService } from '../../services/utils.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  products: any[] = [];
  token: string | null = '';

  constructor(
    private productService: ProductService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private utils: UtilsService,
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    if (this.token) {
      const headers = { Authorization: `Bearer ${this.token}` };
  
      this.productService.getProducts(headers).subscribe(
        (data) => {
          console.log('Products:', data);
          this.products = data;
        },
        (error) => {
          console.error('Failed to load products:', error);
          alert('Failed to load products. Check your token or server.');
        }
      );
  
      this.ngOnInitHandlers();
    } else {
      alert('Authorization token is missing!');
    }
  }  

  generateProductRows(): SafeHtml {
    const rowsHtml = this.products
      .map(
        (product) => `
          <tr>
            <td>${product.id}</td>
            <td>${product.sku}</td>
            <td>${product.name}</td>
            <td>${this.utils.formatCurrency(product.cost)}</td>
            <td>
              <button onclick="window.handleDetails(${product.id})">Details</button>
              <button onclick="window.handleEdit(${product.id})">Edit</button>
              <button onclick="window.handleDelete(${product.id})">Delete</button>
            </td>
          </tr>
        `
      )
      .join('');
    return this.sanitizer.bypassSecurityTrustHtml(rowsHtml);
  }
  
  navigateToCreate() {
    this.router.navigate(['/create']);
  }

  ngOnInitHandlers(): void {
    (window as any).handleDetails = this.handleDetails.bind(this);
    (window as any).handleEdit = this.handleEdit.bind(this);
    (window as any).handleDelete = this.handleDelete.bind(this);
  }

  handleDetails(id: number): void {
    this.router.navigate([`/products/${id}`]);
  }

  handleEdit(id: number): void {
    this.router.navigate([`/edit/${id}`]);
  }

  handleDelete(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      const headers = { Authorization: `Bearer ${this.token}` };
      this.productService.deleteProduct(id, headers).subscribe(
        () => {
          alert('Product deleted successfully!');
          this.products = this.products.filter((product) => product.id !== id);
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Failed to delete product:', error);
          alert('Failed to delete product. Please try again.');
        }
      );
    }
  } 
  
  logout(): void {
    localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
  }  
}
