export const login = (username: string, password: string): boolean | undefined => {
  try {
    if (username === 'admin' && password === '123') {
      return true
    }
    return false
  } catch (error) {
    console.error(error)
  }
}
