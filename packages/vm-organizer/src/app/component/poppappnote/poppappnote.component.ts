import { Component } from '@angular/core';
import { CrudService } from '../../service/crud.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { Vm } from '../../model/vm';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-poppappnote',
  templateUrl: './poppappnote.component.html',
  styleUrl: './poppappnote.component.css'
})
export class PoppappnoteComponent {

  vmForm = new FormGroup ({
    vmNote : new FormControl(this.data.note)
    
})

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Vm,
    private dialogRed : MatDialog,
    private crudService : CrudService
 ) { }
 
 ngOnInit() {
   // will log the entire data object
   console.log(this.data)
 } 


 onSubmit() {
  this.data.note = this.vmForm.value.vmNote!
  console.log(this.data.note)
  this.crudService.addNote(this.data).subscribe(
    {
        next: res => this.closeDialog(),
        error: err => console.log(err)
    }
);

}

closeDialog() {
  this.dialogRed.closeAll();
}


}
