import mongoose from 'mongoose';

const connectToDb=async()=>{

    try{

        if(mongoose.connection.readyState === 1)
            {
                console.log("Database is already connected");
                return;
    }

    await mongoose.connect('mongodb://127.0.0.1:27017/holyPills');
    
    console.log("DB is connected !!!");
}
catch(err){

    console.log(`Error message ${err?.message || err}`);
    process.exit(1);
}

};


mongoose.connection.on('connected',()=>{
    console.log("Mongoose is connected !!!");
} );

mongoose.connection.on('disconnected',()=>{
    console.log("Mongoose is disconnected !!!");
} );


export default connectToDb