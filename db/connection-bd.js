const mongoose = require('mongoose');

const getConnection = async () => {

    try {

        const url = 'mongodb+srv://jeison1995207:Elian2023@apirest.zcpr6ex.mongodb.net/'

        await mongoose.connect(url);

        console.log('Conexion exitosa a mongoDB.')

    } catch (error) {
        console.log(error);
    }

}

module.exports ={
    getConnection,
}


