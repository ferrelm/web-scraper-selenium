console.log("Olá")
function callScript() {
    console.log("Olá outra vez")
    const para = document.createElement("p")
    para.innerText = "Sucesso"
    //document.body.appendChild(para)
    document.getElementById('sumWrapper').appendChild(para)
}
