import { useMemo, useRef } from 'react'
import { type ITodo } from '../api/todo'

interface Props {
  todo: ITodo
  onDelete: () => void
  onComplete: () => void
  onUpdate: (value: string) => void
  isDeleteLoading: boolean
}

function Todo({ todo, onDelete, isDeleteLoading, onComplete, onUpdate }: Props): JSX.Element {
  const contentRef = useRef<HTMLDivElement>(null)

  const checkedClass = useMemo(() => {
    if (todo.isLoading) return 'bx-loader-circle animate-spin'
    if (todo.completed) return 'bx-check-square'
    return 'bx-square'
  }, [todo.isLoading, todo.completed])

  return (
    <li className="py-[16px] group px-[20px] border-solid border-b-2 border-gray-300 flex items-center justify-between">
      <div className="flex items-center w-full">
        <i className={`bx ${checkedClass} text-[30px] cursor-pointer`} onClick={onComplete}></i>
        <div
          ref={contentRef}
          contentEditable
          className={`pl-[10px] w-full ${todo.completed ? 'line-through' : ''}`}
          dangerouslySetInnerHTML={{ __html: todo.value }}
          onBlur={() => { if (contentRef.current?.textContent) onUpdate(contentRef.current.textContent) }}
        />
      </div>
      <i
        className={`bx text-[30px] cursor-pointer invisible group-hover:visible ${
          isDeleteLoading ? 'bx-loader-circle animate-spin' : 'bx-trash'
        }`}
        onClick={onDelete}
      ></i>
    </li>
  )
}

export default Todo
