import { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'
import { HotTable } from '@handsontable/react'
import { registerAllModules } from 'handsontable/registry'
import 'handsontable/dist/handsontable.full.min.css'
import { RendererProps } from '../../index.interface'

registerAllModules()

export default function XLSXRenderer(props: RendererProps) {
  const { url } = props

  const [xlsxData, setXlsxData] = useState<any[]>([])

  const translateCellData = (cell: ExcelJS.CellValue) => {
    if (typeof cell === 'object') {
      if (!cell) return ''
      if ('richText' in cell) {
        return cell.richText.map((richText) => richText.text).join('')
      }
      if ('formula' in cell) {
        return ''
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
    console.log(values)
    return values.map((value) => {
      if (Array.isArray(value)) {
        return value.filter((item, index) => !(!item && index === 0)).map(translateCellData)
      }
      return value
    })
  }

  const initXlsxData = async () => {
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(data)
    const curSheet = workbook.getWorksheet(2)
    if (!curSheet) return
    const rows = curSheet.getRows(1, curSheet.actualRowCount) || []
    const excelData = translateExcelData(rows.map((row) => row.values))
    setXlsxData(excelData)
  }

  useEffect(() => {
    initXlsxData()
  }, [])

  return (
    <div className="w-full h-full overflow-auto">
      <HotTable
        data={xlsxData}
        rowHeaders={true}
        colHeaders={true}
        height="auto"
        autoWrapRow={true}
        autoWrapCol={true}
        licenseKey="non-commercial-and-evaluation" // for non-commercial use only
      />
    </div>
  )
}
