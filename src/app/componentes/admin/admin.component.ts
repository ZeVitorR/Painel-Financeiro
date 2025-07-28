import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoChartModule, PoChartOptions, PoChartSerie, PoChartType, PoDatepickerRange, PoFieldModule, PoMenuItem, PoMenuModule, PoPageModule, PoSelectOption, PoTableModule, PoWidgetModule } from '@po-ui/ng-components';
import { ProAppConfigService } from '@totvs/protheus-lib-core';
import { AdministradorService } from '../../servicos/administrador.service';
import { CommonModule } from '@angular/common';
import { dadosAdmin } from '../../classes/admin';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    PoPageModule,
    PoMenuModule,
    PoWidgetModule,
    PoFieldModule,
    FormsModule,
    ReactiveFormsModule,
    PoChartModule,
    PoTableModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  public optionUser: Array<PoSelectOption> = []
  public valorUser: string = ''
  public graficoAtendentes:Array<PoChartSerie> = [
    { label: 'Atendente W', data: 10, tooltip: 'Atendente W:10' },
    { label: 'Atendente X', data: 15, tooltip: 'Atendente X:15' },
    { label: 'Atendente Y', data:  8, tooltip: 'Atendente Y:8' },
    { label: 'Atendente Z', data: 13, tooltip: 'Atendente X:13' },
  ];
  public qtdAtendimento:Number = 43
  public mediaAtendimento:Number = 43
  public mediaTempoAtendimento:Number = 20
  public filialSelecionada:string = ''
  public atendentesSelecionada:string = ''
  public filtroData:string = 'ano'
  public meses:Array<string> = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
  private dataAtual = new Date()
  public mes:string = this.meses[this.dataAtual.getMonth()]
  public ano:string = this.dataAtual.getFullYear().toString()
  public datepickerRange!:PoDatepickerRange
  public pricipaisFiliais:Array<any> = []
  public categoriaAtendimento:Array<string> = ['<8:30','8:30','9','9:30','10','10:30','11','11:30','12','12:30','13','13:30','14','14:30','15','15:30','16','16:30','17','17:30','18','>18:30']
  public graficoAtendimento:Array<PoChartSerie> = [
    { label: 'horário' , data: [10,15, 8,13,10,15, 8,13,10,15, 8,13,10,15, 8,13,10,15, 8,13,10,15, 8,13,13], type: PoChartType.Column},

  ];
  optionsAtendimento: PoChartOptions = {
    axis: {
      minRange:  0,
      maxRange: 15,
      gridLines: 5
    }
  };

  public categoriaAtendimentoFilial:Array<string> = ['Filial 1' ,'Filial 2' ,'Filial 3' ,'Filial 4' ,'Filial 5' ,'Filial 6' ,'Filial 7' ,'Filial 8' ,'Filial 9' ,'Filial 10']

  public graficoAtendimentoFilial:Array<PoChartSerie> = [
    { label: 'Filiais' , data: [10, 15,  8, 13, 10, 15,  8, 13, 10, 15], type: PoChartType.Column},
  ];
  optionsAtendimentoFilial: PoChartOptions = {
    axis: {
      minRange:  0,
      maxRange: 15,
      gridLines: 7
    }
  };
  public atendenteTipo: PoChartType  = PoChartType.Donut
  public AtendimentoTipo: PoChartType  = PoChartType.Bar
  public AtendimentoFilialTipo: PoChartType  = PoChartType.Bar

  #appConfig = inject(ProAppConfigService)
  private clienteservice = inject(AdministradorService)

  menus: Array<PoMenuItem> = [
    { label: 'Painel Financeiro', link: '/painel', icon: 'an an-magnifying-glass', shortLabel: 'Painel Financeiro' },
    { label: 'Sair', action: this.close.bind(this), icon: 'an an-magnifying-glass', shortLabel: 'Sair' }
  ]

  ngOnInit(): void {
    this.loadData()
  }

  public loadData(){
    this.obtemDados()
  }

  public obtemDados(){
    let requisicao = this.clienteservice
    let options: Array <any> = []
    let Atendentes: Array <any> = []
    let filiais: Array <any> = []
    let dado:Array<dadosAdmin> = []
    var dataAtual = new Date()
    var dataAtualFormatada = formatarData(dataAtual)
    var aDados:Array<any> = []
    //dados da tabela
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"124001 - Terrazul CG", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"125001 - Terrazul CG II", idUsuario:'jose.vitor', nomeUsuario:"José Vitor Rodrigues",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"030001 - Terrazul BA", idUsuario:'lidia.depetri', nomeUsuario:"Lidia Depetri",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"030001 - Terrazul BA", idUsuario:'lidia.depetri', nomeUsuario:"Lidia Depetri",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"030001 - Terrazul BA", idUsuario:'lidia.depetri', nomeUsuario:"Lidia Depetri",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"030001 - Terrazul BA", idUsuario:'lidia.depetri', nomeUsuario:"Lidia Depetri",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"030001 - Terrazul BA", idUsuario:'lidia.depetri', nomeUsuario:"Lidia Depetri",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"030001 - Terrazul BA", idUsuario:'lidia.depetri', nomeUsuario:"Lidia Depetri",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"030001 - Terrazul BA", idUsuario:'lidia.depetri', nomeUsuario:"Lidia Depetri",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"128001 - Terrazul AM", idUsuario:'leonardo', nomeUsuario:"leonardo",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"128001 - Terrazul AM", idUsuario:'leonardo', nomeUsuario:"leonardo",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"128001 - Terrazul AM", idUsuario:'leonardo', nomeUsuario:"leonardo",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"128001 - Terrazul AM", idUsuario:'leonardo', nomeUsuario:"leonardo",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"128001 - Terrazul AM", idUsuario:'leonardo', nomeUsuario:"leonardo",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"128001 - Terrazul AM", idUsuario:'leonardo', nomeUsuario:"leonardo",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"030001 - Terramerica TA", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})
    dado.push({filial:"030001 - Terramerica TA", idUsuario:'admin', nomeUsuario:"administrador",codigoCliente:"014177",nomeCliente:"Cliente X",tempoInicio:Date.now(),tempoFim:Date.now()+1000*60*20, tempo:20})

    this.qtdAtendimento = dado.length
    const qtdDias = 1
    this.mediaAtendimento = dado.length/qtdDias
    this.mediaTempoAtendimento = (dado.reduce((acumulador, dado) => acumulador + dado.tempo, 0))/dado.length;

    const nomesUnicos = [...new Set(dado.map(item => item.nomeUsuario))];
    nomesUnicos.forEach(element => {
      var qtd = dado.filter(dado => dado.nomeUsuario == element).length
      Atendentes.push({ label: element, data: qtd, tooltip: `${element}:${qtd}` })
    });
    this.graficoAtendentes = Atendentes

    const filiaisUnicas = [...new Set(dado.map(item => item.filial))]
    filiaisUnicas.forEach(element => {
      var qtdEl = (dado.filter(dado => dado.filial == element).length).toString().padStart(2, '0')
      filiais.push({ filial: element, qtd: qtdEl})
    });
    this.pricipaisFiliais = filiais

    aDados.push({
      label: 'horário',
      data: [
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return hora<830}).length,                   //<8:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (830<=hora && hora<900)}).length,    //8:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (900<=hora && hora<930)}).length,    //9:00
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (930<=hora && hora<1000)}).length,   //9:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1000<=hora && hora<1030)}).length,  //10:00
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1030<=hora && hora<1100)}).length,  //10:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1100<=hora && hora<1130)}).length,  //11:00
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1130<=hora && hora<1200)}).length,  //11:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1200<=hora && hora<1230)}).length,  //12:00
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1230<=hora && hora<1300)}).length,  //12:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1300<=hora && hora<1330)}).length,  //13:00
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1330<=hora && hora<1400)}).length,  //13:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1400<=hora && hora<1430)}).length,  //14:00
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1430<=hora && hora<1500)}).length,  //14:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1500<=hora && hora<1530)}).length,  //15:00
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1530<=hora && hora<1600)}).length,  //15:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1600<=hora && hora<1630)}).length,  //16:00
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1630<=hora && hora<1700)}).length,  //16:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1700<=hora && hora<1730)}).length,  //16:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1730<=hora && hora<1800)}).length,  //17:30
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1800<=hora && hora<=1830)}).length, //18:00
        dado.filter(element => {var dataInicial = new Date(element.tempoInicio); var hora = formatarHora(dataInicial); return (1830<hora)}).length                 //>1830
      ]
    })
    this.graficoAtendimento = aDados

    function formatarData(dataAtual:Date):String {
      const ano = dataAtual.getFullYear(); // aaaa
      const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
      const dia = String(dataAtual.getDate()).padStart(2, '0');
      return `${ano}${mes}${dia}`
    }

    function formatarHora(dataAtual:Date):number {
      const horas = String(dataAtual.getHours()).padStart(2, '0');   // HH
      const minutos = String(dataAtual.getMinutes()).padStart(2, '0'); // mm
      return parseInt(`${horas}${minutos}`)
    }
  }
  public close(){
    if (this.#appConfig.insideProtheus()){
      this.#appConfig.callAppClose(false);
    }else{
      alert('sair')
    }
  }
}
