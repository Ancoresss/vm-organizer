import { Injectable } from '@angular/core';
import * as spotinstConf from '../../assets/spotinstConfig.json';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotinstService {

  headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + spotinstConf.token
  };

  requestOptions = {                                                                                                                                                                                 
    headers: new Headers(this.headers), 
  };

  INSTANCES_GET_ALL_URL = `https://api.spotinst.io/aws/ec2/group?accountId={ACCOUNT_ID}`;
  INSTANCES_GET_STATEFUL_URL = `https://api.spotinst.io/aws/ec2/group/{GROUP_ID}/statefulInstance?accountId={ACCOUNT_ID}`;
  INSTANCE_TURN_OFF_URL = `https://api.spotinst.io/aws/ec2/group/{GROUP_ID}/statefulInstance/{STATEFUL_ID}/pause?accountId={ACCOUNT_ID}`;
  INSTANCE_TURN_ON_URL = `https://api.spotinst.io/aws/ec2/group/{GROUP_ID}/statefulInstance/{STATEFUL_ID}/resume?accountId={ACCOUNT_ID}`;
  SERVICE_URL = 'http://localhost:3000';
  
  constructor(private http : HttpClient) { }

  // Working with the Spotinst API

  getInstanceInfoByGroupId(groupId : string) : Observable<object> {
    let INSTANCES_GET_STATEFUL_URL_CHANGED = this.INSTANCES_GET_STATEFUL_URL.replace('{GROUP_ID}', groupId).replace('{ACCOUNT_ID}', spotinstConf.account_id);
		return this.http.get<object>(INSTANCES_GET_STATEFUL_URL_CHANGED, {headers: this.headers});
	}

  getInstancesGroupId() : Observable<any> {
    let INSTANCES_GET_ALL_URL_CHANGED = this.INSTANCES_GET_ALL_URL.replace('{ACCOUNT_ID}', spotinstConf.account_id);
    return this.http.get<any>(INSTANCES_GET_ALL_URL_CHANGED, {headers: this.headers});
  }

  stopInstance(groupId : string, statefulId : string) : Observable<any> {
    let INSTANCE_TURN_OFF_URL_CHANGED = this.INSTANCE_TURN_OFF_URL.replace('{GROUP_ID}', groupId).replace('{STATEFUL_ID}', statefulId).replace('{ACCOUNT_ID}', spotinstConf.account_id);
    return this.http.put<any>(INSTANCE_TURN_OFF_URL_CHANGED, {}, {headers: this.headers});
  }

  startInstance(groupId : string, statefulId : string) : Observable<any> {
    let INSTANCE_TURN_ON_URL_CHANGED = this.INSTANCE_TURN_ON_URL.replace('{GROUP_ID}', groupId).replace('{STATEFUL_ID}', statefulId).replace('{ACCOUNT_ID}', spotinstConf.account_id);
    return this.http.put<any>(INSTANCE_TURN_ON_URL_CHANGED, {}, {headers: this.headers});
  }

  // Working with the local server

  instancesGroupIdToFile(instances : any) : Observable<any> {
		return this.http.post<any>(this.SERVICE_URL + "/addSpotInstances", instances);
	}

  getInstanceFromFile() : Observable<any> {
    return this.http.get<any>(this.SERVICE_URL + "/getSpotInstance");
  }

  deleteInstanceFromFile(vm : any) : Observable<any> {
    return this.http.delete<any>(this.SERVICE_URL + "/deleteSpotInstance" + "/" + vm.id);
  }
}
