import Spinner from "@/app/components/Spinner";

export default function LoadingUI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Spinner className="w-16 h-16 text-blue-600" />
      <p className="mt-4 text-xl font-medium text-gray-100">
        Cargando la página...
      </p>
    </div>
  );
}
