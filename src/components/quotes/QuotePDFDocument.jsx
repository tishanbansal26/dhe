import React from 'react';
import { Shield, CheckCircle, Phone, Mail, Globe, MapPin } from 'lucide-react';
import { useSiteSettings } from '../../lib/useSiteSettings';

export default function QuotePDFDocument({ quoteData, onPrint, onClose }) {
  const { settings } = useSiteSettings();
  if (!quoteData) return null;

  const {
    quote_number,
    plan_name,
    insurer,
    uin,
    customer,
    configuration,
    benefits,
    cashflowTimeline,
    statutorySafeguards,
    created_at
  } = quoteData;

  const contactPhone = settings.contact_phone || '+91 96036 10000';
  const contactEmail = settings.contact_email || 'support@radheinv.site';

  return (
    <>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pdf-print-container, #pdf-print-container * {
            visibility: visible;
          }
          #pdf-print-container {
            position: static !important;
            width: 100%;
            margin: 0;
            padding: 0;
            background: white !important;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
      <div className="fixed inset-0 z-[100] overflow-y-auto bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 flex justify-center items-start print:static print:inset-auto print:block print:bg-white print:p-0 print:m-0 print:overflow-visible text-slate-900">
        <div id="pdf-print-container" className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8 border border-slate-200 print:shadow-none print:border-none print:my-0 print:max-w-none print:rounded-none">
        
        {/* Action Controls (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-sm sm:text-base">Official Quote Document Preview</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onPrint || (() => window.print())}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm rounded-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 print:p-6 space-y-8 font-sans">
          
          {/* Header & Branding */}
          <div className="flex flex-wrap justify-between items-start border-b-2 border-teal-600 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold text-lg">
                  R
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-950">
                  Radhe <span className="text-teal-600">Investments</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">IRDAI Registered Insurance & Financial Advisory Services</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-teal-600" /> {contactPhone}</span>
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-teal-600" /> {contactEmail}</span>
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-teal-600" /> www.radheinv.site</span>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-teal-50 text-teal-800 font-mono font-bold text-sm rounded-md border border-teal-200">
                {quote_number || 'QUOTE-PREVIEW'}
              </span>
              <p className="text-xs text-slate-500 mt-1">Generated: {new Date(created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <p className="text-xs text-slate-500">Valid For: 30 Days</p>
            </div>
          </div>

          {/* Insurer & Plan Header */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex flex-wrap justify-between items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">{insurer || 'Insurance Provider'}</span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-0.5">{plan_name || 'Insurance Policy'}</h2>
              <p className="text-xs text-slate-600 font-mono mt-0.5">UIN: {uin || 'IRDAI Standard'} | Plan Option: {configuration?.optionName || 'Standard'}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Indicative / Annual Payout</span>
              <span className="text-2xl font-black text-teal-600">₹{(benefits?.totalYearlyAnnuity || configuration?.premiumAmount || 0).toLocaleString('en-IN')}</span>
              <span className="text-xs text-slate-500 block">Subject to Underwriting</span>
            </div>
          </div>

          {/* Client & Configuration Dual Column */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Client Profile */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-1">
                Annuitant Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">First Annuitant:</span> <span className="font-semibold text-slate-900">{customer?.name || 'Proposer'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Age / Gender:</span> <span className="font-semibold text-slate-900">{customer?.age} / {customer?.gender?.toUpperCase() || 'MALE'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Second Annuitant:</span> <span className="font-semibold text-slate-900">{customer?.isJointLife ? 'Spouse' : 'NA'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Age / Gender:</span> <span className="font-semibold text-slate-900">{customer?.isJointLife ? `${customer?.secondaryAge} / FEMALE` : 'NA'}</span></div>
              </div>
            </div>

            {/* Plan Configuration */}
            <div className="border border-slate-200 rounded-xl p-4 bg-white">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 border-b border-slate-100 pb-1">
                Policy Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Total Instalment Premium:</span> <span className="font-semibold text-slate-900">₹{(configuration?.premiumAmount || 0).toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Premium Payment Term:</span> <span className="font-semibold text-slate-900">{configuration?.ppt} Years ({configuration?.premiumMode?.toUpperCase()})</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Deferment Period:</span> <span className="font-semibold text-slate-900">{configuration?.defermentPeriod || 0} Years</span></div>
                <div className="flex justify-between"><span className="text-slate-500">GST Rate for Annuity:</span> <span className="font-semibold text-slate-900">0.00%</span></div>
              </div>
            </div>

          </div>

          {/* Key Benefit Highlights */}
          <div className="border border-slate-200 rounded-xl p-5 bg-teal-50/50 print:break-inside-avoid">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-600" /> Key Benefits & Coverage Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm print:shadow-none">
                <span className="text-xs text-slate-500 block">Base Payout / Cover</span>
                <span className="text-lg font-bold text-slate-900">₹{(benefits?.yearlyBaseAnnuity || configuration?.premiumAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm print:shadow-none">
                <span className="text-xs text-slate-500 block">Persistency Booster</span>
                <span className="text-lg font-bold text-teal-600">+₹{(benefits?.annuityBooster || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm print:shadow-none">
                <span className="text-xs text-slate-500 block">Accrued Additions</span>
                <span className="text-lg font-bold text-indigo-600">₹{(benefits?.totalAccruedGA || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm print:shadow-none">
                <span className="text-xs text-slate-500 block">Capital / Death Refund</span>
                <span className="text-lg font-bold text-slate-900">₹{(benefits?.guaranteedReturnOfPurchasePrice || configuration?.premiumAmount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Cashflow Timeline Sample Table */}
          {cashflowTimeline && cashflowTimeline.length > 0 && (
            <div className="print:break-inside-avoid">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Illustrated Cashflow & Death Benefit Schedule</h3>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-semibold text-[10px]">
                    <tr>
                      <th className="p-2">Policy Year</th>
                      <th className="p-2">Premium</th>
                      <th className="p-2">Base Annuity (A)</th>
                      <th className="p-2">Booster (B)</th>
                      <th className="p-2">Total Annuity (A+B)</th>
                      <th className="p-2">Accrued GA</th>
                      <th className="p-2">Death Benefit</th>
                      <th className="p-2">Maturity Benefit</th>
                      <th className="p-2">Min GSV</th>
                      <th className="p-2">Special SV</th>
                      <th className="p-2">Surrender Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600 text-[10px]">
                    {cashflowTimeline.map((row, idx) => (
                      <tr key={idx} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} print:break-inside-avoid`}>
                        <td className="p-2 font-medium text-slate-900">{row.policyYear}</td>
                        <td className="p-2">{row.premiumPaid > 0 ? `₹${row.premiumPaid.toLocaleString('en-IN')}` : '0'}</td>
                        <td className="p-2">{row.baseAnnuity > 0 ? `₹${row.baseAnnuity.toLocaleString('en-IN')}` : '0'}</td>
                        <td className="p-2">{row.annuityBooster > 0 ? `₹${row.annuityBooster.toLocaleString('en-IN')}` : '0'}</td>
                        <td className="p-2 font-bold text-teal-700">{row.annuityPayout > 0 ? `₹${row.annuityPayout.toLocaleString('en-IN')}` : '0'}</td>
                        <td className="p-2 text-indigo-600">{row.accruedGA > 0 ? `₹${row.accruedGA.toLocaleString('en-IN')}` : '0'}</td>
                        <td className="p-2 font-semibold text-slate-900">₹{row.deathBenefit.toLocaleString('en-IN')}</td>
                        <td className="p-2">NA</td>
                        <td className="p-2">₹{(row.minGsv || 0).toLocaleString('en-IN')}</td>
                        <td className="p-2">₹{(row.specialSv || 0).toLocaleString('en-IN')}</td>
                        <td className="p-2 font-semibold">₹{row.surrenderValue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Statutory Safeguards & Tax Disclaimers */}
          <div className="border-t border-slate-200 pt-4 space-y-2 text-[11px] text-slate-500 leading-relaxed">
            <p className="font-semibold text-slate-700">IRDAI Statutory Disclaimers & Consumer Safeguards:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>Section 45 Indisputability</strong>: Under Section 45 of Insurance Act 1938, no policy can be questioned after 3 continuous years on any ground whatsoever.</li>
              <li><strong>Free-Look Period</strong>: 30-day unconditional trial return window with 100% premium refund from receipt of policy document.</li>
              <li><strong>Tax Exemption</strong>: Benefits subject to provisions under Income Tax Act 1961 (Section 80C, 80D, 10(10D) as applicable).</li>
              <li><strong>Indicative Nature</strong>: This quote illustration is prepared based on customer inputs and product rate tables. Final terms, rates, underwriting acceptance and policy issuance are subject to insurer rules.</li>
            </ul>
          </div>

          {/* Signature & Advisory Stamp */}
          <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-12 text-xs text-slate-600 mt-12 print:break-inside-avoid">
            <div>
              <p className="mb-12 leading-relaxed">I, ........................................... (name), have explained the premiums, and benefits under the product fully to the prospect / policyholder.</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="mb-2">Place: ........................</p>
                  <p>Date: ........................</p>
                </div>
                <div className="text-center">
                  <div className="h-0 border-b border-slate-400 w-48 mb-2"></div>
                  <p className="font-semibold text-slate-900">Signature of Agent / Intermediary</p>
                </div>
              </div>
            </div>
            <div>
              <p className="mb-12 leading-relaxed">I, Proposer, having received the information with respect to the above, have understood the above statement before entering into the contract.</p>
              <div className="flex justify-between items-end">
                <div>
                  <p className="opacity-0 mb-2">Place:</p>
                  <p>Date: ........................</p>
                </div>
                <div className="text-center">
                  <div className="h-0 border-b border-slate-400 w-48 mb-2"></div>
                  <p className="font-semibold text-slate-900">Signature of Prospect / Policyholder</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
    </>
  );
}
