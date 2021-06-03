import * as m from '/membresias.js'

const temperatura = document.getElementById('temperatura')
const olfato = document.getElementById('selectolfato')
const gusto = document.getElementById('selectgusto')
const garganta = document.getElementById('selectgarganta')
const boton = document.getElementById('enviar')



//banderas utilizadas
let boolTemp = false
let boolOlfato = false
let boolGusto = false
let boolGarganta = false

//--------------------------



//variables numericas utilizadas
let valor_temp = null
let valor_olfato = null
let valor_gusto  = null
let valor_garganta = null
//--------------------------------------------





//variable lingusticas (Step 1)
let vtemperatura =  ["baja temp" , "normal temp" , "sospechosa temp" , "alta temp"]
let volfato =       ["si tiene olfato", "no tiene olfato" ]
let vgusto =        ["si tiene gusto" , "no tiene gusto"]
let vgarganta =     ["no tiene ardor" , "si tiene ardor"]
//------------------------------------------


//reglas de las funciones (Step 2)

//funciones membresias para la temperatura 
let seleccion_temperatura = null
let funTempetatura = t => {
  if(t <= 36){
    seleccion_temperatura = vtemperatura[0]
    boolTemp = false
    return m.funcionTrapezoidal(t, 30 ,33 , 35 , 36)
  }
  else if(t > 36 && t <= 37){  //error encontrado en esta seccion en el rango de [36.6-37]
    seleccion_temperatura = vtemperatura[1]
    boolTemp = false
    return m.funcionTriangulo(t , 36 , 36.5 , 37)
  }
  else if(t>37 && t <=37.8){
    seleccion_temperatura = vtemperatura[2]
    boolTemp = true
    return m.funcionTriangulo(t , 37 , 37.5 , 37.8)
  }
  else if(t>37.8 && t <=40){
    seleccion_temperatura = vtemperatura[3]
    boolTemp = true
    return m.funcionTrapezoidal(t , 37.8 , 38.4 , 40 , 50)
  }else{
    boolTemp = false
    return null
  }
}
//funciones membresias para olfato
let select_olfato = null
let funcionOlfato =  olfato => {
  if(olfato == "si"){
    boolOlfato = false
    select_olfato = volfato[1]
    return m.funcionBool(1.0 , 1.0)
  }
  else if (olfato == "no"){
    boolOlfato = true
    select_olfato = volfato[0]
    return m.funcionBool(0.0 , 1.0)
  }
  else{
    boolOlfato = false
    return null
  }
}

//funciones membresias para Gusto
let select_gusto = null
let funcionGusto = gusto => {
  if(gusto == "si"){
    boolGusto = false
    select_gusto = vgusto[1]
    return m.funcionBool(1.0 , 1.0)
  }
  else if (gusto == "no"){
    boolGusto = true
    select_gusto = vgusto[0]
    return m.funcionBool(0.0 , 1.0)
  }
  else{
    boolGusto = false
    return null
  }
}
//funciones membresias para La Garganta
let select_garganta = null
let funcionGarganta = garganta => {
  if(garganta == "si"){
    boolGarganta = false
    select_garganta = vgarganta[1]
    return m.funcionBool(1.0 , 1.0)
  }
  else if (garganta == "no"){
    boolGarganta = true
    select_garganta = vgarganta[0]
    return m.funcionBool(0.0 , 1.0)
  }
  else{
    boolGarganta = false 
    return null 
  }
}


//------------------------------------------


//creacion de la matrix de relacion (Step 3)
// ________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________
// |                  ||    baja_Temp        |  normal_Temp         |   sospechosa_Temp      |    alta_Temp         |  si_tiene_olfato        | no_tiene_olfato      | si_tiene_gusto      | no_tiene_gusto         | no_tiene_ardor        | si_tiene_ardor       | 
// |------------------||---------------------|----------------------|------------------------|----------------------|-------------------------|----------------------|---------------------|------------------------|-----------------------|----------------------|
// | baja_Temp        ||        null         |          null        |         null           |          null        |      puede_entrar       |  sospechoso_no_entra | puede_entrar        |  sospechoso_no_entra   | puede_entrar          |  sospechoso_no_entra |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// |  mormal_Temp     ||        null         |          null        |         null           |          null        |       puede_entrar      |  sospechoso_no_entra | puede_entrar        |  sospechoso_no_entra   | puede_entrar          |  sospechoso_no_entra |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | sospechos_Temp   ||        null         |        null          |           null         |         null         |  sospechoso_no_entra    | sospechoso_no_entra  |sospechoso_no_entra  | sospechoso_no_entra    | sospechoso_no_entra   | sospechoso_no_entra  |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// |    alta_Temp     ||        null         |        null          |        null            |         null         |   sospechoso_no_entra   |   covid_no_entra     | sospechoso_no_entra |  covid_no_entra        | sospechoso_no_entra   | covid_no_entra       |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// |  si_tiene_olfato ||    puede_entrar     |    puede_entrar      |  sospechoso_no_entra   |  sospechoso_no_entra |         null            |          null        | puede_entrar        |   sospechoso_no_entra  | puede_entrar          | sospechoso_no_entra  |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | no_tiene_olfato  || sospechoso_no_entra |sospechoso_no_entra   |  sospechoso_no_entra   |    covid_no_entra    |         null            |          null        | sospechoso_no_entra |    covid_no_entra      |  sospechoso_no_entra  |    covid_no_entra    |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | si_tiene_gusto   ||    puede_entrar     |    puede_entrar      |  sospechoso_no_entra   | sospechoso_no_entra  |       puede_entrar      | sospechoso_no_entra  |          null       |           null         | puede_entrar          | sospechoso_no_entra  |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | no_tiene_gusto   || sospechoso_no_entra |sospechoso_no_entra   |  sospechoso_no_entra   |    covid_no_entra    |  sospechoso_no_entra    |    covid_no_entra    |          null       |           null         |  sospechoso_no_entra  |    covid_no_entra    |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | no_tiene_ardor   ||    puede_entrar     |    puede_entrar      |  sospechoso_no_entra   | sospechoso_no_entra  |       puede_entrar      | sospechoso_no_entra  | puede_entrar        |   sospechoso_no_entra  |           null        |           null       |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|
// | si_tiene_ardor   || sospechoso_no_entra |sospechoso_no_entra   |  sospechoso_no_entra   |    covid_no_entra    |  sospechoso_no_entra    |    covid_no_entra    | sospechoso_no_entra |    covid_no_entra      |           null        |           null       |
// |__________________||_____________________|______________________|________________________|______________________|_________________________|______________________|_____________________|________________________|_______________________|______________________|

let matrix = {            
  baja_temp:        {   baja_temp: null,                  normal_temp: null,                   sospechosa_temp: null,                     alta_temp: null,                    si_tiene_olfato: "puede entrar" ,         no_tiene_olfato:"sospechoso no entra",    si_tiene_gusto:"puede entrar",           no_tiene_gusto:"sospechoso no entra",   no_tiene_ardor:"puede entrar",            si_tiene_ardor:"sospechoso no entra"    },
  normal_temp:      {   baja_temp: null,                  normal_temp: null,                   sospechosa_temp: null,                     alta_temp: null,                    si_tiene_olfato: "puede entrar" ,         no_tiene_olfato:"sospechoso no entra",    si_tiene_gusto:"puede entrar",           no_tiene_gusto:"sospechoso no entra",   no_tiene_ardor:"puede entrar",            si_tiene_ardor:"sospechoso no entra"    },
  sospechosa_temp:  {   baja_temp: null,                  normal_temp: null,                   sospechosa_temp: null,                     alta_temp: null,                    si_tiene_olfato: "sospechoso no entra" ,  no_tiene_olfato:"sospechoso no entra",    si_tiene_gusto:"sospechoso no entra",    no_tiene_gusto:"sospechoso no entra",   no_tiene_ardor:"sospechoso no entra",     si_tiene_ardor:"sospechoso no entra"    },
  alta_temp:        {   baja_temp: null,                  normal_temp: null,                   sospechosa_temp: null,                     alta_temp: null,                    si_tiene_olfato: "sospechoso no entra" ,  no_tiene_olfato:"covid no entra",         si_tiene_gusto:"sospechoso no entra",    no_tiene_gusto:"covid no entra",        no_tiene_ardor:"sospechoso no entra",     si_tiene_ardor:"covid no entra"         },
  si_tiene_olfato:  {   baja_temp:"puede entrar",         normal_temp:"puede entrar",          sospechosa_temp:"sospechoso no entra",     alta_temp:"sospechoso no entra",    si_tiene_olfato: null ,                   no_tiene_olfato: null,                    si_tiene_gusto:"puede entrar",           no_tiene_gusto:"sospechoso no entra",   no_tiene_ardor:"puede entrar",            si_tiene_ardor:"sospechoso no entra"    },
  no_tiene_olfato:  {   baja_temp:"sospechoso no entra",  normal_temp:"sospechoso no entra",   sospechosa_temp:"sospechoso no entra",     alta_temp:"covid no entra",         si_tiene_olfato: null ,                   no_tiene_olfato: null,                    si_tiene_gusto:"sospechoso no entra",    no_tiene_gusto:"covid no entra",        no_tiene_ardor:"sospechoso no entra",     si_tiene_ardor:"covid no entra"         },
  si_tiene_gusto:   {   baja_temp:"puede entrar",         normal_temp:"puede entrar",          sospechosa_temp:"sospechoso no entra",     alta_temp:"sospechoso no entra",    si_tiene_olfato: "puede entrar",          no_tiene_olfato:"sospechoso no entra",    si_tiene_gusto:null,                     no_tiene_gusto:null,                    no_tiene_ardor:"puede entrar",            si_tiene_ardor:"sospechoso no entra"    },
  no_tiene_gusto:   {   baja_temp:"sospechoso no entra",  normal_temp:"sospechoso no entra",   sospechosa_temp:"sospechoso no entra",     alta_temp:"covid no entra",         si_tiene_olfato: "sospechoso no entra",   no_tiene_olfato:"covid no entra",         si_tiene_gusto:null,                     no_tiene_gusto:null,                    no_tiene_ardor:"sospechoso no entra",     si_tiene_ardor:"covid no entra"         },
  no_tiene_ardor:   {   baja_temp:"puede entrar",         normal_temp:"puede entrar",          sospechosa_temp:"sospechoso no entra",     alta_temp:"sospechoso no entra",    si_tiene_olfato: "puede entrar",          no_tiene_olfato:"sospechoso no entra",    si_tiene_gusto:"puede entrar",           no_tiene_gusto:"sospechoso no entra",   no_tiene_ardor:null,                      si_tiene_ardor:null                     },
  si_tiene_ardor:   {   baja_temp:"sospechoso no entra",  normal_temp:"sospechoso no entra",   sospechosa_temp:"sospechoso no entra",     alta_temp:"covid no entra",         si_tiene_olfato: "sospechoso no entra",   no_tiene_olfato:"covid no entra",         si_tiene_gusto:"sospechoso no entra",    no_tiene_gusto:"covid no entra",        no_tiene_ardor:null,                      si_tiene_ardor:null                     }
}



let reglas = () => {

  //reglas de covid
  //regla 1 tiene calentura , no tiene olfato y no tiene gusto
  if((seleccion_temperatura == "sospechosa temp" || seleccion_temperatura == "alta temp") && select_olfato == "no tiene olfato" && select_gusto == "no tiene gusto"){
    return "Covid no entrar"
  }
  //regla 2 tiene temperatura , no tiene olfato y si tiene ardor
  if((seleccion_temperatura == "sospechosa temp" || seleccion_temperatura == "alta temp") && select_olfato == "no tiene olfato" && select_garganta == "si tiene ardor"){
    return "Covid no entra"
  }
  //regla 3 no tiene olfato , no tiene gusto y si tiene ardor
  if(select_olfato == "no tiene olfato" && select_gusto == "no tiene gusto" && select_garganta == "si tiene ardor"){
    return "Covid no entra"
  }
  //------------------------


  //reglas de no covid
  //regla 4  tiene temperatura baja o normal , si tiene olfato y si tiene gusto
  if((seleccion_temperatura == "baja temp" || seleccion_temperatura == "normal temp") && select_olfato == "si tiene olfato" && select_gusto == "si tiene gusto"){
    return "puede entrar"
  }
  //regla 5  tiene temperatura baja o normal , si tiene olfato y no tiene ardor
  if((seleccion_temperatura == "baja temp" || seleccion_temperatura == "normal temp") && select_olfato == "si tiene olfato" && select_garganta == "no tiene ardor"){
    return "puede entrar"
  }
  //regla 6 si tiene gusto, si tiene olfato y no tiene ardor
  if(select_gusto == "si tiene gusto" && select_olfato == "si tiene olfato" && select_garganta == "no tiene ardor"){
    return "puede entrar"
  }
//-------------------------------------


  //reglas de sospechoso de covid
  //regla 7 si tiene dos de los 4 sintomas seria sospechoso

  return "sospechoso no entra"

//-------------------------------------
}

//boton enviar
boton.addEventListener("click", () => {
  //condicion para verificar que introducen una temperatura 
  if(temperatura.value != ""){
    //obtenemos los valores numericos de las entradas
    valor_temp =      funTempetatura(temperatura.value)
    valor_olfato =    funcionOlfato(olfato.options[olfato.selectedIndex].value) 
    valor_gusto =     funcionGusto(gusto.options[gusto.selectedIndex].value)
    valor_garganta =  funcionGarganta(garganta.options[garganta.selectedIndex].value)
    //imprimimos en consola una tabla de las entradas
    console.table({temperatura:valor_temp , olfato:valor_olfato , gusto:valor_gusto , ardor:valor_garganta})
    //imprimimos en consola el resultado de las reglas
    console.log(reglas())
  }
  else{
    alert("Ingresa una temperatura ")
  }
})

