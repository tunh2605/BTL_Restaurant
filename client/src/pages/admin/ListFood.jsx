import { Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ListFoodContent from "../../components/admin/ListFoodContent";
import { Link } from "react-router-dom";

const ListFood = () => {
  const { isHQAdmin } = useAuth();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex flex-col leading-8">
          <p className="text-2xl md:text-4xl font-bold">Thực đơn & danh mục</p>
          <p className="text-sm md:text-md font-medium text-[#777775]">
            Quản lí linh hồn của DoMasala - Các hương vị và sự đa dạng
          </p>
        </div>

        {isHQAdmin && (
          <Link to={"/admin/foods/add"}>
            <button className="flex items-center gap-2 self-start sm:self-auto shrink-0 rounded-full font-semibold px-5 py-3 bg-secondary-dull text-primary-dull hover:bg-primary-dull hover:text-white transition-all duration-200 cursor-pointer">
              <div className="bg-primary-dull rounded-full p-0.5 group-hover:bg-white transition-all">
                <Plus className="w-4 h-4 text-secondary-dull" />
              </div>
              Thêm món mới
            </button>
          </Link>
        )}
      </div>
      <ListFoodContent isHQAdmin={isHQAdmin} />
    </>
  );
};

export default ListFood;
