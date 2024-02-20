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

    onChange(vmTag : string): void {
      if (this.allSelectedVmTags.includes(vmTag)) {
        this.allSelectedVmTags = this.removeItem(this.allSelectedVmTags, vmTag);
      } else {
        this.allSelectedVmTags.push(vmTag);
      }
      console.log(this.allSelectedVmTags)
    }

    removeItem(array: any[], value: any) {
      return array = array.filter(item => item !== value);
    }

    getAllVms() {
      this.crudService.getAllVms().subscribe(
          {
              next: res => this.vmArr = res,
              error: err => alert("Unable to get Vms")
          }
      );
    }

    deleteVm() {
      for (let i = 0; i < this.vmArr.length; i++) {
        for (let j = 0; j < this.allSelectedVmTags.length; j++) {
          if (this.vmArr[i].id === this.allSelectedVmTags[j]) {
            this.crudService.deleteVm(this.vmArr[i]).subscribe(
              {
                  next: res => {
                    this.vmArr = this.removeItem(this.vmArr, this.vmArr[i]);
                    this.allSelectedVmTags = this.removeItem(this.allSelectedVmTags, this.allSelectedVmTags[j])
                    this.ngOnInit()
                  },
                  error: err => alert("Unable to detele Vm")
              }
          );
          }
        }
      }
    }

    editStatus(vm: Vm) {
      vm.status = vm.status === 'ON' ? 'OFF' : 'ON';
      this.crudService.editVm(vm).subscribe(
        {
            next: res => this.ngOnInit(),
            error: err => alert("Unable to get Vms")
        }
      );
    }
}
