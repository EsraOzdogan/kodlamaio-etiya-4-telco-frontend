import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.css'],
})
export class MessageDialogComponent implements OnInit {
  constructor(private messageService: MessageService) {}

  ngOnInit(): void {}
  onConfirm() {
    this.messageService.clear();
  }
}
