'use client';

import Button from '@/components/ui/Button';
import LogoCloud from '@/components/ui/LogoCloud';
import type { Tables } from '@/types_db';
import { getStripe } from '@/utils/stripe/client';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getErrorRedirect } from '@/utils/helpers';
import { User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

type Subscription = Tables<'subscriptions'>;
type Product = Tables<'products'>;
type Price = Tables<'prices'>;
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({ user, products, subscription }: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const currentPath = usePathname();

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      setPriceIdLoading(undefined);
      return router.push('/signin/signup');
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    );

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          'An unknown error occurred.',
          'Please try again later or contact a system administrator.'
        )
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
        <LogoCloud />
      </section>
    );
  } else {
    return (
      <section className="bg-black">
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
          {/* Title */}
          <div className="mx-auto max-w-2xl mb-8 lg:mb-14 text-center">
            <h2 className="text-3xl lg:text-4xl text-gray-250 font-bold">
              Solo, agency or team? We’ve got you covered.
            </h2>
          </div>
          {/* End Title */}

          <div className="relative xl:w-10/12 xl:mx-auto">
            {/* Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {['month', 'year'].map((interval) => (
                <div key={interval}>
                  {/* Card */}
                  <div className="p-4 relative z-10 bg-gray-800 border-gray-900 rounded-xl md:p-10 ">
                    <h3 className="text-xl font-bold text-gray-250 dark:text-neutral-200">
                      {interval === 'month' ? 'Monthly' : 'Yearly'} Pricing
                    </h3>
                    <div className="text-sm text-gray-250 dark:text-neutral-500">
                      {interval === 'month'
                        ? 'Pay month to month.'
                        : 'Pay once a year.'}
                    </div>

                    <div className="mt-5">
                      {products
                        .filter((product) =>
                          product.prices.some((price) => price.interval === interval)
                        )
                        .map((product) => {
                          const price = product.prices.find(
                            (price) => price.interval === interval
                          );
                          if (!price) return null;
                          const priceString = new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: price.currency!,
                            minimumFractionDigits: 0,
                          }).format((price?.unit_amount || 0) / 100);
                          return (
                            <div key={product.id} className="mb-6">
                              <h4 className="text-lg font-semibold text-gray-250 dark:text-neutral-200">
                                {product.name}
                              </h4>
                              <p className="mt-2 text-gray-250 dark:text-neutral-500">
                                {product.description}
                              </p>
                              <div className="mt-4">
                                <span className="text-4xl font-bold text-gray-250 dark:text-neutral-200">
                                  {priceString}
                                </span>
                                <span className="text-lg font-bold text-gray-250 dark:text-neutral-200">
                                  .00
                                </span>
                                <span className="ms-3 text-gray-250 dark:text-neutral-500">
                                  USD / {interval}
                                </span>
                              </div>
                              <Button
                                variant="slim"
                                type="button"
                                loading={priceIdLoading === price.id}
                                onClick={() => handleStripeCheckout(price)}
                                className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                              >
                                {subscription ? 'Manage' : 'Subscribe'}
                              </Button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  {/* End Card */}
                </div>
              ))}
            </div>
            {/* End Grid */}
          </div>
        </div>
      </section>
    );
  }
}