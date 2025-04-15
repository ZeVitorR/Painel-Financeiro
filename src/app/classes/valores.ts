export class Valores{
  produto: string
  valorVencer: number
  ValorHoje: number
  ValorVencido: number
  jurosTotal: number
  totalNominal: number
  ValorTotal: number
  ValorLiquidado: number
  ValorDespVencer: number
  ValorDespHoje: number
  ValorDespVencida: number
  ValorDespLiquidado: number

  constructor(){
    this.produto = ''
    this.valorVencer = 0
    this.ValorHoje = 0
    this.ValorVencido = 0
    this.jurosTotal = 0
    this.totalNominal = 0
    this.ValorTotal = 0
    this.ValorLiquidado = 0
    this.ValorDespVencer = 0
    this.ValorDespHoje = 0
    this.ValorDespVencida = 0
    this.ValorDespLiquidado = 0
  }
}