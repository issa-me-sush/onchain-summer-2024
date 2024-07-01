// import dbConnect from '../../utils/dbConnect';
// import Task from '../../models/Task';

// export default async function handler(req, res) {
//   await dbConnect();

//   const { method } = req;

//   if (method === 'POST') {
//     try {
//       const task = new Task(req.body);
//       await task.save();
//       res.status(201).json({ success: true, data: task });
//     } catch (error) {
//       res.status(400).json({ success: false, error: error.message });
//     }
//   } else {
//     res.status(405).json({ success: false, message: 'Method not allowed' });
//   }
// }
