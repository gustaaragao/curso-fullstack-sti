interface TodoItemProps {
  title: string;
  description: string;
}

export const TodoItem = ({title, description}: TodoItemProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
};
