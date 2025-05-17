import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = "products";

const productSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  thumbnail: String,
  code: { type: String, required: true, unique: true },
  stock: { type: Number, default: 0 },
  category: String,
  status: { type: Boolean, default: true },
});

mongoosePaginate.paginate.options = {
  customLabels: {
    docs: "payload",
    page: "currentPage",
    limit: false,
    pagingCounter: false,
    totalDocs: false,
  },
};

productSchema.plugin(mongoosePaginate);

const productModel = model(productCollection, productSchema);

export default productModel;
