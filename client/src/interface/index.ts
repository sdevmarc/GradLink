export interface IAvatar {
    image: string
    initials: string
} 

interface IComboBox {
    value: string
    label: string
}

export interface IFCChildren {
    bg?: string
    title?: string
    link?: string
    description?: string
    children?: React.ReactNode
    lists?: IComboBox[]
    type?: (e: string | undefined) => void
    value?: string | number
    className?: string
}

export interface IEventTarget {
    value?: string
    name?: string
}