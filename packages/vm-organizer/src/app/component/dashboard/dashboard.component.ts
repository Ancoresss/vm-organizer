import { Component } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { Vm } from '../../model/vm';
import { MatDialog } from '@angular/material/dialog';
import { PopappformComponent } from '../popappform/popappform.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpotinstService } from '../../service/spotinst.service';
import { concat, concatMap } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { PoppappnoteComponent } from '../poppappnote/poppappnote.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
    vmArr : Vm[] = [];
    vmForNote: Vm = new Vm;
    searchVm = '';
    allSelectedVmTags: string[] = [];
    spotInstances: any = [];

    constructor(private crudService : CrudService,
                private dialogRed : MatDialog,
                private clipboard: Clipboard,
                private snackBar: MatSnackBar,
                private spotInstService : SpotinstService) {}

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

    openDialogForNote(vmForNote: Vm) {
		  var popup = this.dialogRed.open(PoppappnoteComponent, {data: vmForNote});
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
      this.spotInstService.getInstanceFromFile().pipe(
        tap(res => {
          for (let i = 0; i < res.length; i++) {
            if (res[i].tag.includes(vm.id)) {
              this.spotInstances.push({tag: res[i].tag, groupId: res[i].groupId, statefulId: res[i].statefulId});
            }
          }
        }),
        concatMap(res => {
          let app_inst = this.spotInstances.filter((inst: any) => inst.tag.includes('ais_rcm'))[0];
          let db_inst = this.spotInstances.filter((inst: any) => !inst.tag.includes('ais_rcm'))[0];
          if (vm.status === 'ON') {
            return this.spotInstService.startInstance(db_inst.groupId, db_inst.statefulId).pipe(
              tap(res => {
                let intervalStatus = setInterval(() => {
                  this.spotInstService.getInstanceInfoByGroupId(db_inst.groupId).subscribe({
                    next: (res: any) => {
                        if (res.response.items[0].state === 'ACTIVE') {
                          this.spotInstService.startInstance(app_inst.groupId, app_inst.statefulId).subscribe({
                            next: (res: any) => {console.log("starting app instance")},
                            error: err => console.log(err)
                          })
                          clearInterval(intervalStatus);
                        }
                      },
                      error: err => console.log(err)
                    });
                }, 15000);
                console.log("starting db instance")
              })
            )
          } else {
            return this.spotInstService.stopInstance(app_inst.groupId, app_inst.statefulId).pipe(
              tap(res => {
                let intervalStatus = setInterval(() => {
                  this.spotInstService.getInstanceInfoByGroupId(app_inst.groupId).subscribe({
                    next: (res: any) => {
                      console.log("pausing: " + res.response.items[0].state);
                      if (res.response.items[0].state === 'PAUSED') {
                        this.spotInstService.stopInstance(db_inst.groupId, db_inst.statefulId).subscribe({
                          next: (res: any) => {console.log("stopping db instance")},
                          error: err => console.log(err)
                        })
                        clearInterval(intervalStatus);
                      }
                    },
                    error: err => console.log(err)
                  });
                }, 15000);
                console.log("pausing app instance")
              })
            )
          }
        })
      ).subscribe({
        next: res => console.log("Machines are preparing to start/stop"),
        error: err => console.log(err)
      })
    }

    copyText(text: string) {
      this.snackBar.open('Copied!', undefined, {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
       })
     const textClear = text.trim();
     this.clipboard.copy(textClear);
    }



}
