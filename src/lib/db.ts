// Database schema and initial data

export interface Location {
  id?: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SugarFactory {
  id?: number;
  name: string;
  transportPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Driver {
  id?: number;
  name: string;
  truckNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Delivery {
  id?: number;
  locationId: number;
  factoryId: number;
  driverId: number;
  deliveryDate: Date;
  sugarcaneWeight: number;
  sugarcanePrice: number;
  harvestPrice: number;
  harvestCost: number;
  transportCost: number;
  grossAmount: number;
  netAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Joined data for display
  locationName?: string;
  factoryName?: string;
  driverName?: string;
  truckNumber?: string;
  transportPrice?: number;
}

// Initial data
export const initialLocations: Location[] = [
  { id: 1, name: 'Gembol' },
  { id: 2, name: 'Natah' },
  { id: 3, name: 'Gunung Celeng' },
  { id: 4, name: 'Pribadi' }
];

export const initialSugarFactories: SugarFactory[] = [
  { id: 1, name: 'PG Geneng', transportPrice: 9000 },
  { id: 2, name: 'PG Rejo Agung', transportPrice: 11000 },
  { id: 3, name: 'PG Pagotan', transportPrice: 11000 },
  { id: 4, name: 'PG Kecap', transportPrice: 7000 },
  { id: 5, name: 'PG Glodok', transportPrice: 10000 }
];

export const initialDrivers: Driver[] = [
  { id: 1, name: 'Pras', truckNumber: 'AB-1234-CD' },
  { id: 2, name: 'Duwex', truckNumber: 'AB-5678-EF' }
];

// IndexedDB setup
export const DB_NAME = 'sugarcane-tracker-db';
export const DB_VERSION = 1;

export const STORES = {
  LOCATIONS: 'locations',
  FACTORIES: 'factories',
  DRIVERS: 'drivers',
  DELIVERIES: 'deliveries'
};

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores
      if (!db.objectStoreNames.contains(STORES.LOCATIONS)) {
        const locationsStore = db.createObjectStore(STORES.LOCATIONS, { keyPath: 'id', autoIncrement: true });
        locationsStore.createIndex('name', 'name', { unique: false });
        
        // Add initial locations
        initialLocations.forEach(location => {
          locationsStore.add({
            ...location,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
      
      if (!db.objectStoreNames.contains(STORES.FACTORIES)) {
        const factoriesStore = db.createObjectStore(STORES.FACTORIES, { keyPath: 'id', autoIncrement: true });
        factoriesStore.createIndex('name', 'name', { unique: false });
        
        // Add initial factories
        initialSugarFactories.forEach(factory => {
          factoriesStore.add({
            ...factory,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
      
      if (!db.objectStoreNames.contains(STORES.DRIVERS)) {
        const driversStore = db.createObjectStore(STORES.DRIVERS, { keyPath: 'id', autoIncrement: true });
        driversStore.createIndex('name', 'name', { unique: false });
        
        // Add initial drivers
        initialDrivers.forEach(driver => {
          driversStore.add({
            ...driver,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        });
      }
      
      if (!db.objectStoreNames.contains(STORES.DELIVERIES)) {
        const deliveriesStore = db.createObjectStore(STORES.DELIVERIES, { keyPath: 'id', autoIncrement: true });
        deliveriesStore.createIndex('deliveryDate', 'deliveryDate', { unique: false });
        deliveriesStore.createIndex('locationId', 'locationId', { unique: false });
        deliveriesStore.createIndex('factoryId', 'factoryId', { unique: false });
        deliveriesStore.createIndex('driverId', 'driverId', { unique: false });
      }
    };
  });
};

// Generic CRUD operations
export const getAll = <T>(storeName: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = () => reject('Error opening database');
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getAllRequest = store.getAll();
      
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
      
      getAllRequest.onerror = () => {
        reject('Error getting data');
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

export const getById = <T>(storeName: string, id: number): Promise<T> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = () => reject('Error opening database');
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        resolve(getRequest.result);
      };
      
      getRequest.onerror = () => {
        reject('Error getting data');
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

export const add = <T>(storeName: string, data: T): Promise<number> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = () => reject('Error opening database');
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const addRequest = store.add({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      addRequest.onsuccess = () => {
        resolve(addRequest.result as number);
      };
      
      addRequest.onerror = () => {
        reject('Error adding data');
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

export const update = <T>(storeName: string, id: number, data: T): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = () => reject('Error opening database');
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const updatedData = {
          ...getRequest.result,
          ...data,
          updatedAt: new Date()
        };
        
        const updateRequest = store.put(updatedData);
        
        updateRequest.onsuccess = () => {
          resolve();
        };
        
        updateRequest.onerror = () => {
          reject('Error updating data');
        };
      };
      
      getRequest.onerror = () => {
        reject('Error getting data for update');
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};

export const remove = (storeName: string, id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME);
    
    request.onerror = () => reject('Error opening database');
    
    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const deleteRequest = store.delete(id);
      
      deleteRequest.onsuccess = () => {
        resolve();
      };
      
      deleteRequest.onerror = () => {
        reject('Error deleting data');
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    };
  });
};
