export const metadata = {
  title: "Facturas Diarias",
  description: "Facturas Diarias",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="container mx-auto px-4 text-center max-w-6xl">
        <h1 className="text-2xl font-bold mb-4">Facturas Diarias</h1>
        {children}
      </div>
  );
}
