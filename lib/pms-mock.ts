// lib/pms-mock.ts

/**
 * Mock PMS Service
 * Simulates external API calls to a Property Management System.
 * Includes randomized network latency and a 20% failure rate (503).
 */

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateNetworkAndFailure = async () => {
  // Random network delay between 1000ms and 2000ms
  const latency = Math.floor(Math.random() * 1000) + 1000;
  await delay(latency);

  // 20% chance to throw a 503 error
  if (Math.random() < 0.20) {
    const error = new Error('Service Unavailable: PMS API Timeout');
    (error as any).status = 503;
    throw error;
  }
};

export class MockPMSService {
  static async pushGuestProfile(data: any): Promise<any> {
    await simulateNetworkAndFailure();
    console.log(`[MOCK PMS] Guest Profile Created for: ${data.primaryGuest?.fullName}`);
    return {
      status: 'success',
      pmsConfirmationId: `CONF-${Math.floor(Math.random() * 1000000)}`,
      timestamp: new Date().toISOString(),
    };
  }

  static async postRoomCharge(roomNumber: string, chargeData: any): Promise<any> {
    await simulateNetworkAndFailure();
    console.log(`[MOCK PMS] Charge Posted to Room ${roomNumber}:`, chargeData);
    return {
      status: 'success',
      folioTransactionId: `TXN-${Math.floor(Math.random() * 1000000)}`,
      timestamp: new Date().toISOString(),
    };
  }

  static async getGuestFolio(roomNumber: string): Promise<any> {
    await simulateNetworkAndFailure();
    console.log(`[MOCK PMS] Fetched Folio for Room ${roomNumber}`);
    return {
      status: 'success',
      roomNumber,
      balance: 1500,
      transactions: [
        { date: new Date().toISOString(), description: 'Room Rate', amount: 3500 },
        { date: new Date().toISOString(), description: 'Deposit', amount: -2000 },
      ]
    };
  }
}
