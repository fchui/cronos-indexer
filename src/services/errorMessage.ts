export function errorMessage(error: unknown) {
    if (error instanceof Error)
      return console.log(error.message)
    return console.log(String(error))
}  