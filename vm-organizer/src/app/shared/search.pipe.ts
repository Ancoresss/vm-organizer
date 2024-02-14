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
            return vm.tag.toLowerCase().includes(searchStr.toLowerCase())
        })
    }
}