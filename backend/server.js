   require('dotenv').config();
   const express = require('express');
   const cors = require('cors');
   const driver = require('./db');
   const employeeRoutes = require('./routes/employees');

   const app = express();
   app.use(cors());
   app.use(express.json());
   app.use('/api/employees', employeeRoutes);

   app.get('/api/health', async (req, res) => {
     const session = driver.session();
     try {
       await session.run('RETURN 1');
       res.json({ status: 'ok', database: 'connected' });
     } catch (err) {
       res.status(500).json({ status: 'error', message: 'Database unreachable' });
     } finally {
       await session.close();
     }
   });

   const PORT = process.env.PORT || 3000;const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));
   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));