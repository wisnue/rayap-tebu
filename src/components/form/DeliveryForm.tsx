import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../hooks/useApp';
import { Delivery } from '../../lib/db';
import Popup from '../ui/Popup';

const DeliveryForm = () => {
  const navigate = useNavigate();
  const {
    locations,
    factories,
    drivers,
    addDelivery,
    getTransportPrice,
    getDriverTruck
  } = useApp();

  const [formData, setFormData] = useState<Partial<Delivery>>({
    locationId: 0,
    factoryId: 0,
    driverId: 0,
    deliveryDate: new Date(),
    sugarcaneWeight: 0,
    sugarcanePrice: 0,
    harvestPrice: 0,
    harvestCost: 0,
    transportCost: 0,
    grossAmount: 0,
    netAmount: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-populate truck number when driver is selected
  useEffect(() => {
    if (formData.driverId) {
      const truckNumber = getDriverTruck(formData.driverId);
      setFormData(prev => ({ ...prev, truckNumber }));
    }
  }, [formData.driverId, getDriverTruck]);

  // Auto-calculate transport price when factory is selected
  useEffect(() => {
    if (formData.factoryId) {
      const transportPrice = getTransportPrice(formData.factoryId);
      setFormData(prev => ({ ...prev, transportPrice }));
    }
  }, [formData.factoryId, getTransportPrice]);

  // Auto-calculate costs and amounts
  useEffect(() => {
    const { sugarcaneWeight, sugarcanePrice, harvestPrice, transportPrice } = formData;
    
    if (sugarcaneWeight && harvestPrice) {
      const harvestCost = sugarcaneWeight * harvestPrice;
      setFormData(prev => ({ ...prev, harvestCost }));
    }
    
    if (sugarcaneWeight && transportPrice) {
      const transportCost = sugarcaneWeight * transportPrice;
      setFormData(prev => ({ ...prev, transportCost }));
    }
    
    if (sugarcaneWeight && sugarcanePrice) {
      const grossAmount = sugarcaneWeight * sugarcanePrice;
      setFormData(prev => ({ ...prev, grossAmount }));
    }
    
    if (formData.grossAmount && formData.harvestCost && formData.transportCost) {
      const netAmount = formData.grossAmount - formData.harvestCost - formData.transportCost;
      setFormData(prev => ({ ...prev, netAmount }));
    }
  }, [
    formData.sugarcaneWeight,
    formData.sugarcanePrice,
    formData.harvestPrice,
    formData.transportPrice,
    formData.grossAmount,
    formData.harvestCost,
    formData.transportCost
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric values
    if (['sugarcaneWeight', 'sugarcanePrice', 'harvestPrice'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (['locationId', 'factoryId', 'driverId'].includes(name)) {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name === 'deliveryDate') {
      setFormData(prev => ({ ...prev, [name]: new Date(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      locationId: 0,
      factoryId: 0,
      driverId: 0,
      deliveryDate: new Date(),
      sugarcaneWeight: 0,
      sugarcanePrice: 0,
      harvestPrice: 0,
      harvestCost: 0,
      transportCost: 0,
      grossAmount: 0,
      netAmount: 0
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.locationId || !formData.factoryId || !formData.driverId || 
        !formData.sugarcaneWeight || !formData.sugarcanePrice || !formData.harvestPrice) {
      setErrorMessage('Silakan isi semua kolom yang diperlukan');
      setShowErrorPopup(true);
      return;
    }
    
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      
      // Create delivery object
      const delivery: Delivery = {
        locationId: formData.locationId!,
        factoryId: formData.factoryId!,
        driverId: formData.driverId!,
        deliveryDate: formData.deliveryDate!,
        sugarcaneWeight: formData.sugarcaneWeight!,
        sugarcanePrice: formData.sugarcanePrice!,
        harvestPrice: formData.harvestPrice!,
        harvestCost: formData.harvestCost!,
        transportCost: formData.transportCost!,
        grossAmount: formData.grossAmount!,
        netAmount: formData.netAmount!
      };
      
      await addDelivery(delivery);
      
      // Reset form
      resetForm();
      
      // Show success popup
      setShowSuccessPopup(true);
    } catch (error) {
      console.error('Error adding delivery:', error);
      setErrorMessage('Gagal menambahkan data pengiriman');
      setShowErrorPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddAnother = () => {
    setShowSuccessPopup(false);
    resetForm();
  };

  const handleGoToDashboard = () => {
    setShowSuccessPopup(false);
    navigate('/');
  };

  return (
    <div className="container">
      <div className="card max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Form Pengiriman Tebu</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Location */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Lokasi
              </label>
              <select
                name="locationId"
                value={formData.locationId || ''}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Pilih Lokasi</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sugar Factory */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Pabrik Gula
              </label>
              <select
                name="factoryId"
                value={formData.factoryId || ''}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Pilih Pabrik</option>
                {factories.map(factory => (
                  <option key={factory.id} value={factory.id}>
                    {factory.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Delivery Date */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Tanggal Pengiriman
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate ? formData.deliveryDate.toISOString().split('T')[0] : ''}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            {/* Driver */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Sopir
              </label>
              <select
                name="driverId"
                value={formData.driverId || ''}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Pilih Sopir</option>
                {drivers.map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Truck Number (Auto-filled) */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Nomor Truk
              </label>
              <input
                type="text"
                value={formData.truckNumber || ''}
                className="form-input bg-gray-100"
                disabled
              />
            </div>
            
            {/* Transport Price (Auto-calculated) */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Harga Transport (per kwintal)
              </label>
              <input
                type="text"
                value={formData.transportPrice ? `Rp ${formData.transportPrice.toLocaleString()}` : ''}
                className="form-input bg-gray-100"
                disabled
              />
            </div>
            
            {/* Harvest Price - Changed to "Harga Tebang" */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Harga Tebang (per kwintal)
              </label>
              <input
                type="number"
                name="harvestPrice"
                value={formData.harvestPrice || ''}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            {/* Sugarcane Weight */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Berat Tebu (kwintal)
              </label>
              <input
                type="number"
                name="sugarcaneWeight"
                value={formData.sugarcaneWeight || ''}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            {/* Sugarcane Price */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Harga Tebu (per kwintal)
              </label>
              <input
                type="number"
                name="sugarcanePrice"
                value={formData.sugarcanePrice || ''}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            {/* Harvest Cost - Changed to "Biaya Tebang" */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Biaya Tebang
              </label>
              <input
                type="text"
                value={formData.harvestCost ? `Rp ${formData.harvestCost.toLocaleString()}` : ''}
                className="form-input bg-gray-100"
                disabled
              />
            </div>
            
            {/* Transport Cost (Auto-calculated) */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Biaya Transport
              </label>
              <input
                type="text"
                value={formData.transportCost ? `Rp ${formData.transportCost.toLocaleString()}` : ''}
                className="form-input bg-gray-100"
                disabled
              />
            </div>
            
            {/* Gross Amount (Auto-calculated) */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Jumlah Brutto
              </label>
              <input
                type="text"
                value={formData.grossAmount ? `Rp ${formData.grossAmount.toLocaleString()}` : ''}
                className="form-input bg-gray-100"
                disabled
              />
            </div>
            
            {/* Net Amount (Auto-calculated) */}
            <div className="col-span-1 form-group">
              <label className="form-label">
                Jumlah Netto
              </label>
              <input
                type="text"
                value={formData.netAmount ? `Rp ${formData.netAmount.toLocaleString()}` : ''}
                className="form-input bg-gray-100"
                disabled
              />
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-secondary mr-4"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>

      {/* Success Popup */}
      <Popup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Berhasil!"
        message="Data pengiriman tebu berhasil disimpan."
        type="success"
        actions={
          <>
            <button 
              className="btn btn-primary" 
              onClick={handleAddAnother}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Tambah Data Lagi
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={handleGoToDashboard}
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Ke Dashboard
            </button>
          </>
        }
      />

      {/* Error Popup */}
      <Popup
        isOpen={showErrorPopup}
        onClose={() => setShowErrorPopup(false)}
        title="Gagal!"
        message={errorMessage}
        type="error"
        actions={
          <button 
            className="btn btn-primary" 
            onClick={() => setShowErrorPopup(false)}
          >
            Coba Lagi
          </button>
        }
      />
    </div>
  );
};

export default DeliveryForm;
