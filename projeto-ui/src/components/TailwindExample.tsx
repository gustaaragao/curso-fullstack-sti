export const TailwindExample = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <h1 className="text-4xl font-bold text-white mb-4">
        Exemplo com Tailwind CSS
      </h1>
      <p className="text-lg text-white mb-6">
        Este bloco está centralizado e estilizado com classes do Tailwind.
      </p>
      <button className="px-6 py-2 bg-white text-blue-600 font-semibold rounded shadow hover:bg-blue-100 transition">
        Botão estilizado
      </button>
    </div>
  );
};
