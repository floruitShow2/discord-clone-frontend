const extname2Language: Array<[string[], Editor.AvailableLang]> = [
  [['js', 'jsx'], 'javascript'],
  [['ts', 'tsx'], 'typescript'],
  [['json'], 'json'],
  [['css'], 'css'],
  [['less', 'scss'], 'less'],
  [['html'], 'html']
]

export function filename2Language(filename: string): Editor.AvailableLang {
  const ext = filename.split('.').pop() || ''
  for (const [extArr, lang] of extname2Language) {
    if (extArr.includes(ext)) return lang
  }

  return 'javascript'
}
