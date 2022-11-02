const express = require('express');

const mongooseConnect = require('./utils/database');
const adminRoutes = require('./routes/admin');
const teacherRoutes = require('./routes/teacher');
const studentRoutes = require('./routes/students');

const app = express();
app.use(express.json());

port = process.env.PORT;

app.use('/admin', adminRoutes);
app.use('/teacher', teacherRoutes);
app.use('/student', studentRoutes);

mongooseConnect();

app.listen(port);