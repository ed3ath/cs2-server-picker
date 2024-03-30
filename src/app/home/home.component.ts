import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../core/services';
import { Server } from '../core/services/interfaces';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  servers!: Server[];

  constructor(public electronService: ElectronService) {
    this.electronService
      .getServers()
      .then((servers) => {
        console.log(servers);
        this.servers = servers.filter((i) => !!i.relays);
      })
      .catch(console.log);
  }

  ngOnInit(): void {
    console.log('HomeComponent INIT');
  }

  async unBlock(server: Server) {
    const success = await this.electronService.unBlockServer(server);
    if (success) server.blocked = false;
    else await Swal.fire('', 'Please run as admin', 'error');
  }

  async block(server: Server) {
    const success = await this.electronService.blockServer(server);
    if (success) server.blocked = true;
    else await Swal.fire('', 'Please run as admin', 'error');
  }
}
