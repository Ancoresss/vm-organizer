import { Component } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { Vm } from '../../model/vm';
import { MatDialog } from '@angular/material/dialog';
import { PopappformComponent } from '../popappform/popappform.component';
import { PopappformeditComponent } from '../popappformedit/popappformedit.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    vmArr : Vm[] = [];
    searchVm = '';
    allSelectedVmTags: string[] = [];

    constructor(private crudService : CrudService,
                private dialogRed : MatDialog) {}

    ngOnInit() {
      this.getAllVms();
      this.allSelectedVmTags = []
    }

    openDialogForAdding() {
		  var popup = this.dialogRed.open(PopappformComponent);
      popup.afterClosed().subscribe({
        next: res => this.ngOnInit(),
        error: err => alert(err)
      })
	  } 

    openDialogForEdit(): void {
      if (this.allSelectedVmTags.length === 1) {
        const vm : any = this.vmArr.filter(item => item.id === this.allSelectedVmTags[0])[0]
        var popup = this.dialogRed.open(PopappformeditComponent, {
          data: { vm }
        } );
        popup.afterClosed().subscribe({
          next: res => this.ngOnInit(),
          error: err => alert(err)
        })
      } else {
        alert("Choose the 1 VM")
      }
	  } 

    onChange(vmTag : string): void {
      if (this.allSelectedVmTags.includes(vmTag)) {
        this.allSelectedVmTags = this.allSelectedVmTags.filter(item => item !== vmTag);
      } else {
        this.allSelectedVmTags.push(vmTag);
      }
      console.log(this.allSelectedVmTags)
    }

    getAllVms() {
      this.crudService.getAllVms().subscribe(
          {
              next: res => this.vmArr = res,
              error: err => alert("Unable to get Vms")
          }
      );
    }
}
