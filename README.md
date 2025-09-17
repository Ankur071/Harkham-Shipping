# Sakai-NG with Cargo Booking System

A modern Angular application based on the Sakai-NG template, enhanced with a comprehensive cargo booking management system. Built with Angular 20, PrimeNG components, and featuring a hierarchical cargo categorization system.

## 🚀 Features

- **Hierarchical Cargo Booking System**: Advanced multi-level categorization for cargo types
- **Cascading Dropdowns**: Smart form controls that dynamically update based on parent selections
- **Real-world Cargo Categories**: Comprehensive catalog covering 8 major shipping categories
- **Responsive Design**: Built on Sakai-NG's responsive layout system
- **Service-oriented Architecture**: Separated concerns with dedicated API and business logic services

## 📁 Project Structure

### Cargo Booking Component Files

```
src/
├── app/
│   ├── models/
│   │   └── cargo.model.ts                    # Data interfaces and types
│   ├── services/
│   │   ├── cargo-api.service.ts             # HTTP communication layer
│   │   └── cargo.service.ts                 # Business logic and catalog management
│   ├── pages/
│   │   ├── cargo-booking/
│   │   │   ├── cargo-booking.component.ts   # Component logic with cascading dropdowns
│   │   │   ├── cargo-booking.component.html # Template with hierarchical forms
│   │   │   └── cargo-booking.component.scss # Component styling
│   │   └── shipments/
│   │       └── shipments.routes.ts          # Routing configuration
│   └── layout/
│       └── component/
│           └── app.menu.ts                   # Menu configuration with shipments section
└── assets/
    └── data/
        └── cargo-catalog.json                # Hierarchical cargo categories database
```

## 📦 Cargo Booking System

### Hierarchical Categories

The system supports 8 main cargo categories with full subcategorization:

1. **Dry Foodstuffs**
   - Grains & Legumes (Rice, Beans, Wheat/Flour, Corn)
   - Canned/Preserved Foods
   - Sugar & Salt

2. **Clothing & Household Goods**
   - Clothing (Used/Secondhand, New, Textiles)
   - Household Items (Furniture, Appliances, Kitchenware)
   - Personal Care Products

3. **Vehicles & Machinery**
   - Used Vehicles (Cars, Trucks, Motorcycles, Buses)
   - Machinery (Construction, Agricultural, Industrial)
   - Auto Parts (New, Used)

4. **Building Materials**
   - Construction Materials (Cement, Steel, Wood)
   - Finishing Materials (Tiles, Paint, Plumbing)

5. **General Cargo**
   - Barrels/Drums
   - Palletized Goods
   - Boxed Cargo

6. **Refrigerated Cargo**
   - Frozen Foods (Meats, Vegetables, Prepared Foods)
   - Fresh Produce (Fruits, Vegetables)
   - Dairy Products

7. **Medical & Pharmaceutical**
   - Medical Supplies (Equipment, Consumables)
   - Pharmaceuticals

8. **Hazardous / Special Cargo**
   - Flammables (Liquids, Gases)
   - Chemicals
   - Batteries

### Key Features

- **Cascading Selection**: Category → Subcategory → Item Type → Package Type
- **Smart Examples**: Shows common cargo examples for selected items
- **Dynamic Package Types**: Context-aware packaging options
- **Form Validation**: Comprehensive validation with user-friendly error messages
- **Responsive Design**: Mobile-friendly interface

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20)

### Installation Steps

1. Clone the repository:
```bash
git clone [repository-url]
cd sakai-ng/sakai-ng
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Navigate to `http://localhost:4200/` in your browser

## 🚀 Development server

Run `ng serve` or `npm start` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

### Accessing Cargo Booking

1. Once the application is running, navigate to the main page
2. In the left sidebar menu, click on **SHIPMENTS**
3. Select **Cargo Booking**
4. Or directly navigate to: `http://localhost:4200/shipments/cargo-booking`

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## 🔌 API Integration

### Cargo API Service

The cargo booking system is designed to integrate with backend APIs. The `CargoApiService` provides the following endpoints:

- `POST /api/cargo/booking` - Create new booking
- `GET /api/cargo/bookings` - List all bookings
- `GET /api/cargo/booking/:id` - Get booking details
- `PUT /api/cargo/booking/:id` - Update booking
- `DELETE /api/cargo/booking/:id` - Delete booking
- `GET /api/cargo/origins` - Get available origins
- `GET /api/cargo/destinations` - Get available destinations
- `POST /api/cargo/calculate-cost` - Calculate shipping cost

### Data Models

```typescript
interface CargoBooking {
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
}

interface CargoDimensions {
    length: number;
    width: number;
    height: number;
    weight: number;
    unit?: 'cm' | 'inches' | 'meters';
    weightUnit?: 'kg' | 'lbs';
}
```

## 🛠️ Technologies Used

- **Angular 20**: Latest Angular framework
- **PrimeNG 18+**: UI component library
- **RxJS**: Reactive programming
- **TypeScript 5**: Type-safe development
- **Sakai-NG**: Base template for layout and theming
- **Standalone Components**: Modern Angular architecture

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is based on the Sakai-NG template. Please refer to the original license terms.

## 📈 Recent Updates

### Version 1.1.0 - Cargo Booking System
- Added comprehensive cargo booking component
- Implemented hierarchical cargo categorization
- Added cascading dropdown functionality
- Created service layer for API integration
- Added cargo catalog JSON database
- Implemented form validation and error handling
- Added responsive design improvements

## 📚 Additional Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [PrimeNG Components](https://primeng.org/)
- [Sakai-NG Template](https://www.primefaces.org/sakai-ng/)
- [Angular Standalone Components](https://angular.dev/guide/components)
