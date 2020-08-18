import app from './app';
import * as http from 'http';
const PORT = 5000;

http.createServer(app).listen(PORT, () => {
    console.log('Server listening to port ' + PORT);
})
