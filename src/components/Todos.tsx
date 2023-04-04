import { type Todo } from '../App'

interface Props {
  todos: Todo[]
}

function Todos({ todos }: Props): JSX.Element {
  return (
    <ul className="text-gray-600 text-[24px] bg-white">
      {todos.map(todo => (
        <li className="py-[16px] group px-[20px] border-solid border-b-2 border-gray-300 flex items-center justify-between">
          <div className="flex items-center w-full">
            <i className={`bx ${todo.completed ? 'bx-check-square' : 'bx-square'} text-[30px] cursor-pointer`}></i>
            <div contentEditable={true} className={`pl-[10px] w-full ${todo.completed ? 'line-through' : ''}`}>
              {todo.value}
            </div>
          </div>
          <i className="bx bx-trash text-[30px] cursor-pointer invisible group-hover:visible"></i>
        </li>
      ))}
    </ul>
  )
}

export default Todos
