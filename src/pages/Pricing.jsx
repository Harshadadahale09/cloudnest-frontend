import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Cloud, Zap, Crown, ArrowLeft } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    storage: '15 GB',
    icon: Cloud,
    color: 'bg-secondary text-foreground',
    features: [
      '15 GB storage',
      'Basic file sharing',
      'Mobile app access',
      'Email support',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    period: '/month',
    storage: '100 GB',
    icon: Zap,
    color: 'cloud-gradient text-primary-foreground',
    features: [
      '100 GB storage',
      'Advanced sharing controls',
      'Priority support',
      'File versioning',
      'Custom branding',
    ],
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    period: '/month',
    storage: '2 TB',
    icon: Crown,
    color: 'bg-foreground text-background',
    features: [
      '2 TB storage',
      'Team collaboration',
      'Admin console',
      'SSO integration',
      'Audit logs',
      'Dedicated support',
    ],
    popular: false,
  },
];

const Pricing = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  const handleSelectPlan = (plan) => {
    if (plan.id === 'free') {
      navigate('/dashboard');
      return;
    }
    setSelectedPlan(plan);
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    setShowCheckout(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl cloud-gradient flex items-center justify-center">
              <Cloud size={24} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">CloudNest</span>
          </Link>
          <Link 
            to="/dashboard" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back to Drive</span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Unlock more storage and powerful features to supercharge your cloud experience.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-card rounded-2xl p-6 card-shadow transition-all duration-300 hover:-translate-y-2 hover:card-shadow-hover ${
                plan.popular ? 'ring-2 ring-primary' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="cloud-gradient text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Icon */}
              <div className={`w-12 h-12 rounded-xl ${plan.color} flex items-center justify-center mb-4`}>
                <plan.icon size={24} />
              </div>

              {/* Plan Name & Price */}
              <h3 className="text-xl font-bold text-foreground mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-foreground">
                  ${plan.price}
                </span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>

              {/* Storage */}
              <p className="text-primary font-medium mb-6">{plan.storage} storage</p>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                    <Check size={16} className="text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
                  plan.popular
                    ? 'cloud-gradient text-primary-foreground hover:opacity-90'
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                {plan.id === 'free' ? 'Continue Free' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Money Back Guarantee */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            💳 Secure payment powered by Stripe • 30-day money-back guarantee
          </p>
        </div>
      </section>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        plan={selectedPlan}
        onComplete={handleCheckoutComplete}
      />
    </div>
  );
};

export default Pricing;
