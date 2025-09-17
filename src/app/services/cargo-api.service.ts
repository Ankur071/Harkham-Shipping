import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CargoBooking, CargoBookingResponse } from '../models/cargo.model';

@Injectable({
    providedIn: 'root'
})
export class CargoApiService {
    private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor(private http: HttpClient) {}

    /**
     * Create a new cargo booking
     */
    createCargoBooking(cargoData: CargoBooking): Observable<CargoBookingResponse> {
        return this.http.post<CargoBookingResponse>(
            `${this.apiUrl}/cargo/booking`,
            cargoData,
            this.httpOptions
        ).pipe(
            map(response => {
                console.log('Cargo booking created successfully:', response);
                return response;
            }),
            catchError(this.handleError)
        );
    }

    /**
     * Get all cargo bookings
     */
    getAllCargoBookings(): Observable<CargoBooking[]> {
        return this.http.get<CargoBooking[]>(`${this.apiUrl}/cargo/bookings`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get cargo booking by ID
     */
    getCargoBookingById(id: string): Observable<CargoBooking> {
        return this.http.get<CargoBooking>(`${this.apiUrl}/cargo/booking/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Update cargo booking
     */
    updateCargoBooking(id: string, cargoData: Partial<CargoBooking>): Observable<CargoBookingResponse> {
        return this.http.put<CargoBookingResponse>(
            `${this.apiUrl}/cargo/booking/${id}`,
            cargoData,
            this.httpOptions
        ).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Delete cargo booking
     */
    deleteCargoBooking(id: string): Observable<CargoBookingResponse> {
        return this.http.delete<CargoBookingResponse>(`${this.apiUrl}/cargo/booking/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get available destinations
     */
    getDestinations(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/cargo/destinations`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Get available origins
     */
    getOrigins(): Observable<string[]> {
        return this.http.get<string[]>(`${this.apiUrl}/cargo/origins`).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Calculate shipping cost
     */
    calculateShippingCost(cargoData: CargoBooking): Observable<{ cost: number }> {
        return this.http.post<{ cost: number }>(
            `${this.apiUrl}/cargo/calculate-cost`,
            cargoData,
            this.httpOptions
        ).pipe(
            catchError(this.handleError)
        );
    }

    /**
     * Handle HTTP errors
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An error occurred';
        
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}