import fs from 'fs'

import axios from 'axios';


export class Busquedas{
    historial:string[] = [];
    dbPath:string = 'src/domain/database/database.json';

    constructor(){
        this.leerDB();
    }

    private get paramsMapBox():any{
        return {
            'limit': 5,
            'proximity':'ip',
            'language':'es',
            'access_token': process.env.MAPBOX_KEY || ''
        }
    }

    get historialCapitalizado(){
        //Capitalizar cada palabra en mayuscula
        const capitalizedArray = this.historial.map(word => {
            const words = word.split(' ');
            const capitalizeWords = words.map(w => w.charAt(0).toUpperCase()+w.slice(1));
            return capitalizeWords.join(' ');
        })
        return capitalizedArray;
    }

    async ciudad(lugar:string = ''): Promise<string[]>{
        
        try {
            //peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/`,
                params: this.paramsMapBox
            });


            const resp = await instance.get(`${lugar}.json`);
            
            return resp.data.features.map( (lugar: { id: any; place_name: any; center: any[]; }) => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));

            
        } catch (error) {
            
            return [];
        }
        
        
    }

    private paramsOpenWeather(lat:number, lon:number):{[key:string]:any}{
        return {
            'lat': lat,
            'lon': lon,
            'appid': process.env.OPENWATHER_KEY,
            'units': 'metric',
            'lang':'es'
        }
    }
    async climaLugar(lat:number, lon:number): Promise<{[key:string]:any}|string>{
        try {
            //axios
            const instance = axios.create({
                baseURL: 'https://api.openweathermap.org/data/2.5/',
                params: this.paramsOpenWeather(lat,lon)         
            });
            //respuesta

            const resp:any = await instance.get('weather');
            const {weather, main} = resp.data;

            return {
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

        } catch (error) {
            return 'error: '+error;
        }
    }

    agregarHistorial(lugar:string = '') {
        //Prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial.unshift(lugar.toLocaleLowerCase());     
        this.historial = this.historial.splice(0,9);
        //grabar en la bd
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }
    leerDB(){
        //cargar la informacion
        if(!fs.existsSync(this.dbPath)){
            null;
        }
        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;

    }
}