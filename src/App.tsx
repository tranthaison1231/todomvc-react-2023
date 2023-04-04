import { useRef, useState, useEffect } from 'react'
import Todos from './components/Todos'

export interface Todo {
  id: string
  value: string
  completed: boolean
}

const TODO_APP_URL = 'https://64106f42be7258e14529c12f.mockapi.io'

const createTodo = async ({ value, completed }: Omit<Todo, 'id'>): Promise<Todo | undefined> => {
  try {
    const res = await fetch(`${TODO_APP_URL}/todos`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ value, completed })
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

function App(): JSX.Element {
  const [todos, setTodos] = useState<Todo[]>([])

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

  useEffect(() => {
    const fetchTodos = async (): Promise<void> => {
      try {
        const res = await fetch(`${TODO_APP_URL}/todos`)
        const data = await res.json()
        setTodos(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchTodos()
  }, [])

  return (
    <div>
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
      <Todos todos={todos} />
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

export default App
