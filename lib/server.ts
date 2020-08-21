import app from './app';
import * as http from 'http';
const PORT = 5000;

http.createServer(app).listen(PORT, () => {
    console.log('Server listening to port ' + PORT);
})

//TODO: MODIFICAR CREAR REUNIO PER QUE EL MATEIX USUARI LA PUGUI CREAR
//TODO: READAPTAR EL CHECK AVAILABILITY PER PODER FER "CONVOCAR A REUNIÓ"