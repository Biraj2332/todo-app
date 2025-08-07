import { Plus } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "../app/slices/taskSlice";

const AddTasks = () => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const dispatch = useDispatch();
  
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      dispatch(addTask({ title: newTaskTitle }));
      setNewTaskTitle("");
    }
  };
  
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-2">
      <input
        type="text"
        value={newTaskTitle}
        onChange={(e) => setNewTaskTitle(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleAddTask()}
        placeholder="Add a new task..."
        className="px-4 py-3 flex-grow border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm"
      />
      <button
        onClick={handleAddTask}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg shadow-md transition-colors duration-200 flex items-center justify-center gap-1 min-w-[120px]"
      >
        <Plus size={18} />
        <span>Add Task</span>
      </button>
    </div>
  );
};

export default AddTasks;
