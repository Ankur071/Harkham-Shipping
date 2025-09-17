export interface CargoBooking {
    id?: string;
    category: string;
    subcategory: string;
    itemType: string;
    packageType: string;
    description?: string;
    dimensions: CargoDimensions;
    declaredValue?: number;
    insurance?: boolean;
    origin: string;
    destination: string;
    createdDate?: Date;
    status?: CargoStatus;
}

export interface CargoDimensions {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit?: 'cm' | 'inches' | 'meters';
    weightUnit?: 'kg' | 'lbs';
}

export enum CargoType {
    BOX = 'Box',
    PALLET = 'Pallet',
    CONTAINER = 'Container',
    BULK = 'Bulk',
    FRAGILE = 'Fragile'
}

export enum CargoStatus {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
    IN_TRANSIT = 'In Transit',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}

export interface CargoBookingResponse {
    success: boolean;
    message: string;
    data?: CargoBooking;
    error?: any;
}

// Interfaces for Cargo Catalog Structure
export interface CargoItem {
    packageTypes: string[];
    examples: string[];
}

export interface CargoSubcategory {
    [itemType: string]: CargoItem;
}

export interface CargoCategory {
    [subcategory: string]: CargoSubcategory;
}

export interface CargoCatalog {
    cargoCatalog: {
        [category: string]: CargoCategory;
    };
    packageTypesMaster: string[];
}

// Interface for dropdown options
export interface SelectOption {
    label: string;
    value: string;
}
