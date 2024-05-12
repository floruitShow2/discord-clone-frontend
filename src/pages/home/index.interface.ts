import React from "react"

export interface Operation {
    label: string
    key: string
    icon: React.ReactNode
    handler: () => void
}