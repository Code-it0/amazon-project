import { formatCurrency } from "../../amazonn project/scripts/utils/money.js";

if (formatCurrency(2095)==20.95){
    console.log('passed');
    console.log(typeof(formatCurrency(2095)));
}
else{console.log("failed");} 
if (formatCurrency(0)===0){
    console.log('passed');
}
else{console.log("failed");} 


