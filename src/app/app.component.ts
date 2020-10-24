import { Component } from '@angular/core';
import * as io from "socket.io-client";

import { ChartType, ChartOptions } from 'chart.js';

import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartLabels: Label[] = null;
  public pieChartData: SingleDataSet = null;
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];

  question = ""
  socket: SocketIOClient.Socket;
  selected = null

  constructor() {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
    this.socket = io.connect();
  }

  ngOnInit() {
    this.getLabels()
    this.getVotes()
    this.getQuestion()

  }

  getQuestion(){
    this.socket.on("polls", data => {
      this.question = data.question
      }
      )
  }

  getLabels(){
    this.socket.on("polls", data => {
    let options = data.options
    let labels : Label[]= []

    for (let i=0;i<options.length;i++){
        labels.push(options[i].text)
    
    }

    this.pieChartLabels = labels
    }
    )
  }

  getVotes(){
    this.socket.on("polls", data => {
    let options = data.options
    let votes : SingleDataSet= []
  
    for (let i=0;i<options.length;i++){
      votes.push(options[i].count)
    
    }
    this.pieChartData = votes
    console.log(this.pieChartData)
    }
    )
  }

  sendVote(){
    this.socket.emit("newVote", this.selected)
  }

  selectedVote(vote){
    this.selected = vote
  }

}
