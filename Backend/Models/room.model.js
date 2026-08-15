import mongoose from "mongoose"

const roomShema = new  mongoose.Schema({
    roomCode: { type: String, unique: true, required: true },
    roomName:{
        type:String,
        required:true
    },

    files:[{
        fileName:{
            type:String,
          
        },
      path: { type: String },
        downloadUrl:{
            type:String
        },
        updatedAt:{type:Date, default:Date.now},
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export const RoomModel = mongoose.model("Room" , roomShema);