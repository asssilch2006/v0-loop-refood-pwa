'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, MapPin, Clock, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/lib/i18n';
import { useAppState } from '@/lib/app-state';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: {
    id: number | string;
    name: string;
    originalPrice?: number;
    loopPrice: number;
    seller: string;
    expiresIn?: number;
  } | null;
}

export function OrderModal({ isOpen, onClose, listing }: OrderModalProps) {
  const { t } = useLanguage();
  const { user, speak, accessibilityMode } = useAppState();
  const [quantity, setQuantity] = useState(1);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!listing) return null;

  const totalPrice = listing.loopPrice * quantity;
  const savings = listing.originalPrice
    ? (listing.originalPrice - listing.loopPrice) * quantity
    : 0;

  const handleSubmitOrder = async () => {
    if (!user?.id) {
      setError('Please sign in to place an order');
      if (accessibilityMode) speak('Please sign in to place an order');
      return;
    }

    if (!deliveryAddress.trim()) {
      setError('Please enter a delivery address');
      if (accessibilityMode) speak('Please enter a delivery address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('[v0] Submitting order:', { listing_id: listing.id, quantity, totalPrice });

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          buyer_id: user.id,
          listing_id: listing.id,
          quantity,
          total_price: totalPrice,
          delivery_address: deliveryAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      console.log('[v0] Order created successfully:', data.order);

      setSuccess(true);
      if (accessibilityMode) {
        speak(`Order placed successfully for ${listing.name}. Total: ${totalPrice} DZD`);
      }

      setTimeout(() => {
        onClose();
        setSuccess(false);
        setQuantity(1);
        setDeliveryAddress('');
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Order failed';
      setError(errorMessage);
      console.error('[v0] Order error:', err);
      if (accessibilityMode) speak(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[80] bg-foreground/50 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-[90] max-h-[90vh] overflow-y-auto rounded-t-3xl bg-card safe-bottom"
          >
            <div className="sticky top-0 flex items-center justify-between p-5 border-b border-border/50 bg-card/95 backdrop-blur-xl">
              <h2 className="text-lg font-bold text-foreground">{t('confirmOrder')}</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Item Summary */}
              <div className="rounded-xl bg-muted/40 border border-border/50 p-4 space-y-3">
                <h3 className="font-semibold text-foreground">{listing.name}</h3>
                <p className="text-sm text-muted-foreground">{listing.seller}</p>

                {listing.expiresIn && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                    <Clock className="h-4 w-4" />
                    Expires in {listing.expiresIn} hours
                  </div>
                )}

                {listing.originalPrice && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="line-through text-muted-foreground">
                      {listing.originalPrice} DZD
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      Save {savings} DZD
                    </span>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="h-10 w-10 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted disabled:opacity-50 transition-colors"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-semibold text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-lg border border-border/50 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Delivery Address
                </label>
                <Input
                  placeholder="Enter your delivery address in Algiers"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Price Summary */}
              <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Unit Price:</span>
                  <span className="font-medium">{listing.loopPrice} DZD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">x{quantity}</span>
                </div>
                <div className="border-t border-primary/20 pt-2 flex justify-between">
                  <span className="font-semibold text-foreground">{t('total')}:</span>
                  <span className="text-lg font-bold text-primary">{totalPrice} DZD</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 text-sm"
                >
                  Order placed successfully! Check your email for confirmation.
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pb-4">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {t('cancel')}
                </Button>
                <Button
                  onClick={handleSubmitOrder}
                  className="flex-1"
                  disabled={isLoading || !deliveryAddress.trim()}
                >
                  {isLoading ? t('loading') : t('placeOrder')}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
