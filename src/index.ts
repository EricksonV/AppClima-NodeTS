import { Busquedas } from "./domain/models/busquedas";
import * as inquirers from "./helpers/inquirer"
import dontenv from 'dotenv';
import colors from 'colors';


dontenv.config();


const main =async () => {
    
    const busquedas = new Busquedas();
    let opt:number = 0;
       
    do{
        opt = await inquirers.inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje
                const lugar:any = await inquirers.leerInput('Ciudad:');
                
                //Buscar coincidencias con lugares
                const lugares:string[] = await busquedas.ciudad( lugar );
                
                //seleccionar el lugar
                const id = await inquirers.listarLugares(lugares);
                const lugarSel = inquirers.buscaPorId(id,lugares);
                if(id !== 0){
                    //guardar en db
                    busquedas.agregarHistorial(lugarSel.nombre);

                    //Datos del clima
                    const clima:any = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);
                    //Mostrar resultados
                    console.clear();
                    console.log('\nInformacion del lugar\n'.green);
                    console.log('Ciudad:', colors.green(lugarSel.nombre));
                    console.log('Lat:',lugarSel.lat);
                    console.log('Lng:', lugarSel.lng);
                    if(typeof clima !== "string"){
                        console.log('Temperatura',clima.temp);
                        console.log('Minima:',clima.min);
                        console.log('Maxima:',clima.max);
                        console.log('Descripcion del clima:', clima.desc.green);
                    }
                    
                }               
                break;
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i)=>{   
                    const idx = `${i + 1}.`.green;
                    console.log(`${idx}  ${lugar}`);
                });
                break;
        
            default:
                break;
        }

        if ( opt !==3 ) await inquirers.pausa();
    }while(opt !== 3)
}

main();