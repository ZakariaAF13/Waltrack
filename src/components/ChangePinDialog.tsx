import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Lock } from 'lucide-react';

interface ChangePinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: 'id' | 'en';
}

export function ChangePinDialog({ open, onOpenChange, lang }: ChangePinDialogProps) {
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const { toast } = useToast();

  const t = {
    id: {
      title: 'Ubah PIN',
      currentPin: 'PIN Saat Ini',
      newPin: 'PIN Baru',
      confirmPin: 'Konfirmasi PIN Baru',
      save: 'Simpan',
      cancel: 'Batal',
      success: 'PIN berhasil diubah',
      errorMatch: 'PIN baru tidak cocok',
      errorLength: 'PIN harus 4-6 digit',
      errorWrong: 'PIN saat ini salah',
    },
    en: {
      title: 'Change PIN',
      currentPin: 'Current PIN',
      newPin: 'New PIN',
      confirmPin: 'Confirm New PIN',
      save: 'Save',
      cancel: 'Cancel',
      success: 'PIN changed successfully',
      errorMatch: 'New PIN does not match',
      errorLength: 'PIN must be 4-6 digits',
      errorWrong: 'Current PIN is incorrect',
    },
  };

  const handleSave = () => {
    // Validate PIN length
    if (newPin.length < 4 || newPin.length > 6 || !/^\d+$/.test(newPin)) {
      toast({
        title: 'Error',
        description: t[lang].errorLength,
        variant: 'destructive',
      });
      return;
    }

    // Check if new PIN matches confirmation
    if (newPin !== confirmPin) {
      toast({
        title: 'Error',
        description: t[lang].errorMatch,
        variant: 'destructive',
      });
      return;
    }

    // Check current PIN (in real app, verify with backend)
    const storedPin = localStorage.getItem('userPin') || '1234';
    if (currentPin !== storedPin) {
      toast({
        title: 'Error',
        description: t[lang].errorWrong,
        variant: 'destructive',
      });
      return;
    }

    // Save new PIN
    localStorage.setItem('userPin', newPin);

    toast({
      title: t[lang].success,
      description: `PIN baru: ${'*'.repeat(newPin.length)}`,
    });

    // Reset form
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock size={20} className="text-teal-600" />
            {t[lang].title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="current-pin">{t[lang].currentPin}</Label>
            <Input
              id="current-pin"
              type="password"
              maxLength={6}
              value={currentPin}
              onChange={(e) => setCurrentPin(e.target.value.replace(/\D/g, ''))}
              placeholder="****"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-pin">{t[lang].newPin}</Label>
            <Input
              id="new-pin"
              type="password"
              maxLength={6}
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              placeholder="****"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-pin">{t[lang].confirmPin}</Label>
            <Input
              id="confirm-pin"
              type="password"
              maxLength={6}
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
              placeholder="****"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t[lang].cancel}
          </Button>
          <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
            {t[lang].save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
