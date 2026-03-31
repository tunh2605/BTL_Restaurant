import app from './server.js';
import 'dotenv/config';

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📱 Frontend URL: ${process.env.FE_BASE_URL || 'http://localhost:5173'}`);
    console.log(`🔗 Backend URL: ${process.env.BASE_URL || 'http://localhost:4000'}`);
});