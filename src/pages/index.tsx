import { useEffect, useRef, useState } from 'react'
import { createTodo, deleteTodo, getTodos, type ITodo } from '../api/todo'
import Header from '../components/Header'
import Loading from '../components/Loading'
import Todos from '../components/Todos'
import withAuthenticate from '../hocs/withAuthenticate'

function App(): JSX.Element {
  const [todos, setTodos] = useState<ITodo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteLoading, setIsDeleteLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>): Promise<void> => {
    try {
      if (event.key === 'Enter' && inputRef.current?.value.trim() !== '') {
        const newTodo = await createTodo({ value: inputRef.current?.value ?? '', completed: false })
        if (newTodo) {
          setTodos(todos => [...todos, newTodo])
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id: string): Promise<void> => {
    try {
      setIsDeleteLoading(true)
      await deleteTodo(id)
      setTodos(todos => todos.filter(todo => todo.id !== id))
    } catch (error) {
      console.log(error)
    } finally {
      setIsDeleteLoading(false)
    }
  }

  const updateTodo = async (id: string, updatedTodo: ITodo): Promise<void> => {
    try {
      setTodos(todos => todos.map(todo => (todo.id === id ? { ...todo, isLoading: true } : todo)))
      await updateTodo(id, updatedTodo)
      setTodos(todos => todos.map(todo => (todo.id === id ? updatedTodo : todo)))
    } catch (error) {
      console.log(error)
    } finally {
      setTodos(todos => todos.map(todo => (todo.id === id ? { ...todo, isLoading: false } : todo)))
    }
  }

  useEffect(() => {
    const fetchTodos = async (): Promise<void> => {
      try {
        setIsLoading(true)
        const data = await getTodos()
        data && setTodos(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTodos()
  }, [])

  return (
    <div>
      <Header />
      <div id="title" className="text-center text-[100px] text-[#ead7d7]">
        todos
      </div>
      <input
        ref={inputRef}
        onKeyDown={onKeyDown}
        className="outline-none items-center py-[16px] px-[60px] w-full shadow-xl text-[24px]"
        type="text"
        placeholder="What need to be done?"
      />
      {isLoading
        ? (
        <Loading />
          )
        : (
        <Todos todos={todos} onDelete={handleDelete} isDeleteLoading={isDeleteLoading} onUpdate={updateTodo} />
          )}
      <div className="bg-white w-full px-[20px] py-4 grid grid-cols-[1fr_2fr_1fr] shadow-xl">
        <span id="count"></span>
        <ul data-todo="filters" className="flex justify-center">
          <li className="px-[20px]">
            <a className="checked p-2" href="#/">
              All
            </a>
          </li>
          <li className="px-[20px]">
            <a href="#/active" className="p-2">
              Active
            </a>
          </li>
          <li className="px-[20px]">
            <a href="#/completed" className="p-2">
              Completed
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default withAuthenticate(App)
