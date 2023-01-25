import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatList, MatListItem } from '@angular/material/list';
import { Subscription } from 'rxjs';
import { Message } from './shared/interfaces/message';
import { SocketIoService } from './socket-io.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  nickname: string;
  message: string;
  messages: Message[] = [];
  private subscriptionMessages: Subscription;
  private subscriptionList: Subscription;

  @ViewChild('lista') list: ElementRef;
  @ViewChildren(MatListItem) listItems: QueryList<MatListItem>;

  constructor(private socketService: SocketIoService) {


  }
  
  ngOnDestroy(): void {
    this.subscriptionMessages.unsubscribe();
    this.subscriptionList.unsubscribe();
  }
  ngOnInit(): void {
    this.subscriptionMessages = this.socketService.messages().subscribe(
      (m: Message) => {
        console.log(m);
        if(m){
          this.messages.push(m); 
        }else{
          console.log('else: ', m);
        }
      }
    )
  }

  ngAfterViewInit(): void {
    this.subscriptionList = this.listItems.changes.subscribe((e) => {
      this.list.nativeElement.scrollTop = this.list.nativeElement.scrollHeight;
      console.log('Valor: ', this.list.nativeElement.scrollTop );
      
       
    });
  }
  

  send() {
    this.socketService.send({
      from: this.nickname,
      message: this.message
    });
    this.message = '';
  }
}
