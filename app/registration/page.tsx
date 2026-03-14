'use client';

import { RegistrationForm } from '@/components/features/registration';
import { RegistrationData } from '@/data/types';
import { Card } from '@/components/ui/card';

export default function RegistrationPage() {
  const handleSubmit = (data: RegistrationData) => {
    console.log('Registration submitted:', data);
    alert('Registration submitted successfully! Check console for details.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Futsal Tournament Registration
          </h1>
          <p className="text-gray-600">
            Register your team for the upcoming tournament
          </p>
        </div>

        <RegistrationForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
