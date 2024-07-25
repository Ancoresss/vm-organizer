import { Pipe, PipeTransform } from "@angular/core";
import { Vm } from '../model/vm';

@Pipe({
    name: 'searchVms'
})
export class SearchVm implements PipeTransform {
    transform(vms : Vm[], searchStr = ''): Vm[] {
        if(!searchStr.trim()) {
            return vms;
        }

        return vms.filter(vm => {
            return (vm.id.toLowerCase().includes(searchStr.toLowerCase()) ||
                    vm.ipApp.toLowerCase().includes(searchStr.toLowerCase()) ||
                    vm.ipDB.toLowerCase().includes(searchStr.toLowerCase()) ||
                    vm.password.toLowerCase().includes(searchStr.toLowerCase()) ||
                    vm.status.toLowerCase().includes(searchStr.toLowerCase()) ||
                    vm.note.toLowerCase().includes(searchStr.toLowerCase()))
        })
    }
}