import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Autentificare utilizator',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <div >
        {children}
      </div>
    </div>
  );
}