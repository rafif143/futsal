'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, CreditCard } from 'lucide-react';
import { PlayerInput } from './PlayerInput';
import { PaymentModal } from './PaymentModal';
import { RegistrationData, PlayerInput as PlayerInputType } from '@/data/types';

interface RegistrationFormProps {
  onSubmit: (data: RegistrationData) => void;
}

interface FormErrors {
  teamName?: string;
  schoolName?: string;
  officialName?: string;
  coachName?: string;
  contactNumber?: string;
  players?: string;
}

export function RegistrationForm({ onSubmit }: RegistrationFormProps) {
  const [teamName, setTeamName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [teamLogo, setTeamLogo] = useState<File | undefined>(undefined);
  const [officialName, setOfficialName] = useState('');
  const [coachName, setCoachName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [players, setPlayers] = useState<PlayerInputType[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }

    if (!schoolName.trim()) {
      newErrors.schoolName = 'School name is required';
    }

    if (!officialName.trim()) {
      newErrors.officialName = 'Official name is required';
    }

    if (!coachName.trim()) {
      newErrors.coachName = 'Coach name is required';
    }

    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(contactNumber.replace(/\s/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid phone number (e.g., +62812345678)';
    }

    if (players.length === 0) {
      newErrors.players = 'At least one player is required';
    } else {
      // Validate each player has required fields
      const hasInvalidPlayer = players.some(
        (player) => !player.name.trim() || !player.jerseyNumber || !player.studentCard
      );
      if (hasInvalidPlayer) {
        newErrors.players = 'All player fields are required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formData: RegistrationData = {
      teamName,
      schoolName,
      teamLogo,
      officialName,
      coachName,
      contactNumber,
      players,
    };

    onSubmit(formData);
  };

  const handleWhatsAppContact = () => {
    const adminNumber = '+6281234567890'; // Admin contact number
    const message = `Hello, I would like to register my team for the Futsal Tournament.

Team Name: ${teamName || '[Not filled]'}
School: ${schoolName || '[Not filled]'}
Official Name: ${officialName || '[Not filled]'}
Coach Name: ${coachName || '[Not filled]'}
Contact: ${contactNumber || '[Not filled]'}
Number of Players: ${players.length}

Please let me know the next steps for registration.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminNumber.replace(/\+/g, '')}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setTeamLogo(file);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">Team Information</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="team-name" className="text-sm font-medium text-gray-900">
                Team Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="team-name"
                type="text"
                placeholder="Enter team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className={errors.teamName ? 'border-destructive' : ''}
              />
              {errors.teamName && (
                <p className="text-sm text-destructive">{errors.teamName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="school-name" className="text-sm font-medium text-gray-900">
                School Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="school-name"
                type="text"
                placeholder="Enter school name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className={errors.schoolName ? 'border-destructive' : ''}
              />
              {errors.schoolName && (
                <p className="text-sm text-destructive">{errors.schoolName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="team-logo" className="text-sm font-medium text-gray-900">
                Team Logo
              </label>
              <Input
                id="team-logo"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
              />
              {teamLogo && (
                <p className="text-sm text-gray-600">
                  Selected: {teamLogo.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="official-name" className="text-sm font-medium text-gray-900">
                Official Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="official-name"
                type="text"
                placeholder="Enter official name"
                value={officialName}
                onChange={(e) => setOfficialName(e.target.value)}
                className={errors.officialName ? 'border-destructive' : ''}
              />
              {errors.officialName && (
                <p className="text-sm text-destructive">{errors.officialName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="coach-name" className="text-sm font-medium text-gray-900">
                Coach Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="coach-name"
                type="text"
                placeholder="Enter coach name"
                value={coachName}
                onChange={(e) => setCoachName(e.target.value)}
                className={errors.coachName ? 'border-destructive' : ''}
              />
              {errors.coachName && (
                <p className="text-sm text-destructive">{errors.coachName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="contact-number" className="text-sm font-medium text-gray-900">
                Contact Number <span className="text-destructive">*</span>
              </label>
              <Input
                id="contact-number"
                type="tel"
                placeholder="+62812345678"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className={errors.contactNumber ? 'border-destructive' : ''}
              />
              {errors.contactNumber && (
                <p className="text-sm text-destructive">{errors.contactNumber}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <PlayerInput players={players} onChange={setPlayers} />
          {errors.players && (
            <p className="text-sm text-destructive mt-2">{errors.players}</p>
          )}
        </Card>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => setPaymentModalOpen(true)}
          >
            <CreditCard className="h-4 w-4" />
            Payment Instructions
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2"
            onClick={handleWhatsAppContact}
          >
            <MessageCircle className="h-4 w-4" />
            Contact via WhatsApp
          </Button>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Submit Registration
        </Button>
      </form>

      <PaymentModal open={paymentModalOpen} onOpenChange={setPaymentModalOpen} />
    </>
  );
}
