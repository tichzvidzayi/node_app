let casinos = JSON.parse(execution.getVariable('arr_casinoNames'));
let mappingArray = JSON.parse(execution.getVariable('mappingArray'));

//get all possible defendants 
var arr_defendant = [];
var arr_mail_address = [];

for (let i = 0; i < casinos.length; i++) {
    let cas_name = casinos[i];
    for (let c = 0; c < mappingArray.length; c++) {
        for (let j = 0; j < mappingArray[c].casinos.length; j++) {
            c_name = mappingArray[c].casinos[j].casinoName;
            if (cas_name == c_name) {
                arr_defendant.push(mappingArray[c].betreiber);
                arr_mail_address.push(mappingArray[c].casinos[j].casinoMailadresse);
            }
        }
    }
}

//  if one defendant exists, get Casino'smail Address and funding value
let c_mail_address = '';
let c_funding = false;
if (arr_defendant.length == 1) {
    for (let c = 0; c < mappingArray.length; c++) {
        if (arr_defendant[0] == mappingArray[c].betreiber) {
            c_funding = mappingArray[c].finanziererGeeignet;
            c_mail_address = arr_mail_address[0];
        }
    }
    execution.setVariable("cf_311", arr_defendant[0] + "");
    execution.setVariable("Casino_mail", c_mail_address);
}

//f there is more than one defendant or no defendant, forward the issue to Julia.
let correct = true;
if (arr_defendant.length != 1) {
    arr_defendant = deleteDuplicates(arr_defendant)
    arr_mail_address = deleteDuplicates(arr_mail_address)
}
if (arr_defendant.length != 1) {
    execution.setVariable("cf_311", arr_defendant + "");
    correct = false;
}
execution.setVariable("Correct", correct);

// set cf_4449 according to the funding value 
if (c_funding == true || c_funding == 'true') {
    execution.setVariable('cf_4449', true);
}


//// Helper Functions

// deleate the duplicates of one array
function deleteDuplicates(arr) {
    if (arr.length == 0) {
        return arr
    }
    var duplicates = [];
    for (i = 0; i < arr.length - 1; i++) {
        for (j = i + 1; j < arr.length; j++) {
            if ((arr[i] === arr[j]) && (duplicates.indexOf(i) < 0)) {
                duplicates.push(i);
            }
        }
    }

    if (duplicates.length != 0) {
        var i = 0;
        while (i < duplicates.length) {
            move(arr, (duplicates[i] - i), arr.length - 1);
            i = i + 1;
        }

        for (i = 0; i < duplicates.length; i++) {
            arr.pop();
        }
    }
    return arr
}

function move(array, from, to) {
    if (to === from) return array;

    var target = array[from];
    var increment = to < from ? -1 : 1;

    for (var k = from; k != to; k += increment) {
        array[k] = array[k + increment];
    }
    array[to] = target;
    return array;
}