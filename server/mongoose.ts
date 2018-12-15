import mongoose from 'mongoose';
mongoose.connect('mongodb://localhost/PassportAuth', {}, function () {
  console.log('mongoose connected');
});
