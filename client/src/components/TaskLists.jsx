import { useState } from "react";
import { Trash2, Circle, CircleCheck, SquarePen, GripVertical, Loader2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { deleteTask, updateTask, reorderTasks } from "../app/slices/taskSlice";

const TaskLists = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state) => state.tasks);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", date: "", time: "" });

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleToggleComplete = (id) => {
    const task = tasks.all.find(task => task.id === id);
    if (task) {
      dispatch(updateTask(id, { completed: !task.completed }));
    }
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditForm({
      title: task.title,
      date: task.date,
      time: task.time,
    });
  };

  const handleEditSubmit = (id) => {
    dispatch(updateTask(id, editForm));
    setEditingTask(null);
  };

  const onDragEnd = (result) => {
    dispatch(reorderTasks(result));
  };

  const columnTitles = {
    all: "All Tasks",
    active: "Active",
    completed: "Completed",
  };

  const columnColors = {
    all: "bg-blue-50 border-blue-200",
    active: "bg-amber-50 border-amber-200",
    completed: "bg-green-50 border-green-200",
  };

  const columnHeaderColors = {
    all: "bg-blue-100 text-blue-800",
    active: "bg-amber-100 text-amber-800",
    completed: "bg-green-100 text-green-800",
  };

  if (!tasks.initialized) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen px-4 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {["all", "active", "completed"].map((columnKey) => (
              <Droppable droppableId={columnKey} key={columnKey}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-lg sm:rounded-xl border-2 ${columnColors[columnKey]} shadow-sm min-h-[300px] sm:min-h-[400px]`}
                  >
                    <div
                      className={`p-3 sm:p-4 rounded-t-lg ${columnHeaderColors[columnKey]} flex justify-between items-center`}
                    >
                      <h3 className="text-base sm:text-lg font-semibold">
                        {columnTitles[columnKey]}
                      </h3>
                      <span className="bg-white/80 px-2 py-1 rounded text-xs sm:text-sm font-medium">
                        {tasks[columnKey].length} tasks
                      </span>
                    </div>

                    <div className="p-2 sm:p-4 min-h-[200px]">
                      {tasks[columnKey].length === 0 ? (
                        <div className="flex justify-center items-center h-full text-gray-500">
                          No tasks found
                        </div>
                      ) : (
                        <div className="space-y-2 sm:space-y-3">
                          {tasks[columnKey].map((task, index) => (
                            <Draggable draggableId={task.id} index={index} key={task.id}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`bg-white p-3 sm:p-4 rounded-md sm:rounded-lg shadow-xs border ${
                                    task.completed ? "border-green-200" : "border-indigo-200"
                                  } hover:shadow-md transition-shadow duration-200`}
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="flex items-start gap-2 sm:gap-3 w-full">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="mt-0.5 sm:mt-1 text-gray-400 hover:text-gray-600 cursor-grab"
                                      >
                                        <GripVertical size={16} className="sm:size-[18px]" />
                                      </div>

                                      {editingTask === task.id ? (
                                        <div className="w-full space-y-2">
                                          <input
                                            type="text"
                                            value={editForm.title}
                                            onChange={(e) =>
                                              setEditForm({ ...editForm, title: e.target.value })
                                            }
                                            className="w-full px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            autoFocus
                                          />
                                          <div className="flex gap-1 sm:gap-2">
                                            <input
                                              type="text"
                                              value={editForm.date}
                                              onChange={(e) =>
                                                setEditForm({ ...editForm, date: e.target.value })
                                              }
                                              placeholder="MM/DD/YYYY"
                                              className="px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                            <input
                                              type="text"
                                              value={editForm.time}
                                              onChange={(e) =>
                                                setEditForm({ ...editForm, time: e.target.value })
                                              }
                                              placeholder="HH:MM AM/PM"
                                              className="px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                            />
                                          </div>
                                          <div className="flex justify-end gap-2 mt-1 sm:mt-2">
                                            <button
                                              onClick={() => setEditingTask(null)}
                                              className="px-2 py-1 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded"
                                            >
                                              Cancel
                                            </button>
                                            <button
                                              onClick={() => handleEditSubmit(task.id)}
                                              className="px-2 py-1 text-xs sm:text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                            >
                                              Save
                                            </button>
                                          </div>
                                        </div>
                                      ) : (
                                        <div className="w-full">
                                          <p
                                            className={`text-sm sm:text-md font-medium ${
                                              task.completed
                                                ? "line-through text-gray-500"
                                                : "text-gray-800"
                                            }`}
                                          >
                                            {task.title}
                                          </p>
                                          <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-gray-500">
                                            <span>{task.date}</span>
                                            <span>•</span>
                                            <span>{task.time}</span>
                                          </div>
                                          <div className="mt-1 sm:mt-2">
                                            <span
                                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                                                task.completed
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-amber-100 text-amber-800"
                                              }`}
                                            >
                                              {task.completed ? "Completed" : "Active"}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {editingTask !== task.id && (
                                      <div className="flex flex-col gap-1 sm:gap-2 text-gray-500">
                                        <button
                                          onClick={() => startEditing(task)}
                                          className="hover:text-indigo-600 transition-colors"
                                          title="Edit"
                                        >
                                          <SquarePen size={16} className="sm:size-[18px]" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteTask(task.id)}
                                          className="hover:text-red-600 transition-colors"
                                          title="Delete"
                                        >
                                          <Trash2 size={16} className="sm:size-[18px]" />
                                        </button>
                                        <button
                                          onClick={() => handleToggleComplete(task.id)}
                                          className="hover:text-green-600 transition-colors"
                                          title={task.completed ? "Mark active" : "Mark complete"}
                                        >
                                          {task.completed ? (
                                            <CircleCheck size={16} className="sm:size-[18px] text-green-600" />
                                          ) : (
                                            <Circle size={16} className="sm:size-[18px]" />
                                          )}
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
};

export default TaskLists;
// import { useState, useEffect } from "react";
// import {
//   Trash2,
//   Circle,
//   CircleCheck,
//   SquarePen,
//   GripVertical,
// } from "lucide-react";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
// } from "react-beautiful-dnd";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   deleteTask,
//   updateTask,
//   reorderTasks,
// } from "../app/slices/taskSlice";

// const TaskLists = () => {
//   const dispatch = useDispatch();
//   const tasks = useSelector((state) => state.tasks);

//   const [editingTask, setEditingTask] = useState(null);
//   const [editForm, setEditForm] = useState({
//     title: "",
//     date: "",
//     time: "",
//   });

//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const timer = setTimeout(() => setIsLoading(false), 500);
//     return () => clearTimeout(timer);
//   }, []);

//   const handleDeleteTask = (id) => {
//     dispatch(deleteTask(id));
//   };

//   const handleToggleComplete = (id) => {
//     const task = tasks.all.find((task) => task.id === id);
//     if (task) {
//       dispatch(updateTask(id, { completed: !task.completed }));
//     }
//   };

//   const startEditing = (task) => {
//     setEditingTask(task.id);
//     setEditForm({
//       title: task.title,
//       date: task.date,
//       time: task.time,
//     });
//   };

//   const handleEditSubmit = (id) => {
//     dispatch(updateTask(id, editForm));
//     setEditingTask(null);
//   };

//   const onDragEnd = (result) => {
//     const { source, destination } = result;
//     if (!destination) return;

//     const sourceCol = source.droppableId;
//     const destCol = destination.droppableId;

//     const sourceTasks = Array.from(tasks[sourceCol]);
//     const [movedTask] = sourceTasks.splice(source.index, 1);
//     const destTasks = Array.from(tasks[destCol]);

//     destTasks.splice(destination.index, 0, movedTask);

//     dispatch(
//       reorderTasks({ sourceCol, destCol, sourceTasks, destTasks })
//     );
//   };

//   const columnTitles = {
//     all: "All Tasks",
//     active: "Active",
//     completed: "Completed",
//   };

//   const columnColors = {
//     all: "bg-blue-50 border-blue-200",
//     active: "bg-amber-50 border-amber-200",
//     completed: "bg-green-50 border-green-200",
//   };

//   const columnHeaderColors = {
//     all: "bg-blue-100 text-blue-800",
//     active: "bg-amber-100 text-amber-800",
//     completed: "bg-green-100 text-green-800",
//   };

//   return (
//     <div className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen px-4 py-6 sm:py-10">
//       <div className="max-w-7xl mx-auto">
//         <DragDropContext onDragEnd={onDragEnd}>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//             {["all", "active", "completed"].map((columnKey) => (
//               <Droppable droppableId={columnKey} key={columnKey}>
//                 {(provided) => (
//                   <div
//                     ref={provided.innerRef}
//                     {...provided.droppableProps}
//                     className={`rounded-lg sm:rounded-xl border-2 ${columnColors[columnKey]} shadow-sm min-h-[300px] sm:min-h-[400px]`}
//                   >
//                     <div
//                       className={`p-3 sm:p-4 rounded-t-lg ${columnHeaderColors[columnKey]} flex justify-between items-center`}
//                     >
//                       <h3 className="text-base sm:text-lg font-semibold">
//                         {columnTitles[columnKey]}
//                       </h3>
//                       <span className="bg-white/80 px-2 py-1 rounded text-xs sm:text-sm font-medium">
//                         {tasks[columnKey].length} tasks
//                       </span>
//                     </div>

//                     <div className="p-2 sm:p-4 min-h-[200px]">
//                       {isLoading ? (
//                         <div className="flex justify-center items-center h-full">
//                           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//                         </div>
//                       ) : tasks[columnKey].length === 0 ? (
//                         <div className="flex justify-center items-center h-full text-gray-500">
//                           No tasks found
//                         </div>
//                       ) : (
//                         <div className="space-y-2 sm:space-y-3">
//                           {tasks[columnKey].map((task, index) => (
//                             <Draggable
//                               draggableId={task.id}
//                               index={index}
//                               key={task.id}
//                             >
//                               {(provided) => (
//                                 <div
//                                   ref={provided.innerRef}
//                                   {...provided.draggableProps}
//                                   className={`bg-white p-3 sm:p-4 rounded-md sm:rounded-lg shadow-xs border ${
//                                     task.completed
//                                       ? "border-green-200"
//                                       : "border-indigo-200"
//                                   } hover:shadow-md transition-shadow duration-200`}
//                                 >
//                                   <div className="flex justify-between items-start gap-2">
//                                     <div className="flex items-start gap-2 sm:gap-3 w-full">
//                                       <div
//                                         {...provided.dragHandleProps}
//                                         className="mt-0.5 sm:mt-1 text-gray-400 hover:text-gray-600 cursor-grab"
//                                       >
//                                         <GripVertical
//                                           size={16}
//                                           className="sm:size-[18px]"
//                                         />
//                                       </div>

//                                       {editingTask === task.id ? (
//                                         <div className="w-full space-y-2">
//                                           <input
//                                             type="text"
//                                             value={editForm.title}
//                                             onChange={(e) =>
//                                               setEditForm({
//                                                 ...editForm,
//                                                 title: e.target.value,
//                                               })
//                                             }
//                                             className="w-full px-2 py-1 sm:px-3 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                                           />
//                                           <div className="flex gap-1 sm:gap-2">
//                                             <input
//                                               type="text"
//                                               value={editForm.date}
//                                               onChange={(e) =>
//                                                 setEditForm({
//                                                   ...editForm,
//                                                   date: e.target.value,
//                                                 })
//                                               }
//                                               placeholder="MM/DD/YYYY"
//                                               className="px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                                             />
//                                             <input
//                                               type="text"
//                                               value={editForm.time}
//                                               onChange={(e) =>
//                                                 setEditForm({
//                                                   ...editForm,
//                                                   time: e.target.value,
//                                                 })
//                                               }
//                                               placeholder="HH:MM AM/PM"
//                                               className="px-2 py-1 sm:px-3 sm:py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
//                                             />
//                                           </div>
//                                           <div className="flex justify-end gap-2 mt-1 sm:mt-2">
//                                             <button
//                                               onClick={() =>
//                                                 setEditingTask(null)
//                                               }
//                                               className="px-2 py-1 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded"
//                                             >
//                                               Cancel
//                                             </button>
//                                             <button
//                                               onClick={() =>
//                                                 handleEditSubmit(task.id)
//                                               }
//                                               className="px-2 py-1 text-xs sm:text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
//                                             >
//                                               Save
//                                             </button>
//                                           </div>
//                                         </div>
//                                       ) : (
//                                         <div className="w-full">
//                                           <p
//                                             className={`text-sm sm:text-md font-medium ${
//                                               task.completed
//                                                 ? "line-through text-gray-500"
//                                                 : "text-gray-800"
//                                             }`}
//                                           >
//                                             {task.title}
//                                           </p>
//                                           <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-gray-500">
//                                             <span>{task.date}</span>
//                                             <span>•</span>
//                                             <span>{task.time}</span>
//                                           </div>
//                                           <div className="mt-1 sm:mt-2">
//                                             <span
//                                               className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
//                                                 task.completed
//                                                   ? "bg-green-100 text-green-800"
//                                                   : "bg-amber-100 text-amber-800"
//                                               }`}
//                                             >
//                                               {task.completed
//                                                 ? "Completed"
//                                                 : "Active"}
//                                             </span>
//                                           </div>
//                                         </div>
//                                       )}
//                                     </div>

//                                     {/* Action buttons */}
//                                     {editingTask !== task.id && (
//                                       <div className="flex flex-col gap-1 sm:gap-2 text-gray-500">
//                                         <button
//                                           onClick={() =>
//                                             handleToggleComplete(task.id)
//                                           }
//                                           className={`hover:${
//                                             task.completed
//                                               ? "text-amber-500"
//                                               : "text-green-500"
//                                           } transition-colors`}
//                                           title={
//                                             task.completed
//                                               ? "Mark as Active"
//                                               : "Mark as Completed"
//                                           }
//                                         >
//                                           {task.completed ? (
//                                             <CircleCheck
//                                               size={16}
//                                               className="sm:size-[18px]"
//                                             />
//                                           ) : (
//                                             <Circle
//                                               size={16}
//                                               className="sm:size-[18px]"
//                                             />
//                                           )}
//                                         </button>
//                                         <button
//                                           onClick={() => startEditing(task)}
//                                           className="hover:text-indigo-600 transition-colors"
//                                           title="Edit"
//                                         >
//                                           <SquarePen
//                                             size={16}
//                                             className="sm:size-[18px]"
//                                           />
//                                         </button>
//                                         <button
//                                           onClick={() =>
//                                             handleDeleteTask(task.id)
//                                           }
//                                           className="hover:text-red-600 transition-colors"
//                                           title="Delete"
//                                         >
//                                           <Trash2
//                                             size={16}
//                                             className="sm:size-[18px]"
//                                           />
//                                         </button>
//                                       </div>
//                                     )}
//                                   </div>
//                                 </div>
//                               )}
//                             </Draggable>
//                           ))}
//                           {provided.placeholder}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </Droppable>
//             ))}
//           </div>
//         </DragDropContext>
//       </div>
//     </div>
//   );
// };

// export default TaskLists;
