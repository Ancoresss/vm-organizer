import { Component } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { SpotinstService } from '../../service/spotinst.service';
import { Vm } from '../../model/vm';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {ViewEncapsulation} from '@angular/core';
import { concatMap, delay, from } from 'rxjs';

@Component({
  selector: 'app-popappform',
  templateUrl: './popappform.component.html',
  styleUrl: './popappform.component.css',
  encapsulation: ViewEncapsulation.None
})
export class PopappformComponent {
    vm : Vm = new Vm();
    isEnabled = false;
    spotInstancesPartial: { tag: string, groupId: string }[] = [];
    spotInstancesFull: { tag: string, groupId: string, statefulId: string }[] = [];

    vmForm = new FormGroup ({
        vmTag : new FormControl(''),
        vmPassword : new FormControl(''),
        vmIpApp : new FormControl(''),
        vmIpDb : new FormControl(''),
        vmNote : new FormControl(''),
        vmStatus : new FormControl('')
        
    })

    constructor(private crudService : CrudService,
                private dialogRed : MatDialog,
                private spotInstService : SpotinstService) {}

    onSubmit() {
        this.vm.ipApp = this.vmForm.value.vmIpApp!
        this.vm.ipDB = this.vmForm.value.vmIpDb!
        this.vm.id = this.vmForm.value.vmTag!
        this.vm.password = this.vmForm.value.vmPassword!
        this.vm.note = ''
        if (this.vmForm.value.vmStatus === '') {
            this.vm.status = 'OFF'
        } else {
            this.vm.status = this.vmForm.value.vmStatus!
        }

        this.addVm(this.vm);

        this.vm = new Vm();
    }

    addVm(vm : Vm) {
        this.crudService.addVm(vm).subscribe(
            {
                next: res => this.closeDialog(),
                error: err => console.log(err)
            }
        );
        this.spotInstService.getInstancesGroupId().pipe(
            // get full tag and groupId from SpotInst API for APP/DB instances of specific tag
            concatMap(res => {
              for (let i = 0; i < res.response.items.length; i++) {
                if (res.response.items[i].name.includes(vm.id)) {
                  this.spotInstancesPartial.push({tag: res.response.items[i].name, groupId: res.response.items[i].id});
                }
              }
              // get statefulId from SpotInst API for APP/DB instances of specific groupId
              return this.spotInstService.getInstanceInfoByGroupId(this.spotInstancesPartial[0].groupId).pipe(
                concatMap((res: any) => {
                  this.spotInstancesFull.push({tag: this.spotInstancesPartial[0].tag, groupId: this.spotInstancesPartial[0].groupId, statefulId: res.response.items[0].id});
                  return this.spotInstService.getInstanceInfoByGroupId(this.spotInstancesPartial[1].groupId).pipe(
                    concatMap((resp: any) => {
                      this.spotInstancesFull.push({tag: this.spotInstancesPartial[1].tag, groupId: this.spotInstancesPartial[1].groupId, statefulId: resp.response.items[0].id});
                      return this.spotInstService.instancesGroupIdToFile(this.spotInstancesFull);
                    }),
                  );
                }),
              );
            }),
          ).subscribe({
            next: res => {console.log("Instances was written to the instances.json file");},
            error: err => console.log(err)
          });
    }

    closeDialog() {
        this.dialogRed.closeAll();
    }

    enableFlag() {
        this.isEnabled = true
    }

    disableFlag() {
        this.isEnabled = false
    }
}
