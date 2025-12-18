export interface FeeStructure {
  makerFee: number;      // 0.1% (0.001)
  takerFee: number;      // 0.2% (0.002)
  marketCreationFee: number; // $10 flat fee
  withdrawalFee: number; // 0.5% (0.005)
}

export interface VolumeTier {
  minVolume: number;
  feeDiscount: number; // Percentage discount (0.1 = 10% off)
}

export class FeeService {
  private static readonly DEFAULT_FEES: FeeStructure = {
    makerFee: 0.001,      // 0.1%
    takerFee: 0.002,      // 0.2%
    marketCreationFee: 10, // $10
    withdrawalFee: 0.005   // 0.5%
  };

  private static readonly VOLUME_TIERS: VolumeTier[] = [
    { minVolume: 0, feeDiscount: 0 },        // No discount
    { minVolume: 10000, feeDiscount: 0.1 },  // 10% off at $10K volume
    { minVolume: 50000, feeDiscount: 0.2 },  // 20% off at $50K volume
    { minVolume: 100000, feeDiscount: 0.3 }, // 30% off at $100K volume
  ];

  static calculateTradingFee(
    tradeAmount: number,
    isMaker: boolean,
    userVolume30d: number = 0
  ): { fee: number; feeRate: number } {
    const baseFeeRate = isMaker ? this.DEFAULT_FEES.makerFee : this.DEFAULT_FEES.takerFee;
    
    // Apply volume discount
    const tier = this.getVolumeTier(userVolume30d);
    const discountedRate = baseFeeRate * (1 - tier.feeDiscount);
    
    const fee = tradeAmount * discountedRate;
    
    return { fee, feeRate: discountedRate };
  }

  static calculateMarketCreationFee(): number {
    return this.DEFAULT_FEES.marketCreationFee;
  }

  static calculateWithdrawalFee(amount: number): number {
    return amount * this.DEFAULT_FEES.withdrawalFee;
  }

  private static getVolumeTier(volume: number): VolumeTier {
    return this.VOLUME_TIERS
      .slice()
      .reverse()
      .find(tier => volume >= tier.minVolume) || this.VOLUME_TIERS[0];
  }

  static getFeeStructure(): FeeStructure {
    return { ...this.DEFAULT_FEES };
  }

  static getVolumeTiers(): VolumeTier[] {
    return [...this.VOLUME_TIERS];
  }
}

export const feeService = new FeeService();