import { useState, useEffect } from 'react';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export const CharacterData = () => {
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    // Exemplo de consumo da API do Rick and Morty
    fetch('https://rickandmortyapi.com/api/character/1')
      .then(res => res.json())
      .then(data => setCharacter(data));
  }, []);

  if (!character) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Personagem: {character.name}</h2>
      <img src={character.image} alt={character.name} width={150} />
      <p>Status: {character.status}</p>
      <p>Espécie: {character.species}</p>
    </div>
  );
}