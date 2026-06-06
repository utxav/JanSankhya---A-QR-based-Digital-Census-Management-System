import { useState } from 'react';
import { Check, Zap, Shield, Building2, CreditCard, CheckCircle2 } from 'lucide-react';
import { paymentHistory } from '../data/mockData';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    icon: Zap,
    color: '#FF9933',
    period: '/month',
    citizens: '500 citizens',
    features: [
      '500 citizen records',
      '5 enumerators',
      '3 export formats',
      'Email support',
      'Basic analytics',
      '1 state coverage',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 1499,
    icon: Shield,
    color: '#0D1B4B',
    period: '/month',
    citizens: '10,000 citizens',
    features: [
      '10,000 citizen records',
      '25 enumerators',
      'All export formats',
      'Priority support',
      'Full analytics + Power BI',
      'Pan India coverage',
      'QR code generation',
      'Razorpay integration',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 4999,
    icon: Building2,
    color: '#138808',
    period: '/month',
    citizens: 'Unlimited',
    features: [
      'Unlimited citizen records',
      'Unlimited enumerators',
      'Custom exports',
      '24/7 dedicated support',
      'Advanced AI analytics',
      'Custom integrations',
      'On-premise deployment',
      'SLA guarantee',
      'Aadhaar integration',
    ],
    popular: false,
  },
];

export function BillingPage() {
  const [current] = useState('pro');
  const [processing, setProcessing] = useState('');
  const [paid, setPaid] = useState('');

  const handleSubscribe = async (planId: string) => {
    if (planId === current) return;
    setProcessing(planId);
    await new Promise(r => setTimeout(r, 1800));
    setProcessing('');
    setPaid(planId);
    setTimeout(() => setPaid(''), 3000);
  };

  return (
    <div style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="px-6 py-5 border-b border-gray-100 bg-white">
        <h1 className="text-gray-800 text-xl" style={{ fontWeight: 600 }}>Billing &amp; Plans</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your subscription and payment history</p>
      </div>

      <div className="p-4 md:p-6 space-y-8">
        {/* Current Plan Banner */}
        <div className="bg-gradient-to-r from-[#0D1B4B] to-[#162254] rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-[#FF9933] text-xs mb-1" style={{ fontWeight: 600 }}>ACTIVE SUBSCRIPTION</p>
              <h2 className="text-white text-2xl mb-0.5" style={{ fontWeight: 700 }}>Professional Plan</h2>
              <p className="text-white/50 text-sm">Next billing: 01 March 2026 · ₹1,499/month</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-xl border border-green-500/30">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-300 text-sm" style={{ fontWeight: 600 }}>Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Plans */}
        <div>
          <h2 className="text-gray-800 text-base mb-5" style={{ fontWeight: 600 }}>Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map(plan => {
              const Icon = plan.icon;
              const isCurrent = plan.id === current;
              const isProcessing = processing === plan.id;
              const isPaid = paid === plan.id;

              return (
                <div key={plan.id} className={`bg-white rounded-2xl border flex flex-col overflow-hidden transition-all hover:shadow-lg ${
                  isCurrent ? 'border-[#0D1B4B] ring-1 ring-[#0D1B4B]/20' :
                  plan.popular ? 'border-[#FF9933]/40 ring-1 ring-[#FF9933]/10' : 'border-gray-100'
                }`}>
                  {/* Header */}
                  {plan.popular && (
                    <div className="flex h-1">
                      <div className="flex-1 bg-[#FF9933]" />
                      <div className="flex-1 bg-white border-y border-gray-100" />
                      <div className="flex-1 bg-[#138808]" />
                    </div>
                  )}
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${plan.color}15` }}>
                          <Icon size={18} style={{ color: plan.color }} />
                        </div>
                        <h3 className="text-gray-800 text-base" style={{ fontWeight: 700 }}>{plan.name}</h3>
                      </div>
                      {isCurrent && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#0D1B4B]/10 text-[#0D1B4B]" style={{ fontWeight: 600 }}>Current</span>
                      )}
                      {plan.popular && !isCurrent && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF9933]/15 text-[#FF9933]" style={{ fontWeight: 600 }}>Popular</span>
                      )}
                    </div>

                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-gray-400 text-lg">₹</span>
                        <span className="text-gray-800 text-4xl" style={{ fontWeight: 800 }}>{plan.price.toLocaleString('en-IN')}</span>
                        <span className="text-gray-400 text-sm">{plan.period}</span>
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{plan.citizens}</p>
                    </div>

                    <ul className="space-y-2.5 mb-6">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${plan.color}20` }}>
                            <Check size={10} style={{ color: plan.color }} strokeWidth={3} />
                          </div>
                          <span className="text-gray-500 text-xs">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 border-t border-gray-50">
                    <button
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={isCurrent || !!processing}
                      className={`w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${
                        isCurrent ? 'bg-[#F4F6FA] text-gray-400 cursor-default' :
                        isPaid ? 'bg-green-50 text-green-600 border border-green-100' :
                        isProcessing ? 'bg-[#FF9933] text-white opacity-80' :
                        'bg-[#0D1B4B] text-white hover:bg-[#162254] shadow-sm'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {isCurrent ? 'Current Plan' :
                       isPaid ? <><CheckCircle2 size={15} /> Subscribed!</> :
                       isProcessing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</> :
                       <><CreditCard size={15} /> Subscribe via Razorpay</>}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-gray-800 text-sm mb-4" style={{ fontWeight: 600 }}>Accepted Payment Methods</h3>
          <div className="flex flex-wrap gap-3">
            {['UPI / Google Pay', 'Debit Card', 'Credit Card', 'Net Banking', 'Paytm Wallet', 'PhonePe'].map(m => (
              <div key={m} className="flex items-center gap-2 px-3 py-2 bg-[#F4F6FA] rounded-xl">
                <div className="w-1.5 h-1.5 rounded-full bg-[#138808]" />
                <span className="text-xs text-gray-600" style={{ fontWeight: 500 }}>{m}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">Powered by Razorpay · PCI DSS Compliant · 256-bit encryption</p>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-50">
            <h3 className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>Payment History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8F9FB]">
                  {['Transaction ID', 'Plan', 'Amount', 'Date', 'Razorpay ID', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs uppercase tracking-wider text-gray-400" style={{ fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map(p => (
                  <tr key={p.id} className="border-t border-gray-50 hover:bg-[#FAFBFC] transition-colors">
                    <td className="px-5 py-3.5"><code className="text-xs text-[#0D1B4B] bg-[#F4F6FA] px-2 py-1 rounded-lg" style={{ fontWeight: 600 }}>{p.id}</code></td>
                    <td className="px-5 py-3.5 text-sm text-gray-700" style={{ fontWeight: 500 }}>{p.plan}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-800" style={{ fontWeight: 600 }}>₹{p.amount.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{p.date}</td>
                    <td className="px-5 py-3.5"><code className="text-xs text-gray-400">{p.paymentId}</code></td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-600" style={{ fontWeight: 600 }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
