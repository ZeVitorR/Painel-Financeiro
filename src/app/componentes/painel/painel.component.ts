import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { Clientes } from '../../classes/clientes';
import { PoButtonModule, PoChartModule, PoContainerModule, PoFieldModule, PoInfoModule, PoListViewModule, PoLoadingModule, PoLookupComponent, PoMenuComponent, PoMenuItem, PoMenuModule, PoModalComponent, PoModalModule, PoNotificationService, PoPageModule, PoPageSlideComponent, PoPageSlideModule, PoSelectOption, PoTableAction, PoTableColumn, PoTableColumnLabel, PoTableComponent, PoTableModule, PoTabsModule, PoToasterModule, PoWidgetModule } from '@po-ui/ng-components';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PainelService } from '../../servicos/painel.service';
import { environment } from '../../../environments/environment';
import { ProAppConfigService, ProJsToAdvplService } from '@totvs/protheus-lib-core';
import { interval, lastValueFrom, Subscription } from 'rxjs';
import { Acesso } from '../../classes/acesso';
import { Historico, Produto, ProdutoCliente } from '../../classes/produto';
import { Parcela, Valores } from '../../classes/valores';
import { FluigService } from '../../servicos/fluig.service';

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
    PoInfoModule,
    PoToasterModule
  ],
  templateUrl: './painel.component.html',
  styleUrl: './painel.component.css'
})
export class PainelComponent {
  avatar = 'http://lorempixel.com/300/300/cats/';
  public escondeToaster:boolean = true
  public messagem:string = ''
  public filial: string = ''
  public codigoCliente: string = ''
  public loja: string = ''
  public produto: string = ''
  public clientes: Array<Clientes> = []
  public produtoCliente: Array<ProdutoCliente> = []
  public historicoCobranca: Array<any> = []
  public financeiro: Array<any> = []
  public parcelas: Array<Array<Parcela>> = []
  public parcelasTit: Array<Parcela> = []
  public optionProdHist: Array<PoSelectOption> = []
  public optionProdFin: Array<PoSelectOption> = []
  public optionProdCli: Array<ProdutoCliente> = []
  public n!: number
  public ProdHist: any = 0
  private clienteservice = inject(PainelService)
  private clienteserviceFluig = inject(FluigService)
  public fieldLabel = 'nomeFantasia';
  public historicoCobrancaFiltrado: Array<any> = []
  public historicoVidaLoteFiltrado: Array<any> = []
  public selProd: Array<any> = []
  public selecao: number = 0
  public x: number = 0
  public valorTotalAVP: number = 0
  public historicoProduto: Array<any> = []
  public historicoVidaLote: Array<any> = []
  public clienteBC: string = ''
  public tamanhoTabela: number = (screen.height <= 900) ? 300 : 450
  public dataAtual = new Date()
  public DataBase:any = this.dataAtual
  public formMulta:string = '0,00'
  public formJuros:string = '2,00'
  public formDesconto:string = '0,80'
  public formValorOferta:string = ''
  public selectedRows:any
  public qtdParcelas:number = 0
  public valorFilial:string = ""
  public erroRotina:boolean = false
  public logo: string = environment.ambiente === "protheus" ? 'fortech.png' : '../../../assets/fortech.png'
  select = ''
  #appConfig = inject(ProAppConfigService)
  private codproduto : string = ''
  private descproduto : string = ''
  private codfilial : string = ''
  private codclienteat : string = ''
  private notify = inject(PoNotificationService)

  constructor(private proJsToAdvplService: ProJsToAdvplService) {}

  columnsCliente = [
    { property: 'codigo', label: 'codigo' },
    { property: 'loja', label: 'loja' },
    { property: 'nome', label: 'nome' },
    { property: 'cpf', label: 'cpf' }
  ];

  serviceApi = environment.url + '/financeiro/api/dashboard/buscaCliente'
  serviceApiFil = environment.url + '/financeiro/api/dashboard/retornaFilial'
  serviceApiProd = environment.url + '/financeiro/api/dashboard/retornaProdutoConsul'
  filtro = {filial: this.filial}
  @ViewChild('pageSlide') pageSlide!: PoPageSlideComponent;
  @ViewChild('modalHistorico') modalHistoricoElement!: PoModalComponent
  @ViewChild('modalVidaLote') modalVidaLoteElement!: PoModalComponent
  @ViewChild('tablePOUI') tablePOUIElement!: PoTableComponent
  @ViewChild('meuLookup') lookupEl!: PoLookupComponent
  menus: Array<PoMenuItem> = [
    { label: 'Boleto Seven', action: this.geraBoleto.bind(this), icon: 'an an-magnifying-glass', shortLabel: 'boleto' },
    { label: 'Enviar Boleto por email', action: this.enviaEmail.bind(this), icon: 'an an-magnifying-glass', shortLabel: 'Email' },
    { label: 'Envia boleto por Whatsapp', action: this.enviaWhats.bind(this), icon: 'an an-whatsapp-logo', shortLabel: 'Whatsapp' },
    { label: 'Posição AVP', action: this.posiVP.bind(this), icon: 'an an-magnifying-glass', shortLabel: 'AVP' },
    { label: 'Posição Cliente', action: this.posiCli.bind(this), icon: 'an an-magnifying-glass', shortLabel: 'Cliente' },
    { label: 'Cobrança', action: this.cobranca.bind(this), icon: 'an an-magnifying-glass', shortLabel: 'Cobranca' },
    { label: 'Administrador', link: '/admin', icon: 'an an-magnifying-glass', shortLabel: 'Admin' },
    { label: 'Sair', action: this.close.bind(this), icon: 'an an-door-open', shortLabel: 'Sair' },
  ]

  isHideLoading = true;
  public readonly columns: Array<PoTableColumn> = [
    { property: 'status', type: 'label', label: 'Status', visible:true, width: '5%',
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
    {property: 'acoes'         , label: 'Ações'     , type: 'link'  , action: this.geraBoletoCliente.bind(this), visible: true},
    {property: 'prefixo'       , label: 'Pfx'       , type: 'string', visible:false},
    {property: 'numero'        , label: 'Numero'    , type: 'string', visible:false},
    {property: 'parcela'       , label: 'Pcl'       , type: 'string', visible:true},
    {property: 'banco'         , label: 'Banco'     , type: 'string', visible:true},
    {property: 'vencimento'    , label: 'Vencto'    , type: 'string', visible:true},
    {property: 'indice'        , label: 'Ind'       , type: 'string', visible:false},
    {property: 'valorOriginal' , label: 'Val Ori'   , type: 'number', visible:true},
    {property: 'acrescimo'     , label: 'Acresc'    , type: 'number', visible:true},
    {property: 'valorTitulo'   , label: 'Val Tit'   , type: 'number', visible:true},
    {property: 'valorAVP'      , label: 'Val AVP'   , type: 'number', visible:true},
    {property: 'juros'         , label: 'Juros'     , type: 'number', visible:false},
    {property: 'desconto'      , label: 'Desconto'  , type: 'number', visible:false},
    {property: 'valorLiquidado', label: 'Val Liq'   , type: 'number', visible:true},
    {property: 'dataBaixa'     , label: 'Dta Bx'    , type: 'string', visible:true},
    {property: 'motivoBaixa'   , label: 'Motivo'    , type: 'string', visible:true},
    {property: 'securitizadora', label: 'Secur'     , type: 'string', visible:true},
    {property: 'parceiro'      , label: 'Parce'     , type: 'string', visible:true},
  ]

  private resetDados(){
    this.selProd = []
    this.clientes = []
    this.financeiro = []
    this.produtoCliente = []
    this.historicoCobrancaFiltrado = []
    this.historicoVidaLoteFiltrado = []
    this.parcelasTit = []
  }

  exibe(item:any):boolean{
    let bordero = ''+item.bordero
    let banco = ''+item.banco
    let status = ''+item.status
    console.log('bordero',bordero,'banco',banco,'status',status)
    return false
  }
  ngOnInit(): void {
    this.loadData()
  }


  loadData():void {

  }

  public abrirSlide(){
    this.pageSlide.open()
  }

  public fecharSlide(){
    this.pageSlide.close()
  }

  public erroConsulta(event:any){
    this.notify.error(event.error.erro)
  }

  chamarMeuPainel(){

  }
  public Consultas(pageSlide: any){
    var req = this.clienteservice
    var reqFluig = this.clienteserviceFluig

    reqFluig.processes().subscribe({
      next: (value:any) => {
        console.log('Fluig',value)
      }
    });
    this.resetDados()
    if(this.codigoCliente != '' || this.produto != ''){
      if(this.produto != '' && this.codigoCliente == ''){
        if(this.filial == ''){
          this.notify.error('para consultar o cliente pelo produto preencha a filial')
          return
        }else{
          req.retornaCliente(this.filial,this.produto).subscribe({
            next: (value:any) => {
              var cliente = value.codigo
              var loja = value.loja
              this.consultaCliente(cliente,loja)

            }
          })
        }
      }else if(this.codigoCliente != '' && this.loja == ''){
        req.buscaCliente(this.codigoCliente,'1','1').subscribe({
          next: (value:any) => {
            var loja = value.items[0].loja
            this.consultaCliente(this.codigoCliente,loja)
            return
          }
        })
      }else{
        this.consultaCliente(this.codigoCliente,this.loja)
      }
      console.log('this.loja',this.loja)

      if(!this.erroRotina){
        this.fecharSlide()
      }
    }else{
      this.notify.error('Para consultar preencha o codigo do cliente ou o código do produto')
    }

  }

  public mascaraMoeda(valor:any,event:any,tipo:string){
    var numeroCompleto = (''+valor).replace(/\./g, '').replace(',', '')
    var novoNum = ''
    var formatado = ''
    var valorAt = 0
    if(numeroCompleto.length == 1){
      novoNum = '0,0'+numeroCompleto
    }else if(numeroCompleto.length == 2){
      novoNum = '0,'+numeroCompleto
    }else{
      formatado = ''+numeroCompleto.slice(0, -2) + "." + numeroCompleto.slice(-2);
      valorAt = parseFloat(formatado)
      novoNum = (typeof valorAt == 'number')? valorAt.toLocaleString('pt-br', { minimumFractionDigits: 2 }) : '0,00'
    }
    novoNum = (novoNum == 'NaN')? '0,00':novoNum
    switch (tipo) {
      case 'oferta':
        this.formValorOferta = novoNum
        break;
      case 'multa':
        this.formMulta = novoNum
        break;
      case 'juros':
        this.formJuros = novoNum
        break;
      case 'desconto':
        this.formDesconto = novoNum
        break;
      default:
        break;
    }
  }

  public consultaCliente(codigoCliente: string, loja: string): void{
    this.limparEstadoInicial()

    if (codigoCliente === '000000') {
      this.carregarClienteCoringa();
    } else {
      this.carregarDadosCliente(codigoCliente, loja);
    }

    this.finalizarCarregamento();
  }

  //metodo para realizar o carregamento de um usuário Corringa
  private carregarClienteCoringa(){
    const clienteCoringa = '000000'
    const produtos:Array<ProdutoCliente> = []
    let cliente:Array<Clientes> = []
    let parcelas:Array<any> = []
    let valores:Array<Valores> = []
    let histCobranca:Array<any> = []
    let histPedido:Array<any> = []
    let histProdGeral:Array<any> = []


    cliente.push({
      codigo: clienteCoringa,
      nome:'Cliente X',
      loja:'01',
      telefone: '99 9999-9999',
      telcomer: '88 8888-8888',
      celular: '77 77777-7777',
      email: 'cliente.teste@teste.com'
    })

    produtos.push({label: "1 - A - TESTE", produto: "1 - A - TESTE", value: 0, item: 0, codigo: "000000001", filial: "000000", cliente: clienteCoringa})
    produtos.push({label: "2 - A - TESTE", produto: "2 - A - TESTE", value: 1, item: 1, codigo: "000000002", filial: "000000", cliente: clienteCoringa})

    produtos.forEach(item => {
      parcelas.push(geraParcela(item))
      console.log(parcelas[item.value])
      valores.push({
        produto: ''+item.produto,
        valorVencer: parcelas[item.value].reduce((soma:number, parc:Parcela) => soma + parseFloat(parc.valorTitulo.replace(/\./g, '').replace(',', '.')), 0),
        ValorHoje: 0,
        ValorVencido: 0,
        jurosTotal: parcelas[item.value].reduce((soma:number, parc:Parcela) => soma + parseFloat(parc.juros.replace(/\./g, '').replace(',', '.')), 0),
        totalNominal: parcelas[item.value].reduce((soma:number, parc:Parcela) => soma + parseFloat(parc.valorTitulo.replace(/\./g, '').replace(',', '.')), 0),
        ValorTotal: parcelas[item.value].reduce((soma:number, parc:Parcela) => soma + parseFloat(parc.valorTitulo.replace(/\./g, '').replace(',', '.')), 0)+parcelas[item.value].reduce((soma:number, parc:Parcela) => soma + parseFloat(parc.valorTitulo), 0),
        ValorLiquidado: 0,
        ValorDespVencer: 0,
        ValorDespHoje: 0,
        ValorDespVencida: 0,
        ValorDespLiquidado: 0,
        prefixo: 'PX',
        num: `10000${item.value}`,
        idc: '1 - IPCA',
        qtd: 10,
        filial: '000000 - TESTE',
        propAtual: 'Sim',
        quitado: 'Não'
      })
      var hist1:Array<any> = []
      hist1.push({texto:"User X - XX/XX/XXXX - 12:34:41"})
      hist1.push({texto:"CONFORME CONTATO TELEFONICO, SR. Cliente X INFORMA QUE JÁ POSSUI OS BOLETOS"})
      hist1.push({texto:"-------------------"})
      hist1.push({texto:"User Y - XX/XX/XXXX - 15:58:13"})
      hist1.push({texto:"CONFORME CONTATO, PARCELA 09/2021 SERÁ LIQUIDADA NESTA DATA. BOLETO ENVIADO POR WHATS."})
      hist1.push({texto:"-------------------"})
      hist1.push({texto:"User Z - XX/XX/XXXX - 11:50:17"})
      hist1.push({texto:"CONFORME SOLICITADO POR WHATS, ENVIADO BOLETO DE DEZ 21"})
      hist1.push({texto:"-------------------"})
      histCobranca.push(hist1)
      var histvdlt:Array<any> = []
      var histProd:Array<any> = []
      if(item.value == 0){
        histvdlt.push({Obs: "User C - XX/XX/XXXX - 10:41:49"})
        histvdlt.push({Obs: "--------------------------------------------------"})
        histvdlt.push({Obs: "Via Física da Proposta Recebida com Assinatura do Cliente em: XX/XX/XX"})
        histvdlt.push({Obs: "Imobiliária: Imobiliária Meireles"})
        histvdlt.push({Obs: "Corretor: Y"})
        histvdlt.push({Obs: "Cliente(s): Cliente X"})
        histvdlt.push({Obs: "Serasa/SPC - OK"})
        histvdlt.push({Obs: "Documentação Completa e OK"})
        histvdlt.push({Obs: "Encaminhado para demais providencias"})

        histProd.push({
        name: "000000" + ' - ' + "Cliente X",
        data: "XX/XX/XXXX",
        atual: "Não",
        doc: "000002",
        codprod: "000000001",
        produto: "1 - A - TESTE"
      })
      }else{
        histvdlt.push({Obs: "User C - XX/XX/XXXX - 10:41:49"})
        histvdlt.push({Obs: "--------------------------------------------------"})
        histvdlt.push({Obs: "Via Física da Proposta Recebida com Assinatura do Cliente em: XX/XX/XX"})
        histvdlt.push({Obs: "Imobiliária: Imobiliária Meireles"})
        histvdlt.push({Obs: "Corretor: R"})
        histvdlt.push({Obs: "Cliente(s): Cliente Y"})
        histvdlt.push({Obs: "Serasa/SPC - OK"})
        histvdlt.push({Obs: "Documentação Completa e OK"})
        histvdlt.push({Obs: "--------------------------------------------------"})
        histvdlt.push({Obs: "User V - XX/XX/XXXX - 10:50:33"})
        histvdlt.push({Obs: "Tranferencia de lote para o cliente X"})
        histvdlt.push({Obs: "--------------------------------------------------"})
        histvdlt.push({Obs: "Via Física da Proposta Recebida com Assinatura do Cliente em: XX/XX/XX"})
        histvdlt.push({Obs: "Imobiliária: Imobiliária Meireles"})
        histvdlt.push({Obs: "Corretor: R"})
        histvdlt.push({Obs: "Cliente(s): Cliente X"})
        histvdlt.push({Obs: "Serasa/SPC - OK"})
        histvdlt.push({Obs: "Documentação Completa e OK"})
        histvdlt.push({Obs: "Encaminhado para demais providencias"})

        histProd.push({
          name: "000001" + ' - ' + "Cliente Y",
          data: "XX/XX/XXXX",
          atual: "Não",
          doc: "000002",
          codprod: "000000001",
          produto: "2 - A - TESTE"
        })
        histProd.push({
          name: "000000" + ' - ' + "Cliente X",
          data: "XX/XX/XXXX",
          atual: "Não",
          doc: "000002",
          codprod: "000000001",
          produto: "2 - A - TESTE"
        })
      }
      histPedido.push(histvdlt)
      histProdGeral.push(histProd)
    })

    this.clientes = cliente,
    this.produtoCliente = produtos
    this.parcelas = parcelas
    this.financeiro = valores
    this.historicoCobranca = histCobranca
    this.historicoProduto = histProdGeral
    this.historicoVidaLote = histPedido

    function geraParcela(item:ProdutoCliente){
      let data = new Date();
      const parc:Array<Parcela> = []
      for (let i = 0; i < 10; i++) {
        let valorOriginal = 1000 + (i + item.value) * 50;
        let juros = 5 + i;
        let multa = 1 + i * 0.5;
        let jurosfuturo = (i == 0)? 0 : 5 + (i);
        let multafuturo = (i == 0)? 0 : 1 + (i) * 0.5;
        let sdacrescimo = jurosfuturo + multafuturo;
        let acrescimo = juros + multa;
        let valorTitulo = valorOriginal + acrescimo;
        parc.push({
          id: i,
          acoes: '',
          vencimento: formataData(adicionarMeses(data,i)),
          vencimentoReal: formataData(adicionarMeses(data,i)),
          dataEmissao: formataData(data),
          numero: `10000${item.value}`,
          valorLiquidado: '0,00',
          securitizadora: '',
          filial: '01',
          prefixo: 'PX',
          parcela: `00${i+1}`,
          tipo: 'Duplicata',
          juros: juros.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
          multa: multa.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
          indice: 'IGPM',
          valorOriginal: valorOriginal.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
          valorTitulo: valorTitulo.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
          valorAVP: '0,00',
          valorDesconto: '0,00',
          saldo: valorTitulo.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
          acrescimo: acrescimo.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
          sdAcrecimo: sdacrescimo.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
          CODOBSD: '',
          cliente: '000000',
          loja: '01',
          produto: '000000002',
          debito: valorTitulo.toLocaleString('pt-br', { minimumFractionDigits: 2 }),
          tipoDocumento: 'Boleto',
          banco: '237',
          FV: '01',
          tipoProduto: 'Serviço',
          codigoProduto: '000000001',
          descricaoProduto: 'Produto Financeiro A',
          motivoBaixa: '',
          dataBaixa: '',
          valorMovimentacao: '0,00',
          desconto: '0,00',
          recPag: 'Receber',
          parceiro: 'Cliente X',
          status: 'VENCER',
          bordero: '',
          recno: i
        });
      }
      return parc
    }

    function formataData(dataAtual:Date){
      const dia = String(dataAtual.getDate()).padStart(2, '0');
      const mes = String(dataAtual.getMonth() + 1).padStart(2, '0'); // meses começam em 0
      const ano = dataAtual.getFullYear();
      return `${dia}/${mes}/${ano}`;
    }

    function adicionarMeses(data:Date, meses:number) {
      let novaData = new Date(data);
      novaData.setMonth(novaData.getMonth() + meses);
      return novaData;
    }
  }

  private carregarDadosCliente(codigoCliente: string, loja: string){
    const requisicao = this.clienteservice

    var erro
    var client:Array<Clientes> = []
    var prodCli:Array<ProdutoCliente> = []
    var count:number
    var hist:Array<any> = [],hist2:Array<any> = [],hist3:Array<any> = [], histvidalote:Array<any> = []
    var histProd:Array<Historico> = [], histProdGeral:Array<any>= []
    var indiceAtual:string = '', geraBoletoTabela:string
    var parc:Array<Parcela> = []
    var valores:Array<Valores> = [], parcCom:Array<any> = []
    var indices:Array<string> = ['1 - IPCA','2 - IGPM','3 - INCC','4', '5 - IPC-DI','6 - Fixa']
    var complemento = ''
    var propAtual = ''
    var quitado = ''
    var codigoCli = codigoCliente

    try {
      requisicao.dadosCliente(codigoCliente, loja).subscribe({
        next(value:any) {
          value.clientes.forEach((el: Clientes) => {
            client.push(el)
          });
        },
        error(err) {
          console.log(err)
        },
      })
      this.clientes = client;
      complemento += (this.filial == '')? '': '&cFil='+this.filial
      complemento += (this.produto.trim() == '')? '': '&cProduto='+this.produto
      requisicao.produtoCliente(codigoCliente,loja,complemento).subscribe({
        next(value:any) {
          count = 0
          value.produtos.forEach((el: any) => {
            prodCli.push({
              label: el.descricao,
              produto: el.descricao,
              value: count,
              item: count,
              codigo: el.codigo,
              filial: el.filial,
              cliente: codigoCliente
            })
            count ++
            requisicao.historicoCliente(codigoCliente,loja,el.codigo).subscribe({
              next(value: any) {
                hist = value.historico.split("\r\n")
                hist2 = []
                for (let i = 0; i < hist.length; i++) {
                  hist2.push({texto:hist[i]});
                }
                hist3.push(hist2)
              },error(err: any) {
                console.log(err)
              }
            })
            requisicao.historicoVidaLote(el.codigo,el.filial).subscribe({
              next(value: any) {
                value.dados.forEach((elemento: any) => {
                  hist = elemento.Observacao.split("\r\n")
                  hist2 = []
                  for (let i = 0; i < hist.length; i++) {
                    hist2.push({
                      Obs: hist[i]
                    })
                  }
                })
                histvidalote.push(hist2)
              },
              error(err: any) {
                console.log(err)
              }
            })
            requisicao.historicoProduto(el.codigo,el.filial).subscribe({
              next(value: any) {
                histProd = []
                value.proprietarios.forEach((elemento: any) => {
                  if( codigoCli == elemento.codcliente){
                    propAtual = (elemento.propatual == 'S')?'Sim':'Não'
                    quitado = (elemento.quitado == 'S')?'Sim':'Não'
                  }
                  histProd.push({
                    name: elemento.codcliente + ' - ' + elemento.cliente,
                    data: elemento.emissao,
                    atual: (elemento.propatual == 'S') ? "Sim" : "Não",
                    doc: elemento.documento,
                    codprod: el.codigo,
                    produto: el.descricao,
                    quitado: (elemento.quitado == 'S')?'Sim':'Não'
                  })
                })
                histProdGeral.push(histProd)
              },
              error(err: any) {
                console.log(err)
              }
            })
            requisicao.dadosFinanceiro(codigoCliente,loja,el.codigo,el.filial).subscribe({
              next(value: any) {
                parc = []

                for (let indexAtual = 0; indexAtual < value.parcelas.length; indexAtual++) {
                  indiceAtual = (indiceAtual.trim() == '' ) ? ''+value.parcelas[indexAtual].indice : indiceAtual

                  geraBoletoTabela = ((''+value.parcelas[indexAtual].bordero).trim() !== '' && (''+value.parcelas[indexAtual].banco).trim() !== '' && (''+value.parcelas[indexAtual].tipoVencimento).trim() !== 'PAGO') ? 'Boleto P'+value.parcelas[indexAtual].parcela : ''
                  parc.push({
                    id: indexAtual,
                    acoes: geraBoletoTabela,
                    vencimento: value.parcelas[indexAtual].vencimento,
                    vencimentoReal: value.parcelas[indexAtual].vencimentoReal,
                    dataEmissao: value.parcelas[indexAtual].dataEmissao,
                    numero: value.parcelas[indexAtual].documento,
                    valorLiquidado: value.parcelas[indexAtual].valorLiquidado.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    securitizadora: value.parcelas[indexAtual].securitizadora,
                    filial: value.parcelas[indexAtual].filial,
                    prefixo: value.parcelas[indexAtual].prefixo,
                    parcela: value.parcelas[indexAtual].parcela,
                    tipo: value.parcelas[indexAtual].tipo,
                    juros: value.parcelas[indexAtual].jurosvalorAVP,
                    multa: value.parcelas[indexAtual].multa.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    indice: value.parcelas[indexAtual].indice,
                    valorOriginal: value.parcelas[indexAtual].valor.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    valorTitulo: value.parcelas[indexAtual].valorParcela.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    valorAVP: '0,00',
                    valorDesconto: value.parcelas[indexAtual].valorDesconto.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    saldo: value.parcelas[indexAtual].saldo.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    acrescimo: value.parcelas[indexAtual].acrescimo.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    sdAcrecimo: value.parcelas[indexAtual].sdAcrecimo.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    CODOBSD: value.parcelas[indexAtual].CODOBSD,
                    cliente: value.parcelas[indexAtual].cliente,
                    loja: value.parcelas[indexAtual].loja,
                    produto: value.parcelas[indexAtual].produto,
                    debito: value.parcelas[indexAtual].debito,
                    tipoDocumento: value.parcelas[indexAtual].tipoDocumento,
                    banco: value.parcelas[indexAtual].banco,
                    FV: value.parcelas[indexAtual].FV,
                    tipoProduto: value.parcelas[indexAtual].tipoProduto,
                    codigoProduto: value.parcelas[indexAtual].codigoProduto,
                    descricaoProduto: value.parcelas[indexAtual].descricaoProduto,
                    motivoBaixa: value.parcelas[indexAtual].motivoBaixa,
                    dataBaixa: value.parcelas[indexAtual].dataMovimentacao,
                    valorMovimentacao: value.parcelas[indexAtual].valorMovimentacao.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    desconto: value.parcelas[indexAtual].desconto.toLocaleString('pt-br', {minimumFractionDigits: 2}),
                    recPag: value.parcelas[indexAtual].recPag,
                    parceiro: value.parcelas[indexAtual].parceiro,
                    status: value.parcelas[indexAtual].tipoVencimento,
                    bordero: value.parcelas[indexAtual].bordero,
                    recno: value.parcelas[indexAtual].recno
                  })
                }
                indiceAtual = (parseInt(indiceAtual) > indices.length - 1) ? indiceAtual : indices[parseInt(indiceAtual)]
                valores.push({
                  produto: el.descricao,
                  filial: value.parcelas[0].filial,
                  prefixo: value.parcelas[0].prefixo,
                  num: value.parcelas[0].documento,
                  idc: indiceAtual,
                  qtd: value.parcelas.length,
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
                  ValorDespLiquidado: value.ValorDespLiquidado,
                  propAtual: propAtual,
                  quitado: quitado
                })
                parcCom.push(parc)
              },
              error(err: any) {
                console.log(err)

              }
            })
          })
        },
        error: err => {
          this.erroRotina = true;
          this.notify.error(err.error.erro)
        },
      })

      console.log(prodCli)
      this.clientes = client,
      this.produtoCliente = prodCli
      this.parcelas = parcCom
      this.financeiro = valores
      this.historicoCobranca = hist3
      this.historicoVidaLote = histvidalote
      this.historicoProduto = histProdGeral

    } catch (err:any) {
      console.error('Erro ao carregar dados cliente:', err);

      this.erroRotina = true;
    }
  }


  private limparEstadoInicial() {
    this.isHideLoading = false;
    this.optionProdHist = [];
    this.selProd = [];
    this.parcelasTit = [];
  }

  private finalizarCarregamento(): void {
    this.valorTotalAVP = 0;
    this.formValorOferta = '0,00';
    this.qtdParcelas = 0;
    this.isHideLoading = true;
  }

  public mudaOpcao(event: any):void{
    let valor: Array<any> = []
    let valorLote: Array<any> = []

    if( typeof event == 'number'){
      this.n = event

      this.codfilial     = this.produtoCliente[event].filial
      this.codclienteat  = this.produtoCliente[event].cliente
      this.codproduto    = this.produtoCliente[event].codigo
      this.descproduto   = this.produtoCliente[event].produto

      valor.push(this.historicoCobranca[event])
      this.historicoCobrancaFiltrado = valor[0]
      valorLote.push(this.historicoVidaLote[event])
      this.historicoVidaLoteFiltrado = valorLote[0]
    }

  }

  public mudaProd(event: number): void{
    this.selProd = []
    this.parcelasTit = []

    this.isHideLoading = false;
    if( typeof event == 'number'){
      this.n = event
      this.selecao = 1
      this.selProd.push(this.financeiro[event])
      this.parcelasTit = this.parcelas[event]
    }
    this.isHideLoading = true;
  }

  public abrirModal():any{
    this.modalHistoricoElement.open()
  }
  public abrirModal2():any{
    this.modalVidaLoteElement.open()
  }

  public close(){
    if (this.#appConfig.insideProtheus()){
      this.#appConfig.callAppClose(false);
    }
  }

  public calcParcelaAVP(event:any){
    const desconto = parseFloat(this.formDesconto.replace(/\./g, '').replace(',', '.'))
    const multa = parseFloat(this.formMulta.replace(/\./g, '').replace(',', '.'))
    const juros = parseFloat(this.formJuros.replace(/\./g, '').replace(',', '.'))
    let partesData = this.DataBase.split("-");
    let diaAtual = parseInt(partesData[2], 10);
    let mesAtual = parseInt(partesData[1], 10) - 1;
    let anoAtual = parseInt(partesData[0], 10);
    const dataBase = new Date(anoAtual, mesAtual, diaAtual);
    const valorSaldo = parseFloat(event.saldo.replace(/\./g, '').replace(',', '.'));
    const valorAcrescimo = parseFloat(event.sdAcrecimo.replace(/\./g, '').replace(',', '.'));
    const valorNumerico = valorSaldo + valorAcrescimo

    let dataString = event.vencimento;
    let partes = dataString.split("/");
    let dia = parseInt(partes[0], 10);
    let mes = parseInt(partes[1], 10) - 1;
    let ano = parseInt(partes[2], 10);
    let dataVencto = new Date(ano, mes, dia);
    let dia1 = dataBase.getDate();
    let mes1 = dataBase.getMonth();
    let ano1 = dataBase.getFullYear();
    const dataAtual = new Date(ano1, mes1, dia1)
    const diffMs = dataVencto.getTime() - dataAtual.getTime();

    // Converter para dias
    const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    let valorAVP:number
    let valorAVPAntigo:number = parseFloat(event.valorAVP.replace(/\./g, '').replace(',', '.'));
    let resultado:number

    if(diffDias >= 0){
      resultado = parseFloat((Math.exp((Math.log(1 + (desconto/100))) * ((diffDias*-1)/30))).toFixed(8));
      const valor = valorNumerico * resultado
      valorAVP = parseFloat(parseFloat(valor.toFixed(8)).toFixed(2))
    }else{
      resultado = parseFloat((Math.exp((Math.log(1 + (juros/100))) * ((diffDias*-1)/30))).toFixed(8));
      const valorAtualizado = parseFloat((valorNumerico * (multa/100)).toFixed(2));
      const valor = (valorNumerico * resultado) + valorAtualizado
      valorAVP = parseFloat(parseFloat(valor.toFixed(8)).toFixed(2))
    }
    if( valorAVPAntigo != valorAVP){
      event.valorAVP = valorAVP.toLocaleString('pt-br', { minimumFractionDigits: 2 })
      this.valorTotalAVP += valorAVP
      this.qtdParcelas++
    }
  }

  public calcTodasParcelaAVP(event:any){
    for (let index = 0; index < event.length; index++) {
      var prefixoAtual= ''+event[index].prefixo
      if (!prefixoAtual.includes('Z')){
        this.calcParcelaAVP(event[index]);
      }else{
        this.tablePOUIElement.unselectRowItem(event[index])
      }
    }
  }

  public removeParcelaAvp(event:any){
    const valorAVP = parseFloat(event.valorAVP.replace(/\./g, '').replace(',', '.'));
    if( valorAVP > 0){
      this.valorTotalAVP -= valorAVP
      var val = 0
      event.valorAVP = val.toLocaleString('pt-br', { minimumFractionDigits: 2 })
      this.qtdParcelas--
    }
  }

  public removeTodasParcelaAvp(event:any){
    for (let index = 0; index < event.length; index++) {
      this.removeParcelaAvp(event[index]);
    }
    this.valorTotalAVP = 0
  }

  public atualizaAVP(){
    this.valorTotalAVP = 0
    for (let index = 0; index < this.parcelasTit.length; index++) {
      if (parseFloat(this.parcelasTit[index].valorAVP) > 0){
        this.calcParcelaAVP(this.parcelasTit[index])
      }
    }
  }

  public calculaOferta(){
    let valorOferta = parseFloat(this.formValorOferta.replace(/\./g, '').replace(',', '.'))
    let valorOfertaOriginal = parseFloat(this.formValorOferta.replace(/\./g, '').replace(',', '.'))
    let contador = 0
    let dateAtual = new Date()
    const ano = dateAtual.getFullYear();
    const mes = String(dateAtual.getMonth() + 1).padStart(2, '0'); // Janeiro = 0
    const dia = String(dateAtual.getDate()).padStart(2, '0');
    let dataString = `${ano}${mes}${dia}`
    let titulosVencido: any = this.parcelasTit.filter(parcelasTit => parcelasTit.status == 'VENCIDO')
    let titulosAberto: any = this.parcelasTit.filter(parcelasTit => parcelasTit.status == 'VENCER' || parcelasTit.status == 'HOJE').sort((a, b) =>{
      const isAEspecial = a.parcela.startsWith('E');
      const isBEspecial = b.parcela.startsWith('E');

      if (isAEspecial && !isBEspecial) return -1; // "E" vem antes
      if (!isAEspecial && isBEspecial) return 1;  // número comum vem depois

      // Ambos do mesmo tipo: ordenar pelo valor numérico da string (ignorando o 'E' se tiver)
      const aNumero = parseInt(a.parcela.replace('E', ''), 10);
      const bNumero = parseInt(b.parcela.replace('E', ''), 10);

      return aNumero - bNumero;
    })

    let qtd = titulosAberto.length

    this.parcelasTit.forEach((el:any)=>{
      this.removeParcelaAvp(el)
      this.tablePOUIElement.unselectRowItem(el)
    })

    if (titulosVencido.length > 0){
      contador = 0
      this.calcParcelaAVP(titulosVencido[contador])
      while (contador < titulosVencido.length && valorOferta >= parseFloat(titulosVencido[contador].valorAVP.replace(/\./g, '').replace(',', '.'))){
        var prefixoAtual= ''+titulosVencido[contador].prefixo
        if (!prefixoAtual.includes('Z')){
          valorOferta = valorOferta - parseFloat(titulosVencido[contador].valorAVP.replace(/\./g, '').replace(',', '.'))
          this.tablePOUIElement.selectRowItem(titulosVencido[contador])
        }else{
          this.removeParcelaAvp(titulosVencido[contador])
        }
        contador ++
        if (contador < titulosVencido.length){
          this.calcParcelaAVP(titulosVencido[contador])
        }
      }
      if (valorOfertaOriginal < this.valorTotalAVP){
        this.removeParcelaAvp(titulosVencido[contador])
      }
    }

    if(valorOfertaOriginal > this.valorTotalAVP){

      contador = qtd-1
      this.calcParcelaAVP(titulosAberto[contador])
      while (contador >= 0 && valorOferta >= parseFloat(titulosAberto[contador].valorAVP.replace(/\./g, '').replace(',', '.'))){
        var prefixoAtual= ''+titulosAberto[contador].prefixo
        if (!prefixoAtual.includes('Z')){
          valorOferta = valorOferta - parseFloat(titulosAberto[contador].valorAVP.replace(/\./g, '').replace(',', '.'))
          this.tablePOUIElement.selectRowItem(titulosAberto[contador])
        }else{
          this.removeParcelaAvp(titulosAberto[contador])
        }
        contador --
        if (contador >= 0){
          this.calcParcelaAVP(titulosAberto[contador])
        }
      }
      if (valorOfertaOriginal < this.valorTotalAVP){
        this.removeParcelaAvp(titulosAberto[contador])
      }
    }

    function convertData(data:string) {
      let partes = dataString.split("/");
      let dia = String(parseInt(partes[0], 10)).padStart(2, '0');
      let mes = String(parseInt(partes[1], 10)).padStart(2, '0');
      let ano = parseInt(partes[2], 10);

      return `${ano}${mes}${dia}`
    }
  }

  public geraBoleto(){
    this.salvandoRotina('Geracao de Boleto')
    if (environment.ambiente == "protheus"){
      this.proJsToAdvplService.jsToAdvpl('geraBoleto','')
    }
  }

  public enviaEmail(){
    this.salvandoRotina('Envio de Boleto por E-Mail')
    if (environment.ambiente == "protheus"){
      this.proJsToAdvplService.jsToAdvpl('enviaBoletoEmail','')
    }
  }
  public enviaWhats(){
    this.salvandoRotina('Envio de Boleto por WhatsApp')
    if (environment.ambiente == "protheus"){
      this.proJsToAdvplService.jsToAdvpl('enviaBoletoWhatsapp','')
    }
  }
  public posiVP(){
    this.salvandoRotina('Gerando Posicao AVP do Cliente')
    if (this.codproduto != ''){
      this.notify.information('Será preenchido com o produto selecionado')
      let cContent = `cCodProd := "${this.codproduto}", cFil := "${this.codfilial}", cCli := "${this.codclienteat}"`
      if (environment.ambiente == "protheus"){
        this.proJsToAdvplService.jsToAdvpl('posiVP',cContent)
      }
    }else{
      this.notify.error('Selecione um produto ao lado do cliente antes de seguir para a rotina')
    }

  }
  public posiCli(){
    this.salvandoRotina('Gerando Posicao Financeira do Cliente')
    if(this.codproduto != ''){
      let cContent = `cCodProd := "${this.codproduto}", cFil := "${this.codfilial}", cCli := "${this.codclienteat}"`
      if (environment.ambiente == "protheus"){
        this.proJsToAdvplService.jsToAdvpl('posiCli',cContent)
      }
    }else{
      this.notify.error('Selecione um produto ao lado do cliente antes de seguir para a rotina')
    }
  }

  public cobranca(){
    if(this.codigoCliente != ''){
      let cContent = `cFilAt := "${this.codfilial}", cCliente := "${this.codigoCliente}", cLoja := "${this.loja}"`
      if (environment.ambiente == "protheus"){
        this.proJsToAdvplService.jsToAdvpl('cobranca',cContent)
      }
    }
  }

  limpar(){
    this.valorFilial = ''
    this.codigoCliente = ''
  }


  public mudaFiltro(){
    this.filtro = {filial: this.filial}
  }

  public salvandoRotina(rotina: string){
    const dataAtual = new Date()
    const formatarDoisDigitos = (num:any) => String(num).padStart(2, '0');

    const dia = formatarDoisDigitos(dataAtual.getDate());
		const mes = formatarDoisDigitos(dataAtual.getMonth() + 1);
		const ano = dataAtual.getFullYear();
    const data = `${ano}${mes}${dia}`

    const hora = formatarDoisDigitos(dataAtual.getHours())
    const minutos = formatarDoisDigitos(dataAtual.getMinutes())
    const segundos = formatarDoisDigitos(dataAtual.getSeconds())

    const horario = `${hora}:${minutos}:${segundos}`

    let acesso: Acesso = {
      filial: this.codfilial,
      codCliente: this.clientes[0].codigo,
      cliente:this.clientes[0].nome,
      codProduto: this.codproduto,
      descProduto:this.descproduto,
      data: data,
      horario:horario,
      rotina: rotina
    }
    // console.log('acesso', acesso)
    // let requisicao = this.clienteservice

    // requisicao.salvarRotina(acesso).subscribe({
    //   next(value) {
    //     console.log('salvaRotina value',value)
    //   },
    //   error(err) {
    //     console.log(err)
    //   },
    //   complete() {

    //   }
    // })
  }

  public geraBoletoCliente(item:any){
    this.notify.success('O boleto será gerado em instantes')
    this.escondeToaster = false
    let parcela = item.split('P')[1]
    let aDados:any = this.parcelasTit.filter(parcelasTit => parcelasTit.parcela == parcela)
    let dados = {
      nRecno: aDados[0].recno
    }
    let requisicao = this.clienteservice

    requisicao.geraBolCliente(dados).subscribe({
      next(value) {
        const base64PDF = value[0].boleto;

        const byteCharacters = atob(base64PDF);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });

        const blobUrl = URL.createObjectURL(blob);

        window.open(blobUrl);
      },
      error(err) {
        console.log(err)
      },
      complete() {
      }
    })
    this.escondeToaster = true
  }

}
