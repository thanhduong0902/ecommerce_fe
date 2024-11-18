import { Link } from "react-router-dom";
import ProductRating from "../../../../components/ProductRating";
import path from "../../../../constants/path";
import { Product as ProductType } from "../../../../types/product.type";
import {
  formatCurrency,
  formatNumberToSocialStyle,
  generateNameId,
} from "../../../../utils/utils";

interface Props {
  product: ProductType;
}

export default function Product({ product }: Props) {
  const url = "https://pushimage-production.up.railway.app/api/auth/image/";
  return (
    <Link
      to={`${path.product}/${generateNameId({
        name: product.title,
        id: product.id,
      })}`}
    >
      <div className="overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md">
        <div className="relative w-full pt-[100%]">
          <img
            src={`${url + product.main_image}`}
            alt={product.title}
            className="absolute left-0 top-0 h-full w-full bg-white object-cover"
          />
        </div>
        <div className="overflow-hidden p-2">
          <div className="min-h-[2rem] text-xs line-clamp-2">
            {product.title}
          </div>
          <div className="mt-3 flex items-center">
            <div className="max-w-[50%] truncate text-gray-500 line-through">
              <span className="text-xs">₫</span>
              <span className="text-sm">
                {formatCurrency(product.list_price)}
              </span>
            </div>
            <div className="ml-1 truncate text-orange">
              <span className="text-xs">₫</span>
              <span className="text-sm">
                {formatCurrency(product.selling_price)}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-end">
            <ProductRating rating={product.rate} />
            <div className="ml-2 text-sm">
              <span>{formatNumberToSocialStyle(product.quantity)}</span>
              <span className="ml-1">Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
