'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'react-hot-toast';
import { calculateRoyalty } from '../services/royalty_calculator';

interface RoyaltyData {
  calculation_date: string;
  inputs: {
    water_gel_kg: number;
    nh4no3_kg: number;
    powder_factor: number;
  };
  calculations: {
    total_explosive_quantity: number;
    basic_volume: number;
    blasted_rock_volume: number;
    base_royalty: number;
    royalty_with_sscl: number;
    total_amount_with_vat: number;
  };
  rates_applied: {
    royalty_rate_per_cubic_meter: number;
    sscl_rate: string;
    vat_rate: string;
  };
}

interface RoyaltyCalculatorProps {
  onCalculated: (data: RoyaltyData) => void;
}

interface SavedCalculation {
  id: string;
  date: string;
  waterGel: number;
  nh4no3: number;
  powderFactor: number;
  totalAmount: number;
  explosiveQuantity: number;
  blastedVolume: number;
  dueDate: string;
}

export default function RoyaltyCalculator({ onCalculated }: RoyaltyCalculatorProps) {
  const [waterGel, setWaterGel] = useState('');
  const [nh4no3, setNh4no3] = useState('');
  const [powderFactor, setPowderFactor] = useState('');
  const [loading, setLoading] = useState(false);
  const [royaltyData, setRoyaltyData] = useState<RoyaltyData | null>(null);
  

  const handleCalculateRoyalty = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await calculateRoyalty({
        water_gel: parseFloat(waterGel),
        nh4no3: parseFloat(nh4no3),
        powder_factor: parseFloat(powderFactor)
      });
      
      setRoyaltyData(data);
      onCalculated(data);
      toast.success('Royalty calculated successfully!');
    } catch (error) {
      console.error('Error calculating royalty:', error);
      toast.error('Failed to calculate royalty. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWaterGel('');
    setNh4no3('');
    setPowderFactor('');
    setRoyaltyData(null);
    toast.success('Calculator reset');
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleCalculateRoyalty} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="waterGel" className="block text-sm font-medium mb-2">
              Water Gel (kg)
            </label>
            <input
              id="waterGel"
              type="number"
              step="0.01"
              value={waterGel}
              onChange={(e) => setWaterGel(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="nh4no3" className="block text-sm font-medium mb-2">
              NH4NO3 (kg)
            </label>
            <input
              id="nh4no3"
              type="number"
              step="0.01"
              value={nh4no3}
              onChange={(e) => setNh4no3(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="powderFactor" className="block text-sm font-medium mb-2">
              Powder Factor
            </label>
            <input
              id="powderFactor"
              type="number"
              step="0.001"
              value={powderFactor}
              onChange={(e) => setPowderFactor(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-800 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Calculating...' : 'Calculate Royalty'}
        </button>
      </form>

      {royaltyData && (
        <div className="mt-8 p-6 bg-gray-800 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Royalty Calculation Results</h2>
            <div className="space-x-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-sm font-medium transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Explosive Quantities</h3>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span>Total Explosive Quantity:</span>
                    <span>{royaltyData.calculations.total_explosive_quantity.toFixed(2)} kg</span>
                  </p>
                  <div className="border-t border-gray-600 my-2" />
                  <p className="flex justify-between text-sm">
                    <span>Water Gel:</span>
                    <span>{royaltyData.inputs.water_gel_kg.toFixed(2)} kg</span>
                  </p>
                  <p className="flex justify-between text-sm">
                    <span>NH4NO3:</span>
                    <span>{royaltyData.inputs.nh4no3_kg.toFixed(2)} kg</span>
                  </p>
                </div>
              </div>
              
              <div className="p-4 bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-400 mb-2">Rock Volume</h3>
                <p className="flex justify-between">
                  <span>Blasted Rock Volume:</span>
                  <span>{royaltyData.calculations.blasted_rock_volume.toFixed(2)} m³</span>
                </p>
              </div>
            </div>

            <div className="p-4 bg-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Details</h3>
              <div className="space-y-2">
                <p className="flex justify-between">
                  <span>Base Royalty:</span>
                  <span>LKR {royaltyData.calculations.base_royalty.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>With SSCL ({royaltyData.rates_applied.sscl_rate}):</span>
                  <span>LKR {royaltyData.calculations.royalty_with_sscl.toFixed(2)}</span>
                </p>
                <div className="border-t border-gray-600 my-2" />
                <p className="flex justify-between text-lg font-semibold">
                  <span>Total Amount (with {royaltyData.rates_applied.vat_rate} VAT):</span>
                  <span>LKR {royaltyData.calculations.total_amount_with_vat.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}