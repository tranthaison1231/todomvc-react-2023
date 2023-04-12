export interface ITodo {
  id: string
  value: string
  completed: boolean
  isLoading?: boolean
}

const TODO_APP_URL = 'https://64106f42be7258e14529c12f.mockapi.io'

export const createTodo = async ({ value, completed }: Omit<ITodo, 'id'>): Promise<ITodo | undefined> => {
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

export const getTodos = async (): Promise<ITodo[] | undefined> => {
  try {
    const res = await fetch(`${TODO_APP_URL}/todos`)
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

export const updateTodo = async (todo: ITodo): Promise<ITodo | undefined> => {
  try {
    const res = await fetch(`${TODO_APP_URL}/todos/${todo.id}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(todo)
    })
    const data = await res.json()
    return data
  } catch (error) {
    console.error(error)
  }
}

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await fetch(`${TODO_APP_URL}/todos/${id}`, {
      method: 'DELETE'
    })
  } catch (error) {
    console.error(error)
  }
}
