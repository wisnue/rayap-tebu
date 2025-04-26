import { useState } from 'react';
import LocationSettings from '../components/settings/LocationSettings';
import FactorySettings from '../components/settings/FactorySettings';
import DriverSettings from '../components/settings/DriverSettings';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<'locations' | 'factories' | 'drivers'>('locations');

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Pengaturan</h1>
      
      <div className="card max-w-4xl mx-auto mb-6">
        {/* Updated tab design using settings-tabs class from ui-updates-v2.css */}
        <div className="settings-tabs">
          <button
            onClick={() => setActiveTab('locations')}
            className={`settings-tab ${activeTab === 'locations' ? 'settings-tab-active' : ''}`}
          >
            <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Lokasi
          </button>
          <button
            onClick={() => setActiveTab('factories')}
            className={`settings-tab ${activeTab === 'factories' ? 'settings-tab-active' : ''}`}
          >
            <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
            </svg>
            Pabrik Gula
          </button>
          <button
            onClick={() => setActiveTab('drivers')}
            className={`settings-tab ${activeTab === 'drivers' ? 'settings-tab-active' : ''}`}
          >
            <svg className="w-5 h-5 mr-2 inline-block" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            Sopir
          </button>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {activeTab === 'locations' && <LocationSettings />}
        {activeTab === 'factories' && <FactorySettings />}
        {activeTab === 'drivers' && <DriverSettings />}
      </div>
    </div>
  );
};

export default SettingsPage;
