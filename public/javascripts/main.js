function fetchdata(){
    fetch("http://localhost:3000/api/test-suit").then(resp=>resp.json()).then(resp=>{
        // console.log("resp", resp);
        let select_type = document.getElementById("select_type")
        let inhtml = ''
        resp.map(i=>{
            inhtml = inhtml + `<option value="${i.name}">${i.name}</option>`
        })
        select_type.innerHTML = inhtml
    }).catch(err=>{
        console.log('err', err);
    })
}

function handleTypeChange(){
    fetchdata()
}

function main(){
    // DOM loaded
    // fetchdata();

}
document.addEventListener('DOMContentLoaded', main());