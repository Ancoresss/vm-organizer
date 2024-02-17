import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { CrudService } from '../../service/crud.service';
import { Vm } from '../../model/vm';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-popappformedit',
  templateUrl: './popappformedit.component.html',
  styleUrl: './popappformedit.component.css'
})
export class PopappformeditComponent {
  vm : Vm = new Vm();

  vmForm = new FormGroup ({
    id : new FormControl({value: '', disabled: true}),
    password : new FormControl(''),
    ipApp : new FormControl(''),
    ipDB : new FormControl(''),
    status : new FormControl('')
  })

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
                                       private crudService : CrudService,
                                       private dialogRed : MatDialog) {
    this.ngOnInit()
  }

  ngOnInit() {
    this.vmForm.patchValue(this.data.vm)
  }

  onSubmit() {
    this.vm.ipApp = this.vmForm.value.ipApp!
    this.vm.ipDB = this.vmForm.value.ipDB!
    this.vm.id = this.data.vm.id
    this.vm.password = this.vmForm.value.password!
    this.vm.status = this.vmForm.value.status!

    console.log("edit: " + this.vm.id)
    console.log("edit: " + this.vm.ipApp)
    console.log("edit: " + this.vm.ipDB)
    console.log("edit: " + this.vm.password)
    console.log("edit: " + this.vm.status)

    this.editVm(this.vm);

    this.vm = new Vm();
  }

  editVm(vm : Vm) {
    this.crudService.editVm(vm).subscribe(
      {
          next: res => this.closeDialog(),
          error: err => alert("Fail in edit task!")
      }
    );
  }

  closeDialog() {
    this.dialogRed.closeAll();
  }

  //todo send data to the view and implement edit logic
  // error is about undefined onSubmit method in the view
}
