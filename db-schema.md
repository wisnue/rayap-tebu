# Database Schema for Sugarcane Farming Tracking Application

## Tables

### 1. Locations
- `id` (Primary Key, Auto Increment)
- `name` (String) - Name of the location (e.g., Gembol, Natah, Gunung Celeng, Pribadi)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 2. SugarFactories
- `id` (Primary Key, Auto Increment)
- `name` (String) - Name of the sugar factory (e.g., PG Geneng, PG Rejo Agung)
- `transport_price` (Number) - Price per kwintal for transport to this factory
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 3. Drivers
- `id` (Primary Key, Auto Increment)
- `name` (String) - Name of the driver (e.g., Pras, Duwex)
- `truck_number` (String) - Truck number associated with this driver
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### 4. Deliveries
- `id` (Primary Key, Auto Increment)
- `location_id` (Foreign Key to Locations)
- `factory_id` (Foreign Key to SugarFactories)
- `driver_id` (Foreign Key to Drivers)
- `delivery_date` (Date) - Date of delivery
- `sugarcane_weight` (Number) - Weight in kwintal
- `sugarcane_price` (Number) - Price per kwintal
- `harvest_price` (Number) - Price per kwintal for harvesting
- `harvest_cost` (Number) - Total harvesting cost (calculated)
- `transport_cost` (Number) - Total transport cost (calculated)
- `gross_amount` (Number) - Gross amount (calculated)
- `net_amount` (Number) - Net amount (calculated)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Relationships
- Each Delivery is associated with one Location
- Each Delivery is associated with one SugarFactory
- Each Delivery is associated with one Driver

## Initial Data

### Locations
1. Gembol
2. Natah
3. Gunung Celeng
4. Pribadi

### Sugar Factories
1. PG Geneng (transport_price: 9000)
2. PG Rejo Agung (transport_price: 11000)
3. PG Pagotan (transport_price: 11000)
4. PG Kecap (transport_price: 7000)
5. PG Glodok (transport_price: 10000)

### Drivers
1. Pras (with associated truck number)
2. Duwex (with associated truck number)

## Data Storage Implementation
For a Progressive Web App, we'll implement this schema using:
- IndexedDB for local storage
- JSON structure for data exchange
- LocalStorage for application settings

This will allow the application to work offline while maintaining data integrity and relationships.
