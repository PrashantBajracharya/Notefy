import NewTask from "./NewTask.jsx";

function Tasks({ tasks, onAdd, onDelete }) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-stone-700 mb-4">Tasks</h2>
      <NewTask onAdd={onAdd} />
      {tasks.length === 0 && (
        <p className="text-stone-800 my-4">
          This note does not have any tasks yet.
        </p>
      )}

      {tasks.length > 0 && (
        <ul className="p-4 mt-8 rounded-md bg-stone-100 border-2 border-stone-400">
          {tasks.map((task) => (
            <li key={task.id} className="flex justify-between my-2 ">
              <span>{task.text}</span>
              <button
                className="text-red-600 hover:text-red-700"
                onClick={() => onDelete(task.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Tasks;
