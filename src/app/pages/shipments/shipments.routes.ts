import { Routes } from '@angular/router';
import { CargoBookingComponent } from '../cargo-booking/cargo-booking.component';

export default [
    { 
        path: 'cargo-booking', 
        component: CargoBookingComponent,
        data: { breadcrumb: 'Cargo Booking' }
    },
    { 
        path: '', 
        redirectTo: 'cargo-booking', 
        pathMatch: 'full' 
    },
    // You can add other shipment-related routes here later
    // { path: 'list', component: ShipmentListComponent },
    // { path: 'orphan-cargo', component: OrphanCargoComponent }
] as Routes;