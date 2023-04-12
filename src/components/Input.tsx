
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = (props: InputProps): JSX.Element => {
  return <input {...props} className={`p-2 border-red-200 border-2 ${props.className ?? ''}`} />
}

export default Input
