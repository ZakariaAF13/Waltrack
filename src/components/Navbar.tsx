import { Wallet } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Waltrack</h1>
          </div>
          <div className="text-sm text-muted-foreground">
            Kelola Keuangan Anda
          </div>
        </div>
      </div>
    </nav>
  );
};
