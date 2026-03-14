'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { CreditCard, Building2, User, Hash } from 'lucide-react';

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentModal({ open, onOpenChange }: PaymentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white text-gray-900">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gray-900">Payment Instructions</DialogTitle>
          <DialogDescription className="text-gray-600">
            Please follow these steps to complete your tournament registration payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Bank Account Information */}
          <Card className="p-6 bg-[#1F7A63]/5 border-[#1F7A63]/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
              <CreditCard className="h-5 w-5 text-[#1F7A63]" />
              Bank Account Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-semibold text-gray-900">Bank Mandiri</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Hash className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-semibold text-lg text-gray-900">1234567890</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-gray-500 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Account Name</p>
                  <p className="font-semibold text-gray-900">Panitia Turnamen Futsal</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Steps */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900">Payment Steps</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1F7A63] text-white flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Transfer Registration Fee</p>
                  <p className="text-sm text-gray-600">
                    Transfer the registration fee of Rp 500.000 to the bank account above
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1F7A63] text-white flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-900">Save Payment Proof</p>
                  <p className="text-sm text-gray-600">
                    Take a screenshot or photo of your transfer receipt
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1F7A63] text-white flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-900">Send Confirmation via WhatsApp</p>
                  <p className="text-sm text-gray-600">
                    Click the WhatsApp button on the registration form to send your payment proof and team details to the committee
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1F7A63] text-white flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <p className="font-medium text-gray-900">Wait for Confirmation</p>
                  <p className="text-sm text-gray-600">
                    The committee will verify your payment and confirm your registration within 1-2 business days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <Card className="p-4 bg-amber-50 border-amber-200">
            <h4 className="font-semibold text-amber-900 mb-2">
              Important Notes
            </h4>
            <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
              <li>Registration fee is non-refundable</li>
              <li>Payment must be completed within 24 hours after registration</li>
              <li>Make sure to include your team name in the transfer notes</li>
              <li>Keep your payment receipt until registration is confirmed</li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
