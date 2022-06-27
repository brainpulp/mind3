var mongoose = require("mongoose");

module.exports = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://Sarath:VO8cXIB4trse33eH@cluster0.isshte6.mongodb.net/test",
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      }
    );
  } catch (err) {
    console.log(err);
    throw new Error(error);
  }
};
