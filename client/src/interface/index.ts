export interface IAvatar {
    image: string
    initials: string
} 

interface IComboBox {
    value: string
    label: string
}

export interface IFCChildren {
    title?: string
    link?: string
    description?: string
    children?: React.ReactNode
    lists?: IComboBox[]
}