import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { CargoApiService } from './cargo-api.service';
import { CargoBooking, CargoBookingResponse, CargoCatalog, SelectOption } from '../models/cargo.model';

@Injectable({
    providedIn: 'root'
})
export class CargoService {
    private currentBookingSubject = new BehaviorSubject<CargoBooking | null>(null);
    public currentBooking$ = this.currentBookingSubject.asObservable();
    
    private cargoCatalogSubject = new BehaviorSubject<CargoCatalog | null>(null);
    public cargoCatalog$ = this.cargoCatalogSubject.asObservable();

    private origins = [
        { label: 'Miami Warehouse', value: 'Miami Warehouse' },
        { label: 'New York Hub', value: 'New York Hub' },
        { label: 'Los Angeles Center', value: 'Los Angeles Center' },
        { label: 'Chicago Terminal', value: 'Chicago Terminal' },
        { label: 'Houston Depot', value: 'Houston Depot' }
    ];

    private destinations = [
        { label: 'Haiti Port', value: 'Haiti Port' },
        { label: 'Santo Domingo', value: 'Santo Domingo' },
        { label: 'Kingston Jamaica', value: 'Kingston Jamaica' },
        { label: 'Nassau Bahamas', value: 'Nassau Bahamas' },
        { label: 'San Juan Puerto Rico', value: 'San Juan Puerto Rico' }
    ];

    constructor(
        private cargoApiService: CargoApiService,
        private http: HttpClient
    ) {
        this.loadCargoCatalog();
    }

    /**
     * Load cargo catalog from JSON file
     */
    private loadCargoCatalog(): void {
        this.http.get<CargoCatalog>('assets/data/cargo-catalog.json')
            .pipe(
                catchError(error => {
                    console.error('Error loading cargo catalog:', error);
                    // Return a default catalog structure if loading fails
                    return of(this.getDefaultCatalog());
                })
            )
            .subscribe(catalog => {
                if (catalog) {
                    this.cargoCatalogSubject.next(catalog);
                    console.log('Cargo catalog loaded successfully', catalog);
                }
            });
    }

    /**
     * Get all categories from catalog
     */
    getCategories(): Observable<SelectOption[]> {
        return this.cargoCatalog$.pipe(
            map(catalog => {
                if (!catalog) return [];
                return Object.keys(catalog.cargoCatalog).map(key => ({
                    label: key,
                    value: key
                }));
            })
        );
    }

    /**
     * Get subcategories for a specific category
     */
    getSubcategories(category: string): Observable<SelectOption[]> {
        return this.cargoCatalog$.pipe(
            map(catalog => {
                if (!catalog || !catalog.cargoCatalog[category]) return [];
                return Object.keys(catalog.cargoCatalog[category]).map(key => ({
                    label: key,
                    value: key
                }));
            })
        );
    }

    /**
     * Get item types for a specific subcategory
     */
    getItemTypes(category: string, subcategory: string): Observable<SelectOption[]> {
        return this.cargoCatalog$.pipe(
            map(catalog => {
                if (!catalog || !catalog.cargoCatalog[category] || 
                    !catalog.cargoCatalog[category][subcategory]) return [];
                return Object.keys(catalog.cargoCatalog[category][subcategory]).map(key => ({
                    label: key,
                    value: key
                }));
            })
        );
    }

    /**
     * Get package types for a specific item
     */
    getPackageTypes(category: string, subcategory: string, itemType: string): Observable<SelectOption[]> {
        return this.cargoCatalog$.pipe(
            map(catalog => {
                if (!catalog || !catalog.cargoCatalog[category] || 
                    !catalog.cargoCatalog[category][subcategory] ||
                    !catalog.cargoCatalog[category][subcategory][itemType]) return [];
                
                const item = catalog.cargoCatalog[category][subcategory][itemType];
                return item.packageTypes.map(type => ({
                    label: type,
                    value: type
                }));
            })
        );
    }

    /**
     * Get examples for a specific item
     */
    getItemExamples(category: string, subcategory: string, itemType: string): Observable<string[]> {
        return this.cargoCatalog$.pipe(
            map(catalog => {
                if (!catalog || !catalog.cargoCatalog[category] || 
                    !catalog.cargoCatalog[category][subcategory] ||
                    !catalog.cargoCatalog[category][subcategory][itemType]) return [];
                
                return catalog.cargoCatalog[category][subcategory][itemType].examples;
            })
        );
    }

    /**
     * Get origins for dropdown
     */
    getOriginOptions(): Observable<any[]> {
        // First try to get from API, fallback to local data
        return this.cargoApiService.getOrigins().pipe(
            map(origins => {
                if (origins && origins.length > 0) {
                    return origins.map(origin => ({ label: origin, value: origin }));
                }
                return this.origins;
            }),
            catchError(() => {
                // Return mock data on error
                return of(this.origins);
            })
        );
    }

    /**
     * Get destinations for dropdown
     */
    getDestinationOptions(): Observable<any[]> {
        // First try to get from API, fallback to local data
        return this.cargoApiService.getDestinations().pipe(
            map(destinations => {
                if (destinations && destinations.length > 0) {
                    return destinations.map(dest => ({ label: dest, value: dest }));
                }
                return this.destinations;
            }),
            catchError(() => {
                // Return mock data on error
                return of(this.destinations);
            })
        );
    }

    /**
     * Create a new cargo booking
     */
    createBooking(bookingData: CargoBooking): Observable<CargoBookingResponse> {
        // Add validation logic here if needed
        const validatedData = this.validateBookingData(bookingData);
        
        return this.cargoApiService.createCargoBooking(validatedData).pipe(
            tap(response => {
                if (response.success && response.data) {
                    this.currentBookingSubject.next(response.data);
                }
            })
        );
    }

    /**
     * Get all bookings
     */
    getAllBookings(): Observable<CargoBooking[]> {
        return this.cargoApiService.getAllCargoBookings();
    }

    /**
     * Get booking by ID
     */
    getBookingById(id: string): Observable<CargoBooking> {
        return this.cargoApiService.getCargoBookingById(id).pipe(
            tap(booking => this.currentBookingSubject.next(booking))
        );
    }

    /**
     * Update booking
     */
    updateBooking(id: string, bookingData: Partial<CargoBooking>): Observable<CargoBookingResponse> {
        return this.cargoApiService.updateCargoBooking(id, bookingData);
    }

    /**
     * Delete booking
     */
    deleteBooking(id: string): Observable<CargoBookingResponse> {
        return this.cargoApiService.deleteCargoBooking(id);
    }

    /**
     * Calculate shipping cost
     */
    calculateCost(bookingData: CargoBooking): Observable<number> {
        return this.cargoApiService.calculateShippingCost(bookingData).pipe(
            map(response => response.cost)
        );
    }

    /**
     * Validate booking data
     */
    private validateBookingData(data: CargoBooking): CargoBooking {
        // Add any validation logic here
        if (!data.category || !data.subcategory || !data.itemType) {
            throw new Error('Category, subcategory, and item type are required');
        }
        if (!data.packageType) {
            throw new Error('Package type is required');
        }
        if (!data.origin || !data.destination) {
            throw new Error('Origin and destination are required');
        }
        if (!data.dimensions || !data.dimensions.length || !data.dimensions.width || 
            !data.dimensions.height || !data.dimensions.weight) {
            throw new Error('All dimensions are required');
        }
        
        return data;
    }

    /**
     * Reset current booking
     */
    resetCurrentBooking(): void {
        this.currentBookingSubject.next(null);
    }

    /**
     * Get mock origins for testing (when API is not available)
     */
    getMockOrigins(): any[] {
        return this.origins;
    }

    /**
     * Get mock destinations for testing (when API is not available)
     */
    getMockDestinations(): any[] {
        return this.destinations;
    }

    /**
     * Get default catalog structure as fallback
     */
    private getDefaultCatalog(): CargoCatalog {
        return {
            cargoCatalog: {
                'Dry Foodstuffs': {
                    'Grains & Legumes': {
                        'Rice': {
                            packageTypes: ['Sack (25kg/50kg)', 'Box', 'Other'],
                            examples: ['Jasmine Rice', 'Parboiled Rice']
                        },
                        'Beans': {
                            packageTypes: ['Sack', 'Bag', 'Other'],
                            examples: ['Kidney Beans', 'Black Beans']
                        }
                    }
                },
                'Clothing & Household Goods': {
                    'Clothing': {
                        'Used/Secondhand': {
                            packageTypes: ['Bale', 'Box', 'Bag', 'Other'],
                            examples: ['Mixed Apparel', 'Used Shoes']
                        },
                        'New': {
                            packageTypes: ['Box', 'Polybag', 'Other'],
                            examples: ['T-Shirts', 'Jeans']
                        }
                    }
                },
                'Vehicles & Machinery': {
                    'Used Vehicles': {
                        'Cars': {
                            packageTypes: ['Unit', 'Other'],
                            examples: ['Sedan', 'SUV', 'Pickup Truck', 'Van']
                        },
                        'Trucks': {
                            packageTypes: ['Unit', 'Other'],
                            examples: ['Light Truck', 'Heavy Truck']
                        }
                    },
                    'Machinery': {
                        'Construction': {
                            packageTypes: ['Unit', 'Crate', 'Other'],
                            examples: ['Backhoe', 'Cement Mixer']
                        }
                    }
                },
                'General Cargo': {
                    'Barrels/Drums': {
                        'Liquids': {
                            packageTypes: ['Barrel', 'Drum', 'Other'],
                            examples: ['Cooking Oil', 'Paint']
                        }
                    },
                    'Palletized Goods': {
                        'Electronics': {
                            packageTypes: ['Pallet', 'Crate', 'Other'],
                            examples: ['Electronics', 'Computers']
                        }
                    }
                }
            },
            packageTypesMaster: [
                'Box', 'Bag', 'Bale', 'Sack', 'Pallet', 'Crate',
                'Drum', 'Barrel', 'Unit', 'Other'
            ]
        };
    }
}