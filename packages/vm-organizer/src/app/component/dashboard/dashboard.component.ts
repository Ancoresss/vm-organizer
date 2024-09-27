import { Component } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { Vm } from '../../model/vm';
import { MatDialog } from '@angular/material/dialog';
import { PopappformComponent } from '../popappform/popappform.component';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpotinstService } from '../../service/spotinst.service';
import { concatMap } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
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
		  var popup = this.dialogRed.open(PopappformComponent, {disableClose: true});
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
            // this doesn't work, need to debug
            this.crudService.deleteVm(this.vmArr[i]).subscribe({
                  next: res => {
                    this.spotInstService.deleteInstanceFromFile(this.vmArr[i]).subscribe({
                      next: res => {
                        this.vmArr = this.removeItem(this.vmArr, this.vmArr[i]);
                        this.allSelectedVmTags = this.removeItem(this.allSelectedVmTags, this.allSelectedVmTags[j]);
                        this.ngOnInit();
                      },
                      error: err => console.log(err)
                    })
                  },
                  error: err => alert("Unable to detele Vm")
              }
          );
          }
        }
      }
    }




    editStatus(vm: Vm) {
      let editStatus = vm.status === 'ON' ? 'OFF' : 'ON';      
      this.spotInstances = []

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
          if (editStatus === 'ON') {
            return this.spotInstService.startInstance(db_inst.groupId, db_inst.statefulId).pipe(
              tap(res => {
                vm.status = 'LOADING'
                let dbIntervalStatus = setInterval(() => {
                  this.spotInstService.getInstanceInfoByGroupId(db_inst.groupId).subscribe({
                    next: (resDbInfo: any) => {
                        if (resDbInfo.response.items[0].state === 'ACTIVE') {
                          this.spotInstService.startInstance(app_inst.groupId, app_inst.statefulId).subscribe({
                            next: (res: any) => {
                              clearInterval(dbIntervalStatus);
                              let appIntervalStatus = setInterval(() => {
                                this.spotInstService.getInstanceInfoByGroupId(app_inst.groupId).subscribe({
                                  next: (resAppInfo: any) => { 
                                    if (resAppInfo.response.items[0].state === 'ACTIVE') {
                                      vm.status = vm.status === 'ON' ? 'OFF' : 'ON';
                                      this.crudService.editVm(vm).subscribe({
                                        next: res => {          
                                          clearInterval(appIntervalStatus)
                                          this.ngOnInit()
                                        },
                                        error: err => console.log(err)
                                      });
                                    }
                                  },
                                  error: err => console.log(err)})
                              }, 15000)
                              console.log("starting app instance: " + app_inst.tag)},
                            error: err => console.log(err)
                          })
                        }
                      },
                      error: err => console.log(err)
                    });
                }, 15000);
                console.log("starting db instance: " + db_inst.tag)
              })
            )
          } else {
            return this.spotInstService.stopInstance(app_inst.groupId, app_inst.statefulId).pipe(
              tap(res => {
                vm.status = 'LOADING'
                return this.spotInstService.stopInstance(db_inst.groupId, db_inst.statefulId).subscribe({
                  next: (res: any) => {
                    vm.status = vm.status === 'ON' ? 'OFF' : 'ON';
                    this.crudService.editVm(vm).subscribe({
                      next: res => {
                        this.ngOnInit()
                      },
                      error: err => console.log(err)
                    });
                  },
                  error: err => console.log(err)
                })
              })
            )
          }
        })
      ).subscribe({
        next: res => console.log("Machines are preparing to start/stop"),
        error: err => {
          if (err.status === 400) {
            this.errorText('Error 400. Probably instance is resuming/pausing.')
          } else if (err.status === 401) {
            this.errorText('Error 401. Probably spotinstConfig.json has bad configuration.')
          } else {
            console.log(err)
          }
        }
      })
    }

    refreshStatus() {
      this.spotInstService.getInstanceFromFile().pipe( // instances.json
        tap((allInstances: any) => {
          for (let i = 0; i < allInstances.length; i+=2) {
            this.spotInstService.getInstanceInfoByGroupId(allInstances[i].groupId).pipe( // spotinst app
              tap((spotInstance: any) => {
                console.log(allInstances[i].groupId)
                console.log(allInstances[i + 1].groupId)
                this.spotInstService.getInstanceInfoByGroupId(allInstances[i + 1].groupId).pipe( // db app
                tap((dbInstance: any) => {
                  this.crudService.getAllVms().pipe(
                    tap((resInner: any) => resInner.forEach((elementResInner: any) => {
                      console.log(elementResInner.id)
                      if (allInstances[i].tag.includes(elementResInner.id)) {
                        if (spotInstance.response.items[0].state === 'PAUSED' && dbInstance.response.items[0].state === 'PAUSED') {
                          elementResInner.status = 'OFF';
                        } else if (spotInstance.response.items[0].state === 'ACTIVE' && dbInstance.response.items[0].state === 'ACTIVE') {
                          elementResInner.status = 'ON';
                        } else {
                          elementResInner.status = 'LOADING';
                        }
                        this.crudService.editVm(elementResInner).subscribe({
                          next: res => {},
                          error: err => console.log(err)
                        })
                      }
                    }))
                  ).subscribe({
                    next: res => console.log(),
                    error: err => console.log(err)
                  })
                })             
              ).subscribe({
                next: res => console.log(),
                error: err => console.log(err)
              })
            })
            ).subscribe({
              next: res => console.log(),
              error: err => console.log(err)
            })
          }
        })
      ).subscribe({
        next: res => console.log(),
        error: err => console.log(err)
      })  
      console.log('-----------------------------------')
      console.log('last log')

      this.ngOnInit();
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

    errorText(text: string) {
      this.snackBar.open(text, undefined, {
        duration: 6000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
       })
    }

}
