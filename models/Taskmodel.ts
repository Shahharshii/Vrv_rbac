import mongoose from "mongoose";
const { Schema } = mongoose;

const taskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true, enum: ['pending', 'completed'], default: 'pending' },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

export default Task;
