import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit {
  product: any = {
    name: '',
    description: '',
    sku: '',
    cost: 0,
    profile: {
      type: 'furniture',
      available: true,
      backlog: null
    }
  };
  customKeys: string[] = [];
  newKey: string = '';
  newValue: string = '';
  isEditMode: boolean = false;
  token: string | null = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = localStorage.getItem('authToken');

    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.isEditMode = true;
      // Load product for editing
      this.productService.getProduct(productId, {
        Authorization: `Bearer ${this.token}`
      }).subscribe((data) => {
        this.product = data;
        this.customKeys = Object.keys(this.product.profile).filter(
          (key) => !['type', 'available', 'backlog'].includes(key)
        );
        this.updateCustomPropertiesUI();
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/products']);
  }

  onNameChange(event: Event): void {
    this.product.name = (event.target as HTMLInputElement).value;
  }

  onDescriptionChange(event: Event): void {
    this.product.description = (event.target as HTMLInputElement).value;
  }

  onCostChange(event: Event): void {
    this.product.cost = parseFloat((event.target as HTMLInputElement).value);
  }

  onTypeChange(event: Event): void {
    this.product.profile.type = (event.target as HTMLSelectElement).value;
  }

  onAvailableChange(event: Event): void {
    this.product.profile.available = (event.target as HTMLInputElement).checked;
  }

  onBacklogChange(event: Event): void {
    this.product.profile.backlog = parseInt((event.target as HTMLInputElement).value, 10);
  }

  onSkuChange(event: Event): void {
    this.product.sku = (event.target as HTMLInputElement).value;
  }  

  onCustomPropertyChange(key: string, event: Event): void {
    this.product.profile[key] = (event.target as HTMLInputElement).value;
  }

  onNewKeyChange(event: Event): void {
    this.newKey = (event.target as HTMLInputElement).value;
  }

  onNewValueChange(event: Event): void {
    this.newValue = (event.target as HTMLInputElement).value;
  }

  addCustomProperty(): void {
    if (this.newKey.trim() && this.newValue.trim()) {
      this.product.profile[this.newKey] = this.newValue;
      this.customKeys.push(this.newKey);
  
      this.newKey = '';
      this.newValue = '';
  
      this.updateCustomPropertiesUI();
    } else {
      alert('Please provide both key and value.');
    }
  }

  updateCustomPropertiesUI(): void {
    const container = document.getElementById('custom-properties-container');
    if (!container) return;
  
    container.innerHTML = '';
  
    this.customKeys.forEach((key) => {
      const propertyDiv = document.createElement('div');
      propertyDiv.classList.add('custom-property');
  
      const keyLabel = document.createElement('strong');
      keyLabel.textContent = `${key}:`;
  
      const valueSpan = document.createElement('span');
      valueSpan.textContent = this.product.profile[key];

      propertyDiv.appendChild(keyLabel);
      propertyDiv.appendChild(valueSpan);
  
      container.appendChild(propertyDiv);
    });
  }  

  generateCustomPropertiesHTML(): string {
    return this.customKeys
      .map((key, index) => {
        const value = this.product.profile[key];
        return `
          <div>
            <label>
              ${key}:
              <input
                type="text"
                value="${value || ''}"
                oninput="window.handleCustomPropertyChange('${key}', this.value)"
              />
            </label>
          </div>
        `;
      })
      .join('');
  }

  onSubmit(event: Event): void {
    event.preventDefault();
  
    const headers = { Authorization: `Bearer ${this.token}` };
    const productData = { ...this.product };
  
    if (this.isEditMode) {
      delete productData.sku; // Ensure SKU is not sent in edit mode
    }
  
    if (!this.product.sku.trim()) {
      alert('SKU is required.');
      return;
    }
  
    // Debug: Check the product data before submission
    console.log('Submitting product data:', productData);
  
    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id, productData, headers).subscribe(
        () => alert('Product updated successfully!'),
        (error) => console.error('Failed to update product:', error)
      );
    } else {
      this.productService.createProduct(productData, headers).subscribe(
        () => alert('Product created successfully!'),
        (error) => console.error('Failed to create product:', error)
      );
    }
  }      
}
