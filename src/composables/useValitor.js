import { reactive } from "vue";

export function validator(){
    //validation
    let error = reactive({
    email: '',
    password: '',
    })
    //function
    function validatField(field, value, message){
    if(!value){
    error[field] = message;
    }else{
    error[field] = '';
    }
    return !error[field];
  }
    //return
    return { validatField, error }
}