import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vm } from '../model/vm';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

	serviceUrl : string;
	serviceUrlTasks : string;

  	constructor(private http : HttpClient) { 
		this.serviceUrl = 'http://localhost:3000/vms';
		this.serviceUrlTasks = 'http://localhost:3000/tasks';
  	}

	addVm(vm : Vm) : Observable<Vm> {
		return this.http.post<Vm>(this.serviceUrl, vm);
	}

	getAllVms() : Observable<Vm[]> {
		return this.http.get<Vm[]>(this.serviceUrl);
	}

	deleteVm(vm : Vm) : Observable<Vm> {
		console.log(this.serviceUrl + "/" + vm.id)
		return this.http.delete<Vm>(this.serviceUrl + "/" + vm.id);
	}

	editVm(vm : Vm) : Observable<Vm> {
		console.log(this.serviceUrl + "/" + vm.id)
		return this.http.put<Vm>(this.serviceUrl, vm);
	}

	addNote(note: Vm) : Observable<Vm>{
		return this.http.post<Vm>(this.serviceUrl + "/note", note)
	}


}
