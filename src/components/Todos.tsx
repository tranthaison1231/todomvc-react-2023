import { type ITodo } from '../App'
import Todo from './Todo'

interface Props {
  todos: ITodo[]
  onDelete: (id: string) => void
  onUpdate: (id: string, todo: ITodo) => void
  isDeleteLoading: boolean
}

function Todos({ todos, onDelete, isDeleteLoading, onUpdate }: Props): JSX.Element {
  return (
    <ul className="text-gray-600 text-[24px] bg-white">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          isDeleteLoading={isDeleteLoading}
          onDelete={() => {
            onDelete(todo.id)
          }}
          onComplete={() => {
            onUpdate(todo.id, {
              ...todo,
              completed: !todo.completed
            })
          }}
          onUpdate={(value) => {
            onUpdate(todo.id, {
              ...todo,
              value
            })
          }}
        />
      ))}
    </ul>
  )
}

export default Todos
