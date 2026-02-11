'use client';

import { useState, useEffect } from 'react';

interface EmiCalculatorProps {
    defaultLoanAmount?: number;
}

export default function EmiCalculator({ defaultLoanAmount = 3800000 }: EmiCalculatorProps) {
    const [loanAmount, setLoanAmount] = useState(defaultLoanAmount);
    const [tenure, setTenure] = useState(30); // years
    const [interestRate, setInterestRate] = useState(8.3); // % per annum

    // EMI Calculation
    const calculateEMI = () => {
        const principal = loanAmount;
        const monthlyRate = interestRate / 12 / 100;
        const months = tenure * 12;

        if (monthlyRate === 0) {
            return principal / months;
        }

        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);
        return emi;
    };

    const emi = calculateEMI();
    const totalAmount = emi * tenure * 12;
    const totalInterest = totalAmount - loanAmount;

    // Pie chart calculation (percentage)
    const principalPercentage = (loanAmount / totalAmount) * 100;
    const interestPercentage = (totalInterest / totalAmount) * 100;

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatLargeNumber = (amount: number) => {
        if (amount >= 10000000) {
            return `₹${(amount / 10000000).toFixed(2)} Cr`;
        } else if (amount >= 100000) {
            return `₹${(amount / 100000).toFixed(2)} Lac`;
        }
        return formatCurrency(amount);
    };

    return (
        <section className="bg-white border border-gray-100 rounded-2xl p-8 shadow-soft-md">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Emi <span className="text-navy-blue">Calculator</span></h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left: Controls */}
                <div className="space-y-8">
                    {/* Loan Amount Slider */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Loan Amount
                        </label>
                        <div className="flex items-center gap-4 mb-4">
                            <input
                                type="text"
                                value={`₹ ${loanAmount.toLocaleString('en-IN')}`}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[₹,\s]/g, '');
                                    const num = parseInt(val) || 0;
                                    setLoanAmount(Math.min(Math.max(num, 100000), 100000000));
                                }}
                                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-semibold text-gray-900"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="range"
                                min="100000"
                                max="100000000"
                                step="100000"
                                value={loanAmount}
                                onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb-green"
                                style={{
                                    background: `linear-gradient(to right, #2fb9a2 0%, #2fb9a2 ${((loanAmount - 100000) / (100000000 - 100000)) * 100}%, #e5e7eb ${((loanAmount - 100000) / (100000000 - 100000)) * 100}%, #e5e7eb 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                                <span>₹1 Lac</span>
                                <span>₹10 Cr</span>
                            </div>
                        </div>
                    </div>

                    {/* Tenure Slider */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Tenure (Years)
                        </label>
                        <div className="flex items-center gap-4 mb-4">
                            <input
                                type="number"
                                min="1"
                                max="30"
                                value={tenure}
                                onChange={(e) => setTenure(Math.min(Math.max(parseInt(e.target.value) || 1, 1), 30))}
                                className="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-semibold text-gray-900"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="1"
                                value={tenure}
                                onChange={(e) => setTenure(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #2fb9a2 0%, #2fb9a2 ${((tenure - 1) / 29) * 100}%, #e5e7eb ${((tenure - 1) / 29) * 100}%, #e5e7eb 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                                <span>1</span>
                                <span>30</span>
                            </div>
                        </div>
                    </div>

                    {/* Interest Rate Slider */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            Interest Rate (% P.A.)
                        </label>
                        <div className="flex items-center gap-4 mb-4">
                            <input
                                type="number"
                                min="0.5"
                                max="20"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Math.min(Math.max(parseFloat(e.target.value) || 0.5, 0.5), 20))}
                                className="w-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal font-semibold text-gray-900"
                            />
                            <span className="text-gray-600 font-medium">%</span>
                        </div>
                        <div className="relative">
                            <input
                                type="range"
                                min="0.5"
                                max="20"
                                step="0.1"
                                value={interestRate}
                                onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #2fb9a2 0%, #2fb9a2 ${((interestRate - 0.5) / 19.5) * 100}%, #e5e7eb ${((interestRate - 0.5) / 19.5) * 100}%, #e5e7eb 100%)`
                                }}
                            />
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-medium">
                                <span>0.5</span>
                                <span>20</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Visualization */}
                <div className="flex flex-col items-center justify-center">
                    {/* Pie Chart */}
                    <div className="relative w-72 h-72 mb-8">
                        <svg viewBox="0 0 200 200" className="transform -rotate-90 w-full h-full">
                            {/* Background circle for complete visibility */}
                            <circle
                                cx="100"
                                cy="100"
                                r="70"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="40"
                            />
                            {/* Total Interest (Dark Blue) */}
                            <circle
                                cx="100"
                                cy="100"
                                r="70"
                                fill="none"
                                stroke="#1a365d"
                                strokeWidth="40"
                                strokeDasharray={`${(interestPercentage / 100) * 439.82} 439.82`}
                                className="transition-all duration-700 ease-in-out"
                            />
                            {/* Principal (Orange) */}
                            <circle
                                cx="100"
                                cy="100"
                                r="70"
                                fill="none"
                                stroke="#f97316"
                                strokeWidth="40"
                                strokeDasharray={`${(principalPercentage / 100) * 439.82} 439.82`}
                                strokeDashoffset={`-${(interestPercentage / 100) * 439.82}`}
                                className="transition-all duration-700 ease-in-out"
                            />
                        </svg>
                        {/* Legend */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <div className="text-xs text-gray-500 font-medium">Total</div>
                            <div className="text-sm font-bold text-gray-900">{formatLargeNumber(totalAmount)}</div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="flex gap-6 mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-[#1a365d] rounded"></div>
                            <span className="text-sm font-medium text-gray-600">Total Interest</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-500 rounded"></div>
                            <span className="text-sm font-medium text-gray-600">Principal Amount</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-brand-teal/5 to-white border border-brand-teal/10">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Monthly Home Loan EMI</div>
                    <div className="text-2xl font-black text-brand-teal">{formatCurrency(emi)}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-white border border-orange-100">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Principal Amount</div>
                    <div className="text-xl font-black text-orange-600">{formatLargeNumber(loanAmount)}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-navy-blue/5 to-white border border-navy-blue/10">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Interest Amount</div>
                    <div className="text-xl font-black text-navy-blue">{formatLargeNumber(totalInterest)}</div>
                </div>
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-brand-red/5 to-white border border-brand-red/10">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Total Amount Payable</div>
                    <div className="text-xl font-black text-brand-red">{formatLargeNumber(totalAmount)}</div>
                </div>
            </div>

            <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2fb9a2;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #2fb9a2;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }
      `}</style>
        </section>
    );
}
