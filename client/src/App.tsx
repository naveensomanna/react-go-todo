import { useEffect, useState } from "react";
import "./App.css";

const END_POINT = "http://localhost:4000";

function App() {
  const [visibleModal, setVisibleModal] = useState(false);
  const [data, setData] = useState<any>({});
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await fetch(`${END_POINT}/api/todos`);
      const result = await res.json();
      setTodos(result);
    }
    getData();
  }, []);

  async function addData() {
    const res = await fetch(`${END_POINT}/api/todos`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ title: data?.title, body: data?.body }),
    });
    const result = await res.json();
    setTodos(result);
  }

  async function doneData(id: number) {
    const res = await fetch(`${END_POINT}/api/todos/${id}/done`, {
      method: "PATCH",
    });
    const result = await res.json();
    setTodos(result);
  }

  const onClickCreate = () => {
    setVisibleModal(true);
  };

  const onClickAdd = () => {
    setVisibleModal(false);
    addData();
  };

  const onchange = (e: any, name: string) => {
    const { value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleDone = (id: number) => {
    doneData(id);
  };

  return (
    <section className="p-4">
      <button
        className="p-2 bg-slate-100 text-black rounded-md"
        onClick={onClickCreate}
      >
        Create
      </button>
      <ul className="mt-8 p-8 rounded-md shadow-md bg-slate-100 w-[30%]">
        {todos.map((item: any) => (
          <li
            key={item.id}
            className={`mb-4  cursor-pointer ${item.done && "line-through"}`}
            onClick={() => handleDone(item.id)}
          >
            <p className="text-[green] mb-2 ">{item.title}</p>
            <p className="text-[grey]">{item.body}</p>
          </li>
        ))}
      </ul>
      {visibleModal && (
        <div className="p-6 bg-white shadow-md rounded-md absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-10 ">
          <div className="mb-6">
            <label>Title:</label>{" "}
            <input type="text" onChange={(e) => onchange(e, "title")} />
          </div>
          <div className="mb-6">
            <label>Body:</label>{" "}
            <input type="text" onChange={(e) => onchange(e, "body")} />
          </div>
          <button
            className="py-2 px-4 bg-black text-white rounded-md flex  ml-auto"
            onClick={onClickAdd}
          >
            Add
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
