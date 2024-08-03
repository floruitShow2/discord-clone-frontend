declare namespace Question {
  type Category = 'Vue' | 'React'

  interface File {
    name: string
    language: string
    value: string
  }

  interface Entity {
    id: string
    title: string
    content: string
    category: Category
    files: File[]
  }
}
