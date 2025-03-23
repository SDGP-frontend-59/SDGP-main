// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// interface RoyaltyCalculationRequest {
//   water_gel: number;
//   nh4no3: number;
//   powder_factor: number;
// }

// interface RoyaltyCalculationResponse {
//   calculation_date: string;
//   inputs: {
//     water_gel_kg: number;
//     nh4no3_kg: number;
//     powder_factor: number;
//   };
//   calculations: {
//     total_explosive_quantity: number;
//     basic_volume: number;
//     blasted_rock_volume: number;
//     base_royalty: number;
//     royalty_with_sscl: number;
//     total_amount_with_vat: number;
//   };
//   rates_applied: {
//     royalty_rate_per_cubic_meter: number;
//     sscl_rate: string;
//     vat_rate: string;
//   };
// }

// export const calculateRoyalty = async (data: RoyaltyCalculationRequest): Promise<RoyaltyCalculationResponse> => {
//   try {
//     const response = await fetch(`${API_BASE_URL}/calculate-royalty`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return await response.json();
//   } catch (error) {
//     console.error('API call failed:', error);
//     throw error;
//   }
// }; 

// API URL configuration with environment-based fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface RoyaltyCalculationRequest {
  water_gel: number;
  nh4no3: number;
  powder_factor: number;
}

interface RoyaltyCalculationResponse {
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

/**
 * Calculate royalty based on input parameters
 */
export const calculateRoyalty = (data: RoyaltyCalculationRequest): RoyaltyCalculationResponse => {
    const { water_gel, nh4no3, powder_factor } = data;

    // Step 1: Calculate Total Explosive Quantity (TEQ)
    const total_explosive_quantity = (water_gel * 1.2) + nh4no3;

    // Step 2: Determine Blasted Rock Volume
    const blasted_rock_volume = total_explosive_quantity / powder_factor;
    const expanded_blasted_rock_volume = (total_explosive_quantity * 1.6) / (powder_factor * 2.83);

    // Step 3: Calculate Royalty Fee
    const royalty = blasted_rock_volume * 240;

    // Step 4: Apply Additional Charges
    const royalty_with_sscl = royalty * 1.0256; // SSCL
    const total_amount_with_vat = royalty_with_sscl * 1.18; // VAT

    // Return the calculated response
    return {
        calculation_date: new Date().toISOString(),
        inputs: {
            water_gel_kg: water_gel,
            nh4no3_kg: nh4no3,
            powder_factor: powder_factor,
        },
        calculations: {
            total_explosive_quantity,
            basic_volume: blasted_rock_volume, // Adjusted to reflect the calculation
            blasted_rock_volume: expanded_blasted_rock_volume, // Adjusted to reflect the calculation
            base_royalty: royalty,
            royalty_with_sscl,
            total_amount_with_vat,
        },
        rates_applied: {
            royalty_rate_per_cubic_meter: 240, // Example rate
            sscl_rate: '2.56%', // Updated SSCL rate
            vat_rate: '18%', // Updated VAT rate
        },
    };
};