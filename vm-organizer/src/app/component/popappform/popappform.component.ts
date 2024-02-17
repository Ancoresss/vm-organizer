import { Component } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { Vm } from '../../model/vm';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-popappform',
  templateUrl: './popappform.component.html',
  styleUrl: './popappform.component.css'
})
export class PopappformComponent {
    vm : Vm = new Vm();

    vmForm = new FormGroup ({
        vmTag : new FormControl(''),
        vmPassword : new FormControl(''),
        vmIpApp : new FormControl(''),
        vmIpDb : new FormControl(''),
        vmStatus : new FormControl('')
    })

    constructor(private crudService : CrudService,
                private dialogRed : MatDialog) {}

    onSubmit() {
        this.vm.ipApp = this.vmForm.value.vmIpApp!
        this.vm.ipDB = this.vmForm.value.vmIpDb!
        this.vm.id = this.vmForm.value.vmTag!
        this.vm.password = this.vmForm.value.vmPassword!
        this.vm.status = this.vmForm.value.vmStatus!
        
        this.addVm(this.vm);

        this.vm = new Vm();
    }

    addVm(vm : Vm) {
        this.crudService.addVm(vm).subscribe(
            {
                next: res => this.closeDialog(),
                error: err => alert(err)
            }
        );
    }

    closeDialog() {
        this.dialogRed.closeAll();
    }
}
