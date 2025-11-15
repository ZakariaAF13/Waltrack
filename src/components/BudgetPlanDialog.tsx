import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp } from 'lucide-react';

interface BudgetPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: 'id' | 'en';
}

export function BudgetPlanDialog({ open, onOpenChange, lang }: BudgetPlanDialogProps) {
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [savingsGoal, setSavingsGoal] = useState('');
  const { toast } = useToast();

  const t = {
    id: {
      title: 'Rencanakan Keuangan',
      monthlyBudget: 'Budget Bulanan',
      savingsGoal: 'Target Tabungan',
      placeholder: 'Masukkan jumlah',
      save: 'Simpan',
      cancel: 'Batal',
      success: 'Rencana keuangan berhasil disimpan',
      error: 'Masukkan nilai yang valid',
    },
    en: {
      title: 'Financial Planning',
      monthlyBudget: 'Monthly Budget',
      savingsGoal: 'Savings Goal',
      placeholder: 'Enter amount',
      save: 'Save',
      cancel: 'Cancel',
      success: 'Financial plan saved successfully',
      error: 'Please enter valid values',
    },
  };

  const handleSave = () => {
    const budget = parseFloat(monthlyBudget);
    const goal = parseFloat(savingsGoal);

    if (isNaN(budget) || budget <= 0 || isNaN(goal) || goal <= 0) {
      toast({
        title: 'Error',
        description: t[lang].error,
        variant: 'destructive',
      });
      return;
    }

    // Save to localStorage
    localStorage.setItem('monthlyBudget', monthlyBudget);
    localStorage.setItem('savingsGoal', savingsGoal);

    toast({
      title: t[lang].success,
      description: `Budget: Rp ${budget.toLocaleString('id-ID')}, Target: Rp ${goal.toLocaleString('id-ID')}`,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t[lang].title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Card className="border-0 bg-teal-50 dark:bg-teal-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Target size={18} className="text-teal-600" />
                <Label htmlFor="budget" className="font-semibold">{t[lang].monthlyBudget}</Label>
              </div>
              <Input
                id="budget"
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder={t[lang].placeholder}
                className="bg-background"
              />
            </CardContent>
          </Card>

          <Card className="border-0 bg-green-50 dark:bg-green-900/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-green-600" />
                <Label htmlFor="savings" className="font-semibold">{t[lang].savingsGoal}</Label>
              </div>
              <Input
                id="savings"
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                placeholder={t[lang].placeholder}
                className="bg-background"
              />
            </CardContent>
          </Card>
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
