const mongoose = required('mongoose')
const Schema = mongoose.Schema


const accountSchema = new mongoose.Schema({

    account: {
        type: number,
        ref: "User"
    },
    balance: {
        type: number,
        default: 0
    },
    status: {
        type: String,
        default: "Active"
    }
},{
    timestamps: true
})

const account  = mongoose.model("Account", accountSchema)
module.export = account