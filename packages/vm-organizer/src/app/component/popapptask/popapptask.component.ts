import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CrudService } from '../../service/crud.service';
import { Task } from '../../model/task';

@Component({
  selector: 'app-popapptask',
  templateUrl: './popapptask.component.html',
  styleUrl: './popapptask.component.css'
})
export class PopapptaskComponent {

  task: Task = new Task();
  taskForm = new FormGroup({
    taskName: new FormControl(''),
    taskDescription: new FormControl('')
  })

constructor(
 // @Inject(MAT_DIALOG_DATA) public data: Task,
  private dialogRed : MatDialog,
  private crudService : CrudService
) { }


ngOnInit() {
  // will log the entire data object
 // console.log(this.data)
} 


onSubmit() {

 this.task.name = this.taskForm.value.taskName!
 this.task.description = this.taskForm.value.taskDescription!
 console.log(this.task)
 this.crudService.addTask(this.task).subscribe(
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
