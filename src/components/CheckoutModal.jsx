import { useState } from 'react';
import { X, CreditCard, Lock, Check, Loader2 } from 'lucide-react';

const CheckoutModal = ({ isOpen, onClose, plan, onComplete }) => {
  const [step, setStep] = useState('payment'); // 'payment' | 'processing' | 'success'
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: '',
    email: '',
  });

  if (!isOpen || !plan) return null;

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'expiry') {
      formattedValue = formatExpiry(value);
    } else if (name === 'cvc') {
      formattedValue = value.replace(/[^0-9]/g, '').substring(0, 4);
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      setStep('success');
    }, 2500);
  };

  const handleComplete = () => {
    setStep('payment');
    setFormData({ cardNumber: '', expiry: '', cvc: '', name: '', email: '' });
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-md card-shadow-hover animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="cloud-gradient p-6 text-primary-foreground">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={24} />
              <span className="font-semibold">Secure Checkout</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-primary-foreground/20 rounded-lg transition-colors"
              disabled={step === 'processing'}
            >
              <X size={20} />
            </button>
          </div>
          <div className="text-2xl font-bold">
            {plan.name} Plan - ${plan.price}/mo
          </div>
          <p className="text-primary-foreground/80 text-sm mt-1">
            {plan.storage} storage • Cancel anytime
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'payment' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="4242 4242 4242 4242"
                  className="input-field"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Expiry
                  </label>
                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="input-field"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    name="cvc"
                    value={formData.cvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="input-field"
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                <Lock size={16} />
                Pay ${plan.price}
              </button>

              <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Lock size={12} />
                Secured by Stripe. Your data is encrypted.
              </p>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center">
              <Loader2 size={48} className="text-primary mx-auto animate-spin mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Processing Payment...
              </h3>
              <p className="text-muted-foreground text-sm">
                Please wait while we process your payment securely.
              </p>
            </div>
          )}

          {step === 'success' && (
            <div className="py-12 text-center">
              <div className="w-16 h-16 cloud-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Payment Successful! 🎉
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Welcome to CloudNest {plan.name}! Your storage has been upgraded.
              </p>
              <button onClick={handleComplete} className="btn-primary">
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
