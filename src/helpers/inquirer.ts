import inquirer from 'inquirer';
import colors from 'colors';
// import { Tarea } from '../domain/models/tarea';

const preguntas: {[keys:string]:any} = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${colors.green('1.')} Buscar ciudad`
            },
            {
                value: 2,
                name: `${colors.green('2.')} Historial`
            },
            {
                value: 3,
                name: `${colors.green('3.')} Salir`
            }
        ]
    }
]

export const inquirerMenu = async() =>{
    console.clear();
    console.log(colors.green('=========================='));
    console.log(colors.white('   Seleccione la Opcion'));
    console.log(colors.green('==========================\n'));

    const {opcion} = await inquirer.prompt(preguntas);
    return opcion;
}

export const pausa = async() => {
    console.log('\n');
    await inquirer.prompt([
        {
            type: 'input',
            name: 'opcionPausa',
            message: `\nPresione ${colors.green('ENTER')} para continuar`
        }
    ]);
    
}

export const leerInput = async( message:string ) => {
    
    const { desc } = await inquirer.prompt([
        {
            type: 'input',
            name: 'desc',
            message,
            validate ( value:string ){
                if(value.length === 0){
                    return 'Ingrese un valor';
                }
                return true;
            }
        }
    ]);
    return desc;
}

export const listarLugares = async(lugares:any[]) => {
    
    const choices = lugares.map( (lugar, i) => {
        const idx = `${i + 1}`;
        return {
            value: lugar['id'],
            name: `${idx} ${lugar['nombre']}`
        }
    });

    choices.unshift({
        value: 0,
        name: '0.'.blue +' Cancelar'
    });

    

    const {id} = await inquirer.prompt([
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione el lugar: ',
            choices,
            
        }
    ]);
    return id;
    
}

export const confirmar = async(message:string) => {
    const { ok } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'ok',
            message
        }
    ]);
    return ok;
}

export function buscaPorId(id: string, arreglo: any[]):any{
    return arreglo.find(objeto => objeto.id === id);
}


