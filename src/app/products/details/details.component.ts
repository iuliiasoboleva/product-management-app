import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  product: any = null;
  token: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private utils: UtilsService,
  ) {}

  ngOnInit() {
    this.token = localStorage.getItem('authToken');
    const productId = this.route.snapshot.paramMap.get('id');

    if (productId && this.token) {
      const headers = { Authorization: `Bearer ${this.token}` };

      this.productService.getProduct(productId, headers).subscribe(
        (data) => {
          this.product = data;
        },
        (error) => {
          console.error('Failed to load product details:', error);
          alert('Failed to load product details. Please try again.');
        }
      );
    } else {
      alert('Product ID or token is missing!');
    }
  }

  navigateBack(): void {
    this.router.navigate(['/products']);
  }

  getFormattedPrice(): string {
    return this.utils.formatCurrency(this.product?.cost || 0);
  }
  
  generateCustomPropertiesText(): string {
    if (!this.product?.profile) {
      return 'None';
    }

    const customProperties = Object.keys(this.product.profile)
      .filter((key) => !['type', 'available', 'backlog'].includes(key))
      .map((key) => `${key}: ${this.product.profile[key]}`)
      .join(', ');

    return customProperties || 'None';
  }
}
