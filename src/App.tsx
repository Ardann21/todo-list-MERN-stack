/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, KeyboardEvent } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { Todo } from './types';


export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    fetch("http://localhost:5000/api/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => console.log(err));
  }, []);

  const handleAddTodo = async () => {
    if (!newTodoTitle.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTodoTitle,
        }),
      });

      const data = await res.json();

      setTodos((prev) => [data, ...prev]);

      setNewTodoTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find((t) => t._id === id);

      const res = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !todo?.completed,
        }),
      });

      const updatedTodo = await res.json();

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: "DELETE",
      });

      setTodos((prev) =>
        prev.filter((todo) => todo._id !== id)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const completedCount = todos.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-black font-sans p-4 sm:p-6 md:p-8 flex flex-col h-screen overflow-hidden">
      <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
        <header className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-black">Tasks.v1</h1>
            <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
              Frontend UI ready for backend
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-black">
                {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">Focus Mode</p>
            </div>
            <div className="w-10 h-10 rounded-full border-[3px] border-black bg-yellow-400 flex items-center justify-center font-black">
              !
            </div>
          </div>
        </header>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-6 gap-4 flex-grow overflow-y-auto pb-4 md:pb-0 h-full">

          {/* Main Tasks Card */}
          <div className="md:col-span-7 md:row-span-6 bg-white border-[3px] border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-[400px]">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h2 className="text-xl font-black uppercase">Active Tasks</h2>
              <span className="bg-black text-white px-3 py-1 text-[10px] font-bold rounded-full uppercase">
                {todos.length - completedCount} Pending
              </span>
            </div>
            <div className="space-y-3 overflow-y-auto flex-grow pb-2 pr-2">
              {todos.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-400 border-2 border-dashed border-gray-300 rounded-2xl h-full">
                  <p className="font-bold text-sm uppercase tracking-widest mb-2">No tasks available</p>
                  <p className="text-xs">Use Quick Entry to add something.</p>
                </div>
              ) : (
                todos.map(todo => (
                  <div
                    key={todo._id}
                    className={`group flex items-center gap-4 p-4 border-2 border-black rounded-2xl bg-white transition-opacity ${todo.completed ? 'opacity-60' : ''
                      }`}
                  >
                    <button
                      onClick={() => toggleTodo(todo._id)}
                      className={`flex items-center justify-center w-5 h-5 rounded-md border-2 border-black transition-colors flex-shrink-0 ${todo.completed
                          ? 'bg-black text-white'
                          : 'bg-white hover:bg-gray-100 text-transparent'
                        }`}
                    >
                      <Check size={14} strokeWidth={4} />
                    </button>

                    <div className="flex-grow min-w-0">
                      <p className={`font-bold text-sm truncate ${todo.completed ? 'line-through text-gray-600' : 'text-black'
                        }`}>
                        {todo.title}
                      </p>
                      <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                        {todo.completed ? 'Completed' : 'Pending'} • Added {new Date(todo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteTodo(todo._id)}
                      className="opacity-0 group-hover:opacity-100 text-black p-1 bg-gray-100 border border-black rounded transition-all focus:opacity-100 uppercase text-[10px] font-black tracking-wider hover:bg-black hover:text-white"
                      aria-label="Delete task"
                    >
                      DEL
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Add Card */}
          <div className="md:col-span-5 md:row-span-3 bg-yellow-400 border-[3px] border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[200px]">
            <div>
              <h2 className="text-lg font-black uppercase">Quick Entry</h2>
              <p className="text-xs font-bold opacity-70">Capture thoughts instantly</p>
            </div>
            <div className="relative mt-auto">
              <input
                type="text"
                className="w-full bg-white border-2 border-black rounded-xl p-3 pr-12 text-sm font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="What's next?"
                value={newTodoTitle}
                onChange={(e) => setNewTodoTitle(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleAddTodo}
                disabled={!newTodoTitle.trim()}
                className="absolute right-2 top-1.5 w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center font-bold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Add task"
              >
                <Plus size={18} strokeWidth={4} />
              </button>
            </div>
          </div>

          {/* Stats / Focus Card */}
          <div className="md:col-span-5 md:row-span-3 bg-[#E0E7FF] border-[3px] border-black rounded-3xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[200px]">
            <div>
              <h2 className="text-sm font-black uppercase mb-1">Weekly Velocity</h2>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-tight">Focus Metrics</p>
            </div>

            <div className="mt-4 flex-grow flex flex-col justify-end">
              <div className="flex justify-between items-end mb-2">
                <span className="text-4xl font-black tracking-tighter">{completedCount}</span>
                <span className="text-sm font-bold text-gray-500 uppercase pb-1">/ {todos.length} Done</span>
              </div>

              <div className="w-full h-4 bg-white border-2 border-black rounded-full overflow-hidden relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div
                  className="bg-purple-500 h-full border-r-2 border-black transition-all duration-500"
                  style={{ width: todos.length === 0 ? '0%' : `${(completedCount / todos.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
