import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TextareaModule } from 'primeng/textarea';

// Services and models
import { CargoService } from '../../services/cargo.service';
import { CargoBooking, SelectOption } from '../../models/cargo.model';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    selector: 'app-cargo-booking',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        CardModule,
        SelectModule,
        InputTextModule,
        InputNumberModule,
        CheckboxModule,
        DividerModule,
        ToastModule,
        ProgressSpinnerModule,
        TextareaModule
    ],
    templateUrl: './cargo-booking.component.html',
    styleUrls: ['./cargo-booking.component.scss'],
    providers: [MessageService]
})
export class CargoBookingComponent implements OnInit {
    cargoForm!: FormGroup;
    categories: SelectOption[] = [];
    subcategories: SelectOption[] = [];
    itemTypes: SelectOption[] = [];
    packageTypes: SelectOption[] = [];
    itemExamples: string[] = [];
    origins: SelectOption[] = [];
    destinations: SelectOption[] = [];
    loading: boolean = false;
    submitted: boolean = false;
    showExamples: boolean = false;

    constructor(
        private fb: FormBuilder,
        private cargoService: CargoService,
        private messageService: MessageService,
        private router: Router
    ) {
        this.initializeForm();
    }

    ngOnInit(): void {
        this.loadDropdownOptions();
    }

    private initializeForm(): void {
        this.cargoForm = this.fb.group({
            category: [null, Validators.required],
            subcategory: [null, Validators.required],
            itemType: [null, Validators.required],
            packageType: [null, Validators.required],
            description: [null],
            dimensions: this.fb.group({
                length: [null, [Validators.required, Validators.min(0.1)]],
                width: [null, [Validators.required, Validators.min(0.1)]],
                height: [null, [Validators.required, Validators.min(0.1)]],
                weight: [null, [Validators.required, Validators.min(0.1)]]
            }),
            declaredValue: [null, Validators.min(0)],
            insurance: [false],
            origin: [null, Validators.required],
            destination: [null, Validators.required]
        });

        this.setupFormValueChanges();
    }

    private setupFormValueChanges(): void {
        // When category changes, load subcategories
        this.cargoForm.get('category')?.valueChanges.subscribe(category => {
            if (category) {
                this.loadSubcategories(category);
                // Reset dependent fields
                this.cargoForm.patchValue({
                    subcategory: null,
                    itemType: null,
                    packageType: null
                });
                this.itemTypes = [];
                this.packageTypes = [];
                this.itemExamples = [];
                this.showExamples = false;
            }
        });

        // When subcategory changes, load item types
        this.cargoForm.get('subcategory')?.valueChanges.subscribe(subcategory => {
            const category = this.cargoForm.get('category')?.value;
            if (category && subcategory) {
                this.loadItemTypes(category, subcategory);
                // Reset dependent fields
                this.cargoForm.patchValue({
                    itemType: null,
                    packageType: null
                });
                this.packageTypes = [];
                this.itemExamples = [];
                this.showExamples = false;
            }
        });

        // When item type changes, load package types and examples
        this.cargoForm.get('itemType')?.valueChanges.subscribe(itemType => {
            const category = this.cargoForm.get('category')?.value;
            const subcategory = this.cargoForm.get('subcategory')?.value;
            if (category && subcategory && itemType) {
                this.loadPackageTypes(category, subcategory, itemType);
                this.loadItemExamples(category, subcategory, itemType);
                // Reset package type
                this.cargoForm.patchValue({
                    packageType: null
                });
            }
        });
    }

    private loadDropdownOptions(): void {
        // Load categories
        this.cargoService.getCategories().subscribe(
            categories => this.categories = categories,
            error => console.error('Error loading categories:', error)
        );

        // Load origins - with fallback to mock data
        this.cargoService.getOriginOptions().pipe(
            catchError(error => {
                console.error('Error loading origins, using mock data:', error);
                return of(this.cargoService.getMockOrigins());
            })
        ).subscribe(origins => this.origins = origins);

        // Load destinations - with fallback to mock data
        this.cargoService.getDestinationOptions().pipe(
            catchError(error => {
                console.error('Error loading destinations, using mock data:', error);
                return of(this.cargoService.getMockDestinations());
            })
        ).subscribe(destinations => this.destinations = destinations);
    }

    private loadSubcategories(category: string): void {
        this.cargoService.getSubcategories(category).subscribe(
            subcategories => this.subcategories = subcategories,
            error => console.error('Error loading subcategories:', error)
        );
    }

    private loadItemTypes(category: string, subcategory: string): void {
        this.cargoService.getItemTypes(category, subcategory).subscribe(
            itemTypes => this.itemTypes = itemTypes,
            error => console.error('Error loading item types:', error)
        );
    }

    private loadPackageTypes(category: string, subcategory: string, itemType: string): void {
        this.cargoService.getPackageTypes(category, subcategory, itemType).subscribe(
            packageTypes => this.packageTypes = packageTypes,
            error => console.error('Error loading package types:', error)
        );
    }

    private loadItemExamples(category: string, subcategory: string, itemType: string): void {
        this.cargoService.getItemExamples(category, subcategory, itemType).subscribe(
            examples => {
                this.itemExamples = examples;
                this.showExamples = examples.length > 0;
            },
            error => console.error('Error loading examples:', error)
        );
    }

    onSubmit(): void {
        this.submitted = true;

        if (this.cargoForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill in all required fields correctly.'
            });
            return;
        }

        this.loading = true;
        const bookingData: CargoBooking = this.cargoForm.value;

        this.cargoService.createBooking(bookingData).subscribe(
            response => {
                this.loading = false;
                if (response.success) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Cargo booking created successfully!'
                    });
                    
                    // Reset form after successful submission
                    setTimeout(() => {
                        this.resetForm();
                        // Optionally navigate to shipment list
                        // this.router.navigate(['/shipments/list']);
                    }, 2000);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.message || 'Failed to create booking'
                    });
                }
            },
            error => {
                this.loading = false;
                console.error('Booking error:', error);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'An error occurred while creating the booking. Please try again.'
                });
            }
        );
    }

    resetForm(): void {
        this.cargoForm.reset({
            insurance: false
        });
        this.submitted = false;
    }

    calculateCost(): void {
        if (this.cargoForm.valid) {
            const bookingData: CargoBooking = this.cargoForm.value;
            this.cargoService.calculateCost(bookingData).subscribe(
                cost => {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Estimated Cost',
                        detail: `Estimated shipping cost: $${cost.toFixed(2)}`
                    });
                },
                error => {
                    console.error('Cost calculation error:', error);
                    // Fallback calculation
                    const dimensions = this.cargoForm.get('dimensions')?.value;
                    const estimatedCost = (dimensions.length * dimensions.width * dimensions.height * 0.001 + dimensions.weight * 2).toFixed(2);
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Estimated Cost',
                        detail: `Estimated shipping cost: $${estimatedCost}`
                    });
                }
            );
        }
    }

    // Getters for form validation
    get f() { return this.cargoForm.controls; }
    get dimensions() { return this.cargoForm.get('dimensions') as FormGroup; }

    isFieldValid(fieldName: string): boolean {
        const field = this.cargoForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }

    isDimensionFieldValid(fieldName: string): boolean {
        const field = this.dimensions.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
    }
}