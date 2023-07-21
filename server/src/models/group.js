import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const { Schema } = mongoose;

const GroupSchema = new Schema({
    name: String,
    hashedPassword: String,
    body: String,
    users: {
        type: [
            {
                _id: mongoose.Types.ObjectId,
                name: String,
            }
        ],
        default: [],
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

GroupSchema.methods.setPassword = async function(password){
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
}

GroupSchema.methods.checkPassword = async function(password){
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result
}

GroupSchema.methods.addMember = function(member){
    this.users.push(member)
}

GroupSchema.statics.findById = function (id) {
    return this.findOne({ _id: id }); // Change "id" to "_id"
};



const Group = mongoose.model('Group', GroupSchema);
export default Group;

//add image field
