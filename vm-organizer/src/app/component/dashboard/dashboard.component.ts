import { Component } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { Vm } from '../../model/vm';
import { MatDialog } from '@angular/material/dialog';
import { PopappformComponent } from '../popappform/popappform.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    vmArr : Vm[] = [];
    searchVm = ''

    constructor(private crudService : CrudService,
                private dialogRed : MatDialog) {}

    ngOnInit() {
      this.getAllVms();
    }

    getAllVms() {
      this.crudService.getAllVms().subscribe(
          {
              next: res => this.vmArr = res,
              error: err => alert("Unable to get Vms")
          }
      );
    }

    openDialog() {
		  var popup = this.dialogRed.open(PopappformComponent);
      popup.afterClosed().subscribe({
        next: res => this.getAllVms(),
        error: err => alert(err)
      })
	  }            
}
