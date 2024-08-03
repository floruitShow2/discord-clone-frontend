import { transform } from '@babel/standalone'
import { PluginObj } from '@babel/core'
import { PlaygroundFile } from '../../playgroundContext'

const beforeBabelTransform = (filename: string, code: string) => {
  let _code = code
  const regexReact = /import\s+React/g
  if ((filename.endsWith('.jsx') || filename.endsWith('.tsx')) && !regexReact.test(code)) {
    _code = `import React from 'react';\n${code}`
  }
  return _code
}
export const babelTransform = (filename: string, code: string, files: PlaygroundFile[]) => {
  let _code = beforeBabelTransform(filename, code)
  let result = ''
  try {
    result = transform(_code, {
      // 指定对 jsx 和 ts 语法做处理
      presets: ['react', 'typescript'],
      filename,
      plugins: [customResolver(files)],
      // 编译后保持原有行列号不变
      retainLines: true
    }).code!
  } catch (e) {
    console.error('编译出错', e)
  }
  return result
}

const getModuleFile = (files: PlaygroundFile[], modulePath: string): PlaygroundFile => {
  let moduleName = modulePath.split('./').pop() || ''
  // 如果是类似 ./App 这种格式，需要自行匹配 js\ts\jsx\tsx 后缀的文件
  if (!moduleName.includes('.')) {
    const realModule = files
      .filter((f) => {
        return (
          f.name.endsWith('.js') ||
          f.name.endsWith('.ts') ||
          f.name.endsWith('.jsx') ||
          f.name.endsWith('.tsx')
        )
      })
      .find((f) => f.name.split('.').includes(moduleName))
    if (realModule) {
      moduleName = realModule.name
    }
  }

  return files.find((f) => f.name === moduleName)!
}
const css2Js = (file: PlaygroundFile) => {
  const randomId = Date.now()
  const js = `
(() => {
    const stylesheet = document.createElement('style')
    stylesheet.setAttribute('id', 'style_${randomId}_${file.name}')
    document.head.appendChild(stylesheet)

    const styles = document.createTextNode(\`${file.value}\`)
    stylesheet.innerHTML = ''
    stylesheet.appendChild(styles)
})()
`
  return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}
const json2Js = (file: PlaygroundFile) => {
  const js = `export default ${file.value}`
  return URL.createObjectURL(new Blob([js], { type: 'application/javascript' }))
}
const customResolver = (files: PlaygroundFile[]): PluginObj => {
  return {
    visitor: {
      ImportDeclaration(path) {
        const modulePath = path.node.source.value
        // 仅处理相对路径
        if (modulePath.startsWith('.')) {
          const file = getModuleFile(files, modulePath)
          if (!file) return

          if (file.name.endsWith('.css')) {
            path.node.source.value = css2Js(file)
          } else if (file.name.endsWith('.json')) {
            path.node.source.value = json2Js(file)
          } else {
            path.node.source.value = URL.createObjectURL(
              new Blob([babelTransform(file.name, file.value, files)], {
                type: 'application/javascript'
              })
            )
          }
        }
        // path.node.source.value = '2323232'
      }
    }
  }
}

export const compile = (files: PlaygroundFile[], entry: string) => {
  const main = files.find((f) => f.name === entry)
  if (main) return babelTransform(entry, main.value, files)
  return ''
}

self.addEventListener('message', async ({ data }) => {
  try {
    self.postMessage({
      type: 'COMPILED_CODE',
      data: compile(data.files, data.entry)
    })
  } catch (err) {
    self.postMessage({
      type: 'ERROR',
      data: err
    })
  }
})
