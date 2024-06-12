import { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'
import { HyperFormula } from 'hyperformula'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import { cs } from '@/utils/property'
import { RendererProps } from '../../index.interface'
import 'handsontable/dist/handsontable.full.min.css'
import { DetailedSettings } from 'handsontable/plugins/mergeCells'

registerAllModules()

export default function XLSXRenderer(props: RendererProps) {
  const { url } = props

  const [workbook, setWorkbook] = useState<ExcelJS.Workbook>()
  const initWorkbook = async () => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)
    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(data)
    setWorkbook(workbook)
  }

  const [xlsxData, setXlsxData] = useState<any[]>([])
  const [activeSheet, setActiveSheet] = useState<number>(1)
  const [mergedCells, setMergedCells] = useState<DetailedSettings[]>([])

  const translateCellData = (cell: ExcelJS.CellValue) => {
    if (typeof cell === 'object') {
      if (!cell) return ''
      if ('richText' in cell) {
        return cell.richText.map((richText) => richText.text).join('')
      }
      if ('formula' in cell) {
        /**
         * @fix 公式计算需要加上 = 前缀，但是联表计算还是要另外处理
         */
        return `=${cell.formula}`
      }
      return cell
    } else {
      return cell
    }
  }
  const translateExcelData = (
    values: (
      | ExcelJS.CellValue[]
      | {
          [key: string]: ExcelJS.CellValue
        }
    )[]
  ) => {
    return values.map((value) => {
      if (Array.isArray(value)) {
        value.splice(0, 1)
        return value.map(translateCellData)
      }
      return value
    })
  }
  const updateMergedCells = (sheet: ExcelJS.Worksheet) => {
    /**
     * @description 这是个很糟糕的处理方式，但是目前没有更好的方法
     */
    const mergedCells = (
      sheet as unknown as { _merges: Record<string, { model: Record<string, number> }> }
    )['_merges']
    const res: DetailedSettings[] = Object.keys(mergedCells).map((key) => {
      const target = mergedCells[key]
      const { bottom, top, left, right } = target.model
      return {
        row: top - 1,
        col: left - 1,
        rowspan: bottom - top + 1,
        colspan: right - left + 1
      }
    })
    setMergedCells(res)
  }
  const initWorkSheetData = (sheetId: number) => {
    if (!workbook) return
    const curSheet = workbook.getWorksheet(sheetId)
    if (!curSheet) return
    const rows = curSheet.getRows(1, curSheet.actualRowCount) || []
    updateMergedCells(curSheet)
    const excelData = translateExcelData(rows.map((row) => row.values))
    setActiveSheet(sheetId)
    setXlsxData(excelData)
  }

  useEffect(() => {
    initWorkbook()
  }, [])

  return (
    <div className="w-full h-full overflow-auto">
      {workbook ? (
        <>
          <HotTable
            data={xlsxData}
            formulas={{
              engine: HyperFormula
            }}
            rowHeaders={true}
            colHeaders={true}
            className="htCenter htMiddle"
            height="calc(100% - 32px)"
            autoWrapRow={true}
            autoWrapCol={true}
            mergeCells={mergedCells}
            licenseKey="non-commercial-and-evaluation" // for non-commercial use only
          />
          <ul className="w-full h-8 flex items-center justify-start bg-primary overflow-auto">
            {workbook.worksheets.map((sheet) => (
              <li
                className={cs(
                  'h-full px-4 flex items-center justify-center text-xs whitespace-nowrap cursor-pointer hover:bg-module',
                  sheet.id === activeSheet ? 'bg-module-2 hover:bg-module' : ''
                )}
                key={sheet.id}
                onClick={() => initWorkSheetData(sheet.id)}
              >
                {sheet.name}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">Loading...</div>
      )}
    </div>
  )
}
