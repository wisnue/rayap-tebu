import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  initDB, 
  getAll, 
  add, 
  update, 
  remove,
  STORES,
  Location,
  SugarFactory,
  Driver,
  Delivery
} from '../lib/db';

interface AppContextType {
  // Data
  locations: Location[];
  factories: SugarFactory[];
  drivers: Driver[];
  deliveries: Delivery[];
  
  // Loading states
  isLoading: boolean;
  
  // CRUD operations
  addLocation: (location: Location) => Promise<number>;
  updateLocation: (id: number, location: Location) => Promise<void>;
  deleteLocation: (id: number) => Promise<void>;
  
  addFactory: (factory: SugarFactory) => Promise<number>;
  updateFactory: (id: number, factory: SugarFactory) => Promise<void>;
  deleteFactory: (id: number) => Promise<void>;
  
  addDriver: (driver: Driver) => Promise<number>;
  updateDriver: (id: number, driver: Driver) => Promise<void>;
  deleteDriver: (id: number) => Promise<void>;
  
  addDelivery: (delivery: Delivery) => Promise<number>;
  updateDelivery: (id: number, delivery: Delivery) => Promise<void>;
  deleteDelivery: (id: number) => Promise<void>;
  
  // Utility functions
  refreshData: () => Promise<void>;
  getTransportPrice: (factoryId: number) => number;
  getDriverTruck: (driverId: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [factories, setFactories] = useState<SugarFactory[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  // Initialize database and load data
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        await refreshData();
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  // Refresh all data from database
  const refreshData = async () => {
    try {
      setIsLoading(true);
      const [locationsData, factoriesData, driversData, deliveriesData] = await Promise.all([
        getAll<Location>(STORES.LOCATIONS),
        getAll<SugarFactory>(STORES.FACTORIES),
        getAll<Driver>(STORES.DRIVERS),
        getAll<Delivery>(STORES.DELIVERIES)
      ]);

      setLocations(locationsData);
      setFactories(factoriesData);
      setDrivers(driversData);
      
      // Enrich deliveries with joined data
      const enrichedDeliveries = deliveriesData.map(delivery => {
        const location = locationsData.find(l => l.id === delivery.locationId);
        const factory = factoriesData.find(f => f.id === delivery.factoryId);
        const driver = driversData.find(d => d.id === delivery.driverId);
        
        return {
          ...delivery,
          locationName: location?.name,
          factoryName: factory?.name,
          driverName: driver?.name,
          truckNumber: driver?.truckNumber
        };
      });
      
      setDeliveries(enrichedDeliveries);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Utility functions
  const getTransportPrice = (factoryId: number): number => {
    const factory = factories.find(f => f.id === factoryId);
    return factory?.transportPrice || 0;
  };

  const getDriverTruck = (driverId: number): string => {
    const driver = drivers.find(d => d.id === driverId);
    return driver?.truckNumber || '';
  };

  // CRUD operations for locations
  const addLocation = async (location: Location): Promise<number> => {
    const id = await add<Location>(STORES.LOCATIONS, location);
    await refreshData();
    return id;
  };

  const updateLocation = async (id: number, location: Location): Promise<void> => {
    await update<Location>(STORES.LOCATIONS, id, location);
    await refreshData();
  };

  const deleteLocation = async (id: number): Promise<void> => {
    await remove(STORES.LOCATIONS, id);
    await refreshData();
  };

  // CRUD operations for factories
  const addFactory = async (factory: SugarFactory): Promise<number> => {
    const id = await add<SugarFactory>(STORES.FACTORIES, factory);
    await refreshData();
    return id;
  };

  const updateFactory = async (id: number, factory: SugarFactory): Promise<void> => {
    await update<SugarFactory>(STORES.FACTORIES, id, factory);
    await refreshData();
  };

  const deleteFactory = async (id: number): Promise<void> => {
    await remove(STORES.FACTORIES, id);
    await refreshData();
  };

  // CRUD operations for drivers
  const addDriver = async (driver: Driver): Promise<number> => {
    const id = await add<Driver>(STORES.DRIVERS, driver);
    await refreshData();
    return id;
  };

  const updateDriver = async (id: number, driver: Driver): Promise<void> => {
    await update<Driver>(STORES.DRIVERS, id, driver);
    await refreshData();
  };

  const deleteDriver = async (id: number): Promise<void> => {
    await remove(STORES.DRIVERS, id);
    await refreshData();
  };

  // CRUD operations for deliveries
  const addDelivery = async (delivery: Delivery): Promise<number> => {
    const id = await add<Delivery>(STORES.DELIVERIES, delivery);
    await refreshData();
    return id;
  };

  const updateDelivery = async (id: number, delivery: Delivery): Promise<void> => {
    await update<Delivery>(STORES.DELIVERIES, id, delivery);
    await refreshData();
  };

  const deleteDelivery = async (id: number): Promise<void> => {
    await remove(STORES.DELIVERIES, id);
    await refreshData();
  };

  const value = {
    // Data
    locations,
    factories,
    drivers,
    deliveries,
    
    // Loading state
    isLoading,
    
    // CRUD operations
    addLocation,
    updateLocation,
    deleteLocation,
    
    addFactory,
    updateFactory,
    deleteFactory,
    
    addDriver,
    updateDriver,
    deleteDriver,
    
    addDelivery,
    updateDelivery,
    deleteDelivery,
    
    // Utility functions
    refreshData,
    getTransportPrice,
    getDriverTruck
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
