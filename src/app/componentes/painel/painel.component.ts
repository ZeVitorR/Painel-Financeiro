import { Component, inject, Inject, ViewChild } from '@angular/core';
import { Clientes } from '../../classes/clientes';
import { PoButtonModule, PoChartModule, PoContainerModule, PoFieldModule, PoInfoModule, PoListViewModule, PoLoadingModule, PoMenuComponent, PoMenuItem, PoMenuModule, PoModalComponent, PoModalModule, PoPageModule, PoPageSlideComponent, PoPageSlideModule, PoSelectOption, PoTableColumn, PoTableColumnLabel, PoTableModule, PoTabsModule, PoWidgetModule } from '@po-ui/ng-components';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PainelService } from '../../servicos/painel.service';
import { environment } from '../../../environments/environment';
import { ProAppConfigService } from '@totvs/protheus-lib-core';

@Component({
  selector: 'app-painel',
  standalone: true,
  imports: [
    CommonModule,
    PoContainerModule,
    PoPageSlideModule,
    PoButtonModule,
    PoTabsModule,
    PoChartModule,
    PoWidgetModule,
    PoFieldModule,
    FormsModule,
    ReactiveFormsModule,
    PoModalModule,
    PoMenuModule,
    PoPageModule,
    PoTableModule,
    PoLoadingModule,
    PoListViewModule,
    PoInfoModule
  ],
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.css'
})
export class PainelComponent {
  avatar = 'http://lorempixel.com/300/300/cats/';

  public filial: string = ''
  public codigoCliente: string = ''
  public loja: string = ''
  public produto: string = ''
  public clientes: Array<Clientes> = []
  public produtoCliente: Array<any> = []
  public historicoCobranca: Array<any> = []
  public financeiro: Array<any> = []
  public parcelas: Array<any> = []
  public parcelasTit: Array<any> = []
  public optionProdHist: Array<PoSelectOption> = []
  public optionProdFin: Array<PoSelectOption> = []
  public optionProdCli: Array<any> = []
  public n: number = 0
  public ProdHist: any = 0
  private clienteservice = inject(PainelService)
  public fieldLabel = 'nomeFantasia';
  public historicoCobrancaFiltrado: Array<any> = []
  public selProd: Array<any> = []
  public x: number = 0
  public historicoProduto: Array<any> = []
  public logo: string = environment.ambiente === "protheus" ? 'thcm.png' : '../../../assets/thcm.png'
  #appConfig = inject(ProAppConfigService)

  @ViewChild(PoPageSlideComponent, { static: true }) pageSlide!: PoPageSlideComponent;
  @ViewChild('modalHistorico') modalHistoricoElement!: PoModalComponent

  menus: Array<PoMenuItem> = [
    { label: 'Perguntas', action: this.openPage.bind(this), icon: 'an an-magnifying-glass', shortLabel: 'Perguntas' },
    { label: 'Sair', action: this.close.bind(this), icon: 'an an-door-open', shortLabel: 'Sair' },
  ]
  isHideLoading = true;
  public readonly columns: Array<PoTableColumn> = [
    { property: 'status', type: 'label', label: 'Status', width: '5%',
      labels: <Array<PoTableColumnLabel>>[
        {
          value: 'PAGO',
          color: 'color-10',
          label: 'Pago',
          textColor: 'white',
          tooltip: 'Cliente pagou o titulo'
        },
        {
          value: 'VENCIDO',
          color: 'color-07',
          label: 'Vencido',
          textColor: 'white',
          tooltip: 'titulo do cliente vencido'
        },
        {
          value: 'VENCER',
          color: 'color-02',
          label: 'Em Aberto',
          textColor: 'white',
          tooltip: 'titulo do cliente em aberto'
        },
        {
          value: 'HOJE',
          color: 'color-08',
          label: 'Vence Hoje',
          textColor: 'white',
          tooltip: 'titulo docliente com vencimento no dia de hoje'
        }
      ]
    },
    {property: 'prefixo'       , label: 'Pfx'            , type: 'string'},
    {property: 'numero'        , label: 'Numero'         , type: 'string'},
    {property: 'parcela'       , label: 'Pcl'            , type: 'string'},
    {property: 'banco'         , label: 'Banco'          , type: 'string'},
    {property: 'vencimento'    , label: 'Vencto'         , type: 'string'},
    {property: 'indice'        , label: 'Ind'            , type: 'string'},
    {property: 'valorOriginal' , label: 'Valor Original' , type: 'string'},
    {property: 'acrescimo'     , label: 'Acréscimo'      , type: 'string'},
    {property: 'valorTitulo'   , label: 'Valor Titulo'   , type: 'string'},
    {property: 'juros'         , label: 'Juros'          , type: 'string'},
    {property: 'desconto'      , label: 'Desconto'       , type: 'string'},
    {property: 'valorLiquidado', label: 'Valor Liquidado', type: 'string'},
    {property: 'dataBaixa'     , label: 'Data Baixa'     , type: 'string'},
    {property: 'motivoBaixa'   , label: 'Motivo'         , type: 'string'},
    {property: 'securitizadora', label: 'Secur'          , type: 'string'},
    {property: 'parceiro'      , label: 'Parce'          , type: 'string'},
  ]
  ngOnInit(): void {
    this.loadData()
  }

  loadData():void {

  }

  public Consultas(pageSlide: any):void{
    console.log(`Filial: ${this.filial}\ncodigoCliente: ${this.codigoCliente}\nloja: ${this.loja}\nproduto: ${this.produto}`)
    this.consultaCliente(this.codigoCliente,this.loja)
    pageSlide.close()
  }

  public consultaCliente(codigoCliente: string, loja: string): void{
    let requisicao = this.clienteservice
    let hist: any
    let hist1: Array<any> = []
    let hist2: Array<any> = []
    let hist3: Array<any> = []
    let itens: Array<Clientes> = []
    let produtos: Array<any> = []
    let options: Array<any> = []
    let prodCli: Array<any> = []
    let valores: Array<any> = []
    let parc: Array<any> = []
    let parcCom: Array<any> = []
    let val: Array<any> = []
    let count: number
    let histProd: Array<any> = []
    let histProdGeral: Array<any> = []

    this.optionProdHist = []
    this.isHideLoading = false;
    requisicao.dadosCliente(codigoCliente,loja).subscribe({
      next(value: any) {
        console.log('valueClient',value)
        value.clientes.forEach((el: Clientes) => {
          itens.push(el)
        });
      },
      error(err: any) {
        console.log(err)
      },
      complete() {
      },
    })
    this.clientes = itens

    requisicao.produtoCliente(codigoCliente,loja).subscribe({
      next(value: any) {
        console.log('valueProd',value)
        count = 0
        value.produtos.forEach((el: any) => {
          options.push({label: el.descricao, value: count})
          prodCli.push({produto: el.descricao, item: count})
          console.log('options', options[count])
          count ++
          produtos.push({numero:count,descricao:el.descricao})
          requisicao.historicoCliente(codigoCliente,loja,el.codigo).subscribe({
            next(value: any) {
              console.log('valueHist',value)
              hist = value.historico
              hist1 = []
              hist2 = []
              hist1 = hist.split("\r\n")
              for (let i = 0; i < hist1.length; i++) {
                hist2.push({texto:hist1[i]});
              }
              hist3.push(hist2)
            },
            error(err: any) {
              console.log(err)
            },
            complete() {
            },
          })
          requisicao.dadosFinanceiro(codigoCliente,loja,el.codigo,el.filial).subscribe({
            next(value: any) {
              parc = []
              valores.push({
                produto: el.descricao,
                valorVencer: value.valorVencer,
                ValorHoje: value.ValorHoje,
                ValorVencido: value.ValorVencido,
                jurosTotal: value.jurosTotal,
                totalNominal: value.totalNominal,
                ValorTotal: value.ValorTotal,
                ValorLiquidado: value.ValorLiquidado,
                ValorDespVencer: value.ValorDespVencer,
                ValorDespHoje: value.ValorDespHoje,
                ValorDespVencida: value.ValorDespVencida,
                ValorDespLiquidado: value.ValorDespLiquidado
              })
              value.parcelas.forEach((el: any) => {
                parc.push({
                  vencimento: el.vencimento,
                  vencimentoReal: el.vencimentoReal,
                  dataEmissao: el.dataEmissao,
                  numero: el.documento,
                  valorLiquidado: el.valorLiquidado.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  securitizadora: el.securitizadora,
                  filial: el.filial,
                  prefixo: el.prefixo,
                  parcela: el.parcela,
                  tipo: el.tipo,
                  juros: el.juros.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  multa: el.multa.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  indice: el.indice,
                  valorOriginal: el.valor.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  valorTitulo: el.valorParcela.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  valorDesconto: el.valorDesconto.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  saldo: el.saldo.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  acrescimo: el.acrescimo.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  sdAcrecimo: el.sdAcrecimo.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  CODOBSD: el.CODOBSD,
                  cliente: el.cliente,
                  loja: el.loja,
                  produto: el.produto,
                  debito: el.debito,
                  tipoDocumento: el.tipoDocumento,
                  banco: el.banco,
                  FV: el.FV,
                  tipoProduto: el.tipoProduto,
                  codigoProduto: el.codigoProduto,
                  descricaoProduto: el.descricaoProduto,
                  motivoBaixa: el.motivoBaixa,
                  dataBaixa: el.dataMovimentacao,
                  valorMovimentacao: el.valorMovimentacao.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  desconto: el.desconto.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                  recPag: el.recPag,
                  parceiro: el.parceiro,
                  status: el.tipoVencimento
                })
              });
              parcCom.push(parc)
            },
            error(err: any) {
              console.log(err)

            },
            complete(){

            }
          })
          requisicao.historicoProduto(el.codigo,el.filial).subscribe({
            next(value: any) {
              histProd = []
              value.proprietarios.forEach((elemento: any) => {
                histProd.push({
                  name: elemento.codcliente + ' - ' + elemento.cliente,
                  data: elemento.emissao,
                  atual: (elemento.propatual == 'S') ? "Sim" : "Não",
                  doc: elemento.documento,
                  codprod: el.codigo,
                  produto: el.descricao
                })
              })
              histProdGeral.push(histProd)
              console.log(histProdGeral)
            },
            error(err: any) {
              console.log(err)
            },
            complete() {

            }
          })
        });
        val = valores
      },
      error(err: any) {
        console.log(err)
      },
      complete() {
      },
    })
    this.isHideLoading = true
    this.produtoCliente = produtos
    this.optionProdHist = options
    this.optionProdCli = prodCli
    this.historicoCobranca = hist3
    this.financeiro = valores
    this.parcelas = parcCom
    this.historicoProduto = histProdGeral
    this.mudaOpcao(0)
  }

  public mudaOpcao(event: any):void{
    let valor: Array<any> = []

    if( typeof event == 'number'){
      this.n = event
      valor.push(this.historicoCobranca[event])
      this.historicoCobrancaFiltrado = valor[0]
    }
  }
  public mudaProd(event: number): void{
    let valor: Array<any> = []
    let parc: Array<any> = []

    this.isHideLoading = false;
    if( typeof event == 'number'){
      this.n = event

      valor.push(this.financeiro[event])
      this.selProd = valor
      console.log('this.selProd.length',this.selProd.length )
      console.log('this.selProd.length',this.selProd )

      parc.push(this.parcelas[event])
      this.parcelasTit = parc[0]

    }
    this.isHideLoading = true;
  }
  public abrirModal():any{
    this.modalHistoricoElement.open()
  }

  public openPage() {
    this.pageSlide.open();
  }

  public close(){
    if (this.#appConfig.insideProtheus()){
      this.#appConfig.callAppClose(false);
    }else{
      alert('sair')
    }

  }
}
