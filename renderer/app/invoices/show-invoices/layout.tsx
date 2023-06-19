export const metadata = {
  title: "Facturas Diarias",
  description: "Facturas Diarias",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex flex-col min-h-screen">
        <div className="container max-w-6xl px-4 py-4 shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-center text-blue-600">Facturas Diarias</h1>
          {children}
        </div>
      </div>
  );
}
