import { useEffect, useState } from "react";

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export const CharacterData = () => {
  const [char, setChar] = useState<Character | null>(null);

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/character/1")
      .then((res) => res.json())
      .then((data) => setChar(data));
  }, []);

  if (!char) return <p>Carregando...</p>;

  return (
    <div className="w-full flex flex-col items-center bg-amber-400">
      <h2 className="bg-green-700 text-white text-4xl font-bold">
        Personagem: {char.name}
      </h2>
      <img src={char.image} alt={char.name} width={150} />
      <h2>Status: {char.status}</h2>
    </div>
  );
};
