export class Produto{
  numero!:number
  descricao!:string
  codigo!:string
}

export class ProdutoCliente{
  label!: string
  value !: number
  produto!: string
  item!: number
  codigo!: string
  filial!: string
  cliente!: string
}

export class Historico{
  name!: string
  data!: string
  atual!: string
  doc!: string
  codprod!: string
  produto!:string
  quitado!:string
}
