import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import colors from 'colors';
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import tableRoutes from './routes/tableRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Api server is running'});
});

app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/tables', tableRoutes);

app.listen(PORT, () => {
    console.log(colors.green("======================================================================"));
    console.log(colors.green("Server is running on port " + PORT));
    console.log(colors.yellow(`http://localhost:${PORT}`));
    console.log(colors.green("======================================================================"));
})