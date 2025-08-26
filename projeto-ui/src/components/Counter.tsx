import { useState } from "react";

export const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span>{count}</span>
      <br/>
      <button onClick={() => setCount(count + 1)}>Atualizar</button>
    </div>
  );
};
