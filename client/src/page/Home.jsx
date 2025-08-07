import Header from "../components/Header";
import AddTasks from "../components/AddTasks";
import TaskLists from "../components/TaskLists";

const Home = () => {
  
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-100 min-h-screen px-4 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto">
        <Header />  
        <AddTasks />
        <TaskLists />
      </div>
    </div>
  );
};

export default Home;
