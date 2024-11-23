import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user', 'superuser'], default: 'user' },
    isActive: { type: Boolean, default: true },
    tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
    permission: [{ type: String, enum: ['add_user', 'edit_user', 'delete_user', 'add_task', 'edit_task', 'delete_task', 'complete_task'], default: 'complete_task' }],
});

userSchema.pre('save', function (next) {
    if (this.permission.length === 0) {
        this.permission = ['complete_task'];
    }
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
