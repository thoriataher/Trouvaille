const mongoose=require('mongoose');

async function main() {
    await mongoose.connect(`mongodb+srv://saber:mOsNq8rNL3HTHg8G@cluster0.7kjglo0.mongodb.net/?retryWrites=true&w=majority`);
    console.log("connected to database successfully ✅✅✅✅");
  }
  main().catch(err => console.log(err));
  